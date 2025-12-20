import React from 'react';

const DateFilter = ({ startDate, endDate, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="date"
      value={startDate}
      onChange={(e) => onChange("startDate", e.target.value)}
      className="
        h-[40px]
        w-[110px]
        px-3
        text-sm
        border
        rounded-lg
        appearance-none
        leading-none
        focus:ring-2 focus:ring-blue-500
        outline-none
      "
    />

    <input
      type="date"
      value={endDate}
      onChange={(e) => onChange("endDate", e.target.value)}
      className="
        h-[40px]
        w-[110px]
        px-3
        text-sm
        border
        rounded-lg
        appearance-none
        leading-none
        focus:ring-2 focus:ring-blue-500
        outline-none
      "
    />
  </div>
);

export default DateFilter;
