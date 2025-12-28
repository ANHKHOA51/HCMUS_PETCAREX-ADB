import React from 'react';
import { Stethoscope } from 'lucide-react';

const ExaminationCountCard = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Total Examinations</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-2xl font-bold text-purple-600">
              {data?.value?.toLocaleString() ?? 0}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExaminationCountCard;
