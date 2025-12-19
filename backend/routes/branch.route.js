import express from "express";
import db from "../db.js";
import sql from "mssql";

const router = express.Router();

// GET /branch?limit=10&cursor=
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor || null;

    let query = `
      SELECT 
        c.machinhanh, c.tenchinhanh, c.diachi, c.sodienthoai, 
        substring(convert(varchar, c.thoigianmo, 108), 1, 5) as thoigianmo,
        substring(convert(varchar, c.thoigiandong, 108), 1, 5) as thoigiandong,
        (
            SELECT STUFF((
                SELECT ',' + CAST(cd.madichvu AS VARCHAR)
                FROM CHINHANHDICHVU cd
                WHERE cd.machinhanh = c.machinhanh
                FOR XML PATH('')
            ), 1, 1, '')
        ) AS dichvu_ids
      FROM CHINHANH c
    `;

    if (cursor) {
      query += ` WHERE c.machinhanh > @cursor`;
    }

    query += ` ORDER BY c.machinhanh OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;

    const request = db.request();
    request.input("limit", sql.Int, limit);
    if (cursor) {
      request.input("cursor", sql.Char(15), cursor);
    }

    const result = await request.query(query);

    const items = result.recordset.map(row => ({
      ...row,
      services: row.dichvu_ids ? row.dichvu_ids.split(',').map(Number) : []
    }));

    const nextCursor = items.length === limit ? items[items.length - 1].machinhanh : null;

    res.json({
      items,
      nextCursor
    });
  } catch (err) {
    console.error("Error GET /branch:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
