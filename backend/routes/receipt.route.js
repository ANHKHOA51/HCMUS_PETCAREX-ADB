import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";

const router = express.Router();

// 4) sp_KhoiTaoHoaDon
router.post("/khoi-tao-hoa-don", async (req, res) => {
    const { MaNhanVien, MaKhachHang, MaChiNhanh } = req.body;
    const missing = requireFields(req.body, ["MaNhanVien", "MaKhachHang", "MaChiNhanh"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaHoaDon = await generatePrimaryKey("HD");
        const result = await db
            .request()
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaNhanVien", sql.Char(15), MaNhanVien)
            .input("MaKhachHang", sql.Char(15), MaKhachHang)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_KhoiTaoHoaDon");

        res.json({ MaHoaDon, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_KhoiTaoHoaDon:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 5) sp_ThemChiTietHoaDon_BanLe
router.post("/hoa-don/them-chi-tiet/ban-le", async (req, res) => {
    const { MaHoaDon, MaSanPham, SoLuong } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaSanPham", "SoLuong"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaSanPham", sql.Char(15), MaSanPham)
            .input("SoLuong", sql.Int, SoLuong)
            .execute("sp_ThemChiTietHoaDon_BanLe");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_BanLe:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 6) sp_ThemChiTietHoaDon_KhamBenh
router.post("/hoa-don/them-chi-tiet/kham-benh", async (req, res) => {
    const { MaHoaDon, MaHoSoBenhAn, GiaTien } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaHoSoBenhAn", "GiaTien"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaHoSoBenhAn", sql.Char(15), MaHoSoBenhAn)
            .input("GiaTien", sql.Int, GiaTien)
            .execute("sp_ThemChiTietHoaDon_KhamBenh");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_KhamBenh:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 7) sp_ThemChiTietHoaDon_GoiTiem
router.post("/hoa-don/them-chi-tiet/goi-tiem", async (req, res) => {
    const { MaHoaDon, MaGoiTiem } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaGoiTiem"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaGoiTiem", sql.Char(15), MaGoiTiem)
            .execute("sp_ThemChiTietHoaDon_GoiTiem");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_GoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 8) sp_ChotHoaDon
router.post("/hoa-don/chot", async (req, res) => {
    const { MaHoaDon } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const result = await db.request().input("MaHoaDon", sql.Char(15), MaHoaDon).execute("sp_ChotHoaDon");
        res.json({ rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ChotHoaDon:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 9) sp_HoanTatThanhToan
router.post("/hoa-don/thanh-toan", async (req, res) => {
    const { MaHoaDon } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const result = await db.request().input("MaHoaDon", sql.Char(15), MaHoaDon).execute("sp_HoanTatThanhToan");
        res.json({ rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_HoanTatThanhToan:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;