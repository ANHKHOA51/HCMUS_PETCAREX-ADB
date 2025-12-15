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

// 2) sp_GhiNhanKham
router.post("/ghi-nhan-kham", async (req, res) => {
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
        const MaHoSo = await generatePrimaryKey("HS");
        const result = await db
            .request()
            .input("MaHoSo", sql.Char(15), MaHoSo)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaBacSi", sql.Char(15), MaBacSi)
            .input("TrieuChung", sql.NVarChar(200), TrieuChung)
            .input("ChuanDoan", sql.NVarChar(200), ChuanDoan)
            .input("NgayKham", sql.Date, new Date(NgayKham))
            .input("NgayTaiKham", sql.Date, new Date(NgayTaiKham))
            .input("MaToaThuoc", sql.Char(15), asNullIfEmpty(MaToaThuoc))
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_GhiNhanKham");

        res.json({ MaHoSo, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_GhiNhanKham:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 3) sp_KeToaThuoc
router.post("/ke-toa-thuoc", async (req, res) => {
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
        console.error("Error sp_KeToaThuoc:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 11) sp_NhacLichTaiKhamNgayMai
router.get("/nhac-lich/tai-kham-ngay-mai", async (_req, res) => {
    try {
        const result = await db.request().execute("sp_NhacLichTaiKhamNgayMai");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_NhacLichTaiKhamNgayMai:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;