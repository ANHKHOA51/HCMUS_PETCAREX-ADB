import express from "express";
import db from "../db.js";
import sql from "mssql";
import { asNullIfEmpty } from "../utils/checkValid.js";
import { parseSqlDateTime } from "../utils/dateTime.js";

const router = express.Router();

// 17) sp_BaoCaoDoanhThuChiNhanh -> Branch Revenue
router.get("/revenue/branch", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        let parsedNgayBatDau;
        let parsedNgayKetThuc;
        try {
            parsedNgayBatDau = parseSqlDateTime(NgayBatDau, "NgayBatDau");
            parsedNgayKetThuc = parseSqlDateTime(NgayKetThuc, "NgayKetThuc");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, parsedNgayBatDau)
            .input("NgayKetThuc", sql.DateTime, parsedNgayKetThuc)
            .execute("sp_BaoCaoDoanhThuChiNhanh");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /revenue/branch:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 18) sp_BaoCaoDoanhThuDichVu -> Service Revenue
router.get("/revenue/service", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });
    console.log(req.query);
    try {
        let parsedNgayBatDau;
        let parsedNgayKetThuc;
        try {
            parsedNgayBatDau = parseSqlDateTime(NgayBatDau, "NgayBatDau");
            parsedNgayKetThuc = parseSqlDateTime(NgayKetThuc, "NgayKetThuc");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, parsedNgayBatDau)
            .input("NgayKetThuc", sql.DateTime, parsedNgayKetThuc)
            .execute("sp_BaoCaoDoanhThuDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /revenue/service:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 19) sp_TongDoanhThu -> Total Revenue
router.get("/revenue/total", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        let parsedNgayBatDau;
        let parsedNgayKetThuc;
        try {
            parsedNgayBatDau = parseSqlDateTime(NgayBatDau, "NgayBatDau");
            parsedNgayKetThuc = parseSqlDateTime(NgayKetThuc, "NgayKetThuc");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, parsedNgayBatDau)
            .input("NgayKetThuc", sql.DateTime, parsedNgayKetThuc)
            .execute("sp_TongDoanhThu");

        res.json(result.recordset ?? result.recordsets); // Procedure returns 1 row with TongDoanhThu
    } catch (err) {
        console.error("Error GET /revenue/total:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 20) sp_TopDichVu -> Top Services
router.get("/services/top", async (req, res) => {
    const { MaChiNhanh } = req.query;

    try {
        const result = await db
            .request()
            .input("MaChiNhanh", sql.Char(15), asNullIfEmpty(MaChiNhanh))
            .execute("sp_TopDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /services/top:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 21) sp_BaoCaoDoanhThuTheoThang -> Revenue Trend (Month)
router.get("/revenue/trend", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        let parsedNgayBatDau;
        let parsedNgayKetThuc;
        try {
            parsedNgayBatDau = parseSqlDateTime(NgayBatDau, "NgayBatDau");
            parsedNgayKetThuc = parseSqlDateTime(NgayKetThuc, "NgayKetThuc");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, parsedNgayBatDau)
            .input("NgayKetThuc", sql.DateTime, parsedNgayKetThuc)
            .execute("sp_BaoCaoDoanhThuTheoThang");

        // Format result if necessary, though SP returns 'month' and 'totalRevenue'
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error GET /revenue/trend:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 22) Count Examinations (Raw SQL)
router.get("/examinations/count", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        let parsedNgayBatDau;
        let parsedNgayKetThuc;
        try {
            parsedNgayBatDau = parseSqlDateTime(NgayBatDau, "NgayBatDau");
            parsedNgayKetThuc = parseSqlDateTime(NgayKetThuc, "NgayKetThuc");
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, parsedNgayBatDau)
            .input("NgayKetThuc", sql.DateTime, parsedNgayKetThuc)
            .query(`
                SELECT COUNT(*) AS count 
                FROM HOSOBENHAN 
                WHERE ngaykham BETWEEN @NgayBatDau AND @NgayKetThuc
            `);

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Error GET /examinations/count:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;