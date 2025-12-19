USE PETCAREX
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- Drop index if exists
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETHOADON_MaHoaDon_Calc')
BEGIN
    DROP INDEX IX_CHITIETHOADON_MaHoaDon_Calc ON CHITIETHOADON;
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

PRINT '=== TEST 2: IX_CHITIETHOADON_MaHoaDon_Calc - WITHOUT INDEX ===';

-- TODO: Put your test query here
SELECT machitiethoadon, soluong, giamoidonvi FROM CHITIETHOADON WHERE mahoadon = 'HD2512101806000'

SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
