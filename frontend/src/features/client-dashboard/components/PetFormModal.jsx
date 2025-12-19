import { useState, useEffect } from "react";

const PetFormModal = ({ isOpen, onClose, onSubmit, editingPet }) => {
  const [formData, setFormData] = useState({
    ten: "",
    loai: "dog",
    giong: "",
    weight: "",
    ngaysinh: "",
  });

  useEffect(() => {
    if (editingPet) {
      setFormData({
        ten: editingPet.ten || "",
        loai: editingPet.loai || "dog",
        giong: editingPet.giong || "",
        weight: editingPet.weight || "",
        ngaysinh: editingPet.ngaysinh
          ? (typeof editingPet.ngaysinh === "string" ? editingPet.ngaysinh.split("T")[0] : "")
          : "",
      });
    } else {
      setFormData({
        ten: "",
        loai: "dog",
        giong: "",
        weight: "",
        ngaysinh: "",
      });
    }
  }, [editingPet, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Golden Retriever"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday
              </label>
              <input
                type="date"
                value={formData.ngaysinh}
                onChange={(e) =>
                  setFormData({ ...formData, ngaysinh: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="15.5"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default PetFormModal;
