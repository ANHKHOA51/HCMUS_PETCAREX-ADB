USE PETCAREX
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- Create index
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETHOADON_BANLE_MaSanPham')
BEGIN
    CREATE NONCLUSTERED INDEX IX_CHITIETHOADON_BANLE_MaSanPham
    ON CHITIETHOADON_BANLE(masanpham)
    INCLUDE (machitiethoadon);
END
GO

-- Clear cache for fair testing
CHECKPOINT;
DBCC DROPCLEANBUFFERS; -- Clear data cache
DBCC FREEPROCCACHE;    -- Clear plan cache
GO

SET STATISTICS IO ON;   -- Bật thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME ON; -- Bật thống kê về thời gian thực thi
SET STATISTICS PROFILE ON; -- Bật chế độ xem chiến thuật

PRINT '=== TEST 5: IX_CHITIETHOADON_BANLE_MaSanPham - WITH INDEX ===';

-- TODO: Put your test query here (same as above)
SELECT COUNT(ct.masanpham), COUNT(ct.machitiethoadon)
FROM CHITIETHOADON_BANLE ct
JOIN SANPHAMTONKHO sp ON ct.masanpham = sp.masanpham
WHERE ct.masanpham = 'SP2512100800085';

SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
