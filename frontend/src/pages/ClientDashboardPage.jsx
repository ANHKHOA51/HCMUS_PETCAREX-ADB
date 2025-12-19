"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { petService } from "../services/petService";
import { Plus, Edit2, Trash2, Calendar, PawPrint } from "lucide-react";
import authService from "../services/authService.js"
import cusAPI from "../api/cusAPI.js";

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    ten: "",
    loai: "dog",
    giong: "",
    ngaysinh: "",
  });

  useEffect(() => {
    loadPets();
  }, []);
  const userStr = localStorage.getItem("user");

  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await cusAPI.getPetsByPhone(userStr.)
    } catch (error) {
      console.error("Failed to load pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPet) {
        await petService.updatePet(editingPet.mathucung, formData);
      } else {
        await petService.createPet(formData);
      }
      loadPets();
      closeModal();
    } catch (error) {
      console.error("Failed to save pet:", error);
    }
  };

  const handleDelete = async (mathucung) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await petService.deletePet(mathucung);
        loadPets();
      } catch (error) {
        console.error("Failed to delete pet:", error);
      }
    }
  };

  const openModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        ten: pet.ten,
        loai: pet.loai,
        giong: pet.giong,
        ngaysinh: pet.ngaysinh,
      });
    } else {
      setEditingPet(null);
      setFormData({ ten: "", loai: "dog", giong: "", age: "", weight: "" });
    }
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
            onClick={() => openModal()}
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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No pets registered yet
            </h3>
            <p className="text-gray-500 mb-6">Start by adding your first pet</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Register Your First Pet</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.mathucung}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <PawPrint className="w-20 h-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pet.ten}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-medium">Species:</span> {pet.loai}
                    </p>
                    <p>
                      <span className="font-medium">Breed:</span> {pet.giong}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span> {pet.age} years
                    </p>
                    <p>
                      <span className="font-medium">Weight:</span> {pet.weight}{" "}
                      kg
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(pet)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(pet.mathucung)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPet ? "Edit Pet" : "Register New Pet"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={(e) =>
                    setFormData({ ...formData, ten: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Buddy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species
                </label>
                <select
                  value={formData.loai}
                  onChange={(e) =>
                    setFormData({ ...formData, loai: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  required
                  value={formData.giong}
                  onChange={(e) =>
                    setFormData({ ...formData, giong: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Golden Retriever"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="15.5"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingPet ? "Update Pet" : "Register Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboardPage;
