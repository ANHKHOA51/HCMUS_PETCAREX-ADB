import { PawPrint, Edit2, Trash2 } from "lucide-react";

const PetCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <PawPrint className="w-20 h-20 text-white opacity-50" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.ten}</h3>
        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-medium">Loài:</span> {pet.loai}
          </p>
          <p>
            <span className="font-medium">Giống:</span> {pet.giong}
          </p>
          {pet.ngaysinh && (
            <p>
              <span className="font-medium">Ngày sinh:</span>{" "}
              {new Date(pet.ngaysinh).toLocaleDateString()}
            </p>
          )}
          {pet.weight && (
            <p>
              <span className="font-medium">Cân nặng:</span> {pet.weight} kg
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(pet)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">Sửa</span>
          </button>
          <button
            onClick={() => onDelete(pet.mathucung)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
