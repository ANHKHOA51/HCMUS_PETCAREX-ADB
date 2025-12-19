import express from "express";
import db from "../db.js";
import sql from "mssql";

const router = express.Router();

// 10) sp_TimThuocTheoTen -> Search Medicines (Moved from search.route.js)
router.get('/medicines/search', async (req, res) => {
  const name = req.query.name;
  const num = req.query.num || 20;
  try {
    const result = await db.request()
      .input('Ten', sql.NVarChar(100), name)
      .input('SoLuong', sql.Int, num)
      .execute('sp_TimThuocTheoTen');

    res.json(result.recordsets);
  } catch (err) {
    console.error("Error GET /medicines/search:", err);
    res.status(500).send("Internal Server Error");
  }
});

// GET /?search=&limit=&cursor=&type=
router.get("/", async (req, res) => {
  try {
    const { search, limit, cursor, type } = req.query;
    const limitValue = parseInt(limit) || 10;

    const request = db.request();

    let query = "SELECT TOP (@limit) masanpham, ten, gia FROM SANPHAM WHERE 1=1";
    request.input("limit", sql.Int, limitValue);

    if (search) {
      query += " AND LOWER(ten) LIKE @search";
      request.input("search", sql.NVarChar, `%${search.toLowerCase()}%`);
    }

    if (type !== undefined && type !== null && type !== "") {
      query += " AND loai = @type";
      request.input("type", sql.TinyInt, parseInt(type));
    }

    if (cursor) {
      query += " AND masanpham > @cursor";
      request.input("cursor", sql.Char(15), cursor);
    }

    query += " ORDER BY masanpham ASC";

    const result = await request.query(query);
    const items = result.recordset;

    let nextCursor = null;
    if (items.length > 0) {
      nextCursor = items[items.length - 1].masanpham;
    }

    res.json({ items, nextCursor });
  } catch (err) {
    console.error("Error GET /products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db
      .request()
      .input("id", sql.Char(15), id)
      .query(`
                SELECT * FROM SANPHAM WHERE masanpham = @id;
                
                SELECT cn.tenchinhanh, cn.diachi, stk.soluongtonkho 
                FROM SANPHAMTONKHO stk
                JOIN CHINHANH cn ON stk.machinhanh = cn.machinhanh
                WHERE stk.masanpham = @id;
            `);

    if (!result.recordsets[0].length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.recordsets[0][0];
    const stock = result.recordsets[1] || [];

    res.json({ ...product, stock });
  } catch (err) {
    console.error("Error /product/:id:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
