# Test 8: IX_HOSOBENHAN_MaThuCung - Non-Clustered Index

## Index Definition
```sql
CREATE NONCLUSTERED INDEX IX_HOSOBENHAN_MaThuCung
ON HOSOBENHAN(mathucung)
INCLUDE (ngaykham, chuandoan);
```

**Index Type:** Non-Clustered Index (with Include)  
**Purpose:** Tăng tốc tra cứu lịch sử bệnh án (sp_TraCuuHosoBenhAn)  
**Filter Condition:** N/A

---

## Test Query
```sql
SELECT TOP 10 * FROM HOSOBENHAN 
WHERE mathucung = 'TC2512211735000' 
ORDER BY ngaykham DESC;
```

---

## Performance Comparison

### ❌ WITHOUT INDEX

**I/O Statistics:**
- **Logical Reads:** 2058 pages
- **Physical Reads:** 0 pages
- **Read-Ahead Reads:** 1328 pages

**Execution Time:**
- **CPU Time:** 23 ms
- **Elapsed Time:** 24 ms

**Execution Plan:**
- **Operation:** Clustered Index Scan
- **Cost:** 1.6853
- **Rows:** 20 returned (EstimateRows: 15)

**Execution Details:**
1. **Clustered Index Scan** (Cost: 1.62587)
   - Scans the entire HOSOBENHAN table to find records for the specific pet.
2. **Sort** (Cost: 1.68532)
   - Sorts the results by ngaykham DESC.

### ✅ WITH INDEX

**I/O Statistics:**
- **Logical Reads:** 63 pages
- **Physical Reads:** 33 pages
- **Read-Ahead Reads:** 0 pages

**Execution Time:**
- **CPU Time:** 3 ms
- **Elapsed Time:** 7 ms

**Execution Plan:**
- **Operation:** Index Seek + Key Lookup
- **Cost:** 0.07716 (Total subtree cost)
- **Rows:** 20 returned

**Execution Details:**
1. **Index Seek** (Cost: 0.00330)
   - Seeks directly to the pet's records in IX_HOSOBENHAN_MaThuCung.
2. **Key Lookup** (Cost: 0.06227)
   - Retrieves the remaining columns (like trieuchung, mabacsi) from the Clustered Index.

**Analysis:**
- **Massive I/O Reduction:** Logical reads dropped from 2058 to 63 (~97% reduction).
- **Faster Execution:** CPU time dropped from 23ms to 3ms.
- **Efficiency:** The index allows the engine to jump directly to the relevant records instead of reading thousands of pages. The `INCLUDE` columns help cover some of the query needs, though a Key Lookup is still required for `SELECT *`.

---

## Performance Improvement

| Metric | Without Index | With Index | Improvement |
|--------|---------------|------------|-------------|
| **Logical Reads** | 2058 pages | 63 pages | **96.94%** 🟢 |
| **Physical Reads** | 0 pages | 33 pages | **N/A** ⚪ |
| **CPU Time** | 23 ms | 3 ms | **86.96%** 🟢 |
| **Elapsed Time** | 24 ms | 7 ms | **70.83%** 🟢 |
| **Query Cost** | 1.6853293 | 0.077160366 | **95.42%** 🟢 |
| **Operation** | Clustered Index Scan | Index Seek | **Optimized** 🟢 |

---

## Key Findings

### ✅ Advantages
- **Huge I/O Savings:** Reading ~2000 fewer pages per query is a massive improvement for database throughput.
- **CPU Efficiency:** Significant reduction in CPU usage (87% improvement).
- **Targeted Access:** The index allows precise retrieval of the specific pet's records.

### ⚠️ Considerations
- **Key Lookup Cost:** The query still requires a Key Lookup because of `SELECT *`. If specific columns were selected instead, we could potentially make this a fully covering index to eliminate the Key Lookup entirely.

