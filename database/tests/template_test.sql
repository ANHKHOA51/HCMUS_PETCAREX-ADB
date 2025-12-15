USE PETCAREX
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;

-- ========================================
-- SECTION 1: TEST WITHOUT INDEX
-- ========================================

-- Drop index if exists
IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_TEST_7')
BEGIN
    DROP INDEX IX_TEST_7 ON [TABLE_NAME];
    PRINT 'Da xoa index IX_TEST_7';
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

PRINT '=== TEST 7: [PLACEHOLDER] - WITHOUT INDEX ===';

-- TODO: Add your 7th index definition and test query here


SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO

-- ========================================
-- SECTION 2: TEST WITH INDEX
-- ========================================

-- Create index
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_TEST_7')
BEGIN
    -- TODO: Put your CREATE INDEX statement here
    -- CREATE NONCLUSTERED INDEX IX_TEST_7 ON [TABLE_NAME](column1, column2);
    
    PRINT 'Da tao index IX_TEST_7';
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

PRINT '=== TEST 7: [PLACEHOLDER] - WITH INDEX ===';

-- TODO: Add your test query here (same as above)


SET STATISTICS PROFILE OFF; -- Tắt thống kê về đọc/ghi ổ cứng và RAM
SET STATISTICS TIME OFF; -- Tắt thống kê về thời gian thực thi
SET STATISTICS IO OFF; -- Tắt thống kê về thời gian thực thi
GO
