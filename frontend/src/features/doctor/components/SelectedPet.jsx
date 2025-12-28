import { useState } from "react";
import { doctorService } from "../services/doctorService.js";
import { Search, Stethoscope, FileText, Plus } from "lucide-react";
import RecordList from "../components/RecordList.jsx";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../../../utils/format.js";

const SelectedPet = ({ pet }) => {
  const navigate = useNavigate();
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
                  <b>Mã thú cưng:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.mathucung}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  <b>Chủ sở hữu:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.hovaten}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  <b>Số điện thoại:</b>
                </span>
                <span className="ml-2 text-gray-900">{pet.sodienthoai}</span>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button
                onClick={() => navigate("/doctor/prescription")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Tạo đơn thuốc</span>
              </button>
            </div>
          </div>
          <RecordList petId={pet.mathucung} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa chọn thú cưng
          </h3>
          <p className="text-gray-500">
            Vui lòng tìm kiếm và chọn một thú cưng từ bảng bên trái để bắt đầu xem hồ sơ
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedPet;
