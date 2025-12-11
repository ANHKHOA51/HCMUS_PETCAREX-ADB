USE PETCAREX
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- Drop index if exists
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETTOATHUOC_matoa')
BEGIN
    DROP INDEX IX_CHITIETTOATHUOC_matoa ON CHITIETTOATHUOC;
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

PRINT '=== TEST 6: IX_CHITIETTOATHUOC_matoa - WITHOUT INDEX ===';

-- TODO: Put your test query here
SELECT *
FROM CHITIETTOATHUOC ct
WHERE ct.matoathuoc = 'TT2512111821090';

SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
