USE PETCAREX
GO

-- =======================================================
-- NHÓM 1: QUẢN LÝ LỊCH HẸN & TIẾP NHẬN
-- =======================================================

-- 1. Tạo lịch hẹn [cite: 3]
GO
CREATE OR ALTER PROCEDURE sp_TraCuuLichHenTheoSDT
    @SDT CHAR(10),  
    @NgayHen DATE
AS
BEGIN
    -- Procedure logic here
    SELECT PDL.* FROM PHIEUDATLICH PDL
    JOIN THUCUNG TC ON PDL.mathucung = TC.mathucung
    JOIN KHACHHANG KH ON TC.makhachhang = KH.makhachhang
    WHERE KH.sodienthoai = @SDT
      AND PDL.ngayden = @NgayHen;
END;

GO
CREATE OR ALTER PROCEDURE sp_DatLichKham
    @MaPhieuDatLich CHAR(15),
    @MaThuCung CHAR(15),
    @MaChiNhanh CHAR(15),
    @NgayDen DATE,
    @ThoiGianDen TIME(0) -- Đã sửa từ TIMESTAMP sang TIME để khớp với bảng PHIEUDATLICH
AS
BEGIN
    -- Kiểm tra logic: Nếu đặt lịch cho ngày hôm nay mà giờ đã qua thì lỗi
    -- IF @ThoiGianDen < CAST(GETDATE() AS TIMESTAMP)
    -- BEGIN
    --     THROW 50001, N'Giờ đặt lịch không hợp lệ (nhỏ hơn giờ hiện tại).', 1;
    -- END

    -- Tạo mã phiếu (Tự động hoặc xử lý ở backend, ở đây giả sử trigger tự sinh hoặc truyền vào)
    -- Demo insert đơn giản theo source
    INSERT INTO PHIEUDATLICH (maphieudatlich, machinhanh, mathucung, ngaydat, ngayden, thoigianden)
    VALUES (@MaPhieuDatLich, @MaChiNhanh, @MaThuCung, CAST(GETDATE() AS DATE), CAST(@NgayDen AS DATE), @ThoiGianDen);
END;
GO

-- 2. Ghi nhận khám bệnh (Tạo hồ sơ bệnh án) [cite: 5]
GO
CREATE OR ALTER PROCEDURE sp_GhiNhanKham
    @MaHoSo CHAR(15), -- Thêm tham số này để khớp với PK
    @MaThuCung CHAR(15),
    @MaBacSi CHAR(15),
    @TrieuChung NVARCHAR(200),
    @ChuanDoan NVARCHAR(200),
    @NgayKham DATE,
    @NgayTaiKham DATE,
    @MaToaThuoc CHAR(15),
    @MaChiNhanh CHAR(15)
AS
BEGIN
    -- Kiểm tra toa thuốc có tồn tại không nếu được truyền vào
    IF @MaToaThuoc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM TOATHUOC WHERE matoathuoc = @MaToaThuoc)
    BEGIN
        THROW 50001, N'Chưa có toa thuốc này, vui lòng tạo toa thuốc trước.', 1;
    END;

    INSERT INTO HOSOBENHAN (mahoso, mathucung, mabacsi, trieuchung, chuandoan, ngaykham, ngaytaikham, matoathuoc, ngaylaphoso, machinhanh)
    VALUES (@MaHoSo, @MaThuCung, @MaBacSi, @TrieuChung, @ChuanDoan, @NgayKham, @NgayTaiKham, @MaToaThuoc, GETDATE(), @MaChiNhanh);
END;
GO

-- =======================================================
-- NHÓM 2: QUẢN LÝ THUỐC & TOA THUỐC
-- =======================================================

-- 3. Kê toa thuốc [cite: 6]
GO
CREATE OR ALTER PROCEDURE sp_KeToaThuoc
    @MaToa CHAR(15),
    @MaThuoc CHAR(15),
    @SoLuong INT,
    @GhiChu NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    -- 1. Kiểm tra thuốc có trong kho hay không (Kiểm tra chung bảng SANPHAMTONKHO hoặc bảng THUOC)
    -- Lưu ý: Logic này cần check kho của Chi Nhánh cụ thể, ở đây check tạm bảng THUOC theo source
    IF NOT EXISTS (SELECT 1 FROM THUOC WHERE masanpham = @MaThuoc)
    BEGIN
        THROW 50001, N'Mã thuốc không tồn tại trong danh mục.', 1;
    END;

    -- 2. Nếu toa chưa tồn tại --> tạo mới toa thuốc header
    IF NOT EXISTS (SELECT 1 FROM TOATHUOC WHERE matoathuoc = @MaToa)
    BEGIN
        INSERT INTO TOATHUOC (matoathuoc, ngayketoa, gia) 
        VALUES (@MaToa, GETDATE(), 0); -- Giá sẽ tính sau
    END;

    -- 3. Thêm chi tiết toa thuốc
    INSERT INTO CHITIETTOATHUOC (matoathuoc, masanpham, soluong, ghichu)
    VALUES (@MaToa, @MaThuoc, @SoLuong, @GhiChu);
END;
GO

CREATE OR ALTER PROCEDURE sp_TimToaThuocTheoMa
    @MaToa CHAR(15)
AS
BEGIN
    SET NOCOUNT ON; 
    SELECT *
    FROM TOATHUOC tt
    LEFT JOIN CHITIETTOATHUOC ct ON tt.matoathuoc = ct.matoathuoc
    WHERE (@MaToa IS NULL OR LTRIM(RTRIM(@MaToa)) = N'')
          OR tt.matoathuoc = @MaToa
    ORDER BY tt.ngayketoa DESC;
END;  

GO
CREATE OR ALTER PROCEDURE sp_TimThuocTheoTen
    @Ten NVARCHAR(100),

    -- Cursor
    @CursorMaSanPham CHAR(15) = NULL,

    @SoLuong INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @SoLuong IS NULL OR @SoLuong <= 0
        SET @SoLuong = 2147483647;

    SELECT TOP (@SoLuong)
        sp.*
    FROM SANPHAM sp
    INNER JOIN THUOC t 
        ON t.masanpham = sp.masanpham
    WHERE
        (
            @Ten IS NULL 
            OR LTRIM(RTRIM(@Ten)) = N''
            OR sp.ten LIKE N'%' + @Ten + N'%'
        )
        AND
        (
            @CursorMaSanPham IS NULL
            OR sp.masanpham > @CursorMaSanPham
        )
    ORDER BY sp.masanpham ASC;
END;
GO


-- =======================================================
-- NHÓM 3: QUẢN LÝ HÓA ĐƠN & THANH TOÁN
-- =======================================================

-- 4. Khởi tạo hóa đơn mới [cite: 7]
GO
CREATE OR ALTER PROCEDURE sp_KhoiTaoHoaDon
    @MaHoaDon CHAR(15),
    @MaNhanVien CHAR(15),
    @MaKhachHang CHAR(15),
    @MaChiNhanh CHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NgayLap DATE;
     SET @NgayLap = DATEADD(
        DAY,
        ABS(CHECKSUM(NEWID())) % 365,
        '2025-01-01'
    );    
    INSERT INTO HOADON (mahoadon, ngaylap, manhanvien, makhachhang, machinhanh, trangthai)
    VALUES (@MaHoaDon, @NgayLap, @MaNhanVien, @MaKhachHang, @MaChiNhanh, 0); -- 0: Processing
END;
GO
CREATE OR ALTER PROCEDURE sp_KhoiTaoHoaDonTest
    @MaHoaDon     CHAR(15),
    @MaNhanVien   CHAR(15),
    @MaKhachHang  CHAR(15),
    @MaChiNhanh   CHAR(15),
    @NgayLap      DATE        -- ngày tạo hóa đơn truyền từ ngoài vào
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO HOADON (mahoadon, ngaylap, manhanvien, makhachhang, machinhanh, trangthai)
    VALUES (@MaHoaDon, @NgayLap, @MaNhanVien, @MaKhachHang, @MaChiNhanh, 0); -- 0: Processing
END;
GO

-- 5. Thêm chi tiết bán lẻ vào hóa đơn [cite: 8]
GO
CREATE OR ALTER PROCEDURE sp_ThemChiTietHoaDon_BanLe
    @MaChiTiet CHAR(15),
    @MaHoaDon CHAR(15),
    @MaSanPham CHAR(15),
    @SoLuong INT
AS
BEGIN
    -- Kiểm tra: Hóa đơn phải đang ở trạng thái 'Processing' (0)
    IF NOT EXISTS (SELECT 1 FROM HOADON WHERE mahoadon = @MaHoaDon AND trangthai = 0)
    BEGIN
        THROW 50001, N'Hóa đơn không tồn tại hoặc không ở trạng thái nhập liệu.', 1;
    END

    -- Lấy giá bán hiện tại
    DECLARE @GiaBan INT;
    SELECT @GiaBan = gia FROM SANPHAM WHERE masanpham = @MaSanPham;

    -- Insert vào bảng cha CHITIETHOADON (Loại 2: Bán lẻ)
    INSERT INTO CHITIETHOADON (machitiethoadon, mahoadon, giamoidonvi, soluong, loai)
    VALUES (@MaChiTiet, @MaHoaDon, @GiaBan, @SoLuong, 2);

    -- Insert vào bảng con CHITIETHOADON_BANLE
    INSERT INTO CHITIETHOADON_BANLE (machitiethoadon, masanpham)
    VALUES (@MaChiTiet, @MaSanPham);
END;
GO

-- 6. Thêm chi tiết khám bệnh vào hóa đơn [cite: 9]
GO
CREATE OR ALTER PROCEDURE sp_ThemChiTietHoaDon_KhamBenh
    @MaChiTiet CHAR(15),
    @MaHoaDon CHAR(15),
    @MaHoSoBenhAn CHAR(15),
    @GiaTien INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM HOADON WHERE mahoadon = @MaHoaDon AND trangthai = 0)
    BEGIN
        THROW 50001, N'Hóa đơn không tồn tại hoặc không ở trạng thái nhập liệu.', 1;
    END

    -- Insert vào bảng cha CHITIETHOADON (Loại 0: Khám bệnh, SL: 1)
    INSERT INTO CHITIETHOADON (machitiethoadon, mahoadon, giamoidonvi, soluong, loai)
    VALUES (@MaChiTiet, @MaHoaDon, @GiaTien, 1, 0);

    -- Insert vào bảng con CHITIETHOADON_KHAMBENH
    INSERT INTO CHITIETHOADON_KHAMBENH (machitiethoadon, mahosobenhan)
    VALUES (@MaChiTiet, @MaHoSoBenhAn);
END;
GO

-- 7. Thêm chi tiết gói tiêm vào hóa đơn [cite: 10]
-- (Đổi tên từ sp_ThemChiTietGoiTiem trong doc để tránh trùng lặp với thủ tục quản lý gói tiêm)
GO
CREATE OR ALTER PROCEDURE sp_ThemChiTietHoaDon_GoiTiem
    @MaChiTiet CHAR(15),
    @MaHoaDon CHAR(15),
    @MaGoiTiem CHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM HOADON WHERE mahoadon = @MaHoaDon AND trangthai = 0)
    BEGIN
        THROW 50001, N'Hóa đơn không tồn tại hoặc không ở trạng thái nhập liệu.', 1;
    END

    -- Tính TỔNG GIÁ GỐC các vaccine trong gói
    DECLARE @TongGiaGoc INT;
    SELECT @TongGiaGoc = SUM(SP.gia)
    FROM CHITIETGOITIEM CT
    JOIN SANPHAM SP ON CT.masanpham = SP.masanpham
    WHERE CT.magoitiem = @MaGoiTiem;

    IF @TongGiaGoc IS NULL 
    BEGIN
        THROW 50002, N'Gói tiêm này chưa có chi tiết mũi tiêm nào.', 1;
    END

    -- Lấy % giảm giá
    DECLARE @PhanTramGiam INT;
    SELECT @PhanTramGiam = ISNULL(giamgia, 0) FROM GOITIEM WHERE magoitiem = @MaGoiTiem;

    -- Tính giá bán cuối cùng
    DECLARE @GiaBanCuoi INT;
    SET @GiaBanCuoi = @TongGiaGoc * (1.0 - (@PhanTramGiam / 100.0));

    -- Insert vào bảng cha CHITIETHOADON (Loại 1: Gói tiêm)
    INSERT INTO CHITIETHOADON (machitiethoadon, mahoadon, giamoidonvi, soluong, loai)
    VALUES (@MaChiTiet, @MaHoaDon, @GiaBanCuoi, 1, 1);

    -- Insert vào bảng con CHITIETHOADON_GOITIEM
    INSERT INTO CHITIETHOADON_GOITIEM (machitiethoadon, magoitiem)
    VALUES (@MaChiTiet, @MaGoiTiem);
END;
GO

-- 8. Chốt hóa đơn (Tính tổng tiền & Áp dụng giảm giá hội viên) [cite: 11]
GO
CREATE OR ALTER PROCEDURE sp_ChotHoaDon
    @MaHoaDon CHAR(15)
AS
BEGIN
    -- 1. Tính tổng tiền hàng
    DECLARE @TongTien INT;
    SELECT @TongTien = SUM(soluong * giamoidonvi)
    FROM CHITIETHOADON WHERE mahoadon = @MaHoaDon;

    -- 2. Lấy % giảm giá của hội viên (nếu có)
    DECLARE @PhanTramGiam INT = 0;
    
    SELECT @PhanTramGiam = ISNULL(HV.phantramgiamgia, 0)
    FROM HOADON HD
    JOIN KHACHHANG KH ON HD.makhachhang = KH.makhachhang
    LEFT JOIN HOIVIEN HV ON KH.mahoivien = HV.mahoivien
    WHERE HD.mahoadon = @MaHoaDon;

    -- 3. Cập nhật Hóa đơn --> Chuyển sang Pending_payment (1)
    UPDATE HOADON
    SET tongtien = @TongTien,
        sotiengiamgia = @TongTien * (@PhanTramGiam / 100.0),
        sotienphaitra = @TongTien * (1.0 - (@PhanTramGiam / 100.0)),
        trangthai = 1 
    WHERE mahoadon = @MaHoaDon;
END;
GO

-- 9. Hoàn tất thanh toán [cite: 12]
GO
CREATE OR ALTER PROCEDURE sp_HoanTatThanhToan
    @MaHoaDon CHAR(15)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra trạng thái phải là Pending_payment (1)
        IF NOT EXISTS (SELECT 1 FROM HOADON WHERE mahoadon = @MaHoaDon AND trangthai = 1)
        BEGIN
            THROW 50001, N'Hóa đơn chưa được chốt hoặc đã thanh toán.', 1;
        END

        DECLARE @MaChiNhanh CHAR(15);
        DECLARE @DiemCong INT;
        DECLARE @MaKhachHang CHAR(15);
        DECLARE @SoTienPhaiTra INT;

        SELECT @MaChiNhanh = machinhanh, 
               @SoTienPhaiTra = sotienphaitra,
               @MaKhachHang = makhachhang
        FROM HOADON 
        WHERE mahoadon = @MaHoaDon;

        SET @DiemCong = FLOOR(@SoTienPhaiTra / 50000);

        -- 2. Cập nhật trạng thái Completed (2)
        UPDATE HOADON SET trangthai = 2 WHERE mahoadon = @MaHoaDon;

        -- 3. Trừ tồn kho (Chỉ áp dụng cho sản phẩm bán lẻ)
        -- Sử dụng bảng SANPHAMTONKHO
        UPDATE SLTK
        SET SLTK.soluongtonkho = SLTK.soluongtonkho - CT.soluong
        FROM SANPHAMTONKHO SLTK
        JOIN CHITIETHOADON_BANLE CT_BL ON SLTK.masanpham = CT_BL.masanpham
        JOIN CHITIETHOADON CT ON CT_BL.machitiethoadon = CT.machitiethoadon
        WHERE CT.mahoadon = @MaHoaDon AND SLTK.machinhanh = @MaChiNhanh;

        -- 4. Cộng điểm tích lũy (Giả sử bảng KHACHHANG có cột tongchitieu, ta update luôn)
        UPDATE KHACHHANG
        SET tongchitieu = tongchitieu + @SoTienPhaiTra
        WHERE makhachhang = @MaKhachHang;
        
        -- (Nếu có bảng điểm tích lũy riêng thì update ở đây, script init chưa thấy cột diemtichluy, tạm dùng tongchitieu)

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END
GO

-- =======================================================
-- NHÓM 4: TRA CỨU & NHẮC NHỞ
-- =======================================================

-- 10.1. Tra cứu lịch sử khám bệnh & tiêm [cite: 4]
GO
CREATE OR ALTER PROCEDURE sp_TraCuuThuCung_SDT
    @SDT CHAR(10)
AS
BEGIN
    SELECT * FROM THUCUNG TC
    JOIN KHACHHANG KH ON TC.makhachhang = KH.makhachhang
    WHERE KH.sodienthoai = @SDT;
END;
GO

-- 10.2. Tra cứu lịch sử khám bệnh & tiêm [cite: 4]
GO
CREATE OR ALTER PROCEDURE sp_TraCuuHosoBenhAn
    @MaThuCung CHAR(15),

    -- Cursor
    @CursorMaHoSo CHAR(15) = NULL,
    @CursorMaLichSuTiem CHAR(15) = NULL,

    -- Số lượng mỗi loại
    @SoLuong INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @SoLuong IS NULL OR @SoLuong <= 0
        SET @SoLuong = 2147483647; -- MAX INT

    /* =========================
       HỒ SƠ BỆNH ÁN
       ========================= */
    SELECT TOP (@SoLuong)
        *
    FROM HOSOBENHAN
    WHERE mathucung = @MaThuCung
      AND (
            @CursorMaHoSo IS NULL
            OR mahoso < @CursorMaHoSo
          )
    ORDER BY mahoso DESC;


    /* =========================
       LỊCH SỬ TIÊM
       ========================= */
    SELECT TOP (@SoLuong)
        *
    FROM LICHSUTIEM
    WHERE mathucung = @MaThuCung
      AND (
            @CursorMaLichSuTiem IS NULL
            OR malichsutiem < @CursorMaLichSuTiem
          )
    ORDER BY malichsutiem DESC;
END;
GO



-- 11. Nhắc lịch tái khám ngày mai [cite: 13]
GO
CREATE OR ALTER PROCEDURE sp_NhacLichTaiKhamNgayMai
AS
BEGIN
    DECLARE @NgayMai DATE = DATEADD(DAY, 1, CAST(GETDATE() AS DATE));

    SELECT 
        KH.hovaten AS TenChu,
        KH.sodienthoai AS SDT,
        TC.ten AS TenThuCung,
        HS.trieuchung AS TrieuChungCu,
        HS.ngaytaikham AS NgayHen
    FROM HOSOBENHAN HS
    JOIN THUCUNG TC ON HS.mathucung = TC.mathucung
    JOIN KHACHHANG KH ON TC.makhachhang = KH.makhachhang
    WHERE HS.ngaytaikham = @NgayMai;
END;
GO

-- 12. Nhắc lịch tiêm chủng sắp tới [cite: 14]
GO
CREATE OR ALTER PROCEDURE sp_NhacLichTiemChungSapToi
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NgayBatDau DATE = CAST(GETDATE() AS DATE);
    DECLARE @NgayKetThuc DATE = CAST(DATEADD(DAY, 3, GETDATE()) AS DATE);

    SELECT 
        KH.hovaten AS TenChu,
        KH.sodienthoai AS SDT,
        TC.ten AS TenThuCung,
        SP.ten AS TenVacXin, 
        CT.ngaytiemdukien AS NgayDuKien,
        CT.machitiet AS MaChiTietGoi
    FROM CHITIETGOITIEM CT
    JOIN GOITIEM G ON CT.magoitiem = G.magoitiem
    JOIN THUCUNG TC ON G.mathucung = TC.mathucung
    JOIN KHACHHANG KH ON TC.makhachhang = KH.makhachhang
    JOIN SANPHAM SP ON CT.masanpham = SP.masanpham
    WHERE CT.trangthai = 0 -- Chưa tiêm
      AND CT.ngaytiemdukien BETWEEN @NgayBatDau AND @NgayKetThuc;
END;
GO

-- =======================================================
-- NHÓM 5: QUẢN LÝ GÓI TIÊM
-- =======================================================

-- 13. Tạo gói tiêm mới [cite: 20]
GO
CREATE OR ALTER PROCEDURE sp_KhoiTaoGoiTiem
    @MaGoi CHAR(15),
    @NgayHetHan DATE,
    @PhanTramGiamGia INT,
    @MaThuCung CHAR(15),
    @MaChiNhanh CHAR(15)
AS
BEGIN
    INSERT INTO GOITIEM (magoitiem, thoihan, giamgia, mathucung, machinhanh)
    VALUES (@MaGoi, @NgayHetHan, @PhanTramGiamGia, @MaThuCung, @MaChiNhanh);
END;
GO

-- 14. Thêm chi tiết mũi tiêm vào gói (Cấu hình gói) [cite: 21]
GO
CREATE OR ALTER PROCEDURE sp_ThemChiTietGoiTiem
    @MaChiTiet CHAR(15), -- Thêm tham số PK
    @MaGoi CHAR(15),
    @MaSanPham CHAR(15) -- Mã vaccine
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM GOITIEM WHERE magoitiem = @MaGoi)
        BEGIN
            THROW 50001, N'Gói tiêm không tồn tại', 1;
        END

        IF NOT EXISTS (SELECT 1 FROM VACCINE WHERE masanpham = @MaSanPham)
        BEGIN
            THROW 50001, N'Vaccine không tồn tại', 1;
        END

        -- Tính ngày dự kiến tiêm (Logic: Mũi sau cách mũi trước 14 ngày)
        DECLARE @NgayDuKienTruoc DATE;
        SELECT @NgayDuKienTruoc = MAX(ngaytiemdukien)
        FROM CHITIETGOITIEM
        WHERE magoitiem = @MaGoi;

        DECLARE @NgayDuKienMoi DATE;
        IF @NgayDuKienTruoc IS NULL
            SET @NgayDuKienMoi = CAST(GETDATE() AS DATE);
        ELSE
            SET @NgayDuKienMoi = DATEADD(DAY, 14, @NgayDuKienTruoc);

        INSERT INTO CHITIETGOITIEM(machitiet, magoitiem, masanpham, ngaytiemdukien, trangthai)
        VALUES (@MaChiTiet, @MaGoi, @MaSanPham, @NgayDuKienMoi, 0);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 15. Tra cứu tình trạng gói tiêm [cite: 22]
GO
CREATE OR ALTER PROCEDURE sp_TraCuuTinhTrangGoiTiem
    @MaThuCung CHAR(15)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM GOITIEM WHERE mathucung = @MaThuCung AND thoihan >= CAST(GETDATE() AS DATE))
    BEGIN
        PRINT N'Không có gói tiêm còn hạn cho thú cưng này.';
        RETURN;
    END

    SELECT 
        g.magoitiem,
        g.thoihan,
        ct.masanpham,
        sp.ten AS TenVaccine,
        ct.ngaytiemdukien,
        ct.ngaytiemthucte,
        ct.trangthai,
        CASE 
            WHEN ct.trangthai = 1 THEN N'Đã tiêm'
            ELSE N'Chưa tiêm'
        END AS TrangThaiMoTa
    FROM GOITIEM g
    JOIN CHITIETGOITIEM ct ON g.magoitiem = ct.magoitiem
    JOIN SANPHAM sp ON sp.masanpham = ct.masanpham
    WHERE g.mathucung = @MaThuCung
      AND g.thoihan >= CAST(GETDATE() AS DATE)
    ORDER BY g.magoitiem, ct.ngaytiemdukien;
END;
GO

-- 16. Thực hiện tiêm (Cập nhật trạng thái) [cite: 23]
GO
CREATE OR ALTER PROCEDURE sp_ThucHienTiem
    @MaLichSu CHAR(15), -- PK cho LICHSUTIEM
    @MaThuCung CHAR(15),
    @MaNhanVien CHAR(15),
    @MaChiNhanh CHAR(15),
    @MaChiTiet CHAR(15) -- PK của CHITIETGOITIEM
AS
BEGIN
    BEGIN TRANSACTION;
    
    DECLARE @MaGoi CHAR(15);
    DECLARE @MaSanPham CHAR(15);
    
    SELECT @MaGoi = magoitiem, @MaSanPham = masanpham 
    FROM CHITIETGOITIEM WHERE machitiet = @MaChiTiet;

    -- 1. Ghi nhận lịch sử tiêm
    INSERT INTO LICHSUTIEM (malichsutiem, mathucung, masanpham, ngaytiem, manhanvien, machinhanh)
    VALUES (@MaLichSu, @MaThuCung, @MaSanPham, CAST(GETDATE() AS DATE), @MaNhanVien, @MaChiNhanh);

    -- 2. Cập nhật trạng thái mũi trong gói
    UPDATE CHITIETGOITIEM
    SET trangthai = 1,
        ngaytiemthucte = CAST(GETDATE() AS DATE)
    WHERE machitiet = @MaChiTiet;

    COMMIT TRANSACTION;
END;
GO

-- =======================================================
-- NHÓM 6: BÁO CÁO THỐNG KÊ
-- =======================================================

-- 17. Báo cáo doanh thu chi nhánh [cite: 15]
GO
CREATE OR ALTER PROCEDURE sp_BaoCaoDoanhThuChiNhanh
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    SELECT 
        cn.tenchinhanh AS [Tên chi nhánh], 
        cn.machinhanh AS [Mã chi nhánh], 
        SUM(CAST(hd.sotienphaitra AS BIGINT)) AS [Tổng doanh thu]
    FROM HOADON hd 
    JOIN CHINHANH cn ON hd.machinhanh = cn.machinhanh
    WHERE hd.trangthai = 2 -- Completed
      AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc
    GROUP BY cn.tenchinhanh, cn.machinhanh;
END;
GO

-- 18. Báo cáo doanh thu theo dịch vụ [cite: 16]
GO
CREATE OR ALTER PROCEDURE sp_BaoCaoDoanhThuDichVu
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    SELECT 
        cn.tenchinhanh AS [Tên chi nhánh], 
        cn.machinhanh AS [Mã chi nhánh], 
        dv.loaidichvu AS [Tên dịch vụ], 
        --SUM(ct.giamoidonvi * ct.soluong) AS [Doanh thu]
        SUM(CAST(ct.giamoidonvi AS BIGINT) * CAST(ct.soluong AS BIGINT)) AS [Doanh thu]
    FROM HOADON hd 
    JOIN CHITIETHOADON ct ON ct.mahoadon = hd.mahoadon 
    JOIN CHINHANH cn ON hd.machinhanh = cn.machinhanh
    JOIN CHINHANHDICHVU cdv ON cdv.machinhanh = cn.machinhanh -- Logic join dịch vụ hơi phức tạp, tạm dùng bảng DICHVU qua loai
    JOIN DICHVU dv ON dv.madichvu = ct.loai -- Giả sử cột 'loai' trong CHITIETHOADON map với 'madichvu'
    WHERE hd.trangthai = 2 
      AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc
    GROUP BY cn.tenchinhanh, cn.machinhanh, dv.loaidichvu, dv.madichvu;
END;
GO

-- 19. Tổng doanh thu hệ thống [cite: 17]
GO
CREATE OR ALTER PROCEDURE sp_TongDoanhThu
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    --SELECT SUM(hd.sotienphaitra) AS [Tổng doanh thu]
    SELECT SUM(CAST(hd.sotienphaitra AS BIGINT)) AS TongDoanhThu
    FROM HOADON hd
    WHERE hd.trangthai = 2 
      AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc;
END;
GO

-- 20. Báo cáo doanh thu theo tháng (Trend) [New]
GO
CREATE OR ALTER PROCEDURE sp_BaoCaoDoanhThuTheoThang
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    SELECT 
        FORMAT(hd.ngaylap, 'yyyy-MM') AS [month], 
        SUM(CAST(hd.sotienphaitra AS BIGINT)) AS [totalRevenue]
    FROM HOADON hd
    WHERE hd.trangthai = 2 
      AND hd.ngaylap BETWEEN @NgayBatDau AND @NgayKetThuc
    GROUP BY FORMAT(hd.ngaylap, 'yyyy-MM')
    ORDER BY [month];
END;
GO

-- 20. Top dịch vụ doanh thu cao nhất 6 tháng [cite: 18]
GO
CREATE OR ALTER PROCEDURE sp_TopDichVu
    @MaChiNhanh CHAR(15) = NULL
AS
BEGIN
    DECLARE @SixMonthsAgo DATETIME = DATEADD(MONTH, -6, GETDATE());

    SELECT TOP 1 
        ct.loai AS [Loại Dịch Vụ], -- Tạm dùng cột loại
        --SUM(ct.soluong * ct.giamoidonvi) AS [Tổng doanh thu]
        SUM(CAST(ct.soluong * ct.giamoidonvi AS BIGINT)) AS [Tổng Doanh thu]
    FROM HOADON hd 
    JOIN CHITIETHOADON ct ON ct.mahoadon = hd.mahoadon 
    WHERE hd.ngaylap >= @SixMonthsAgo 
      AND hd.trangthai = 2 
      AND (@MaChiNhanh IS NULL OR hd.machinhanh = @MaChiNhanh)
    GROUP BY ct.loai
    ORDER BY SUM(ct.soluong * ct.giamoidonvi) DESC;
END;
GO

-- =======================================================
-- NHÓM X: ĐĂNG KÝ THÚ CƯNG
-- =======================================================

GO
CREATE OR ALTER PROCEDURE sp_DangKyThuCung
    @MaThuCung CHAR(15),
    @Ten NVARCHAR(50),
    @NgaySinh DATE = NULL,
    @Loai NVARCHAR(50),
    @Giong NVARCHAR(50),
    @MaKhachHang CHAR(15)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM KHACHHANG WHERE makhachhang = @MaKhachHang)
        THROW 50006, N'Khách hàng không tồn tại.', 1;

    IF @NgaySinh IS NOT NULL AND @NgaySinh > CAST(GETDATE() AS DATE)
        THROW 50007, N'Ngày sinh thú cưng không hợp lệ (lớn hơn ngày hiện tại).', 1;

    IF EXISTS (SELECT 1 FROM THUCUNG WHERE mathucung = @MaThuCung)
        THROW 50008, N'Mã thú cưng đã tồn tại.', 1;

    INSERT INTO THUCUNG (mathucung, ten, ngaysinh, loai, giong, ngaydangky, makhachhang)
    VALUES (@MaThuCung, @Ten, @NgaySinh, @Loai, @Giong, CAST(GETDATE() AS DATE), @MaKhachHang);
END;
GO