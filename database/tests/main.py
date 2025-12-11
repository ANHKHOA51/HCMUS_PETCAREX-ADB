import subprocess
import os
import json

# ================= CẤU HÌNH HỆ THỐNG =================
CONFIG_FILE = "config.json"       # Tên file json cấu hình
CONTAINER_NAME = "sqlserverdb"      # <--- TÊN CONTAINER CỦA BẠN
DB_PASSWORD = "Truong123@"   # <--- PASSWORD SA
CMD_LOCATION = "/opt/mssql-tools18/bin/sqlcmd"  # Đường dẫn sqlcmd trong Docker
# =====================================================

def run_sql_file(input_filepath, output_filepath):
    """
    Hàm thực thi 1 file SQL và ghi log ra 1 file Output
    """
    # 1. Kiểm tra file input tồn tại không
    if not os.path.exists(input_filepath):
        print(f"[SKIP] Không tìm thấy file SQL: {input_filepath}")
        return False

    # 2. Tạo thư mục cha cho file output nếu chưa có (VD: tạo folder 'test1')
    output_dir = os.path.dirname(output_filepath)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 3. Đọc nội dung SQL và thêm Header cấu hình
    try:
        with open(input_filepath, "r", encoding="utf-8") as f:
            user_query = f.read()
    except Exception as e:
        print(f"[ERROR] Lỗi đọc file {input_filepath}: {e}")
        return False

    # Header bắt buộc để đo lường chính xác và tránh lỗi Index
    header_settings = """
    """
    # SET NOCOUNT ON;
    # SET ANSI_NULLS ON;
    # SET QUOTED_IDENTIFIER ON;
    # SET STATISTICS IO ON;
    # SET STATISTICS TIME ON;
    # SET STATISTICS PROFILE ON;
    # GO
    # USE PETCAREX;
    # GO

    # 4. Ghi ra file tạm để docker đọc
    temp_script = "temp_exec.sql"
    with open(temp_script, "w", encoding="utf-8") as f:
        f.write(header_settings + "\n" + user_query)

    # 5. Cấu hình lệnh Docker sqlcmd
    cmd = [
        "docker", "exec", "-i", CONTAINER_NAME,
        CMD_LOCATION,
        "-S", "localhost", "-U", "sa", "-P", DB_PASSWORD,
        "-C", "-I",       
        "-w", "65535",    
        "-y", "0"         
    ]

    # 6. Thực thi
    print(f"   -> Đang chạy: {input_filepath} ...")
    try:
        with open(temp_script, "r") as infile:
            with open(output_filepath, "w", encoding="utf-8") as outfile:
                subprocess.run(cmd, stdin=infile, stdout=outfile, stderr=subprocess.STDOUT, check=True)
        print(f"      [OK] Log đã lưu: {output_filepath}")
        return True

    except subprocess.CalledProcessError as e:
        print(f"      [FAIL] Lỗi Docker khi chạy {input_filepath}: {e}")
        return False
    finally:
        if os.path.exists(temp_script):
            os.remove(temp_script)

def main():
    # 1. Đọc file cấu hình JSON
    if not os.path.exists(CONFIG_FILE):
        print(f"Lỗi: Không tìm thấy file cấu hình '{CONFIG_FILE}'")
        return

    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            config_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Lỗi: File JSON không hợp lệ. {e}")
        return

    test_list = config_data.get("tests", [])
    print(f"--- Đã tìm thấy {len(test_list)} kịch bản test trong cấu hình ---\n")

    # 2. Duyệt qua từng Test Case
    for i, test in enumerate(test_list, 1):
        # Lấy đường dẫn từ JSON
        sql_noindex = test.get("sql_noindex")
        sql_index = test.get("sql_index")
        log_noindex = test.get("log_noindex")
        log_index = test.get("log_index")
        # md_file = test.get("md") # Có thể dùng để generate report sau này

        print(f"=== BẮT ĐẦU TEST CASE {i} ===")
        
        # Chạy trường hợp KHÔNG Index
        if sql_noindex and log_noindex:
            run_sql_file(sql_noindex, log_noindex)
        
        # Chạy trường hợp CÓ Index
        if sql_index and log_index:
            run_sql_file(sql_index, log_index)
            
        print("") # Xuống dòng cho đẹp

    print("=== HOÀN TẤT TOÀN BỘ ===")

if __name__ == "__main__":
    main()