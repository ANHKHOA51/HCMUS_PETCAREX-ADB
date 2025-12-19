import { useState } from "react";
import { Calendar, Clock, MapPin, PawPrint, X } from "lucide-react";
import toast from "react-hot-toast";
import { useClientPets } from "../../client-dashboard/hooks/useClientPets";
import { useBranches } from "../../branch/hooks/useBranches";
import { bookingService } from "../services/bookingService";
import CustomDropdown from "../../../components/CustomDropdown";

const BookingModal = ({ isOpen, onClose, onSuccess }) => {
  const { pets, loading: loadingPets } = useClientPets();
  const { branches, loading: loadingBranches } = useBranches();

  const [formData, setFormData] = useState({
    petId: "",
    branchId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.petId || !formData.branchId || !formData.time || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        MaThuCung: formData.petId,
        MaChiNhanh: formData.branchId,
        ThoiGianHen: formData.time, // Format "HH:mm"
        NgayDen: formData.date
      };

      await bookingService.createAppointment(payload);
      toast.success("Appointment booked successfully!");

      if (onSuccess) onSuccess();
      onClose(); // Close modal on success

      setFormData({ ...formData, petId: "", branchId: "", time: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Render option for Pets (showing Name + Species)
  const renderPetOption = (pet) => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        <PawPrint className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{pet.ten}</div>
        <div className="text-xs text-gray-500 capitalize">{pet.loai} - {pet.giong}</div>
      </div>
    </div>
  );

  // Render option for Branches (showing Name + Address)
  const renderBranchOption = (branch) => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <MapPin className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{branch.tenchinhanh}</div>
        <div className="text-xs text-gray-500 truncate max-w-[200px]">{branch.diachi}</div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule Appointment</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Selection */}
            <div>
              <CustomDropdown
                label="Select Pet"
                options={pets}
                value={formData.petId}
                onChange={(val) => setFormData({ ...formData, petId: val })}
                valueKey="mathucung"
                labelKey="ten"
                placeholder={loadingPets ? "Loading pets..." : "Choose your pet"}
                renderOption={renderPetOption}
              />
              {pets.length === 0 && !loadingPets && (
                <p className="mt-2 text-sm text-red-500">
                  You don't have any pets registered. Please register a pet first in your dashboard.
                </p>
              )}
            </div>

            {/* Branch Selection */}
            <div>
              <CustomDropdown
                label="Select Clinic Branch"
                options={branches}
                value={formData.branchId}
                onChange={(val) => setFormData({ ...formData, branchId: val })}
                valueKey="machinhanh"
                labelKey="tenchinhanh"
                placeholder={loadingBranches ? "Loading branches..." : "Choose a nearby clinic"}
                renderOption={renderBranchOption}
              />
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || loadingPets || loadingBranches}
                className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
