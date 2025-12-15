import express from "express";
import db from '../db.js';
import sql from 'mssql';

const router = express.Router();

// Example route to search for pets by name
router.get('/search-pets', async (req, res) => {
    const pet_name = req.query.name;
    const num = req.query.num;
    try {
        const result = await db.request()
            .input('TenThuCung', sql.NVarChar, `%${pet_name}%`)
            .input('SoLuongHoso', sql.Int, num)
            .execute('sp_TraCuuHosoBenhAn');

        res.json(result.recordsets);
    } catch (err) {
        console.error("Error searching pets:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;