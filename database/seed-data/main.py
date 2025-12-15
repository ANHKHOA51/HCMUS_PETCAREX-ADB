from scripts import BaseData, RetailData, MedicalData, BundleData, VaccineHistoryData

def main():
    print("=== BẮT ĐẦU TẠO DỮ LIỆU TEST CHO HỆ THỐNG PETCAREX ===\n")
    
    print("1. TẠO DỮ LIỆU CĂN BẢN...")
    BaseData.BaseData()
    print("\n2. TẠO DỮ LIỆU BÁN LẺ...")
    RetailData.RetailData()
    print("\n3. TẠO DỮ LIỆU Y TẾ...")
    MedicalData.MedicalData()
    print("\n4. TẠO DỮ LIỆU GÓI TIÊM...")
    BundleData.BundleData()
    print("\n5. TẠO DỮ LIỆU LỊCH SỬ TIÊM CHỦNG VACCINE...")
    VaccineHistoryData.VaccineHistoryData()
    
    print("\n=== HOÀN TẤT TẤT CẢ CÁC BƯỚC TẠO DỮ LIỆU TEST ===")

if __name__ == "__main__":
    main()