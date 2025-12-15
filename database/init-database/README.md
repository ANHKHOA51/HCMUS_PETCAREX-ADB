# PETCAREX Database - Primary Key Conventions

## Format
All primary keys follow the format: `PREFIX(2)` + `YYMMDDHHMM(10)` + `SequenceNumber(3)`  
Total length: **15 characters** (CHAR(15))

## Table Prefixes

| Table | Prefix | Example |
|-------|--------|---------|
| KHACHHANG | `KH` | `KH0000000000001` |
| THUCUNG | `TC` | `TC0000000000001` |
| CHINHANH | `CN` | `CN0000000000001` |
| NHANVIEN | `NV` | `NV0000000000001` |
| SANPHAM | `SP` | `SP0000000000001` |
| TOATHUOC | `TT` | `TT0000000000001` |
| HOSOBENHAN | `HS` | `HS0000000000001` |
| GOITIEM | `GT` | `GT0000000000001` |
| LICHSUTIEM | `LT` | `LT0000000000001` |
| CHITIETGOITIEM | `CG` | `CG0000000000001` |
| HOADON | `HD` | `HD0000000000001` |
| HOIVIEN | `HV` | `HV0000000000001` |
| CHITIETHOADON | `CT` | `CT0000000000001` |
| PHIEUDATLICH | `PD` | `PD0000000000001` |
| PHIEUDANHGIA | `DG` | `DG0000000000001` |
| LICHSUDIEUDONG | `DD` | `DD0000000000001` |
| LICHSUCHITIEU | *(composite key)* | `(nam, makhachhang)` |

## Subtype Tables (Inherit from parent)

| Table | Inherits From | Uses Same PK |
|-------|---------------|--------------|
| NVBANHANG | NHANVIEN | `NV...` |
| NVQUANLY | NHANVIEN | `NV...` |
| NVTIEPTAN | NHANVIEN | `NV...` |
| NVBACSI | NHANVIEN | `NV...` |
| THUOC | SANPHAM | `SP...` |
| VACCINE | SANPHAM | `SP...` |
| CHITIETHOADON_KHAMBENH | CHITIETHOADON | `CT...` |
| CHITIETHOADON_GOITIEM | CHITIETHOADON | `CT...` |
| CHITIETHOADON_BANLE | CHITIETHOADON | `CT...` |

## Junction Tables (Composite Keys)

| Table | Primary Key |
|-------|-------------|
| CHINHANHDICHVU | `(machinhanh, madichvu)` |
| SANPHAMTONKHO | `(masanpham, machinhanh)` |
| CHITIETTOATHUOC | `(matoathuoc, masanpham)` |
| LICHSUCHITIEU | `(nam, makhachhang)` |

## Special Cases

| Table | Type | Notes |
|-------|------|-------|
| DICHVU | Fixed values | `0`, `1`, `2` only |