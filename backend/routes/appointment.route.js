import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { requireFields } from "../utils/checkValid.js";
import { parseSqlTime, parseSqlDate } from "../utils/dateTime.js";

const router = express.Router();

// 1) sp_DatLichKham -> Schedule Appointment
router.post("/", async (req, res) => {
  const { MaThuCung, MaChiNhanh, ThoiGianHen, NgayDen } = req.body;
  const missing = requireFields(req.body, ["MaThuCung", "MaChiNhanh", "ThoiGianHen", "NgayDen"]);
  if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

  // Parse separate Date and Time inputs
  try {
    let parsedThoiGianHen;
    try {
      parsedThoiGianHen = parseSqlTime(ThoiGianHen, "ThoiGianHen");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    let parsedNgayDen;
    try {
      parsedNgayDen = parseSqlDate(NgayDen, "NgayDen");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const MaPhieuDatLich = await generatePrimaryKey("PD");
    const result = await db
      .request()
      .input("MaPhieuDatLich", sql.Char(15), MaPhieuDatLich)
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
      .input("NgayDen", sql.Date, parsedNgayDen)
      .input("ThoiGianDen", sql.Time(0), parsedThoiGianHen)
      .execute("sp_DatLichKham");

    res.json({ MaPhieuDatLich, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
  } catch (err) {
    console.error("Error POST /appointments:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 2) GET /user/:userId -> Get Appointments list
// Pagination: limit & cursor (composite: NgayDat_MaPhieu)
// Order by: NgayDat DESC, MaPhieuDatLich DESC
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { limit, cursor } = req.query;
  const limitValue = parseInt(limit) || 10;

  try {
    const request = db.request();
    request.input("userId", sql.Char(15), userId);
    request.input("limit", sql.Int, limitValue);

    let query = `
      SELECT TOP (@limit) 
        p.maphieudatlich, p.ngaydat, p.ngayden, p.thoigianden,
        tc.ten AS tenThuCung, tc.loai,
        cn.tenchinhanh, cn.diachi
      FROM PHIEUDATLICH p
      JOIN THUCUNG tc ON p.mathucung = tc.mathucung
      JOIN CHINHANH cn ON p.machinhanh = cn.machinhanh
      WHERE tc.makhachhang = @userId
    `;

    // Cursor logic: cursor is base64("NgayDat_MaPhieu")
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        const [cursorDate, cursorId] = decoded.split('_');

        if (cursorDate && cursorId) {
          query += `
            AND (p.ngaydat < @cursorDate OR (p.ngaydat = @cursorDate AND p.maphieudatlich < @cursorId))
          `;
          request.input("cursorDate", sql.Date, cursorDate);
          request.input("cursorId", sql.Char(15), cursorId);
        }
      } catch (e) {
        console.warn("Invalid cursor format", e);
      }
    }

    query += ` ORDER BY p.ngaydat DESC, p.maphieudatlich DESC`;

    const result = await request.query(query);
    const items = result.recordset;

    let nextCursor = null;
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      const d = new Date(lastItem.ngaydat);
      const dateStr = d.toISOString().split('T')[0];
      const rawCursor = `${dateStr}_${lastItem.maphieudatlich}`;
      nextCursor = Buffer.from(rawCursor).toString('base64');
    }

    res.json({ items, nextCursor });
  } catch (err) {
    console.error("Error GET /appointments/user/:userId", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
