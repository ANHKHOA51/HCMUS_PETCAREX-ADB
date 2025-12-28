import express from "express";
import db from "../db.js";
import sql from "mssql";

const router = express.Router();

// 10) sp_TimThuocTheoTen -> Search Medicines with cursor pagination (by masanpham)
// Query:
//   name: optional, partial medicine name
//   limit: optional, number of items per page
//   cursorMaSanPham: optional, last "masanpham" from previous page
router.get("/medicines/search", async (req, res) => {
  const { name, limit, cursorMaSanPham } = req.query;

  try {
    const request = db.request();

    request.input("Ten", sql.NVarChar(100), name ?? null);
    request.input("CursorMaSanPham", sql.Char(15), cursorMaSanPham ?? null);

    let parsedLimit = null;
    if (limit !== undefined) {
      const tmp = parseInt(limit, 10);
      if (!Number.isNaN(tmp) && tmp > 0) {
        parsedLimit = tmp;
        // Lấy dư thêm 1 để biết còn trang tiếp hay không
        request.input("SoLuong", sql.Int, parsedLimit + 1);
      }
    }

    const result = await request.execute("sp_TimThuocTheoTen");
    let items = result.recordset ?? result.recordsets?.[0] ?? [];

    let nextCursorMaSanPham = null;
    if (parsedLimit && parsedLimit > 0 && items.length > parsedLimit) {
      items = items.slice(0, parsedLimit);
      const last = items[items.length - 1];
      nextCursorMaSanPham = last?.masanpham ?? null;
    }

    res.json({ items, nextCursorMaSanPham });
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

    let query =
      "SELECT TOP (@limit) masanpham, ten, gia FROM SANPHAM WHERE 1=1";
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
    const result = await db.request().input("id", sql.Char(15), id).query(`
                SELECT * FROM SANPHAM WHERE masanpham = @id;
                
                SELECT cn.tenchinhanh, cn.diachi, stk.soluongtonkho, stk.machinhanh
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
