"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar } from "lucide-react";
import PetList from "../features/client-dashboard/components/PetList";
import PetFormModal from "../features/client-dashboard/components/PetFormModal";
import { useClientPets } from "../features/client-dashboard/hooks/useClientPets";

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { pets, loading, addPet, updatePet, deletePet } = useClientPets();

  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      deletePet(id);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPet) {
        await updatePet(editingPet.mathucung, formData);
      } else {
        await addPet(formData);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save pet:", error);
    }
  };

  const openRegisterModal = () => {
    setEditingPet(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPet(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pets</h1>
          <p className="text-gray-600">
            Manage your pet profiles and book appointments
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={openRegisterModal}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Register New Pet</span>
          </button>
          <button
            onClick={() => navigate("/client/booking")}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Book Appointment</span>
          </button>
        </div>

        {/* Pets Grid */}
        <PetList
          pets={pets}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRegister={openRegisterModal}
        />
      </div>

      {/* Modal */}
      <PetFormModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingPet={editingPet}
      />
    </div>
  );
};

export default ClientDashboardPage;
