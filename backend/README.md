# Backend API Documentation

This document lists the available API endpoints for the PetCareX backend.

## Authentication (`/auth`)
- **POST** `/auth/register` (Register customer)
  - Body: `{ HoVaTen, SoDienThoai, MatKhau, NgaySinh, DiaChi }`
  - Response: `{ role: 'customer', user: { ... } }`
- **POST** `/auth/login` (Login customer/employee)
  - Body: `{ Role: 'customer'|'employee', SoDienThoai, MatKhau }`
  - Response: `{ role, user: { ... } }`

## Appointments (`/appointments`)
- **POST** `/appointments` (Schedule appointment)
  - Body: `{ MaThuCung, MaChiNhanh, ThoiGianHen }`
  - Response: `{ MaPhieuDatLich, ... }`

## Medical & Examinations (`/medical`)
- **POST** `/medical/examinations` (Record examination)
  - Body: `{ MaThuCung, MaBacSi, TrieuChung, ChuanDoan, NgayKham, NgayTaiKham, MaToaThuoc, MaChiNhanh }`
  - Response: `{ MaHoSo, ... }`
- **POST** `/medical/prescriptions` (Create prescription)
  - Body: `{ MaToa, MaThuoc, SoLuong, GhiChu }`
  - Response: `{ MaToa, ... }`
- **GET** `/medical/reminders/tomorrow` (Get re-exam reminders for tomorrow)
  - Query: None
  - Response: List of reminders
- **GET** `/medical/history` (Get pet medical history)
  - Query: `?id=<MaThuCung>&num=<number_of_records>`
  - Response: List of medical records

## Receipt / Invoices (`/receipt`)
- **POST** `/receipt` (Create invoice)
  - Body: `{ MaNhanVien, MaKhachHang, MaChiNhanh }`
  - Response: `{ MaHoaDon, ... }`
- **POST** `/receipt/items/retail` (Add retail product)
  - Body: `{ MaHoaDon, MaSanPham, SoLuong }`
- **POST** `/receipt/items/examination` (Add exam fee)
  - Body: `{ MaHoaDon, MaHoSoBenhAn, GiaTien }`
- **POST** `/receipt/items/vaccine-package` (Add vaccine package)
  - Body: `{ MaHoaDon, MaGoiTiem }`
- **POST** `/receipt/finalize` (Finalize/Lock invoice)
  - Body: `{ MaHoaDon }`
- **POST** `/receipt/payment` (Complete payment)
  - Body: `{ MaHoaDon }`

## Vaccines (`/vaccine`)
- **GET** `/vaccine/reminders` (Get upcoming vaccine reminders)
  - Query: None
- **POST** `/vaccine/packages` (Create vaccine package)
  - Body: `{ NgayHetHan, PhanTramGiamGia, MaThuCung, MaChiNhanh }`
- **POST** `/vaccine/packages/items` (Add vaccine to package)
  - Body: `{ MaGoi, MaSanPham }`
- **GET** `/vaccine/packages/status` (Check package status)
  - Query: `?MaThuCung=<id>`
- **POST** `/vaccine/records` (Record vaccination)
  - Body: `{ MaThuCung, MaNhanVien, MaChiNhanh, MaChiTiet }`

## Products (`/product`)
- **GET** `/product` (List products with pagination/search)
  - Query: `?search=&type=&limit=10&cursor=`
- **GET** `/product/:id` (Get product details & stock)
  - Param: `:id`
- **GET** `/product/medicines/search` (Search medicines)
  - Query: `?name=&num=20`

## Branches (`/branch`)
- **GET** `/branch` (List branches)
  - Query: `?limit=10&cursor=`

## Pets (`/pet`)
- **GET** `/pet/user/:userId` (Get pets of a user)
  - Param: `:userId`
- **GET** `/pet/phone/:phone` (Get pets by owner phone)
  - Param: `:phone`
- **POST** `/pet` (Create pet)
  - Body: `{ Ten, NgaySinh, Loai, Giong, MaKhachHang, CanNang? }`
- **PUT** `/pet/:id` (Update pet)
  - Body: `{ Ten, NgaySinh, Loai, Giong }`
- **DELETE** `/pet/:id` (Delete pet)
  - Param: `:id`
