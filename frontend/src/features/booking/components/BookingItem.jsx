import { Calendar, Clock, MapPin } from "lucide-react";

const BookingItem = ({ appointment, innerRef }) => {
  return (
    <div
      ref={innerRef}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
          <Calendar className="text-indigo-600" size={24} />
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          Confirmed
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {new Date(appointment.ngayden).toLocaleDateString()}
      </h3>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-gray-400" />
          <span>{new Date(appointment.thoigianden).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-gray-400" />
          <span className="truncate">{appointment.tenchinhanh}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{appointment.tenThuCung}</span>
          <span className="text-sm text-gray-400">({appointment.loai})</span>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;
