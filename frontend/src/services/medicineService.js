// Medicine Service - Handles SANPHAM data (loai = 0 for medicines)
// Schema: { masanpham, ten, mota, gia, loai, soluongtonkho }

const mockMedicines = [
  {
    masanpham: "SP001",
    ten: "Amoxicillin 250mg",
    mota: "Antibiotic for bacterial infections",
    gia: 150000,
    loai: 0, // 0 = Medicine, 1 = Vaccine, 2 = Retail
    soluongtonkho: 50,
  },
  {
    masanpham: "SP002",
    ten: "Metronidazole 200mg",
    mota: "Anti-parasitic medication",
    gia: 120000,
    loai: 0,
    soluongtonkho: 30,
  },
  {
    masanpham: "SP003",
    ten: "Prednisolone 5mg",
    mota: "Anti-inflammatory steroid",
    gia: 180000,
    loai: 0,
    soluongtonkho: 0, // Out of stock
  },
  {
    masanpham: "SP004",
    ten: "Meloxicam 1mg",
    mota: "Pain relief and anti-inflammatory",
    gia: 200000,
    loai: 0,
    soluongtonkho: 25,
  },
  {
    masanpham: "SP005",
    ten: "Cephalexin 500mg",
    mota: "Broad-spectrum antibiotic",
    gia: 175000,
    loai: 0,
    soluongtonkho: 40,
  },
  {
    masanpham: "SP006",
    ten: "Doxycycline 100mg",
    mota: "Antibiotic for respiratory infections",
    gia: 160000,
    loai: 0,
    soluongtonkho: 35,
  },
  {
    masanpham: "SP007",
    ten: "Famotidine 10mg",
    mota: "Treats stomach ulcers and acid reflux",
    gia: 140000,
    loai: 0,
    soluongtonkho: 20,
  },
  {
    masanpham: "SP008",
    ten: "Furosemide 40mg",
    mota: "Diuretic for heart conditions",
    gia: 130000,
    loai: 0,
    soluongtonkho: 15,
  },
]

// Mock prescription counter for generating IDs
let prescriptionCounter = 1

const medicineService = {
  /**
   * Search medicines from SANPHAM where loai = 0
   * @param {string} keyword - Search term
   * @returns {Promise<Array>} List of medicines with stock info
   */
  searchMedicines: async (keyword = "") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockMedicines.filter(
          (medicine) =>
            medicine.loai === 0 && // Only medicines (not vaccines or retail)
            medicine.ten.toLowerCase().includes(keyword.toLowerCase()),
        )
        resolve(filtered)
      }, 300)
    })
  },

  /**
   * Get all available medicines (loai = 0)
   * @returns {Promise<Array>} List of all medicines
   */
  getAllMedicines: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const medicines = mockMedicines.filter((m) => m.loai === 0)
        resolve(medicines)
      }, 200)
    })
  },

  /**
   * Get medicine by ID
   * @param {string} masanpham - Medicine ID
   * @returns {Promise<Object|null>} Medicine object or null
   */
  getMedicineById: async (masanpham) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const medicine = mockMedicines.find((m) => m.masanpham === masanpham && m.loai === 0)
        resolve(medicine || null)
      }, 100)
    })
  },

  /**
   * Check stock availability
   * @param {string} masanpham - Medicine ID
   * @returns {Promise<number>} Available stock quantity
   */
  checkStock: async (masanpham) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const medicine = mockMedicines.find((m) => m.masanpham === masanpham)
        resolve(medicine ? medicine.soluongtonkho : 0)
      }, 100)
    })
  },

  /**
   * Create prescription - Save to TOATHUOC and CHITIETTOATHUOC
   * @param {Object} data - Prescription data
   * @param {string} data.mathucung - Pet ID
   * @param {Array} data.items - Array of {masanpham, soluong, ghichu}
   * @returns {Promise<Object>} Created prescription
   */
  createPrescription: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate stock for all items
        for (const item of data.items) {
          const medicine = mockMedicines.find((m) => m.masanpham === item.masanpham)
          if (!medicine) {
            reject(new Error(`Medicine ${item.masanpham} not found`))
            return
          }
          if (medicine.soluongtonkho < item.soluong) {
            reject(new Error(`Insufficient stock for ${medicine.ten}. Available: ${medicine.soluongtonkho}`))
            return
          }
        }

        // Generate prescription ID
        const matoathuoc = `TT${String(prescriptionCounter++).padStart(4, "0")}`

        // Calculate total price
        let totalPrice = 0
        const details = data.items.map((item) => {
          const medicine = mockMedicines.find((m) => m.masanpham === item.masanpham)
          const itemTotal = medicine.gia * item.soluong
          totalPrice += itemTotal

          return {
            matoathuoc,
            masanpham: item.masanpham,
            ten: medicine.ten,
            soluong: item.soluong,
            ghichu: item.ghichu,
            gia: medicine.gia,
            total: itemTotal,
          }
        })

        // Simulate saving to database
        // Update stock (in real app, this would be in database transaction)
        data.items.forEach((item) => {
          const medicine = mockMedicines.find((m) => m.masanpham === item.masanpham)
          if (medicine) {
            medicine.soluongtonkho -= item.soluong
          }
        })

        const prescription = {
          matoathuoc,
          mathucung: data.mathucung,
          ngayketoa: new Date().toISOString(),
          gia: totalPrice, // Derived attribute
          chitiet: details,
        }

        resolve(prescription)
      }, 500)
    })
  },
}

export default medicineService
