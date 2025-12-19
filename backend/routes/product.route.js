import express from "express";
import db from "../db.js";
import sql from "mssql";

const router = express.Router();

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

// GET /:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .request()
      .input("id", sql.Char(15), id)
      .query("SELECT * FROM SANPHAM WHERE masanpham = @id");

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error GET /products/:id:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
