"use client"

import { useState } from "react"
import { Search, Stethoscope, FileText, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Mock patient data
const mockPatients = [
  {
    mathucung: "TC001",
    ten: "Max",
    loai: "Dog",
    giong: "Golden Retriever",
    tuoi: 3,
    owner: "Nguyen Van A",
    phone: "0901234567",
  },
  {
    mathucung: "TC002",
    ten: "Luna",
    loai: "Cat",
    giong: "Persian",
    tuoi: 2,
    owner: "Tran Thi B",
    phone: "0902345678",
  },
  {
    mathucung: "TC003",
    ten: "Charlie",
    loai: "Dog",
    giong: "Beagle",
    tuoi: 4,
    owner: "Le Van C",
    phone: "0903456789",
  },
]

const DoctorExamPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [examData, setExamData] = useState({
    trieuchung: "",
    chandoan: "",
    ghichu: "",
  })
  const [prescriptions, setPrescriptions] = useState([])

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mathucung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    // Reset exam data
    setExamData({ trieuchung: "", chandoan: "", ghichu: "" })
    setPrescriptions([])
  }

  const handleSaveExam = () => {
    if (!examData.trieuchung || !examData.chandoan) {
      alert("Please fill in symptoms and diagnosis")
      return
    }

    alert("Examination record saved successfully!")
    // In real app, save to backend
    console.log("Exam data:", {
      patient: selectedPatient,
      exam: examData,
      prescriptions,
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Examination</h1>
          <p className="text-gray-600">Search and examine patients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Patient Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Lookup</h2>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, ID, or owner..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.mathucung}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                      selectedPatient?.mathucung === patient.mathucung
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{patient.ten.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{patient.ten}</h3>
                        <p className="text-sm text-gray-600">
                          {patient.loai} - {patient.giong}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{patient.owner}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Examination Form */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">{selectedPatient.ten.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.ten}</h2>
                      <p className="text-gray-600">
                        {selectedPatient.loai} - {selectedPatient.giong} - {selectedPatient.tuoi} years old
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Patient ID:</span>
                      <span className="ml-2 text-gray-900">{selectedPatient.mathucung}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Owner:</span>
                      <span className="ml-2 text-gray-900">{selectedPatient.owner}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="ml-2 text-gray-900">{selectedPatient.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Examination Form */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Examination Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (Triệu chứng) *</label>
                      <textarea
                        value={examData.trieuchung}
                        onChange={(e) => setExamData({ ...examData, trieuchung: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Describe the symptoms..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis (Chẩn đoán) *</label>
                      <textarea
                        value={examData.chandoan}
                        onChange={(e) => setExamData({ ...examData, chandoan: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter diagnosis..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Ghi chú)</label>
                      <textarea
                        value={examData.ghichu}
                        onChange={(e) => setExamData({ ...examData, ghichu: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Prescription Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Prescription</h2>
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
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setSelectedPatient(null)
                      setExamData({ trieuchung: "", chandoan: "", ghichu: "" })
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
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                <p className="text-gray-500">
                  Please search and select a patient from the left panel to begin examination
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorExamPage
