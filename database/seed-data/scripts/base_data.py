import pymssql
import random
from faker import Faker

# Import config
try:
    from config import DB_CONFIG, id_gen
except ImportError:
    from .config import DB_CONFIG, id_gen

fake = Faker(['vi_VN'])

def BaseData():
    conn = None
    try:
        print('Đang kết nối đến SQL Server...')
        conn = pymssql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print('Kết nối thành công! Bắt đầu khởi tạo dữ liệu mẫu...')

        # =============================================
        # 1. INSERT DỮ LIỆU BẢNG HOIVIEN
        # =============================================
        print('1. Đang insert HOIVIEN...')
        hoivien_data = [
            (id_gen.get_id('HV'), u'Thân thiết', 5000000, 3000000, 5),
            (id_gen.get_id('HV'), u'VIP', 12000000, 8000000, 10)
        ]
        cursor.executemany('''
            INSERT INTO HOIVIEN (mahoivien, tieude, muchitieutoithieu, mucchitieugiuhang, phantramgiamgia)
            VALUES (%s, %s, %s, %s, %s)
        ''', hoivien_data)

        # =============================================
        # 2. INSERT DỮ LIỆU BẢNG DICHVU
        # =============================================
        print('2. Đang insert DICHVU...')
        cursor.executemany('''
            INSERT INTO DICHVU (madichvu, loaidichvu) VALUES (%s, %s)
        ''', [(0, u'Khám bệnh'), (1, u'Tiêm phòng'), (2, u'Bán lẻ')])

        # =============================================
        # 3. INSERT CHI NHÁNH, NHÂN VIÊN
        # =============================================
        print('3. Đang insert CHINHANH va NHANVIEN...')
        for i in range(1, 11):
            # Chi Nhánh
            ma_chi_nhanh = id_gen.get_id('CN')
            ten_cn = f'Chi nhánh PetCareX {i}'
            dia_chi = f'Địa chỉ số {i}, TP.HCM'
            sdt_cn = f'028{i:07d}'
            
            cursor.execute('''
                INSERT INTO CHINHANH (machinhanh, tenchinhanh, diachi, sodienthoai, thoigianmo, thoigiandong)
                VALUES (%s, %s, %s, %s, '08:00:00', '22:00:00')
            ''', (ma_chi_nhanh, ten_cn, dia_chi, sdt_cn))

            # Dịch vụ chi nhánh
            cursor.execute('INSERT INTO CHINHANHDICHVU (machinhanh, madichvu) VALUES (%s, %s)', (ma_chi_nhanh, 0))
            if i <= 7:
                cursor.execute('INSERT INTO CHINHANHDICHVU (machinhanh, madichvu) VALUES (%s, %s)', (ma_chi_nhanh, 1))
                cursor.execute('INSERT INTO CHINHANHDICHVU (machinhanh, madichvu) VALUES (%s, %s)', (ma_chi_nhanh, 2))

            # Nhân viên
            # 1 Quản lý
            ma_nv = id_gen.get_id('NV')
            cursor.execute('''
                INSERT INTO NHANVIEN (manhanvien, hovaten, ngaysinh, chinhanh, diachi, sodienthoai, luongcoban, heso, phucap, matkhau)
                VALUES (%s, %s, '1985-01-01', %s, N'Nhà quản lý', %s, 15000000, 1.5, 2000000, 'admin')
            ''', (ma_nv, f'Quản Lý {ma_chi_nhanh}', ma_chi_nhanh, f'09{random.randint(10000000, 99999999)}'))
            cursor.execute('INSERT INTO NVQUANLY (manhanvien) VALUES (%s)', (ma_nv,))

            # 2 Tiếp tân
            for j in range(2):
                ma_nv = id_gen.get_id('NV')
                cursor.execute('''
                    INSERT INTO NHANVIEN (manhanvien, hovaten, ngaysinh, chinhanh, diachi, sodienthoai, luongcoban, heso, phucap, matkhau)
                    VALUES (%s, %s, '1995-05-05', %s, N'Nhà tiếp tân', %s, 7000000, 1.0, 500000, 'admin')
                ''', (ma_nv, f'Tiếp Tân {j+1} {ma_chi_nhanh}', ma_chi_nhanh, f'09{random.randint(10000000, 99999999)}'))
                cursor.execute('INSERT INTO NVTIEPTAN (manhanvien) VALUES (%s)', (ma_nv,))

            # 2 Bán hàng
            for j in range(2):
                ma_nv = id_gen.get_id('NV')
                cursor.execute('''
                    INSERT INTO NHANVIEN (manhanvien, hovaten, ngaysinh, chinhanh, diachi, sodienthoai, luongcoban, heso, phucap, matkhau)
                    VALUES (%s, %s, '1998-08-08', %s, N'Nhà bán hàng', %s, 6000000, 1.0, 1000000, 'admin')
                ''', (ma_nv, f'Bán Hàng {j+1} {ma_chi_nhanh}', ma_chi_nhanh, f'09{random.randint(10000000, 99999999)}'))
                cursor.execute('INSERT INTO NVBANHANG (manhanvien) VALUES (%s)', (ma_nv,))

            # 2 Bác sĩ
            for j in range(2):
                ma_nv = id_gen.get_id('NV')
                cursor.execute('''
                    INSERT INTO NHANVIEN (manhanvien, hovaten, ngaysinh, chinhanh, diachi, sodienthoai, luongcoban, heso, phucap, matkhau)
                    VALUES (%s, %s, '1990-01-01', %s, N'Nhà bác sĩ', %s, 20000000, 2.0, 3000000, 'admin')
                ''', (ma_nv, f'Bác Sĩ {j+1} {ma_chi_nhanh}', ma_chi_nhanh, f'09{random.randint(10000000, 99999999)}'))
                cursor.execute('INSERT INTO NVBACSI (manhanvien, hocvi) VALUES (%s, N\'Bác sĩ thú y\')', (ma_nv,))

        # =============================================
        # 4. INSERT SẢN PHẨM
        # =============================================
        print('4. Đang insert SANPHAM...')
        
        # Vaccine
        for v in range(1, 11):
            ma_sp = id_gen.get_id('SP')
            cursor.execute('''
                INSERT INTO SANPHAM (masanpham, ten, mota, gia, nhasanxuat, loai)
                VALUES (%s, %s, N'Vaccine nhập khẩu', %s, N'Zoetis', 1)
            ''', (ma_sp, f'Vaccine Phòng Bệnh {v}', 150000 * v))
            cursor.execute('''
                INSERT INTO VACCINE (masanpham, phanloai, solo, huongdansudung)
                VALUES (%s, N'Đa giá', %s, N'Tiêm dưới da')
            ''', (ma_sp, f'L2025{v}'))

        # Thuốc
        for t in range(1, 21):
            ma_sp = id_gen.get_id('SP')
            cursor.execute('''
                INSERT INTO SANPHAM (masanpham, ten, mota, gia, nhasanxuat, loai)
                VALUES (%s, %s, N'Thuốc đặc trị', %s, N'Bayer', 0)
            ''', (ma_sp, f'Thuốc Điều Trị {t}', 50000 * t))
            cursor.execute('INSERT INTO THUOC (masanpham) VALUES (%s)', (ma_sp,))

        # Bán lẻ
        for bl in range(1, 101):
            ma_sp = id_gen.get_id('SP')
            ten_sp = f'Sản phẩm bán lẻ {bl}'
            if bl <= 30: ten_sp = f'Thức ăn chó mèo loại {bl}'
            elif bl <= 60: ten_sp = f'Đồ chơi thú cưng mẫu {bl}'
            else: ten_sp = f'Vòng cổ/Dây dắt mẫu {bl}'
            
            cursor.execute('''
                INSERT INTO SANPHAM (masanpham, ten, mota, gia, nhasanxuat, loai)
                VALUES (%s, %s, N'Hàng chính hãng', %s, N'Royal Canin', 2)
            ''', (ma_sp, ten_sp, 10000 + (bl * 2000)))

        # Tồn kho
        print('5. Đang khởi tạo tồn kho...')
        cursor.execute('''
            INSERT INTO SANPHAMTONKHO (masanpham, machinhanh, soluongtonkho)
            SELECT SP.masanpham, CN.machinhanh, 100
            FROM SANPHAM SP
            CROSS JOIN CHINHANH CN
        ''')

        # =============================================
        # 6. INSERT KHÁCH HÀNG & THÚ CƯNG
        # =============================================
        print('6. Đang insert KHACHHANG và THUCUNG...')
        
        customer_batch = []
        pet_batch = []
        
        pet_types = ['Chó', 'Mèo']
        dog_breeds = ['Poodle', 'Pug', 'Corgi', 'Golden', 'Husky']
        cat_breeds = ['Anh lông ngắn', 'Ba Tư', 'Mướp', 'Sphynx']

        for _ in range(1000):
            # Tạo Khách hàng
            kh_id = id_gen.get_id('KH')
            name = fake.name()
            dob = fake.date_of_birth(minimum_age=18, maximum_age=70)
            address = fake.address()
            phone = f'09{random.randint(10000000, 99999999)}'
            password = 'customer'
            
            customer_batch.append((kh_id, name, dob, address, phone, password))
            
            # Tạo 4 Thú cưng cho mỗi khách hàng
            for _ in range(4):
                tc_id = id_gen.get_id('TC')
                pet_name = fake.first_name()
                pet_type = random.choice(pet_types)
                breed = random.choice(dog_breeds) if pet_type == 'Chó' else random.choice(cat_breeds)
                pet_dob = fake.date_of_birth(minimum_age=1, maximum_age=10)
                
                pet_batch.append((tc_id, pet_name, pet_dob, pet_type, breed, kh_id))

        # Insert Batch Khách hàng
        cursor.executemany('''
            INSERT INTO KHACHHANG (makhachhang, hovaten, ngaysinh, diachi, sodienthoai, matkhau)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', customer_batch)
        print(f'   - Đã insert {len(customer_batch)} khách hàng.')

        # Insert Batch Thú cưng
        cursor.executemany('''
            INSERT INTO THUCUNG (mathucung, ten, ngaysinh, loai, giong, makhachhang)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', pet_batch)
        print(f'   - Đã insert {len(pet_batch)} thú cưng.')

        conn.commit()
        print('=== HOÀN TẤT KHỞI TẠO DỮ LIỆU ===')

    except Exception as e:
        print(f'Lỗi: {e}')
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == '__main__':
    BaseData()
