import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { requireFields } from "../utils/checkValid.js";
import { parseSqlTime } from "../utils/dateTime.js";

const router = express.Router();

// 1) sp_DatLichKham -> Schedule Appointment
router.post("/", async (req, res) => {
  const { MaThuCung, MaChiNhanh, ThoiGianHen } = req.body;
  const missing = requireFields(req.body, ["MaThuCung", "MaChiNhanh", "ThoiGianHen"]);
  if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

  try {
    let parsedThoiGianHen;
    try {
      parsedThoiGianHen = parseSqlTime(ThoiGianHen, "ThoiGianHen");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const MaPhieuDatLich = await generatePrimaryKey("PD");
    const result = await db
      .request()
      .input("MaPhieuDatLich", sql.Char(15), MaPhieuDatLich)
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
      .input("ThoiGianHen", sql.Time(0), parsedThoiGianHen)
      .execute("sp_DatLichKham");

    res.json({ MaPhieuDatLich, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
  } catch (err) {
    console.error("Error POST /appointments:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
