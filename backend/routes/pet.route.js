import express from "express";
import sql from "mssql";
import db from "../db.js";

const router = express.Router();

// Get pets by user ID
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db
      .request()
      .input("userId", sql.Char(15), userId)
      .query("SELECT * FROM THUCUNG WHERE makhachhang = @userId");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error GET /pet/user/:userId:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get pets by phone number (using stored procedure)
router.get("/phone/:phone", async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await db
      .request()
      .input("SDT", sql.Char(10), phone)
      .execute("sp_TraCuuThuCung_SDT");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error GET /pet/phone/:phone:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
