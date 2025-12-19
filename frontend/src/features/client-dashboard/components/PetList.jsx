import { Plus, PawPrint } from "lucide-react";
import PetCard from "./PetCard";

const PetList = ({ pets, loading, onEdit, onDelete, onRegister }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading pets...</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
        <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No pets registered yet
        </h3>
        <p className="text-gray-500 mb-6">Start by adding your first pet</p>
        <button
          onClick={onRegister}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Register Your First Pet</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <PetCard
          key={pet.mathucung}
          pet={pet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PetList;
