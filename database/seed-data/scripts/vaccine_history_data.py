import pymssql
import random
from datetime import date, timedelta
# Import config
try:
    from config import DB_CONFIG, id_gen
except ImportError:
    from .config import DB_CONFIG, id_gen

def VaccineHistoryData():
    conn = None
    try:
        print("Đang kết nối đến SQL Server...")
        conn = pymssql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Kết nối thành công!")

        # =================================================================
        # BƯỚC 1: CHUẨN BỊ DỮ LIỆU
        # =================================================================
        
        # 1.1 Hack tồn kho Vaccine (Để tránh lỗi hết hàng khi tạo hóa đơn bán lẻ)
        print("Đang cập nhật tồn kho Vaccine...")
        cursor.execute("""
            UPDATE STK
            SET STK.soluongtonkho = 1000000
            FROM SANPHAMTONKHO STK
            JOIN SANPHAM SP ON STK.masanpham = SP.masanpham
            WHERE SP.loai = 1 -- 1 là Vaccine
        """)
        conn.commit()

        # 1.2 Lấy ngẫu nhiên 1000 thú cưng (dùng NEWID() của SQL Server)
        print("Đang lấy random 1000 thú cưng...")
        cursor.execute("""
            SELECT TOP 1000 mathucung, makhachhang 
            FROM THUCUNG 
            ORDER BY NEWID()
        """)
        pets = cursor.fetchall() # List of (mathucung, makhachhang)

        if not pets:
            print("Lỗi: Không tìm thấy thú cưng nào.")
            return

        # 1.3 Lấy ngẫu nhiên 10 loại Vaccine
        print("Đang lấy random 10 loại Vaccine...")
        cursor.execute("""
            SELECT TOP 10 masanpham 
            FROM SANPHAM 
            WHERE loai = 1 -- 1 là Vaccine
            ORDER BY NEWID()
        """)
        vaccines = [row[0] for row in cursor.fetchall()]

        if not vaccines:
            print("Lỗi: Không tìm thấy Vaccine nào.")
            return

        # 1.4 Lấy dữ liệu nhân viên và chi nhánh
        # Bác sĩ (để tiêm)
        cursor.execute("SELECT TOP 50 manhanvien FROM NVBACSI")
        doctors = [row[0] for row in cursor.fetchall()]
        
        # Nhân viên bán hàng (để lập hóa đơn)
        cursor.execute("SELECT TOP 50 manhanvien FROM NVBANHANG")
        sales_staff = [row[0] for row in cursor.fetchall()]
        
        # Chi nhánh
        cursor.execute("SELECT machinhanh FROM CHINHANH")
        branches = [row[0] for row in cursor.fetchall()]

        if not doctors or not sales_staff:
            print("Lỗi: Thiếu dữ liệu nhân viên.")
            return

        # =================================================================
        # BƯỚC 2: LOOP TIÊM CHỦNG & TẠO HÓA ĐƠN
        # =================================================================
        print(f"\n--- BẮT ĐẦU TIÊM CHỦNG CHO {len(pets)} THÚ CƯNG ---")
        
        count = 0
        for pet in pets:
            ma_thucung = pet[0]
            ma_khachhang = pet[1]

            # Random ngày 
            start_date = date(2023, 1, 1)
            end_date   = date(2025, 12, 31)
            delta_days = (end_date - start_date).days

            ngay_tiem = start_date + timedelta(days=random.randint(0, delta_days))
            # Random dữ liệu cho lượt tiêm này
            ma_vaccine = random.choice(vaccines)
            ma_bacsi = random.choice(doctors)
            ma_nv_banhang = random.choice(sales_staff)
            ma_chinhanh = random.choice(branches)
            
            # Tạo ID
            ma_lichsu = id_gen.get_id('LS')
            ma_hoadon = id_gen.get_id('HD')
            ma_chitiet = id_gen.get_id('CT')

            try:
                # ----------------------------------------
                # A. GHI NHẬN LỊCH SỬ TIÊM (LICHSUTIEM)
                # ----------------------------------------
                # Insert trực tiếp vì không có SP riêng cho việc ghi lịch sử lẻ này trong file sp tổng hợp
                # (Lưu ý: sp_ThucHienTiem trong file trước dành cho Gói Tiêm, còn đây là tiêm lẻ)
                cursor.execute("""
                    INSERT INTO LICHSUTIEM (malichsutiem, ngaytiem, mathucung, masanpham, manhanvien, machinhanh)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (ma_lichsu, ngay_tiem, ma_thucung, ma_vaccine, ma_bacsi, ma_chinhanh))

                # ----------------------------------------
                # B. TẠO HÓA ĐƠN THANH TOÁN (HOADON)
                # ----------------------------------------
                
                # 1. Khởi tạo hóa đơn
                cursor.execute("EXEC sp_KhoiTaoHoaDon %s, %s, %s, %s, %s",
                              (ma_hoadon, ma_nv_banhang, ma_khachhang, ma_chinhanh, ngay_tiem))

                # 2. Thêm chi tiết hóa đơn (Bán lẻ Vaccine)
                # Sử dụng sp_ThemChiTietHoaDon_BanLe như yêu cầu
                # Số lượng: 1 mũi
                cursor.execute("EXEC sp_ThemChiTietHoaDon_BanLe %s, %s, %s, %s",
                              (ma_chitiet, ma_hoadon, ma_vaccine, 1))

                # 3. Chốt hóa đơn
                cursor.execute("EXEC sp_ChotHoaDon %s", (ma_hoadon,))

                # 4. Thanh toán
                cursor.execute("EXEC sp_HoanTatThanhToan %s", (ma_hoadon,))

                count += 1
                if count % 100 == 0:
                    conn.commit()
                    print(f"Đã xử lý: {count}/{len(pets)} ca tiêm...", end='\r')

            except Exception as e:
                print(f"\nLỗi tại thú cưng {ma_thucung}: {e}")
                conn.rollback()
                continue

        conn.commit()
        print(f"\n\nHOÀN TẤT! Đã tạo xong lịch sử tiêm và hóa đơn cho {count} thú cưng.")

    except Exception as e:
        print(f"\nLỗi hệ thống: {e}")
    finally:
        if conn: conn.close()