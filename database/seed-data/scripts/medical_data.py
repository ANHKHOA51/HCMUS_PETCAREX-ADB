import pymssql
import random
from faker import Faker

# Import config
try:
    from config import DB_CONFIG, id_gen
except ImportError:
    from .config import DB_CONFIG, id_gen

fake = Faker(['vi_VN'])

def MedicalData():
    conn = None
    try:
        print("Đang kết nối đến SQL Server...")
        conn = pymssql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Kết nối thành công!")

        # --- BƯỚC 0: FETCH DỮ LIỆU CẦN THIẾT ---
        print("Đang lấy dữ liệu tham chiếu...")
        
        # Lấy danh sách Bác sĩ
        cursor.execute("SELECT manhanvien FROM NVBACSI")
        doctor_ids = [row[0] for row in cursor.fetchall()]
        
        # Lấy danh sách Chi nhánh
        cursor.execute("SELECT machinhanh FROM CHINHANH")
        branch_ids = [row[0] for row in cursor.fetchall()]

        # Lấy danh sách Nhân viên bán hàng (để tạo hóa đơn)
        cursor.execute("SELECT manhanvien FROM NVBANHANG")
        sales_staff_ids = [row[0] for row in cursor.fetchall()]

        # Lấy danh sách Thuốc
        cursor.execute("SELECT masanpham FROM THUOC")
        medicine_ids = [row[0] for row in cursor.fetchall()]

        # Lấy danh sách Khách hàng và Thú cưng
        cursor.execute("SELECT makhachhang, mathucung FROM THUCUNG")
        pet_owners = cursor.fetchall() # [(makh, mathucung), ...]

        if not (doctor_ids and branch_ids and sales_staff_ids and medicine_ids and pet_owners):
            print("Lỗi: Thiếu dữ liệu tham chiếu (Bác sĩ, Chi nhánh, NV, Thuốc, hoặc Thú cưng).")
            print("Hãy chạy script base.py trước.")
            return

        # --- BƯỚC 1: TẠO QUY TRÌNH KHÁM BỆNH ---
        # Số lượng hồ sơ bệnh án cần tạo
        TOTAL_RECORDS = 100000 
        print(f"\n--- Bắt đầu tạo {TOTAL_RECORDS} quy trình khám bệnh (Hồ sơ -> Toa thuốc -> Hóa đơn) ---")
        
        symptoms = ['Bỏ ăn', 'Nôn mửa', 'Tiêu chảy', 'Sốt cao', 'Gãy chân', 'Viêm da', 'Ho khạc', 'Mệt mỏi']
        diagnoses = ['Rối loạn tiêu hóa', 'Nhiễm trùng đường ruột', 'Viêm phổi', 'Gãy xương kín', 'Nấm da', 'Cảm cúm']

        for i in range(1, TOTAL_RECORDS + 1):
            try:
                # 1. Chọn ngẫu nhiên thông tin
                pet_data = random.choice(pet_owners)
                ma_kh = pet_data[0]
                ma_thucung = pet_data[1]
                
                ma_bacsi = random.choice(doctor_ids)
                ma_cn = random.choice(branch_ids)
                ma_nv_banhang = random.choice(sales_staff_ids)

                # 2. Tạo Hồ sơ bệnh án (HOSOBENHAN)
                ma_hoso = id_gen.get_id('HS')
                trieu_chung = random.choice(symptoms) + ", " + fake.sentence(nb_words=3)
                chuan_doan = random.choice(diagnoses)
                ngay_kham = fake.date_between(start_date='-1y', end_date='today')
                
                # Insert HOSOBENHAN (chưa có mã toa thuốc)
                cursor.execute("""
                    INSERT INTO HOSOBENHAN (mahoso, mathucung, mabacsi, trieuchung, chuandoan, ngaykham, machinhanh)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (ma_hoso, ma_thucung, ma_bacsi, trieu_chung, chuan_doan, ngay_kham, ma_cn))

                # 3. Tạo Toa thuốc (TOATHUOC)
                ma_toa = id_gen.get_id('TT')
                
                # Chọn 1-3 loại thuốc ngẫu nhiên
                selected_meds = random.sample(medicine_ids, k=random.randint(1, 3))
                
                # Insert từng thuốc vào toa (sử dụng Stored Procedure sp_KeToaThuoc nếu có, hoặc insert tay)
                # Ở đây ta giả lập gọi SP như trong gen_toathuoc.py
                for med_id in selected_meds:
                    sl_thuoc = 1
                    cursor.execute("EXEC sp_KeToaThuoc %s, %s, %s, %s", 
                                  (ma_toa, med_id, sl_thuoc, u"Uống sau ăn"))

                # Cập nhật mã toa vào hồ sơ bệnh án
                cursor.execute("UPDATE HOSOBENHAN SET matoathuoc = %s WHERE mahoso = %s", 
                              (ma_toa, ma_hoso))

                # 4. Tạo Hóa đơn (HOADON) & Thanh toán
                ma_hd = id_gen.get_id('HD')
                
                # Khởi tạo hóa đơn
                cursor.execute("EXEC sp_KhoiTaoHoaDon %s, %s, %s, %s",
                              (ma_hd, ma_nv_banhang, ma_kh, ma_cn))

                # Thêm chi tiết: KHÁM BỆNH
                gia_kham = random.randint(50, 100) * 1000
                ma_ct_kham = id_gen.get_id('CT')
                cursor.execute("EXEC sp_ThemChiTietHoaDon_KhamBenh %s, %s, %s, %s",
                              (ma_ct_kham, ma_hd, ma_hoso, gia_kham))

                # Thêm chi tiết: THUỐC (Bán lẻ thuốc theo toa)
                for med_id in selected_meds:
                    ma_ct_thuoc = id_gen.get_id('CT')
                    # Giả sử mua đúng số lượng kê toa (hoặc random lại)
                    sl_mua = 1
                    cursor.execute("EXEC sp_ThemChiTietHoaDon_BanLe %s, %s, %s, %s",
                                  (ma_ct_thuoc, ma_hd, med_id, sl_mua))

                # Chốt hóa đơn & Thanh toán
                cursor.execute("EXEC sp_ChotHoaDon %s", (ma_hd,))
                cursor.execute("EXEC sp_HoanTatThanhToan %s", (ma_hd,))

                # Commit mỗi 100 records
                if i % 100 == 0:
                    conn.commit()
                    print(f"Đã tạo: {i}/{TOTAL_RECORDS} quy trình...", end='\r')

            except Exception as e:
                print(f"\nLỗi tại record {i}: {e}")
                conn.rollback()
                continue

        conn.commit()
        print(f"\nHoàn tất tạo {TOTAL_RECORDS} quy trình khám bệnh!")

    except Exception as e:
        print(f"\nLỗi hệ thống: {e}")
    finally:
        if conn: conn.close()
        print("Đã đóng kết nối.")
