import { Calendar, Clock, MapPin } from "lucide-react";

const formatTimeDisplay = (value) => {
  if (!value) return "--:--";
  if (typeof value === "string") {
      // Extract HH:mm from ISO string (e.g. ...T20:37:...)
      const isoMatch = value.match(/T(\d{2}):(\d{2})/);
      if (isoMatch) return `${isoMatch[1]}:${isoMatch[2]}`;

      const match = value.match(/^\d{2}:\d{2}/);
      if (match) return match[0];
  }
  
  const asDate = new Date(value);
  if (!Number.isNaN(asDate.getTime())) {
      return asDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return String(value);
};

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
          Đã xác nhận
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {new Date(appointment.ngayden).toLocaleDateString()}
      </h3>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-gray-400" />
          <span>{formatTimeDisplay(appointment.thoigianden)}</span>
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
