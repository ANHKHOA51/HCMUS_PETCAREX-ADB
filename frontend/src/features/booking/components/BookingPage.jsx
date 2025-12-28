import { useState, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { useAppointments } from "../hooks/useAppointments";
import BookingModal from "./BookingModal";
import BookingList from "./BookingList";
import { useAuth } from "../../auth/hooks/useAuth";

const BookingPage = () => {
  const { user } = useAuth();
  const { appointments, loading, hasMore, loadMore, refresh } = useAppointments(user?.makhachhang);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Infinite scroll observer
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lịch hẹn của tôi
          </h1>
          <p className="text-gray-500 mt-2">Quản lý lịch trình sức khỏe thú cưng của bạn</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          <Plus size={20} />
          <span>Đặt lịch hẹn mới</span>
        </button>
      </div>

      {/* Appointment List */}
      <BookingList
        appointments={appointments}
        loading={loading}
        lastElementRef={lastElementRef}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default BookingPage;
