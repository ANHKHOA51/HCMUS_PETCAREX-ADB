"use client"

import { useState, useEffect } from "react"
import medicineService from "../../services/medicineService"

// Mock pet data (in real app, this would come from route params or context)
const mockPetData = {
  mathucung: "TC001",
  ten: "Max",
  owner: "Nguyen Van A",
}

const DoctorPrescriptionPage = () => {
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState("")
  const [selectedMedicineData, setSelectedMedicineData] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [prescriptionItems, setPrescriptionItems] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load medicines on mount
  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines()
      setMedicines(data)
    } catch (error) {
      console.error("Error loading medicines:", error)
    }
  }

  // Update selected medicine data when selection changes
  useEffect(() => {
    if (selectedMedicine) {
      const medicine = medicines.find((m) => m.masanpham === selectedMedicine)
      setSelectedMedicineData(medicine)
    } else {
      setSelectedMedicineData(null)
    }
  }, [selectedMedicine, medicines])

  const handleAddMedicine = () => {
    const newErrors = {}

    // Validate medicine selection
    if (!selectedMedicine) {
      newErrors.medicine = "Please select a medicine"
    }

    // Validate quantity
    const qty = Number.parseInt(quantity)
    if (!quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = "Quantity must be a positive integer"
    } else if (selectedMedicineData && qty > selectedMedicineData.soluongtonkho) {
      newErrors.quantity = `Insufficient stock. Available: ${selectedMedicineData.soluongtonkho}`
    }

    // Validate note
    if (!note.trim()) {
      newErrors.note = "Usage instructions are required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check if medicine already added
    const existingItem = prescriptionItems.find((item) => item.masanpham === selectedMedicine)
    if (existingItem) {
      newErrors.medicine = "Medicine already added to prescription"
      setErrors(newErrors)
      return
    }

    // Add to prescription list
    const newItem = {
      masanpham: selectedMedicine,
      ten: selectedMedicineData.ten,
      soluong: qty,
      ghichu: note,
      gia: selectedMedicineData.gia,
      total: selectedMedicineData.gia * qty,
    }

    setPrescriptionItems([...prescriptionItems, newItem])

    // Reset form
    setSelectedMedicine("")
    setSelectedMedicineData(null)
    setQuantity("")
    setNote("")
    setErrors({})
  }

  const handleRemoveItem = (masanpham) => {
    setPrescriptionItems(prescriptionItems.filter((item) => item.masanpham !== masanpham))
  }

  const calculateTotalPrice = () => {
    return prescriptionItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSavePrescription = async () => {
    if (prescriptionItems.length === 0) {
      setErrors({ submit: "Please add at least one medicine" })
      return
    }

    setLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const prescriptionData = {
        mathucung: mockPetData.mathucung,
        items: prescriptionItems.map((item) => ({
          masanpham: item.masanpham,
          soluong: item.soluong,
          ghichu: item.ghichu,
        })),
      }

      const result = await medicineService.createPrescription(prescriptionData)

      setSuccessMessage(`Prescription ${result.matoathuoc} saved successfully!`)
      setPrescriptionItems([])

      // Reload medicines to reflect updated stock
      await loadMedicines()
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", marginBottom: "8px" }}>Kê Toa Thuốc (Prescription)</h1>
        <div style={{ fontSize: "16px", opacity: 0.9 }}>
          <strong>Pet:</strong> {mockPetData.ten} | <strong>Owner:</strong> {mockPetData.owner}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            color: "#155724",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Add Medicine Form */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#333" }}>Add Medicine</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Medicine Selection */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Select Medicine *</label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: errors.medicine ? "2px solid #dc3545" : "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="">-- Select Medicine --</option>
              {medicines.map((medicine) => (
                <option key={medicine.masanpham} value={medicine.masanpham}>
                  {medicine.ten} - {formatCurrency(medicine.gia)}
                </option>
              ))}
            </select>
            {errors.medicine && (
              <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>{errors.medicine}</div>
            )}
          </div>

          {/* Stock Display */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Available Stock</label>
            <div
              style={{
                padding: "10px 12px",
                background: selectedMedicineData
                  ? selectedMedicineData.soluongtonkho > 0
                    ? "#d4edda"
                    : "#f8d7da"
                  : "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: selectedMedicineData
                  ? selectedMedicineData.soluongtonkho > 0
                    ? "#155724"
                    : "#721c24"
                  : "#6c757d",
              }}
            >
              {selectedMedicineData ? `${selectedMedicineData.soluongtonkho} units` : "Select a medicine"}
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Quantity *</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: errors.quantity ? "2px solid #dc3545" : "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            {errors.quantity && (
              <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>{errors.quantity}</div>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Usage Instructions *</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., 2 times/day after meals"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: errors.note ? "2px solid #dc3545" : "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            {errors.note && <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>{errors.note}</div>}
          </div>
        </div>

        <button
          onClick={handleAddMedicine}
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.background = "#5568d3")}
          onMouseOut={(e) => (e.target.style.background = "#667eea")}
        >
          Add to Prescription
        </button>
      </div>

      {/* Prescription List */}
      {prescriptionItems.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#333" }}>Prescription Items</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Medicine Name</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Quantity</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Usage Instructions</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>Unit Price</th>
                  <th style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>Total</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems.map((item) => (
                  <tr key={item.masanpham} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: "12px" }}>{item.ten}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{item.soluong}</td>
                    <td style={{ padding: "12px" }}>{item.ghichu}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{formatCurrency(item.gia)}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>
                      {formatCurrency(item.total)}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => handleRemoveItem(item.masanpham)}
                        style={{
                          padding: "6px 12px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) => (e.target.style.background = "#c82333")}
                        onMouseOut={(e) => (e.target.style.background = "#dc3545")}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer - Total & Save Button */}
      {prescriptionItems.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>Total Price:</div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#667eea" }}>
              {formatCurrency(calculateTotalPrice())}
            </div>
          </div>

          {errors.submit && (
            <div
              style={{
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                color: "#721c24",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              {errors.submit}
            </div>
          )}

          <button
            onClick={handleSavePrescription}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.background = "#218838"
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.background = "#28a745"
            }}
          >
            {loading ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      )}
    </div>
  )
}

export default DoctorPrescriptionPage
