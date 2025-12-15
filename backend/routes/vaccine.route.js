import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";

const router = express.Router();

// 12) sp_NhacLichTiemChungSapToi
router.get("/nhac-lich/tiem-chung-sap-toi", async (_req, res) => {
    try {
        const result = await db.request().execute("sp_NhacLichTiemChungSapToi");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_NhacLichTiemChungSapToi:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 13) sp_KhoiTaoGoiTiem
router.post("/goi-tiem/khoi-tao", async (req, res) => {
    const { NgayHetHan, PhanTramGiamGia, MaThuCung, MaChiNhanh } = req.body;
    const missing = requireFields(req.body, ["NgayHetHan", "PhanTramGiamGia", "MaThuCung", "MaChiNhanh"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaGoi = await generatePrimaryKey("GT");
        const result = await db
            .request()
            .input("MaGoi", sql.Char(15), MaGoi)
            .input("NgayHetHan", sql.Date, new Date(NgayHetHan))
            .input("PhanTramGiamGia", sql.Int, PhanTramGiamGia)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_KhoiTaoGoiTiem");

        res.json({ MaGoi, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_KhoiTaoGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 14) sp_ThemChiTietGoiTiem
router.post("/goi-tiem/them-chi-tiet", async (req, res) => {
    const { MaGoi, MaSanPham } = req.body;
    const missing = requireFields(req.body, ["MaGoi", "MaSanPham"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CG");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaGoi", sql.Char(15), MaGoi)
            .input("MaSanPham", sql.Char(15), MaSanPham)
            .execute("sp_ThemChiTietGoiTiem");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 15) sp_TraCuuTinhTrangGoiTiem
router.get("/goi-tiem/tinh-trang", async (req, res) => {
    const { MaThuCung } = req.query;
    if (!MaThuCung) return res.status(400).json({ message: "Missing query param: MaThuCung" });

    try {
        const result = await db.request().input("MaThuCung", sql.Char(15), MaThuCung).execute("sp_TraCuuTinhTrangGoiTiem");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TraCuuTinhTrangGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 16) sp_ThucHienTiem
router.post("/tiem/thuc-hien", async (req, res) => {
    const { MaThuCung, MaNhanVien, MaChiNhanh, MaChiTiet } = req.body;
    const missing = requireFields(req.body, ["MaThuCung", "MaNhanVien", "MaChiNhanh", "MaChiTiet"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaLichSu = await generatePrimaryKey("LT");
        const result = await db
            .request()
            .input("MaLichSu", sql.Char(15), MaLichSu)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaNhanVien", sql.Char(15), MaNhanVien)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .execute("sp_ThucHienTiem");

        res.json({ MaLichSu, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThucHienTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});


export default router;  

