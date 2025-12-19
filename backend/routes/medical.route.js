import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";
import { parseSqlDate } from "../utils/dateTime.js";

const router = express.Router();

// 2) sp_GhiNhanKham -> Record Examination
router.post("/examinations", async (req, res) => {
  const {
    MaThuCung,
    MaBacSi,
    TrieuChung,
    ChuanDoan,
    NgayKham,
    NgayTaiKham,
    MaToaThuoc,
    MaChiNhanh,
  } = req.body;

  const missing = requireFields(req.body, [
    "MaThuCung",
    "MaBacSi",
    "TrieuChung",
    "ChuanDoan",
    "NgayKham",
    "NgayTaiKham",
    "MaChiNhanh",
  ]);
  if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

  try {
    let parsedNgayKham;
    let parsedNgayTaiKham;
    try {
      parsedNgayKham = parseSqlDate(NgayKham, "NgayKham");
      parsedNgayTaiKham = parseSqlDate(NgayTaiKham, "NgayTaiKham");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const MaHoSo = await generatePrimaryKey("HS");
    const result = await db
      .request()
      .input("MaHoSo", sql.Char(15), MaHoSo)
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("MaBacSi", sql.Char(15), MaBacSi)
      .input("TrieuChung", sql.NVarChar(200), TrieuChung)
      .input("ChuanDoan", sql.NVarChar(200), ChuanDoan)
      .input("NgayKham", sql.Date, parsedNgayKham)
      .input("NgayTaiKham", sql.Date, parsedNgayTaiKham)
      .input("MaToaThuoc", sql.Char(15), asNullIfEmpty(MaToaThuoc))
      .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
      .execute("sp_GhiNhanKham");

    res.json({ MaHoSo, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
  } catch (err) {
    console.error("Error POST /examinations:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 3) sp_KeToaThuoc -> Create Prescription
router.post("/prescriptions", async (req, res) => {
  const { MaToa, MaThuoc, SoLuong, GhiChu } = req.body;
  const missing = requireFields(req.body, ["MaThuoc", "SoLuong", "GhiChu"]);
  if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

  try {
    const finalMaToa = asNullIfEmpty(MaToa) ?? (await generatePrimaryKey("TT"));
    const result = await db
      .request()
      .input("MaToa", sql.Char(15), finalMaToa)
      .input("MaThuoc", sql.Char(15), MaThuoc)
      .input("SoLuong", sql.Int, SoLuong)
      .input("GhiChu", sql.NVarChar(200), GhiChu)
      .execute("sp_KeToaThuoc");

    res.json({ MaToa: finalMaToa, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
  } catch (err) {
    console.error("Error POST /prescriptions:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 11) sp_NhacLichTaiKhamNgayMai -> Get Tomorrow Reminders
router.get("/reminders/tomorrow", async (_req, res) => {
  try {
    const result = await db.request().execute("sp_NhacLichTaiKhamNgayMai");
    res.json(result.recordset ?? result.recordsets);
  } catch (err) {
    console.error("Error GET /reminders/tomorrow:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 10) sp_TraCuuHosoBenhAn -> Get Medical History (Moved from search.route.js)
router.get('/history', async (req, res) => {
  const pet_id = req.query.id;
  const num = req.query.num;
  try {
    const result = await db.request()
      .input('MaThuCung', sql.Char(15), pet_id)
      .input('SoLuongHoso', sql.Int, num)
      .execute('sp_TraCuuHosoBenhAn');

    res.json(result.recordsets);
  } catch (err) {
    console.error("Error GET /history:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
