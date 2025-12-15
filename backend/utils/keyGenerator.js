import db from "../db.js";
import sql from "mssql";

// Format: PREFIX(2) + YYMMDDHHMM(10) + SEQ(3) => total 15 chars
export const KEY_SPECS = {
    KH: { table: "KHACHHANG", column: "makhachhang" },
    TC: { table: "THUCUNG", column: "mathucung" },
    CN: { table: "CHINHANH", column: "machinhanh" },
    NV: { table: "NHANVIEN", column: "manhanvien" },
    SP: { table: "SANPHAM", column: "masanpham" },
    TT: { table: "TOATHUOC", column: "matoathuoc" },
    HS: { table: "HOSOBENHAN", column: "mahoso" },
    GT: { table: "GOITIEM", column: "magoitiem" },
    LT: { table: "LICHSUTIEM", column: "malichsutiem" },
    CG: { table: "CHITIETGOITIEM", column: "machitiet" },
    HD: { table: "HOADON", column: "mahoadon" },
    HV: { table: "HOIVIEN", column: "mahoivien" },
    CT: { table: "CHITIETHOADON", column: "machitiethoadon" },
    PD: { table: "PHIEUDATLICH", column: "maphieudatlich" },
    DG: { table: "PHIEUDANHGIA", column: "maphieudanhgia" },
    DD: { table: "LICHSUDIEUDONG", column: "malichsudieudong" },
};

const pad2 = (n) => String(n).padStart(2, "0");

export const formatYYMMDDHHMM = (date = new Date()) => {
    const yy = pad2(date.getFullYear() % 100);
    const mm = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const hh = pad2(date.getHours());
    const mi = pad2(date.getMinutes());
    return `${yy}${mm}${dd}${hh}${mi}`;
};

const ensureKnownPrefix = (prefix) => {
    const spec = KEY_SPECS[prefix];
    if (!spec) throw new Error(`Unknown key prefix: ${prefix}`);
    return spec;
};

export const generatePrimaryKey = async (prefix, date = new Date()) => {
    const { table, column } = ensureKnownPrefix(prefix);
    const ts = formatYYMMDDHHMM(date);
    const base = `${prefix}${ts}`; // 12 chars

    // Find latest key for this prefix+timestamp and increment SEQ(3)
    const like = `${base}%`;

    // NOTE: Identifiers (table/column) are from KEY_SPECS only (whitelisted).
    const result = await db
        .request()
        .input("like", sql.VarChar(32), like)
        .query(`SELECT MAX(${column}) AS maxId FROM ${table} WHERE ${column} LIKE @like`);

    const maxId = result?.recordset?.[0]?.maxId;

    let nextSeq = 1;
    if (typeof maxId === "string" && maxId.length >= 15) {
        const seq = Number.parseInt(maxId.slice(-3), 10);
        if (!Number.isNaN(seq)) nextSeq = seq + 1;
    }

    if (nextSeq > 999) {
        throw new Error(`Sequence overflow for ${prefix}${ts} (exceeded 999)`);
    }

    return `${base}${String(nextSeq).padStart(3, "0")}`;
};
