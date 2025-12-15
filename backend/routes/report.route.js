import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";

const router = express.Router();

// 17) sp_BaoCaoDoanhThuChiNhanh
router.get("/bao-cao/doanh-thu-chi-nhanh", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_BaoCaoDoanhThuChiNhanh");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_BaoCaoDoanhThuChiNhanh:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 18) sp_BaoCaoDoanhThuDichVu
router.get("/bao-cao/doanh-thu-dich-vu", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_BaoCaoDoanhThuDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_BaoCaoDoanhThuDichVu:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 19) sp_TongDoanhThu
router.get("/bao-cao/tong-doanh-thu", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_TongDoanhThu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TongDoanhThu:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 20) sp_TopDichVu
router.get("/bao-cao/top-dich-vu", async (req, res) => {
    const { MaChiNhanh } = req.query;

    try {
        const result = await db
            .request()
            .input("MaChiNhanh", sql.Char(15), asNullIfEmpty(MaChiNhanh))
            .execute("sp_TopDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TopDichVu:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;