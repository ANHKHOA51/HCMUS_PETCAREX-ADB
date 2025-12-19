import express from "express";
import db from "../db.js";
console.log("Kiểm tra biến db:", db);
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { requireFields } from "../utils/checkValid.js";
import { parseSqlDate } from "../utils/dateTime.js";
import { normalizePhone10 } from "../utils/phone.js";

const router = express.Router();

// Register customer (KHACHHANG) - no hashing (plain text) as requested
router.post("/register", async (req, res) => {
  const { HoVaTen, SoDienThoai, MatKhau, NgaySinh, DiaChi } = req.body;
  const missing = requireFields(req.body, [
    "HoVaTen",
    "SoDienThoai",
    "MatKhau",
  ]);
  if (missing.length) {
    console.log("Roi vao day");
    return res.status(400).json({ message: "Missing fields", missing });
  }

  const phone = normalizePhone10(SoDienThoai);

  if (!phone)
    return res
      .status(400)
      .json({ message: "SoDienThoai phải đúng 10 chữ số (ví dụ 0900000001)" });

  console.log(phone);
  try {
    let parsedNgaySinh = null;
    try {
      parsedNgaySinh = parseSqlDate(NgaySinh, "NgaySinh");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const existed = await db
      .request()
      .input("sdt", sql.Char(10), phone)
      .query(
        "SELECT TOP 1 makhachhang FROM KHACHHANG WHERE sodienthoai = @sdt"
      );

    if (existed.recordset?.length) {
      return res.status(409).json({ message: "Số điện thoại đã được đăng ký" });
    }

    const MaKhachHang = await generatePrimaryKey("KH");

    await db
      .request()
      .input("makhachhang", sql.Char(15), MaKhachHang)
      .input("hovaten", sql.NVarChar(50), HoVaTen)
      .input("ngaysinh", sql.Date, parsedNgaySinh)
      .input("diachi", sql.NVarChar(200), DiaChi ?? null)
      .input("sodienthoai", sql.Char(10), phone)
      .input("matkhau", sql.VarChar(50), String(MatKhau))
      .query(
        "INSERT INTO KHACHHANG (makhachhang, hovaten, ngaysinh, diachi, sodienthoai, matkhau) VALUES (@makhachhang, @hovaten, @ngaysinh, @diachi, @sodienthoai, @matkhau)"
      );

    console.log({
      role: "customer",
      user: {
        makhachhang: MaKhachHang,
        hovaten: HoVaTen,
        sodienthoai: phone,
      },
    });

    res.json({
      role: "customer",
      user: {
        makhachhang: MaKhachHang,
        hovaten: HoVaTen,
        sodienthoai: phone,
      },
    });
  } catch (err) {
    console.error("Error /auth/register:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Login customer or employee (no hashing)
// body: { Role?: 'customer'|'employee', SoDienThoai, MatKhau }
// Login customer or employee (no hashing)
// body: { Role?: 'customer'|'employee', SoDienThoai, MatKhau }
router.post("/login", async (req, res) => {
  const { Role, SoDienThoai, MatKhau } = req.body;
  const missing = requireFields(req.body, ["SoDienThoai", "MatKhau"]);
  if (missing.length)
    return res.status(400).json({ message: "Missing fields", missing });

  const phone = normalizePhone10(SoDienThoai);
  if (!phone)
    return res
      .status(400)
      .json({ message: "SoDienThoai phải đúng 10 chữ số (ví dụ 0900000001)" });

  const loginType = Role === "employee" ? "employee" : "customer";

  try {
    if (loginType === "employee") {
      const result = await db
        .request()
        .input("sdt", sql.Char(10), phone)
        .input("mk", sql.VarChar(50), String(MatKhau))
        .query(
          "SELECT TOP 1 manhanvien, hovaten, sodienthoai, chinhanh FROM NHANVIEN WHERE sodienthoai = @sdt AND matkhau = @mk"
        );

      if (!result.recordset?.length) {
        return res
          .status(401)
          .json({ message: "Sai số điện thoại hoặc mật khẩu" });
      }

      const user = result.recordset[0];
      console.log(user);
      const roles = [];

      // Check specific roles
      const maNV = user.manhanvien;

      const checkRoles = await db.request().input("manhanvien", sql.Char(15), maNV).query(`
        SELECT 'doctor' as roleName FROM NVBACSI WHERE manhanvien = @manhanvien
        UNION ALL
        SELECT 'sales' as roleName FROM NVBANHANG WHERE manhanvien = @manhanvien
        UNION ALL
        SELECT 'receptionist' as roleName FROM NVTIEPTAN WHERE manhanvien = @manhanvien
        UNION ALL
        SELECT 'manager' as roleName FROM NVQUANLY WHERE manhanvien = @manhanvien
      `);
      console.log(checkRoles.recordset);
      if (checkRoles.recordset.length > 0) {
        checkRoles.recordset.forEach(row => roles.push(row.roleName));
      } else {
        // Default role if in NHANVIEN but not in any specific table (should ideally not happen given schema constraints?)
        // Or simply just 'employee'
        roles.push("staff");
      }

      return res.json({ roles, user });
    }

    // Customer Login
    const result = await db
      .request()
      .input("sodienthoai", sql.Char(10), phone)
      .input("matkhau", sql.VarChar(50), String(MatKhau))
      .query(
        "SELECT TOP 1 makhachhang, hovaten, sodienthoai, mahoivien, tongchitieu FROM KHACHHANG WHERE sodienthoai = @sodienthoai AND matkhau = @matkhau"
      );

    if (!result.recordset?.length) {
      return res
        .status(401)
        .json({ message: "Sai số điện thoại hoặc mật khẩu" });
    }

    res.json({ roles: ["customer"], user: result.recordset[0] });
  } catch (err) {
    console.error("Error /auth/login:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
