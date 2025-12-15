import express from "express";
import db from "../db.js";
import sql from "mssql";
import { generatePrimaryKey } from "../utils/keyGenerator.js";

const router = express.Router();

const asNullIfEmpty = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    return value;
};

const requireFields = (obj, fields) => {
    const missing = fields.filter((f) => obj?.[f] === undefined || obj?.[f] === null || obj?.[f] === "");
    return missing;
};

// 1) sp_DatLichKham
router.post("/dat-lich-kham", async (req, res) => {
    const { MaThuCung, MaChiNhanh, ThoiGianHen } = req.body;
    const missing = requireFields(req.body, ["MaThuCung", "MaChiNhanh", "ThoiGianHen"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaPhieuDatLich = await generatePrimaryKey("PD");
        const result = await db
            .request()
            .input("MaPhieuDatLich", sql.Char(15), MaPhieuDatLich)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .input("ThoiGianHen", sql.Time(0), ThoiGianHen)
            .execute("sp_DatLichKham");

        res.json({ MaPhieuDatLich, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_DatLichKham:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 2) sp_GhiNhanKham
router.post("/ghi-nhan-kham", async (req, res) => {
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
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaHoSo = await generatePrimaryKey("HS");
        const result = await db
            .request()
            .input("MaHoSo", sql.Char(15), MaHoSo)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaBacSi", sql.Char(15), MaBacSi)
            .input("TrieuChung", sql.NVarChar(200), TrieuChung)
            .input("ChuanDoan", sql.NVarChar(200), ChuanDoan)
            .input("NgayKham", sql.Date, new Date(NgayKham))
            .input("NgayTaiKham", sql.Date, new Date(NgayTaiKham))
            .input("MaToaThuoc", sql.Char(15), asNullIfEmpty(MaToaThuoc))
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_GhiNhanKham");

        res.json({ MaHoSo, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_GhiNhanKham:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 3) sp_KeToaThuoc
router.post("/ke-toa-thuoc", async (req, res) => {
    const { MaToa, MaThuoc, SoLuong, GhiChu } = req.body;
    const missing = requireFields(req.body, ["MaThuoc", "SoLuong", "GhiChu"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const finalMaToa = asNullIfEmpty(MaToa) ?? (await generatePrimaryKey("TT"));
        const result = await db
            .request()
            .input("MaToa", sql.Char(15), finalMaToa)
            .input("MaThuoc", sql.Char(15), MaThuoc)
            .input("SoLuong", sql.Int, SoLuong)
            .input("GhiChu", sql.NVarChar(200), GhiChu)
            .execute("sp_KeToaThuoc");

        res.json({ MaToa: finalMaToa, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_KeToaThuoc:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 4) sp_KhoiTaoHoaDon
router.post("/khoi-tao-hoa-don", async (req, res) => {
    const { MaNhanVien, MaKhachHang, MaChiNhanh } = req.body;
    const missing = requireFields(req.body, ["MaNhanVien", "MaKhachHang", "MaChiNhanh"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaHoaDon = await generatePrimaryKey("HD");
        const result = await db
            .request()
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaNhanVien", sql.Char(15), MaNhanVien)
            .input("MaKhachHang", sql.Char(15), MaKhachHang)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_KhoiTaoHoaDon");

        res.json({ MaHoaDon, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_KhoiTaoHoaDon:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 5) sp_ThemChiTietHoaDon_BanLe
router.post("/hoa-don/them-chi-tiet/ban-le", async (req, res) => {
    const { MaHoaDon, MaSanPham, SoLuong } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaSanPham", "SoLuong"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaSanPham", sql.Char(15), MaSanPham)
            .input("SoLuong", sql.Int, SoLuong)
            .execute("sp_ThemChiTietHoaDon_BanLe");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_BanLe:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 6) sp_ThemChiTietHoaDon_KhamBenh
router.post("/hoa-don/them-chi-tiet/kham-benh", async (req, res) => {
    const { MaHoaDon, MaHoSoBenhAn, GiaTien } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaHoSoBenhAn", "GiaTien"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaHoSoBenhAn", sql.Char(15), MaHoSoBenhAn)
            .input("GiaTien", sql.Int, GiaTien)
            .execute("sp_ThemChiTietHoaDon_KhamBenh");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_KhamBenh:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 7) sp_ThemChiTietHoaDon_GoiTiem
router.post("/hoa-don/them-chi-tiet/goi-tiem", async (req, res) => {
    const { MaHoaDon, MaGoiTiem } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon", "MaGoiTiem"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CT");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaHoaDon", sql.Char(15), MaHoaDon)
            .input("MaGoiTiem", sql.Char(15), MaGoiTiem)
            .execute("sp_ThemChiTietHoaDon_GoiTiem");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietHoaDon_GoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 8) sp_ChotHoaDon
router.post("/hoa-don/chot", async (req, res) => {
    const { MaHoaDon } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const result = await db.request().input("MaHoaDon", sql.Char(15), MaHoaDon).execute("sp_ChotHoaDon");
        res.json({ rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ChotHoaDon:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 9) sp_HoanTatThanhToan
router.post("/hoa-don/thanh-toan", async (req, res) => {
    const { MaHoaDon } = req.body;
    const missing = requireFields(req.body, ["MaHoaDon"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const result = await db.request().input("MaHoaDon", sql.Char(15), MaHoaDon).execute("sp_HoanTatThanhToan");
        res.json({ rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_HoanTatThanhToan:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/tra-cuu-ho-so-benh-an', async (req, res) => {
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

// 11) sp_NhacLichTaiKhamNgayMai
router.get("/nhac-lich/tai-kham-ngay-mai", async (_req, res) => {
    try {
        const result = await db.request().execute("sp_NhacLichTaiKhamNgayMai");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_NhacLichTaiKhamNgayMai:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 12) sp_NhacLichTiemChungSapToi
router.get("/nhac-lich/tiem-chung-sap-toi", async (_req, res) => {
    try {
        const result = await db.request().execute("sp_NhacLichTiemChungSapToi");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_NhacLichTiemChungSapToi:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 13) sp_KhoiTaoGoiTiem
router.post("/goi-tiem/khoi-tao", async (req, res) => {
    const { NgayHetHan, PhanTramGiamGia, MaThuCung, MaChiNhanh } = req.body;
    const missing = requireFields(req.body, ["NgayHetHan", "PhanTramGiamGia", "MaThuCung", "MaChiNhanh"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaGoi = await generatePrimaryKey("GT");
        const result = await db
            .request()
            .input("MaGoi", sql.Char(15), MaGoi)
            .input("NgayHetHan", sql.Date, new Date(NgayHetHan))
            .input("PhanTramGiamGia", sql.Int, PhanTramGiamGia)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .execute("sp_KhoiTaoGoiTiem");

        res.json({ MaGoi, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_KhoiTaoGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 14) sp_ThemChiTietGoiTiem
router.post("/goi-tiem/them-chi-tiet", async (req, res) => {
    const { MaGoi, MaSanPham } = req.body;
    const missing = requireFields(req.body, ["MaGoi", "MaSanPham"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaChiTiet = await generatePrimaryKey("CG");
        const result = await db
            .request()
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .input("MaGoi", sql.Char(15), MaGoi)
            .input("MaSanPham", sql.Char(15), MaSanPham)
            .execute("sp_ThemChiTietGoiTiem");

        res.json({ MaChiTiet, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThemChiTietGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 15) sp_TraCuuTinhTrangGoiTiem
router.get("/goi-tiem/tinh-trang", async (req, res) => {
    const { MaThuCung } = req.query;
    if (!MaThuCung) return res.status(400).json({ message: "Missing query param: MaThuCung" });

    try {
        const result = await db.request().input("MaThuCung", sql.Char(15), MaThuCung).execute("sp_TraCuuTinhTrangGoiTiem");
        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TraCuuTinhTrangGoiTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 16) sp_ThucHienTiem
router.post("/tiem/thuc-hien", async (req, res) => {
    const { MaThuCung, MaNhanVien, MaChiNhanh, MaChiTiet } = req.body;
    const missing = requireFields(req.body, ["MaThuCung", "MaNhanVien", "MaChiNhanh", "MaChiTiet"]);
    if (missing.length) return res.status(400).json({ message: "Missing fields", missing });

    try {
        const MaLichSu = await generatePrimaryKey("LT");
        const result = await db
            .request()
            .input("MaLichSu", sql.Char(15), MaLichSu)
            .input("MaThuCung", sql.Char(15), MaThuCung)
            .input("MaNhanVien", sql.Char(15), MaNhanVien)
            .input("MaChiNhanh", sql.Char(15), MaChiNhanh)
            .input("MaChiTiet", sql.Char(15), MaChiTiet)
            .execute("sp_ThucHienTiem");

        res.json({ MaLichSu, rowsAffected: result.rowsAffected, recordsets: result.recordsets });
    } catch (err) {
        console.error("Error sp_ThucHienTiem:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 17) sp_BaoCaoDoanhThuChiNhanh
router.get("/bao-cao/doanh-thu-chi-nhanh", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_BaoCaoDoanhThuChiNhanh");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_BaoCaoDoanhThuChiNhanh:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 18) sp_BaoCaoDoanhThuDichVu
router.get("/bao-cao/doanh-thu-dich-vu", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_BaoCaoDoanhThuDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_BaoCaoDoanhThuDichVu:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 19) sp_TongDoanhThu
router.get("/bao-cao/tong-doanh-thu", async (req, res) => {
    const { NgayBatDau, NgayKetThuc } = req.query;
    if (!NgayBatDau || !NgayKetThuc)
        return res.status(400).json({ message: "Missing query params: NgayBatDau, NgayKetThuc" });

    try {
        const result = await db
            .request()
            .input("NgayBatDau", sql.DateTime, new Date(NgayBatDau))
            .input("NgayKetThuc", sql.DateTime, new Date(NgayKetThuc))
            .execute("sp_TongDoanhThu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TongDoanhThu:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 20) sp_TopDichVu
router.get("/bao-cao/top-dich-vu", async (req, res) => {
    const { MaChiNhanh } = req.query;

    try {
        const result = await db
            .request()
            .input("MaChiNhanh", sql.Char(15), asNullIfEmpty(MaChiNhanh))
            .execute("sp_TopDichVu");

        res.json(result.recordset ?? result.recordsets);
    } catch (err) {
        console.error("Error sp_TopDichVu:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
