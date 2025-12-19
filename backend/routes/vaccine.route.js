import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { requireFields } from "../utils/checkValid.js";
import { parseSqlDate } from "../utils/dateTime.js";

const router = express.Router();

// 12) sp_NhacLichTiemChungSapToi -> Upcoming Vaccine Reminders
router.get("/reminders", async (_req, res) => {
    try {
        const result = await db.request().execute("sp_NhacLichTiemChungSapToi");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /reminders:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 13) sp_KhoiTaoGoiTiem -> Create Vaccine Package
router.post("/packages", async (req, res) => {
    const { NgayHetHan, PhanTramGiamGia, MaThuCung, MaChiNhanh } = req.body;
    const missing = requireFields(req.body, ["NgayHetHan", "PhanTramGiamGia", "MaThuCung", "MaChiNhanh"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        let parsedNgayHetHan;
        try {
            parsedNgayHetHan = parseSqlDate(NgayHetHan, "NgayHetHan");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const MaGoi = await generatePrimaryKey("GT");
        const result = await db
            .request()
            .input("MaGoi", sql.Char(15), MaGoi)
            .input("NgayHetHan", sql.Date, parsedNgayHetHan)
            .input("PhanTramGiamGia", sql.Int, PhanTramGiamGia)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_KhoiTaoGoiTiem");

        res.json({ MaGoi, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error POST /packages:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 14) sp_ThemChiTietGoiTiem -> Add Item to Package
router.post("/packages/items", async (req, res) => {
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
        console.error("Error POST /packages/items:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 15) sp_TraCuuTinhTrangGoiTiem -> Check Package Status
router.get("/packages/status", async (req, res) => {
    const { MaThuCung } = req.query;
    if (!MaThuCung) return res.status(400).json({ message: "Missing query param: MaThuCung" });

    try {
        const result = await db.request().input("MaThuCung", sql.Char(15), MaThuCung).execute("sp_TraCuuTinhTrangGoiTiem");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /packages/status:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 16) sp_ThucHienTiem -> Record Vaccination
router.post("/records", async (req, res) => {
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
        console.error("Error POST /records:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
