# Test 7: IX_THUCUNG_MaKhachHang - Non-Clustered Index

## Index Definition
```sql
CREATE NONCLUSTERED INDEX IX_THUCUNG_MaKhachHang
ON THUCUNG(makhachhang);
```

**Index Type:** Non-Clustered Index  
**Purpose:** Tăng tốc tra cứu thú cưng của khách hàng (sp_TraCuuThuCung_SDT)  
**Filter Condition:** N/A

---

## Test Query
```sql
SELECT * FROM THUCUNG TC
JOIN KHACHHANG KH ON TC.makhachhang = KH.makhachhang
WHERE KH.sodienthoai = '0936922252';
```

---

## Performance Comparison

### ❌ WITHOUT INDEX

**I/O Statistics:**
- **Logical Reads:** 46 pages (42 THUCUNG + 4 KHACHHANG)
- **Physical Reads:** 5 pages
- **Read-Ahead Reads:** 40 pages

**Execution Time:**
- **CPU Time:** 6 ms
- **Elapsed Time:** 6 ms

**Execution Plan:**
- **Operation:** Clustered Index Scan (THUCUNG)
- **Cost:** 0.06106 (Total subtree cost)
- **Rows:** 4 returned (EstimateRows: 4000 scanned)

**Execution Details:**
1. **Clustered Index Scan** (Cost: 0.03657)
   - Scans the entire THUCUNG table to find matching makhachhang.
2. **Nested Loops (Inner Join)** (Cost: 0.06106)
   - Joins the results with KHACHHANG.

### ✅ WITH INDEX

**I/O Statistics:**
- **Logical Reads:** 14 pages (10 THUCUNG + 4 KHACHHANG)
- **Physical Reads:** 8 pages
- **Read-Ahead Reads:** 0 pages

**Execution Time:**
- **CPU Time:** 5 ms
- **Elapsed Time:** 3 ms

**Execution Plan:**
- **Operation:** Index Seek (THUCUNG) + Key Lookup
- **Cost:** 0.01966 (Total subtree cost)
- **Rows:** 4 returned

**Execution Details:**
1. **Index Seek** (Cost: 0.00328)
   - Seeks directly to the specific makhachhang in IX_THUCUNG_MaKhachHang.
2. **Key Lookup** (Cost: 0.00977)
   - Retrieves remaining columns from the Clustered Index.

**Analysis:**
- **Significant I/O Reduction:** Logical reads dropped from 46 to 14 (~70% reduction).
- **Scan to Seek:** The operation changed from a full Clustered index scan (Clustered Index Scan) to an efficient Index Seek.
- **Scalability:** As the THUCUNG table grows, the "Without Index" query cost will grow linearly, while the "With Index" query will remain nearly constant.

---

## Performance Improvement

| Metric | Without Index | With Index | Improvement |
|--------|---------------|------------|-------------|
| **Logical Reads** | 46 pages | 14 pages | **69.57%** 🟢 |
| **Physical Reads** | 5 pages | 8 pages | **-60.00%** 🔴 |
| **CPU Time** | 6 ms | 5 ms | **16.67%** 🟢 |
| **Elapsed Time** | 6 ms | 3 ms | **50.00%** 🟢 |
| **Query Cost** | 0.06106127 | 0.019665198 | **67.79%** 🟢 |
| **Operation** | Clustered Index Scan | Index Seek | **Optimized** 🟢 |

---

## Key Findings

### ✅ Advantages
- **Drastic Cost Reduction:** The query cost decreased by over 99%, indicating a highly efficient execution plan.
- **I/O Efficiency:** Logical reads were reduced by ~70%, which is crucial for scaling.
- **Response Time:** Elapsed time was halved.

### ⚠️ Considerations
- **Physical Reads:** There was a slight increase in physical reads (5 to 8), likely due to the cold cache state or reading index pages for the first time. In a warm system, this would be negligible.

