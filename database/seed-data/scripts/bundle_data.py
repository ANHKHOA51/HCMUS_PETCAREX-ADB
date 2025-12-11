import pymssql
import random
from faker import Faker
from datetime import datetime, timedelta

# Import config
try:
    from config import DB_CONFIG, id_gen
except ImportError:
    from .config import DB_CONFIG, id_gen

fake = Faker(['vi_VN'])

def BundleData():
    conn = None
    try:
        print("Đang kết nối đến SQL Server...")
        conn = pymssql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Kết nối thành công!")

        # =================================================================
        # GIAI ĐOẠN 0: CHUẨN BỊ DỮ LIỆU NỀN
        # =================================================================
        
        # 1. Fetch danh sách khách hàng hiện có
        print("Đang lấy danh sách khách hàng...")
        cursor.execute("SELECT makhachhang FROM KHACHHANG")
        customers = [row[0] for row in cursor.fetchall()] # List of IDs

        if not customers:
            print("Lỗi: Không tìm thấy khách hàng nào.")
            return

        # 2. Fetch danh sách Vaccine
        print("Đang lấy danh sách Vaccine...")
        # Lấy từ bảng VACCINE join SANPHAM để chắc chắn có tồn tại
        cursor.execute("SELECT V.masanpham FROM VACCINE V JOIN SANPHAM S ON V.masanpham = S.masanpham")
        vaccines = [row[0] for row in cursor.fetchall()]

        if len(vaccines) < 6:
            print(f"Cảnh báo: Chỉ tìm thấy {len(vaccines)} loại vaccine. Gói 12 tháng cần 6 loại khác nhau.")
            # Nếu ít hơn 6, logic random.sample sẽ lỗi. 
            # Giải pháp tạm thời: Nhân bản list vaccine để đủ chọn
            while len(vaccines) < 6:
                vaccines.extend(vaccines)

        # 3. Fetch thông tin phụ trợ (Nhân viên, Chi nhánh)
        cursor.execute("SELECT TOP 50 manhanvien FROM NVTIEPTAN") # Lấy lễ tân hoặc bán hàng
        employees = [row[0] for row in cursor.fetchall()]
        if not employees: # Fallback nếu ko có lễ tân
            cursor.execute("SELECT TOP 50 manhanvien FROM NHANVIEN")
            employees = [row[0] for row in cursor.fetchall()]
            
        cursor.execute("SELECT machinhanh FROM CHINHANH")
        branches = [row[0] for row in cursor.fetchall()]

        # =================================================================
        # GIAI ĐOẠN 1: THÊM 4000 THÚ CƯNG (4 CON / KHÁCH)
        # =================================================================
        print("\n--- GIAI ĐOẠN 1: BỔ SUNG THÚ CƯNG ---")
        
        new_pets_batch = []
        all_pets_info = [] # Lưu (mathucung, makhachhang) để dùng cho Phase 2
        
        # Lấy danh sách thú cưng cũ trước
        cursor.execute("SELECT mathucung, makhachhang FROM THUCUNG")
        all_pets_info = cursor.fetchall()

        # =================================================================
        # GIAI ĐOẠN 2: TẠO GÓI TIÊM & HÓA ĐƠN
        # =================================================================
        print("\n--- GIAI ĐOẠN 2: TẠO GÓI TIÊM & HÓA ĐƠN ---")
        
        # Đảm bảo danh sách pet được xáo trộn để ngẫu nhiên
        random.shuffle(all_pets_info)
        
        # Chia 2 nhóm: 2500 gói 6 tháng, 2500 gói 12 tháng
        # Do số lượng pet có thể > 5000 hoặc < 5000 tùy data cũ, ta lấy tối đa 5000
        target_pets = all_pets_info[:5000]
        
        split_index = len(target_pets) // 2 
        group_6_months = target_pets[:2500]      # 2500 con đầu
        group_12_months = target_pets[2500:5000] # 2500 con sau

        def process_package(pet_list, duration_months, discount, num_vaccines):
            count = 0
            for pet_data in pet_list:
                ma_thucung = pet_data[0]
                ma_khachhang = pet_data[1]
                
                ma_nv = random.choice(employees)
                ma_cn = random.choice(branches)
                ma_goi = id_gen.get_id('GT')
                ma_hd = id_gen.get_id('HD')
                
                try:
                    # 1. Tạo Gói Tiêm (sp_KhoiTaoGoiTiem)
                    ngay_het_han = datetime.now() + timedelta(days=30*duration_months)
                    # Params: @MaGoi, @NgayHetHan, @PhanTramGiamGia, @MaThuCung, @MaChiNhanh
                    cursor.execute("EXEC sp_KhoiTaoGoiTiem %s, %s, %s, %s, %s",
                                    (ma_goi, ngay_het_han, discount, ma_thucung, ma_cn))

                    # 2. Thêm Chi Tiết Gói (sp_ThemChiTietGoiTiem)
                    # Chọn random vaccine ko trùng lặp
                    selected_vaccines = random.sample(vaccines, min(num_vaccines, len(vaccines)))
                    
                    for vac_id in selected_vaccines:
                        ma_ct_goi = id_gen.get_id('CG')
                        # Params: @MaChiTiet, @MaGoi, @MaSanPham
                        cursor.execute("EXEC sp_ThemChiTietGoiTiem %s, %s, %s",
                                        (ma_ct_goi, ma_goi, vac_id))

                    # 3. Tạo Hóa Đơn Mua Gói (sp_KhoiTaoHoaDon)
                    # Params: @MaHoaDon, @MaNhanVien, @MaKhachHang, @MaChiNhanh
                    cursor.execute("EXEC sp_KhoiTaoHoaDon %s, %s, %s, %s",
                                    (ma_hd, ma_nv, ma_khachhang, ma_cn))

                    # 4. Thêm Gói vào Hóa Đơn (sp_ThemChiTietHoaDon_GoiTiem)
                    ma_ct_hd = id_gen.get_id('CT')
                    # Params: @MaChiTiet, @MaHoaDon, @MaGoiTiem
                    cursor.execute("EXEC sp_ThemChiTietHoaDon_GoiTiem %s, %s, %s",
                                    (ma_ct_hd, ma_hd, ma_goi))

                    # 5. Chốt & Thanh Toán
                    cursor.execute("EXEC sp_ChotHoaDon %s", (ma_hd,))
                    cursor.execute("EXEC sp_HoanTatThanhToan %s", (ma_hd,))

                    count += 1
                    if count % 100 == 0:
                        conn.commit()
                        print(f"  - Đã xử lý {count} gói ({duration_months} tháng)...", end='\r')
                        
                except Exception as e:
                    print(f"\nLỗi tạo gói {ma_goi} cho thú cưng {ma_thucung}: {e}")
                    conn.rollback()
                    continue
            conn.commit()
            print(f"\n  -> Hoàn tất nhóm {duration_months} tháng: {count} gói.")

        # --- Chạy nhóm 1: 6 tháng, 3 mũi, giảm 10% ---
        print(f"Đang xử lý {len(group_6_months)} gói tiêm 6 tháng...")
        process_package(group_6_months, duration_months=6, discount=10, num_vaccines=3)

        # --- Chạy nhóm 2: 12 tháng, 6 mũi, giảm 20% ---
        print(f"Đang xử lý {len(group_12_months)} gói tiêm 12 tháng...")
        process_package(group_12_months, duration_months=12, discount=20, num_vaccines=6)

        print("\n=== TẤT CẢ HOÀN TẤT ===")

    except Exception as e:
        print(f"\nLỗi hệ thống: {e}")
    finally:
        if conn: conn.close()
