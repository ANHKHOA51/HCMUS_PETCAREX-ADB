import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";
import { asNullIfEmpty, requireFields } from "../utils/checkValid.js";
import { parseSqlDate } from "../utils/dateTime.js";

const router = express.Router();

// 2) sp_GhiNhanKham -> Record Examination
router.post("/examinations", async (req, res) => {
  const {
    MaThuCung,
    MaBacSi,
    TrieuChung,
    ChuanDoan,
    NgayKham,
    NgayTaiKham,
    MaToaThuoc,
    MaChiNhanh,
  } = req.body;

  const missing = requireFields(req.body, [
    "MaThuCung",
    "MaBacSi",
    "TrieuChung",
    "ChuanDoan",
    "NgayKham",
    "NgayTaiKham",
    "MaChiNhanh",
  ]);
  if (missing.length)
    return res.status(400).json({ message: "Missing fields", missing });

  try {
    let parsedNgayKham;
    let parsedNgayTaiKham;
    try {
      parsedNgayKham = parseSqlDate(NgayKham, "NgayKham");
      parsedNgayTaiKham = parseSqlDate(NgayTaiKham, "NgayTaiKham");
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const MaHoSo = await generatePrimaryKey("HS");
    const result = await db
      .request()
      .input("MaHoSo", sql.Char(15), MaHoSo)
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("MaBacSi", sql.Char(15), MaBacSi)
      .input("TrieuChung", sql.NVarChar(200), TrieuChung)
      .input("ChuanDoan", sql.NVarChar(200), ChuanDoan)
      .input("NgayKham", sql.Date, parsedNgayKham)
      .input("NgayTaiKham", sql.Date, parsedNgayTaiKham)
      .input("MaToaThuoc", sql.Char(15), asNullIfEmpty(MaToaThuoc))
      .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
      .execute("sp_GhiNhanKham");

    res.json({
      MaHoSo,
      rowsAffected: result.rowsAffected,
      recordsets: result.recordsets,
    });
  } catch (err) {
    console.error("Error POST /examinations:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 3) sp_KeToaThuoc -> Create Prescription
router.post("/prescriptions", async (req, res) => {
  const chitiet = req.body;
  // Expecting array of { MaToa (optional), MaThuoc, SoLuong, GhiChu, MaChiNhanh }

  const transaction = new sql.Transaction(db);

  try {
    await transaction.begin();

    let batchMaToa = null;

    for (const item of chitiet) {
      let { MaToa, MaThuoc, SoLuong, GhiChu, MaChiNhanh } = item;
      const missing = requireFields(item, ["MaThuoc", "SoLuong"]);
      if (missing.length) {
        throw new Error(`Missing fields: ${missing.join(", ")}`);
      }

      // If we have a generated batch ID, use it to ensure grouping
      if (!MaToa && batchMaToa) {
        MaToa = batchMaToa;
      }

      const finalMaToa =
        asNullIfEmpty(MaToa) ?? (await generatePrimaryKey("TT"));

      // Capture the generated ID for subsequent items
      if (!MaToa && !batchMaToa) {
        batchMaToa = finalMaToa;
      }

      // 1. Check Stock (if MaChiNhanh provided)
      if (MaChiNhanh) {
        const stockCheck = await transaction
          .request()
          .input("MaSanPham", sql.Char(15), MaThuoc)
          .input("MaChiNhanh", sql.Char(15), MaChiNhanh).query(`
            SELECT soluongtonkho 
            FROM SANPHAMTONKHO 
            WHERE masanpham = @MaSanPham AND machinhanh = @MaChiNhanh
          `);

        const currentStock = stockCheck.recordset[0]?.soluongtonkho || 0;
        if (currentStock < SoLuong) {
          throw new Error(
            `Insufficient stock for medicine ${MaThuoc}. Available: ${currentStock}, Requested: ${SoLuong}`
          );
        }

        // 2. Deduct Stock
        await transaction
          .request()
          .input("MaSanPham", sql.Char(15), MaThuoc)
          .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
          .input("SoLuong", sql.Int, SoLuong).query(`
            UPDATE SANPHAMTONKHO
            SET soluongtonkho = soluongtonkho - @SoLuong
            WHERE masanpham = @MaSanPham AND machinhanh = @MaChiNhanh
          `);
      }

      // 3. Create Prescription Detail
      await transaction
        .request()
        .input("MaToa", sql.Char(15), finalMaToa)
        .input("MaThuoc", sql.Char(15), MaThuoc)
        .input("SoLuong", sql.Int, SoLuong)
        .input("GhiChu", sql.NVarChar(200), GhiChu || "")
        .execute("sp_KeToaThuoc");
    }

    await transaction.commit();
    res.json({
      message: "Prescriptions processed successfully",
      status: "ok",
      MaToa: batchMaToa || chitiet[0]?.MaToa
    });

  } catch (err) {
    if (transaction._active) await transaction.rollback();
    console.error("Error POST /prescriptions:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

// 11) sp_NhacLichTaiKhamNgayMai -> Get Tomorrow Reminders
router.get("/reminders/tomorrow", async (_req, res) => {
  try {
    const result = await db.request().execute("sp_NhacLichTaiKhamNgayMai");
    res.json(result.recordset ?? result.recordsets);
  } catch (err) {
    console.error("Error GET /reminders/tomorrow:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 10) sp_TraCuuHosoBenhAn -> Get Medical & Vaccine History (cursor by IDs)
// Query params:
//   id: MaThuCung (required)
//   cursorMaHoSo: optional, last "mahoso" for paging medical records
//   cursorMaLichSuTiem: optional, last "malichsutiem" for paging vaccine history
//   limit: optional, number of records per type (default: unlimited)
router.get("/history", async (req, res) => {
  const { id, cursorMaHoSo, cursorMaLichSuTiem, limit } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Missing query param: id (MaThuCung)" });
  }

  try {
    const request = db.request();
    request.input("MaThuCung", sql.Char(15), id);

    request.input("CursorMaHoSo", sql.Char(15), cursorMaHoSo ?? null);
    request.input(
      "CursorMaLichSuTiem",
      sql.Char(15),
      cursorMaLichSuTiem ?? null
    );

    let parsedLimit = null;
    if (limit !== undefined) {
      const tmp = parseInt(limit, 10);
      if (!Number.isNaN(tmp) && tmp > 0) {
        parsedLimit = tmp;
        // Lấy dư thêm 1 để biết còn trang tiếp hay không
        request.input("SoLuong", sql.Int, parsedLimit + 1);
      }
    }

    const result = await request.execute("sp_TraCuuHosoBenhAn");

    let medicalRecords = result.recordsets?.[0] ?? [];
    let vaccineHistory = result.recordsets?.[1] ?? [];

    let nextCursorMaHoSo = null;
    let nextCursorMaLichSuTiem = null;

    if (parsedLimit && parsedLimit > 0) {
      if (medicalRecords.length > parsedLimit) {
        medicalRecords = medicalRecords.slice(0, parsedLimit);
        const last = medicalRecords[medicalRecords.length - 1];
        nextCursorMaHoSo = last?.mahoso ?? null;
      }

      if (vaccineHistory.length > parsedLimit) {
        vaccineHistory = vaccineHistory.slice(0, parsedLimit);
        const last = vaccineHistory[vaccineHistory.length - 1];
        nextCursorMaLichSuTiem = last?.malichsutiem ?? null;
      }
    }

    res.json({
      medicalRecords,
      vaccineHistory,
      nextCursorMaHoSo,
      nextCursorMaLichSuTiem,
    });
  } catch (err) {
    console.error("Error GET /history:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 12) sp_TimToaThuocTheoMa -> Get Prescription by ID
router.get("/tim-toa-thuoc", async (req, res) => {
  const maToa = req.query.id;
  try {
    const result = await db
      .request()
      .input("MaToa", sql.Char(15), maToa)
      .execute("sp_TimToaThuocTheoMa");
    res.json(result.recordsets);
  } catch (err) {
    console.error("Error GET /lay-toa-thuoc:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 13) Create Full Examination (Prescription + Medical Record)
router.post("/full-examination", async (req, res) => {
  const {
    MaThuCung,
    MaBacSi,
    TrieuChung,
    ChuanDoan,
    NgayKham,
    NgayTaiKham,
    MaChiNhanh,
    PrescriptionItems, // Array of { MaThuoc, SoLuong, GhiChu }
  } = req.body;

  const missing = requireFields(req.body, [
    "MaThuCung",
    "MaBacSi",
    "TrieuChung",
    "ChuanDoan",
    "NgayKham",
    "NgayTaiKham",
    "MaChiNhanh",
  ]);
  if (missing.length)
    return res.status(400).json({ message: "Missing fields", missing });

  const transaction = new sql.Transaction(db);

  try {
    await transaction.begin();

    let MaToaThuoc = null;

    // 1. Create Prescription if items exist
    if (Array.isArray(PrescriptionItems) && PrescriptionItems.length > 0) {
      MaToaThuoc = await generatePrimaryKey("TT");

      for (const item of PrescriptionItems) {
        const { MaThuoc, SoLuong, GhiChu } = item;
        if (!MaThuoc || !SoLuong) {
          throw new Error("Missing MaThuoc or SoLuong in PrescriptionItems");
        }

        // Check stock first
        const stockCheck = await transaction
          .request()
          .input("MaSanPham", sql.Char(15), MaThuoc)
          .input("MaChiNhanh", sql.Char(15), MaChiNhanh).query(`
            SELECT soluongtonkho 
            FROM SANPHAMTONKHO 
            WHERE masanpham = @MaSanPham AND machinhanh = @MaChiNhanh
          `);

        const currentStock = stockCheck.recordset[0]?.soluongtonkho || 0;
        if (currentStock < SoLuong) {
          throw new Error(
            `Insufficient stock for medicine ${MaThuoc}. Available: ${currentStock}, Requested: ${SoLuong}`
          );
        }

        // Create Prescription Detail
        await transaction
          .request()
          .input("MaToa", sql.Char(15), MaToaThuoc)
          .input("MaThuoc", sql.Char(15), MaThuoc)
          .input("SoLuong", sql.Int, SoLuong)
          .input("GhiChu", sql.NVarChar(200), GhiChu || "")
          .execute("sp_KeToaThuoc");

        // Deduct Stock
        await transaction
          .request()
          .input("MaSanPham", sql.Char(15), MaThuoc)
          .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
          .input("SoLuong", sql.Int, SoLuong).query(`
            UPDATE SANPHAMTONKHO
            SET soluongtonkho = soluongtonkho - @SoLuong
            WHERE masanpham = @MaSanPham AND machinhanh = @MaChiNhanh
          `);
      }
    }

    // 2. Create Medical Record
    let parsedNgayKham;
    let parsedNgayTaiKham;
    try {
      parsedNgayKham = parseSqlDate(NgayKham, "NgayKham");
      parsedNgayTaiKham = parseSqlDate(NgayTaiKham, "NgayTaiKham");
    } catch (e) {
      throw new Error(e.message);
    }

    const MaHoSo = await generatePrimaryKey("HS");

    await transaction
      .request()
      .input("MaHoSo", sql.Char(15), MaHoSo)
      .input("MaThuCung", sql.Char(15), MaThuCung)
      .input("MaBacSi", sql.Char(15), MaBacSi)
      .input("TrieuChung", sql.NVarChar(200), TrieuChung)
      .input("ChuanDoan", sql.NVarChar(200), ChuanDoan)
      .input("NgayKham", sql.Date, parsedNgayKham)
      .input("NgayTaiKham", sql.Date, parsedNgayTaiKham)
      .input("MaToaThuoc", sql.Char(15), asNullIfEmpty(MaToaThuoc))
      .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
      .execute("sp_GhiNhanKham");

    await transaction.commit();

    res.json({
      message: "Examination created successfully",
      MaHoSo,
      MaToaThuoc,
    });
  } catch (err) {
    if (transaction._active) await transaction.rollback();
    console.error("Error POST /full-examination:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

// 14) Get Full Prescription Details (with Product Names)
router.get("/prescriptions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.request().input("MaToa", sql.Char(15), id).query(`
        SELECT 
            TT.matoathuoc, 
            TT.ngayketoa, 
            CT.masanpham, 
            SP.ten AS tenThuoc, 
            CT.soluong, 
            CT.ghichu,
            SP.gia
        FROM TOATHUOC TT
        JOIN CHITIETTOATHUOC CT ON TT.matoathuoc = CT.matoathuoc
        JOIN SANPHAM SP ON CT.masanpham = SP.masanpham
        WHERE TT.matoathuoc = @MaToa
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error GET /prescriptions/:id:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
