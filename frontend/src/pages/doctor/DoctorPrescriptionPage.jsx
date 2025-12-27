"use client";

import { useState, useEffect } from "react";
import medicineService from "../../services/medicineService";
import ExaminationForm from "../../features/doctor/components/ExaminationForm";
import AddMedicineForm from "@/features/doctor/components/AddMedicineForm";
import { formatCurrency } from "@/utils/format";
// Mock pet data (in real app, this would come from route params or context)
const mockPetData = {
  mathucung: "TC001",
  ten: "Max",
  owner: "Nguyen Van A",
};

const DoctorPrescriptionPage = () => {
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRemoveItem = (masanpham) => {
    setPrescriptionItems(
      prescriptionItems.filter((item) => item.masanpham !== masanpham)
    );
  };

  const calculateTotalPrice = () => {
    return prescriptionItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSavePrescription = async () => {
    if (prescriptionItems.length === 0) {
      setErrors({ submit: "Please add at least one medicine" });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const prescriptionData = {
        mathucung: mockPetData.mathucung,
        items: prescriptionItems.map((item) => ({
          masanpham: item.masanpham,
          soluong: item.soluong,
          ghichu: item.ghichu,
        })),
      };

      const result = await medicineService.createPrescription(prescriptionData);

      setSuccessMessage(
        `Prescription ${result.matoathuoc} saved successfully!`
      );
      setPrescriptionItems([]);

      // Reload medicines to reflect updated stock
      await loadMedicines();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const [examination, setExamination] = useState({
    trieuchung: "",
    chandoan: "",
  });

  const [selectedPet, setSelectedPet] = useState(() => {
    const saved = sessionStorage.getItem("doctor_selected_pet");
    return saved ? JSON.parse(saved) : undefined;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", marginBottom: "8px" }}>
          Prescription
        </h1>
        <div style={{ fontSize: "16px", opacity: 0.9 }}>
          <strong>Pet:</strong> {selectedPet.ten} | <strong>Owner:</strong>
          {selectedPet.hovaten}
        </div>
      </div>

      <div className="mb-6">
        <ExaminationForm
          examination={examination}
          setExamination={setExamination}
        />
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
      <AddMedicineForm
        prescriptionItems={prescriptionItems}
        setPrescriptionItems={setPrescriptionItems}
      />

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
          <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#333" }}>
            Prescription Items
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Medicine Name
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Usage Instructions
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    Unit Price
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems.map((item) => (
                  <tr
                    key={item.masanpham}
                    style={{ borderBottom: "1px solid #dee2e6" }}
                  >
                    <td style={{ padding: "12px" }}>{item.ten}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {item.soluong}
                    </td>
                    <td style={{ padding: "12px" }}>{item.ghichu}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      {formatCurrency(item.gia)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
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
                        onMouseOver={(e) =>
                          (e.target.style.background = "#c82333")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#dc3545")
                        }
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
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>
              Total Price:
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#667eea",
              }}
            >
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
              if (!loading) e.target.style.background = "#218838";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.background = "#28a745";
            }}
          >
            {loading ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptionPage;
