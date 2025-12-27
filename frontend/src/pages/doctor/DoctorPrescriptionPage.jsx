"use client";

import { useState, useEffect } from "react";
import medicineService from "../../services/medicineService";
import ExaminationForm from "../../features/doctor/components/ExaminationForm";
import AddMedicineForm from "@/features/doctor/components/AddMedicineForm";
import PrescriptionList from "@/features/doctor/components/PrescriptionList";
import { formatCurrency } from "@/utils/format";
import { AuthContext } from "@/features/auth/context/AuthContext";

// Mock pet data (in real app, this would come from route params or context)

const DoctorPrescriptionPage = () => {
  const { user } = useContext(AuthContext);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const calculateTotalPrice = () => {
    return prescriptionItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSavePrescription = async () => {
    if (prescriptionItems.length === 0) {
      setErrors({ submit: "Please add at least one medicine" });
      return;
    }

    if (
      !examination.trieuchung ||
      !examination.chandoan ||
      !examination.ngaytaikham
    ) {
      setErrors({
        submit:
          "Please fill in all examination details (Symptoms, Diagnosis, Re-examination Date)",
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      let maToaThuoc = null;

      // 1. Create Prescription (if items exist)
      if (prescriptionItems.length > 0) {
        // Let backend generate the ID
        const presResult = await medicineService.createPrescription({
          items: prescriptionItems,
          machinhanh: user?.chinhanh || "CN001",
        });
        maToaThuoc = presResult.matoathuoc;
      }

      // 2. Create Examination Record
      const examData = {
        MaThuCung: selectedPet?.mathucung || mockPetData.mathucung,
        MaBacSi: user?.manhanvien || "BS001",
        TrieuChung: examination.trieuchung,
        ChuanDoan: examination.chandoan,
        NgayKham: new Date().toISOString().split("T")[0], // Today
        NgayTaiKham: examination.ngaytaikham,
        MaToaThuoc: maToaThuoc,
        MaChiNhanh: user?.chinhanh || "CN001",
      };

      const result = await medicineService.createExamination(examData);

      setSuccessMessage(
        `Saved successfully! Medical Record: ${result.MaHoSo}${
          maToaThuoc ? `, Prescription: ${maToaThuoc}` : ""
        }`
      );
      setPrescriptionItems([]);
      setExamination({ trieuchung: "", chandoan: "", ngaytaikham: "" });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const [examination, setExamination] = useState({
    trieuchung: "",
    chandoan: "",
    ngaytaikham: "",
  });

  const [selectedPet, setSelectedPet] = useState(() => {
    const saved = sessionStorage.getItem("doctor_selected_pet");
    return saved ? JSON.parse(saved) : undefined;
  });

  const handleRemoveItem = (masanpham) => {
    setPrescriptionItems((prevItems) =>
      prevItems.filter((item) => item.masanpham !== masanpham)
    );
  };

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
          Examination
        </h1>
        <div style={{ fontSize: "16px", opacity: 0.9 }}>
          <strong>Pet:</strong> {selectedPet?.ten || "Unknown"} |{" "}
          <strong>Owner:</strong>
          {selectedPet?.hovaten || "Unknown"}
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
      <PrescriptionList items={prescriptionItems} onRemove={handleRemoveItem} />

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
              background: loading ? "#667eea" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
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
