import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";
import { parseSqlDateTime } from "../utils/dateTime.js";

const router = express.Router();

// 17) sp_BaoCaoDoanhThuChiNhanh
router.get("/bao-cao/doanh-thu-chi-nhanh", async (req, res) => {
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
                SELECT 
                    cn.tenchinhanh AS [Tên chi nhánh],
                    cn.machinhanh AS [Mã chi nhánh],
                    SUM(CAST(hd.sotienphaitra AS BIGINT)) AS [Tổng doanh thu]
                FROM HOADON hd
                JOIN CHINHANH cn ON hd.machinhanh = cn.machinhanh
                WHERE hd.trangthai = 2
                  AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc
                GROUP BY cn.tenchinhanh, cn.machinhanh;
            `);

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
                SELECT 
                    cn.tenchinhanh AS [Tên chi nhánh],
                    cn.machinhanh AS [Mã chi nhánh],
                    dv.loaidichvu AS [Tên dịch vụ],
                    SUM(CAST(ct.giamoidonvi AS BIGINT) * CAST(ct.soluong AS BIGINT)) AS [Doanh thu]
                FROM HOADON hd
                JOIN CHITIETHOADON ct ON ct.mahoadon = hd.mahoadon
                JOIN CHINHANH cn ON hd.machinhanh = cn.machinhanh
                JOIN CHINHANHDICHVU cdv ON cdv.machinhanh = cn.machinhanh
                JOIN DICHVU dv ON dv.madichvu = ct.loai
                WHERE hd.trangthai = 2
                  AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc
                GROUP BY cn.tenchinhanh, cn.machinhanh, dv.loaidichvu, dv.madichvu;
            `);

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
                SELECT SUM(CAST(hd.sotienphaitra AS BIGINT)) AS [Tổng doanh thu]
                FROM HOADON hd
                WHERE hd.trangthai = 2
                  AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc;
            `);

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