import { useState } from "react";
import { doctorService } from "../services/doctorService.js";
import { Search, Stethoscope, FileText, Plus } from "lucide-react";
import RecordList from "../components/RecordList.jsx";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../../../utils/format.js";

const SelectedPet = ({ pet }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examData, setExamData] = useState({
    trieuchung: "",
    chandoan: "",
    ghichu: "",
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    // Reset exam data
    setExamData({ trieuchung: "", chandoan: "", ghichu: "" });
    setPrescriptions([]);
  };

  // const handleSaveExam = () => {
  //   if (!examData.trieuchung || !examData.chandoan) {
  //     alert("Please fill in symptoms and diagnosis");
  //     return;
  //   }

  //   alert("Examination record saved successfully!");
  //   // In real app, save to backend
  //   console.log("Exam data:", {
  //     patient: selectedPatient,
  //     exam: examData,
  //     prescriptions,
  //   });
  // };
  return (
    <div className="lg:col-span-2">
      {pet ? (
        <div className="space-y-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {pet.ten.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{pet.ten}</h2>
                <p className="text-gray-600">
                  {pet.loai} - {pet.giong} - {calculateAge(pet.ngaysinh[0])}{" "}
                  tuổi
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  <b>Pet ID:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.mathucung}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  <b>Owner:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.hovaten}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  <b>Phone:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.sodienthoai}</span>
              </div>
            </div>
          </div>
          <RecordList petId={pet.mathucung} />
          {/* Examination Form */}
          {/* <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Examination Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms (Triệu chứng) *
                </label>
                <textarea
                  value={examData.trieuchung}
                  onChange={(e) =>
                    setExamData({
                      ...examData,
                      trieuchung: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Describe the symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis (Chẩn đoán) *
                </label>
                <textarea
                  value={examData.chandoan}
                  onChange={(e) =>
                    setExamData({ ...examData, chandoan: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter diagnosis..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Ghi chú)
                </label>
                <textarea
                  value={examData.ghichu}
                  onChange={(e) =>
                    setExamData({ ...examData, ghichu: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div> */}

          {/* Prescription Section */}
          {/* <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Prescription
                </h2>
              </div>
              <button
                onClick={() => navigate("/doctor/prescription")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Create Prescription</span>
              </button>
            </div>

            <p className="text-gray-600 text-sm">
              Click "Create Prescription" to add medicines for this patient.
            </p>
          </div> */}

          {/* Save Button */}
          {/* <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setSelectedPatient(null);
                setExamData({ trieuchung: "", chandoan: "", ghichu: "" });
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveExam}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save Examination
            </button>
          </div> */}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Pet Selected
          </h3>
          <p className="text-gray-500">
            Please search and select a Pet from the left panel to begin check
            the Records
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedPet;
