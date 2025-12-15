import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";

const router = express.Router();

// 1) sp_DatLichKham
router.post("/dat-lich-kham", async (req, res) => {
    const { MaThuCung, MaChiNhanh, ThoiGianHen } = req.body;
    const missing = requireFields(req.body, ["MaThuCung", "MaChiNhanh", "ThoiGianHen"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaPhieuDatLich = await generatePrimaryKey("PD");
        const result = await db
            .request()
            .input("MaPhieuDatLich", sql.Char(15), MaPhieuDatLich)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .input("ThoiGianHen", sql.Time(0), ThoiGianHen)
            .execute("sp_DatLichKham");

        res.json({ MaPhieuDatLich, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_DatLichKham:", err);
        res.status(500).send("Internal Server Error");
    }
});


export default router;