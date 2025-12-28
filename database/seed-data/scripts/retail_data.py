import pymssql
import random
from datetime import date, timedelta
# Import config
try:
    from config import DB_CONFIG, id_gen
except ImportError:
    from .config import DB_CONFIG, id_gen

def RetailData():
    conn = None
    try:
        print("Đang kết nối đến SQL Server...")
        conn = pymssql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Kết nối thành công!")

        # --- BƯỚC 0: CHUẨN BỊ DỮ LIỆU ---
        
        # 0.1 Hack tồn kho để không bị lỗi hết hàng khi test 80k hóa đơn
        print("Đang cập nhật tồn kho để đủ hàng bán...")
        cursor.execute("UPDATE SANPHAMTONKHO SET soluongtonkho = 1000000")
        conn.commit()

        # 0.2 Fetch 1000 khách hàng & thú cưng tương ứng (Lưu vào RAM)
        print("Đang fetch 1000 khách hàng...")
        cursor.execute("""
            SELECT TOP 1000 K.makhachhang, T.mathucung 
            FROM KHACHHANG K 
            JOIN THUCUNG T ON K.makhachhang = T.makhachhang
        """)
        # List of tuples: [(makh, mathucung), ...]
        customers = cursor.fetchall() 
        
        if len(customers) < 1:
            print("Lỗi: Không đủ dữ liệu khách hàng/thú cưng.")
            return

        # 0.3 Fetch 100 sản phẩm bán lẻ bất kỳ
        print("Đang fetch 100 sản phẩm bán lẻ...")
        cursor.execute("SELECT TOP 100 masanpham FROM SANPHAM WHERE loai = 2") # Loai 2 = Bán lẻ
        products = [row[0] for row in cursor.fetchall()]

        if len(products) < 1:
            print("Lỗi: Không tìm thấy sản phẩm bán lẻ nào.")
            return

        # 0.4 Fetch dữ liệu bổ trợ (Nhân viên, Chi nhánh) để tạo hóa đơn
        cursor.execute("SELECT TOP 50 manhanvien FROM NVBANHANG")
        employees = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT machinhanh FROM CHINHANH")
        branches = [row[0] for row in cursor.fetchall()]

        if not employees or not branches:
            print("Lỗi: Thiếu dữ liệu nhân viên hoặc chi nhánh.")
            return

        # --- BƯỚC 1: LOOP TẠO 80,000 HÓA ĐƠN ---
        TOTAL_INVOICES = 80000
        print(f"\n--- BẮT ĐẦU TẠO {TOTAL_INVOICES} HÓA ĐƠN ---")

        for i in range(1, TOTAL_INVOICES + 1):
            # 1. Random dữ liệu cho hóa đơn này
            cust_data = random.choice(customers) # (makh, mathucung)
            ma_kh = cust_data[0]
            # ma_thucung = cust_data[1] # Hóa đơn bán lẻ ko bắt buộc lưu mã thú cưng, nhưng có thể dùng nếu cần
            
            ma_nv = random.choice(employees)
            ma_cn = random.choice(branches)
            ma_hd = id_gen.get_id('HD')

            try:
                # 2. Gọi SP Tạo Hóa Đơn (sp_KhoiTaoHoaDon)
                # @MaHoaDon, @MaNhanVien, @MaKhachHang, @MaChiNhanh
                start_date = date(2023, 1, 1)
                end_date   = date(2025, 12, 31)

                delta_days = (end_date - start_date).days
                ngay_lap = start_date + timedelta(days=random.randint(0, delta_days))
                cursor.execute("EXEC sp_KhoiTaoHoaDon %s, %s, %s, %s, %s", 
                              (ma_hd, ma_nv, ma_kh, ma_cn, ngay_lap))

                # 3. Loop thêm 3 sản phẩm (Chi tiết hóa đơn)
                # Mỗi lần lặp thêm 1 chi tiết
                for _ in range(3):
                    ma_ct = id_gen.get_id('CT')
                    ma_sp = random.choice(products)
                    
                    # Gọi SP Thêm Chi Tiết Bán Lẻ (sp_ThemChiTietHoaDon_BanLe)
                    # @MaChiTiet, @MaHoaDon, @MaSanPham, @SoLuong
                    cursor.execute("EXEC sp_ThemChiTietHoaDon_BanLe %s, %s, %s, %s",
                                  (ma_ct, ma_hd, ma_sp, 1))

                # 4. Gọi SP Chốt Hóa Đơn (sp_ChotHoaDon)
                cursor.execute("EXEC sp_ChotHoaDon %s", (ma_hd,))

                # 5. Gọi SP Thanh Toán (sp_HoanTatThanhToan)
                cursor.execute("EXEC sp_HoanTatThanhToan %s", (ma_hd,))

                # Commit theo batch để tối ưu hiệu năng (mỗi 100 hóa đơn commit 1 lần)
                if i % 100 == 0:
                    conn.commit()
                    print(f"Đã tạo: {i}/{TOTAL_INVOICES} hóa đơn...", end='\r')

            except Exception as e:
                # Nếu lỗi ở hóa đơn nào thì rollback hóa đơn đó và in lỗi, nhưng vẫn chạy tiếp loop
                # Lưu ý: pymssql tự động start transaction khi execute
                print(f"\nLỗi tại hóa đơn {i} ({ma_hd}): {e}")
                conn.rollback() 
                continue

        conn.commit() # Commit những hóa đơn còn lại cuối cùng
        print(f"\n\nHOÀN TẤT! Đã tạo xong {TOTAL_INVOICES} hóa đơn.")

    except Exception as e:
        print(f"\nLỗi hệ thống: {e}")
    finally:
        if conn: conn.close()

