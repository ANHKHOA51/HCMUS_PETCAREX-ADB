USE master
GO

IF DB_ID('PETCAREX') IS NOT NULL
BEGIN
    ALTER DATABASE PETCAREX SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PETCAREX;
END
GO


CREATE DATABASE PETCAREX
GO

USE PETCAREX
GO
-- ================================================
-- =                  TABLES                      =
-- ================================================

-- HOIVIEN (Membership Tiers: Gold, Silver, Bronze, etc.)
CREATE TABLE HOIVIEN (
    mahoivien CHAR(15) PRIMARY KEY,
    tieude NVARCHAR(50) NOT NULL,
    muchitieutoithieu INT CHECK (muchitieutoithieu >= 0),
    mucchitieugiuhang INT CHECK (mucchitieugiuhang >= 0),
    phantramgiamgia INT CHECK (phantramgiamgia BETWEEN 0 AND 100)
);
GO

--KHACHHANG
CREATE TABLE KHACHHANG (
    makhachhang CHAR(15) PRIMARY KEY,
    hovaten NVARCHAR(50) NOT NULL,
    ngaysinh DATE,
    diachi NVARCHAR(200),
    sodienthoai CHAR(10) UNIQUE,
    tongchitieu INT DEFAULT 0 CHECK (tongchitieu >= 0),
    ngaydangky DATE DEFAULT GETDATE(),
    matkhau VARCHAR(50) NOT NULL,
    mahoivien CHAR(15) NULL,
    FOREIGN KEY (mahoivien) REFERENCES HOIVIEN(mahoivien)
);
GO

--LICHSUCHITIEU
CREATE TABLE LICHSUCHITIEU (
    nam INT,
    makhachhang CHAR(15),
    tongchitieu INT DEFAULT 0 CHECK (tongchitieu >= 0),
    mahoivien CHAR(15) NULL,
    PRIMARY KEY (nam, makhachhang),
    FOREIGN KEY (makhachhang) REFERENCES KHACHHANG(makhachhang),
    FOREIGN KEY (mahoivien) REFERENCES HOIVIEN(mahoivien)
);
GO

--THUCUNG
CREATE TABLE THUCUNG (
    mathucung CHAR(15) PRIMARY KEY,
    ten NVARCHAR(50) NOT NULL,
    ngaysinh DATE,
    loai NVARCHAR(50) NOT NULL,
    giong NVARCHAR(50) NOT NULL,
    ngaydangky DATE DEFAULT GETDATE(),
    makhachhang CHAR(15) NOT NULL,
    FOREIGN KEY (makhachhang) REFERENCES KHACHHANG(makhachhang)
);
GO

--DICHVU
CREATE TABLE DICHVU (
    madichvu TINYINT PRIMARY KEY CHECK (madichvu BETWEEN 0 AND 2),
    loaidichvu NVARCHAR(20) NOT NULL
);
GO
-- madichvu
-- 0: Khám bệnh 
-- 1: Tiêm phòng
-- 2: Bán lẻ



--CHINHANH
CREATE TABLE CHINHANH (
    machinhanh CHAR(15) PRIMARY KEY,
    tenchinhanh NVARCHAR(100) UNIQUE NOT NULL,
    diachi NVARCHAR(200) NOT NULL,
    sodienthoai CHAR(10) NOT NULL,
    thoigianmo TIME(0) NOT NULL,
    thoigiandong TIME(0) NOT NULL
);
GO

--CHINHANHDICHVU
CREATE TABLE CHINHANHDICHVU (
    machinhanh CHAR(15) NOT NULL,
    madichvu TINYINT NOT NULL,
    PRIMARY KEY (machinhanh, madichvu),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh),
    FOREIGN KEY (madichvu) REFERENCES DICHVU(madichvu)
);
GO

--NHANVIEN
CREATE TABLE NHANVIEN (
    manhanvien CHAR(15) PRIMARY KEY,
    hovaten NVARCHAR(100) NOT NULL,
    ngaysinh DATE CHECK (DATEDIFF(year, ngaysinh, GETDATE()) >= 18),
    chinhanh CHAR(15) NULL,
    diachi NVARCHAR(200),
    sodienthoai CHAR(10) UNIQUE NOT NULL,
    luongcoban INT CHECK (luongcoban > 0),
    heso DECIMAL(4, 2) DEFAULT 1.00,
    phucap INT DEFAULT 0,
    matkhau NVARCHAR(50) NOT NULL,
    FOREIGN KEY (chinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

--NVBANHANG
CREATE TABLE NVBANHANG (
    manhanvien CHAR(15) PRIMARY KEY,
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien)
);
--NVQUANLY
CREATE TABLE NVQUANLY (
    manhanvien CHAR(15) PRIMARY KEY,
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien)
);
--NVTIEPTAN
CREATE TABLE NVTIEPTAN (
    manhanvien CHAR(15) PRIMARY KEY,
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien)
);
--NVBACSI
CREATE TABLE NVBACSI (
    manhanvien CHAR(15) PRIMARY KEY,
    hocvi NVARCHAR(50) NOT NULL,
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien)
);
GO

--LICHSUDIEUDONG
CREATE TABLE LICHSUDIEUDONG (
    madieudong CHAR(15) PRIMARY KEY,
    ngaydieudong DATETIME DEFAULT GETDATE(),
    manhanvien CHAR(15) NOT NULL,
    machinhanh CHAR(15) NOT NULL,
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

-- PHIEUDATLICH
-- DROP TABLE PHIEUDATLICH
CREATE TABLE PHIEUDATLICH (
    maphieudatlich CHAR(15) PRIMARY KEY,
    machinhanh CHAR(15) NOT NULL,
    mathucung CHAR(15) NOT NULL,
    ngaydat DATE,
    ngayden DATE,
    thoigianden TIME(0),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh),
    FOREIGN KEY (mathucung) REFERENCES THUCUNG(mathucung)
);
GO

--SANPHAM
CREATE TABLE SANPHAM (
    masanpham CHAR(15) PRIMARY KEY,
    ten NVARCHAR(100),
    mota NVARCHAR(200),
    gia INT,
    nhasanxuat NVARCHAR(100),
    loai TINYINT CHECK (loai BETWEEN 0 AND 2)
);
GO

-- loai
-- 0: Thuốc
-- 1: Vaccine
-- 2: Sản phẩm bán lẻ


GO

--SANPHAMTONKHO
CREATE TABLE SANPHAMTONKHO (
    masanpham CHAR(15) NOT NULL,
    machinhanh CHAR(15) NOT NULL,
    soluongtonkho INT CHECK (soluongtonkho >= 0),
    PRIMARY KEY (masanpham, machinhanh),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

--THUOC
CREATE TABLE THUOC (
    masanpham CHAR(15) PRIMARY KEY,
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);
GO

--VACCINE
CREATE TABLE VACCINE (
    masanpham CHAR(15) PRIMARY KEY,
    phanloai NVARCHAR(15) NOT NULL,
    solo CHAR(15) NOT NULL,
    huongdansudung NVARCHAR(200),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);
GO

--TOATHUOC
CREATE TABLE TOATHUOC (
    matoathuoc CHAR(15) PRIMARY KEY,
    ngayketoa DATE,
    gia INT
);
GO

--CHITIETTOATHUOC
CREATE TABLE CHITIETTOATHUOC (
    matoathuoc CHAR(15) NOT NULL,
    masanpham CHAR(15) NOT NULL,
    soluong INT NOT NULL,
    ghichu NVARCHAR(100),
    PRIMARY KEY (matoathuoc, masanpham),
    FOREIGN KEY (matoathuoc) REFERENCES TOATHUOC(matoathuoc),
    FOREIGN KEY (masanpham) REFERENCES THUOC(masanpham)
);
GO

--HOSOBENHAN
CREATE TABLE HOSOBENHAN (
    mahoso CHAR(15) PRIMARY KEY,
    mathucung CHAR(15) NOT NULL,
    mabacsi CHAR(15),
    trieuchung NVARCHAR(200),
    chuandoan NVARCHAR(200),
    ngaykham DATE,
    ngaytaikham DATE,
    matoathuoc CHAR(15),
    ngaylaphoso DATE,
    machinhanh CHAR(15),
    CONSTRAINT CK_NgayTaiKham_HopLe
        CHECK (ngaytaikham IS NULL OR ngaytaikham >= ngaykham),
    FOREIGN KEY (mathucung) REFERENCES THUCUNG(mathucung),
    FOREIGN KEY (mabacsi) REFERENCES NVBACSI(manhanvien),
    FOREIGN KEY (matoathuoc) REFERENCES TOATHUOC(matoathuoc),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

--GOITIEM
CREATE TABLE GOITIEM (
    magoitiem CHAR(15) PRIMARY KEY,
    thoihan DATE,
    giamgia INT CHECK (giamgia BETWEEN 0 AND 100),
    mathucung CHAR(15) NOT NULL,
    machinhanh CHAR(15) NOT NULL,
    FOREIGN KEY (mathucung) REFERENCES THUCUNG(mathucung),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

--LICHSUTIEM
CREATE TABLE LICHSUTIEM (
    malichsutiem CHAR(15) PRIMARY KEY,
    ngaytiem DATE NOT NULL,
    mathucung CHAR(15) NOT NULL,
    masanpham CHAR(15) NOT NULL,
    manhanvien CHAR(15) NOT NULL,
    machinhanh CHAR(15) NOT NULL,
    FOREIGN KEY (mathucung) REFERENCES THUCUNG(mathucung),
    FOREIGN KEY (masanpham) REFERENCES VACCINE(masanpham),
    FOREIGN KEY (manhanvien) REFERENCES NVBACSI(manhanvien),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO

--CHITIETGOITIEM
CREATE TABLE CHITIETGOITIEM (
    machitiet CHAR(15) PRIMARY KEY,
    ngaytiemdukien DATE NOT NULL,
    ngaytiemthucte DATE NULL,
    trangthai BIT,
    magoitiem CHAR(15) NOT NULL,
    masanpham CHAR(15) NOT NULL,
    malichsutiem CHAR(15),
    FOREIGN KEY (magoitiem) REFERENCES GOITIEM(magoitiem),
    FOREIGN KEY (masanpham) REFERENCES VACCINE(masanpham),
    FOREIGN KEY (malichsutiem) REFERENCES LICHSUTIEM(malichsutiem)
);
GO

--HOADON
CREATE TABLE HOADON (
    mahoadon CHAR(15) PRIMARY KEY,
    ngaylap DATETIME DEFAULT GETDATE(),
    tongtien INT DEFAULT 0 CHECK (tongtien >= 0),
    sotiengiamgia INT DEFAULT 0 CHECK (sotiengiamgia >= 0),
    sotienphaitra INT DEFAULT 0 CHECK (sotienphaitra >= 0),
    trangthai TINYINT DEFAULT 0 CHECK (trangthai BETWEEN 0 AND 3),
    makhachhang CHAR(15),
    manhanvien CHAR(15),
    machinhanh CHAR(15) NOT NULL,
    FOREIGN KEY (makhachhang) REFERENCES KHACHHANG(makhachhang),
    FOREIGN KEY (manhanvien) REFERENCES NHANVIEN(manhanvien),
    FOREIGN KEY (machinhanh) REFERENCES CHINHANH(machinhanh)
);
GO
-- trangthai:
-- 0: Processing: đang thêm sản phẩm vào hóa đơn
-- 1: Pending_payment: đã thêm tất cả sản phẩm/dịch vụ, chờ khách hàng thanh toán
-- 2: Completed: Thanh toán xong
-- 3: Cancelled: Hủy hóa đơn

GO


--CHITIETHOADON
CREATE TABLE CHITIETHOADON (
    machitiethoadon CHAR(15) PRIMARY KEY,
    mahoadon CHAR(15) NOT NULL,
    giamoidonvi INT CHECK (giamoidonvi >= 0),
    soluong INT CHECK (soluong > 0),
    loai TINYINT CHECK (loai BETWEEN 0 AND 2),
    FOREIGN KEY (mahoadon) REFERENCES HOADON(mahoadon)
);
GO
-- loai:
-- 0: Khám bệnh
-- 1: Gói tiêm
-- 2: Bán lẻ
GO

--CHITIETHOADON_KHAMBENH
CREATE TABLE CHITIETHOADON_KHAMBENH (
    machitiethoadon CHAR(15) PRIMARY KEY,
    mahosobenhan CHAR(15) NOT NULL,
    FOREIGN KEY (machitiethoadon) REFERENCES CHITIETHOADON(machitiethoadon),
    FOREIGN KEY (mahosobenhan) REFERENCES HOSOBENHAN(mahoso)
);
GO

--CHITIETHOADON_GOITIEM
CREATE TABLE CHITIETHOADON_GOITIEM (
    machitiethoadon CHAR(15) PRIMARY KEY,
    magoitiem CHAR(15) NOT NULL,
    FOREIGN KEY (machitiethoadon) REFERENCES CHITIETHOADON(machitiethoadon),
    FOREIGN KEY (magoitiem) REFERENCES GOITIEM(magoitiem)
);
GO

--CHITIETHOADON_BANLE
CREATE TABLE CHITIETHOADON_BANLE (
    machitiethoadon CHAR(15) PRIMARY KEY,
    masanpham CHAR(15) NOT NULL,
    FOREIGN KEY (machitiethoadon) REFERENCES CHITIETHOADON(machitiethoadon),
    FOREIGN KEY (masanpham) REFERENCES SANPHAM(masanpham)
);
GO

--PHIEUDANHGIA
CREATE TABLE PHIEUDANHGIA (
    maphieudanhgia CHAR(15) PRIMARY KEY,
    mahoadon CHAR(15) UNIQUE,
    diemdanhgia TINYINT CHECK (diemdanhgia BETWEEN 1 AND 5),
    noidung NVARCHAR(500),
    ngaydanhgia DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (mahoadon) REFERENCES HOADON(mahoadon)
);
GO


-- ================================================
-- =                  Index                       =
-- ================================================

-- =============================================
-- 1. BẢNG HOADON: Filtered Index
-- Mục đích: Tăng tốc kiểm tra trạng thái Processing/Pending
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_HOADON_TrangThai_Active')
BEGIN
    CREATE NONCLUSTERED INDEX IX_HOADON_TrangThai_Active
    ON HOADON(trangthai)
    INCLUDE (makhachhang, machinhanh) -- Include để hỗ trợ sp_HoanTatThanhToan lấy dữ liệu nhanh
    WHERE trangthai IN (0, 1); -- Chỉ index hóa đơn đang hoạt động
    
    PRINT 'Da tao index IX_HOADON_TrangThai_Active';
END

-- =============================================
-- 2. BẢNG CHITIETHOADON: Covering Index
-- Mục đích: Tăng tốc tính tổng tiền trong sp_ChotHoaDon
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETHOADON_MaHoaDon_Calc')
BEGIN
    CREATE NONCLUSTERED INDEX IX_CHITIETHOADON_MaHoaDon_Calc
    ON CHITIETHOADON(mahoadon)
    INCLUDE (soluong, giamoidonvi); -- Có sẵn dữ liệu để nhân và cộng, không cần về bảng chính
    
    PRINT 'Da tao index IX_CHITIETHOADON_MaHoaDon_Calc';
END

-- =============================================
-- 3. BẢNG HOSOBENHNHAN: Standard Index
-- Mục đích: Quét lịch tái khám hàng ngày
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_HOSOBENHNHAN_NgayTaiKham')
BEGIN
    CREATE NONCLUSTERED INDEX IX_HOSOBENHAN_NgayTaiKham
    ON HOSOBENHAN(ngaytaikham)
    INCLUDE (mathucung, trieuchung); -- Include để hiển thị thông tin nhắc nhở
    
    PRINT 'Da tao index IX_HOSOBENHAN_NgayTaiKham';
END

-- =============================================
-- 4. BẢNG CHITIETGOITIEM: Composite Index
-- Mục đích: Quét lịch tiêm chủng sắp tới
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETGOITIEM_ScanLich')
BEGIN
    CREATE NONCLUSTERED INDEX IX_CHITIETGOITIEM_ScanLich
    ON CHITIETGOITIEM(trangthai, ngaytiemdukien) -- Index trên cả 2 cột điều kiện
    INCLUDE (magoitiem, masanpham); 
    
    PRINT 'Da tao index IX_CHITIETGOITIEM_ScanLich';
END

-- =============================================
-- 5. BẢNG CHITIETHOADON_BANLE: FK Index
-- Mục đích: Tăng tốc JOIN sang kho hàng khi thanh toán
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETHOADON_BANLE_MaSanPham')
BEGIN
    CREATE NONCLUSTERED INDEX IX_CHITIETHOADON_BANLE_MaSanPham
    ON CHITIETHOADON_BANLE(masanpham)
    INCLUDE (machitiethoadon);
    
    PRINT 'Da tao index IX_CHITIETHOADON_BANLE_MaSanPham';
END

-- =============================================
-- 5. BẢNG CHITIETTOATHUOC: FK Index
-- Mục đích: Tăng tốc JOIN sang TOATHUOC khi xem chi tiết toa thuốc
-- =============================================
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETTOATHUOC_matoa')
BEGIN
    CREATE NONCLUSTERED INDEX IX_CHITIETTOATHUOC_matoa
    ON CHITIETTOATHUOC(matoathuoc)
    
    PRINT 'Da tao index IX_CHITIETTOATHUOC_matoa';
END