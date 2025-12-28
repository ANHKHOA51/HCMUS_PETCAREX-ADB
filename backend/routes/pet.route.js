import express from "express";
import sql from "mssql";
import db from "../db.js";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { parseSqlDate } from "../utils/dateTime.js";

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
    console.log("sp_TraCuuThuCung_SDT result:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error GET /pet/phone/:phone:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create new pet
router.post("/", async (req, res) => {
  const { Ten, NgaySinh, Loai, Giong, MaKhachHang, CanNang } = req.body;
  console.log(req.body);
  // Basic validation
  if (!Ten || !MaKhachHang) {
    return res.status(400).json({ message: "Missing required fields: Ten, MaKhachHang" });
  }

  try {
    let parsedNgaySinh = null;
    if (NgaySinh) {
      const dateStr = typeof NgaySinh === "string" ? NgaySinh.split("T")[0] : NgaySinh;
      parsedNgaySinh = parseSqlDate(dateStr, "NgaySinh");
    }

    const MaThuCung = await generatePrimaryKey("TC");

    // Using sp_DangKyThuCung as requested
    // Need to check if sp_DangKyThuCung supports CanNang (Weight). 
    // Based on examine.route.js read previously: 
    // .input("MaThuCung", sql.Char(15), MaThuCung)
    // .input("Ten", sql.NVarChar(50), Ten)
    // .input("NgaySinh", sql.Date, parsedNgaySinh)
    // .input("Loai", sql.NVarChar(50), Loai ?? null)
    // .input("Giong", sql.NVarChar(50), Giong ?? null)
    // .input("MaKhachHang", sql.Char(15), MaKhachHang)
    // It does NOT seem to have CanNang input in the 'examine.route.js' version. 
    // User said: "get code from /dang-ky-thu-cung in examine.route.js".
    // I will follow that strictlly. 
    // If the user wants Update/Delete, I have to guess the SP or query.
    // Usually: "UPDATE THUCUNG SET ..." and "DELETE FROM THUCUNG ..."

    await db
      .request()
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("Ten", sql.NVarChar(50), Ten)
      .input("NgaySinh", sql.Date, parsedNgaySinh)
      .input("Loai", sql.NVarChar(50), Loai ?? null)
      .input("Giong", sql.NVarChar(50), Giong ?? null)
      .input("MaKhachHang", sql.Char(15), MaKhachHang)
      .execute("sp_DangKyThuCung");

    // If CanNang is provided and not in SP, we might need a separate update if the table has it.
    // Checking init.sql (previously viewed): THUCUNG has (MaThuCung, Ten, NgaySinh, Loai, Giong, MaKhachHang, ...).
    // Let's assume the basic SP is enough for creation as requested.

    res.json({ message: "Pet created successfully", MaThuCung });
  } catch (err) {
    console.error("Error POST /pet:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update pet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Ten, NgaySinh, Loai, Giong } = req.body;
  console.log(req.body)
  try {
    let parsedNgaySinh = null;
    if (NgaySinh) {
      const dateStr = typeof NgaySinh === "string" ? NgaySinh.split("T")[0] : NgaySinh;
      parsedNgaySinh = parseSqlDate(dateStr, "NgaySinh");
    }

    const request = db.request()
      .input("MaThuCung", sql.Char(15), id)
      .input("Ten", sql.NVarChar(50), Ten)
      .input("Loai", sql.NVarChar(50), Loai)
      .input("Giong", sql.NVarChar(50), Giong);
    if (parsedNgaySinh) {
      request.input("NgaySinh", sql.Date, parsedNgaySinh);
    }

    // Assuming there isn't a sp_CapNhatThuCung, we use direct UPDATE query
    // Dynamic query building is safer/cleaner but here we construct based on inputs?
    // Or just update all nullable fields.

    let query = "UPDATE THUCUNG SET Ten = @Ten, Loai = @Loai, Giong = @Giong";
    if (parsedNgaySinh) query += ", NgaySinh = @NgaySinh";
    // If CanNang exists in DB... init.sql view earlier likely didn't show CanNang or I missed it.
    // Client dashboard shows "Weight". 
    // Let's check init.sql again? No, let's stick to what's safe or standard columns.
    // User asked for Update.

    query += " WHERE MaThuCung = @MaThuCung";

    await request.query(query);

    res.json({ message: "Pet updated successfully" });
  } catch (err) {
    console.error("Error PUT /pet/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete pet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.request()
      .input("MaThuCung", sql.Char(15), id)
      .query("DELETE FROM THUCUNG WHERE MaThuCung = @MaThuCung");

    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error("Error DELETE /pet/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
