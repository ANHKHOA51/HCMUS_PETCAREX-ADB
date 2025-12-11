USE PETCAREX
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- Drop index if exists
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_CHITIETGOITIEM_ScanLich')
BEGIN
    DROP INDEX IX_CHITIETGOITIEM_ScanLich ON CHITIETGOITIEM;
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

PRINT '=== TEST 4: IX_CHITIETGOITIEM_ScanLich - WITHOUT INDEX ===';

-- TODO: Put your test query here
SELECT magoitiem, masanpham, ngaytiemdukien, trangthai
FROM CHITIETGOITIEM
WHERE trangthai = 0 AND ngaytiemdukien = GETDATE();

SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
