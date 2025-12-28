import { useState } from "react";
import { Search, Stethoscope, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExaminationForm = ({ examination, setExamination }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Stethoscope className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Examination Details</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Triệu chứng
          </label>
          <textarea
            value={examination.trieuchung}
            onChange={(e) =>
              setExamination((prev) => ({
                ...prev,
                trieuchung: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Describe the symptoms..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chẩn đoán
          </label>
          <textarea
            value={examination.chandoan}
            onChange={(e) =>
              setExamination((prev) => ({
                ...prev,
                chandoan: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter diagnosis..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày tái khám
          </label>
          <input
            type="date"
            value={examination.ngaytaikham || ""}
            onChange={(e) =>
              setExamination((prev) => ({
                ...prev,
                ngaytaikham: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ExaminationForm;
