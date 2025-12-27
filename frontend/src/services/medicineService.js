import axiosClient from "@/api/axiosClient";

const medicineService = {
  createPrescription: async (data) => {
    // data: { mathucung, items: [{ masanpham, soluong, ghichu }], matoathuoc, machinhanh }
    // Backend expects array of { MaToa, MaThuoc, SoLuong, GhiChu, MaChiNhanh }

    const payload = data.items.map((item) => ({
      MaToa: data.matoathuoc,
      MaThuoc: item.masanpham,
      SoLuong: item.soluong,
      GhiChu: item.ghichu || "",
      MaChiNhanh: data.machinhanh,
    }));

    const response = await axiosClient.post("/medical/prescriptions", payload);

    return {
      matoathuoc: response.MaToa,
      ...response,
    };
  },

  createExamination: async (data) => {
    // data: { MaThuCung, MaBacSi, TrieuChung, ChuanDoan, NgayKham, NgayTaiKham, MaToaThuoc, MaChiNhanh }
    return await axiosClient.post("/medical/examinations", data);
  },

  createFullExamination: async (data) => {
    // data: { MaThuCung, MaBacSi, TrieuChung, ChuanDoan, NgayKham, NgayTaiKham, MaChiNhanh, PrescriptionItems }
    // PrescriptionItems: [{ MaThuoc, SoLuong, GhiChu }]
    return await axiosClient.post("/medical/full-examination", data);
  },

  getPrescriptionById: async (id) => {
    const response = await axiosClient.get("/medical/tim-toa-thuoc", {
      params: { id },
    });
    // The backend returns recordsets, so we take the first one (which is an array of rows)
    return response[0]; 
  },
};

export default medicineService;
