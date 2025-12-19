from datetime import datetime, timedelta

import pymssql

# ================= CẤU HÌNH ID GENERATOR =================
class IDGenerator:
    def __init__(self):
        self.sequences = {} 
        self.current_time_bases = {}

    def get_id(self, prefix):
        now = datetime.now() + timedelta(days=2)
        if prefix not in self.current_time_bases:
            self.current_time_bases[prefix] = now
            self.sequences[prefix] = 0
        
        if self.sequences[prefix] > 999:
            self.sequences[prefix] = 0
            self.current_time_bases[prefix] += timedelta(minutes=1)
        
        time_str = self.current_time_bases[prefix].strftime('%y%m%d%H%M')
        seq_str = f"{self.sequences[prefix]:03d}"
        
        self.sequences[prefix] += 1
        return f"{prefix}{time_str}{seq_str}"
    
# ================= CẤU HÌNH KẾT NỐI =================
DB_CONFIG = {
    'server': 'localhost',
    'user': 'sa',
    'password': 'Truong123@', # <--- ĐIỀN PASS CỦA BẠN
    'database': 'PETCAREX'
}

connection = pymssql.connect(**DB_CONFIG)
id_gen = IDGenerator()