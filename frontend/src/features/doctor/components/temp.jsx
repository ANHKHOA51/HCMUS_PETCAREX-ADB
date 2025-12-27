{
  /* Examination Form */
}
<div className="bg-white rounded-xl shadow-md p-6">
  <div className="flex items-center space-x-2 mb-6">
    <Stethoscope className="w-6 h-6 text-blue-600" />
    <h2 className="text-xl font-bold text-gray-900">Examination Details</h2>
  </div>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Symptoms (Triệu chứng) *
      </label>
      <textarea
        value={examData.trieuchung}
        onChange={(e) =>
          setExamData({ ...examData, trieuchung: e.target.value })
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
        onChange={(e) => setExamData({ ...examData, chandoan: e.target.value })}
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
        onChange={(e) => setExamData({ ...examData, ghichu: e.target.value })}
        rows={2}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        placeholder="Additional notes..."
      />
    </div>
  </div>
</div>;

{
  /* Prescription Section */
}
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
</div>;

{
  /* Save Button */
}
<div className="flex justify-end space-x-4">
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
</div>;
