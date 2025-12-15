USE PETCAREX
GO
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- Create index
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_HOADON_TrangThai_Active')
BEGIN
    CREATE NONCLUSTERED INDEX IX_HOADON_TrangThai_Active
    ON HOADON(trangthai)
    INCLUDE (makhachhang, machinhanh) -- Include để hỗ trợ sp_HoanTatThanhToan lấy dữ liệu nhanh
    WHERE trangthai IN (0, 1); -- Chỉ index hóa đơn đang hoạt động
END
GO

-- Clear cache for fair testing
CHECKPOINT;
DBCC DROPCLEANBUFFERS; -- Clear data cache
DBCC FREEPROCCACHE;    -- Clear plan cache
GO

-- SET STATISTICS IO ON;   -- Bật thống kê về đọc/ghi ổ cứng và RAM
-- SET STATISTICS TIME ON; -- Bật thống kê về thời gian thực thi
SET STATISTICS PROFILE ON; -- Bật chế độ xem chiến thuật

PRINT '=== TEST 1: IX_HOADON_TrangThai_Active - WITH INDEX ===';

-- Test query
SELECT mahoadon, makhachhang, machinhanh
FROM HOADON 
WHERE trangthai = 0; -- Processing

-- SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
-- SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
