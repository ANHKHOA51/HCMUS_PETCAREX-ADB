# Test 9: IX_HOADON_Completed_Report - Filtered Index

## Index Definition
```sql
CREATE NONCLUSTERED INDEX IX_HOADON_Completed_Report
ON HOADON(ngaylap)
INCLUDE (sotienphaitra, machinhanh)
WHERE trangthai = 2;
```

**Index Type:** Filtered Non-Clustered Index  
**Purpose:** Tăng tốc báo cáo doanh thu (sp_TongDoanhThu, sp_BaoCaoDoanhThuChiNhanh)  
**Filter Condition:** trangthai = 2 (Completed invoices only)

---

## Test Query
```sql
SELECT SUM(CAST(hd.sotienphaitra AS BIGINT)) AS TongDoanhThu
FROM HOADON hd
WHERE hd.trangthai = 2 
  AND hd.ngaylap BETWEEN '2024-01-01' AND '2025-12-31';
```

---

## Performance Comparison

### ❌ WITHOUT INDEX

**I/O Statistics:**
- **Logical Reads:** 2118 pages
- **Physical Reads:** 3 pages
- **Read-Ahead Reads:** 2114 pages

**Execution Time:**
- **CPU Time:** 96 ms
- **Elapsed Time:** 97 ms

**Execution Plan:**
- **Operation:** Clustered Index Scan
- **Cost:** 2.1116
- **Rows:** 185,000 scanned

**Execution Details:**
1. **Clustered Index Scan** (Cost: 1.76381)
   - Scans the entire HOADON table.
2. **Stream Aggregate** (Cost: 2.11161)
   - Calculates the SUM.

### ✅ WITH INDEX

**I/O Statistics:**
- **Logical Reads:** 1109 pages
- **Physical Reads:** 3 pages
- **Read-Ahead Reads:** 1105 pages

**Execution Time:**
- **CPU Time:** 52 ms
- **Elapsed Time:** 56 ms

**Execution Plan:**
- **Operation:** Index Seek
- **Cost:** 1.1518
- **Rows:** 185,000 scanned

**Execution Details:**
1. **Index Seek** (Cost: 1.02233)
   - Seeks directly to the date range in IX_HOADON_Completed_Report.
   - Since the index is filtered by `trangthai = 2`, it automatically satisfies the WHERE clause without checking the column again.
   - It is a **Covering Index** for this query (includes `sotienphaitra`), so no Key Lookup is needed.

**Analysis:**
- **50% I/O Reduction:** Logical reads dropped from 2118 to 1109.
- **Covering Index:** The query was fully satisfied by the index without touching the main table (Heap/Clustered Index), which is highly efficient for aggregation queries.
- **Filtered Efficiency:** The index is smaller and faster to maintain because it only stores completed invoices, ignoring pending or cancelled ones.

---

## Performance Improvement

| Metric | Without Index | With Index | Improvement |
|--------|---------------|------------|-------------|
| **Logical Reads** | 2118 pages | 1109 pages | **47.64%** 🟢 |
| **Physical Reads** | 3 pages | 3 pages | **0.00%** ⚪ |
| **CPU Time** | 96 ms | 52 ms | **45.83%** 🟢 |
| **Elapsed Time** | 97 ms | 56 ms | **42.27%** 🟢 |
| **Query Cost** | 2.1116195 | 1.1518381 | **45.45%** 🟢 |
| **Operation** | Clustered Index Scan | Index Seek | **Optimized** 🟢 |

---

## Key Findings

### ✅ Advantages
- **Covering Index:** The index contains all necessary columns (`ngaylap`, `sotienphaitra`, `trangthai`), eliminating the need to access the base table.
- **Filtered Index:** By indexing only `trangthai = 2`, the index is smaller and more targeted for revenue reports.
- **Aggregation Efficiency:** The database can compute the SUM directly from the index pages.

### ⚠️ Considerations
- **Maintenance:** Filtered indexes require `SET ANSI_NULLS ON` and `SET QUOTED_IDENTIFIER ON` to be active when modifying data, which is standard but worth noting.

