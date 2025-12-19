import { Calendar } from "lucide-react";
import BookingItem from "./BookingItem";

const BookingList = ({ appointments, loading, lastElementRef }) => {
  if (!loading && appointments.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No appointments yet</h3>
        <p className="text-gray-500">Book your first appointment to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((apt, index) => {
          const isLast = index === appointments.length - 1;
          return (
            <BookingItem
              key={apt.maphieudatlich}
              appointment={apt}
              innerRef={isLast ? lastElementRef : null}
            />
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      )}
    </>
  );
};

export default BookingList;
