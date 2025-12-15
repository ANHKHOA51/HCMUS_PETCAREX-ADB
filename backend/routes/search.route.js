import express from "express";
import db from "../db.js";
import sql from "mssql";

const router = express.Router();

router.get('/tra-cuu-thu-cung-khach-hang', async (req, res) => {
    const phone = req.query.phone;
    try {
        const result = await db.request()
            .input('SDT', sql.Char(10), phone)
            .execute('sp_TraCuuThuCung_SDT');

        res.json(result.recordsets);
    } catch (err) {
        console.error("Error searching pets:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 10) Tra cứu hồ sơ bệnh án
router.get('/tra-cuu-ho-so-benh-an', async (req, res) => {
    const pet_id = req.query.id;
    const num = req.query.num;
    try {
        const result = await db.request()
            .input('MaThuCung', sql.Char(15), pet_id)
            .input('SoLuongHoso', sql.Int, num)
            .execute('sp_TraCuuHosoBenhAn');

        res.json(result.recordsets);
    } catch (err) {
        console.error("Error searching pets:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;