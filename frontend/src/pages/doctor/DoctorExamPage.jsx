"use client";

import { useState, useEffect } from "react";
import SearchPets from "@/features/doctor/components/SearchPets";
import SelectedPet from "@/features/doctor/components/SelectedPet";

const DoctorExamPage = () => {
  const [selectedPet, setSelectedPet] = useState(() => {
    const saved = sessionStorage.getItem("doctor_selected_pet");
    return saved ? JSON.parse(saved) : undefined;
  });

  useEffect(() => {
    if (selectedPet) {
      sessionStorage.setItem(
        "doctor_selected_pet",
        JSON.stringify(selectedPet)
      );
    } else {
      sessionStorage.removeItem("doctor_selected_pet");
    }
  }, [selectedPet]);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Examination
          </h1>
          <p className="text-gray-600">Search and examine patients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Examination Form */}
          <SearchPets onSelectedPet={setSelectedPet} />
          {/* Right Panel - Examination Form */}
          <SelectedPet pet={selectedPet} />
        </div>
      </div>
    </div>
  );
};

export default DoctorExamPage;
