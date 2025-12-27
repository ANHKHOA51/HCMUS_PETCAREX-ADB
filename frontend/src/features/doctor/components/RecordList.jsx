import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { doctorService } from "../services/doctorService";
import DoctorExamPage from "@/pages/doctor/DoctorExamPage";
import { formatDateVN } from "../../../utils/format.js";
import RecordDetail from "./RecordDetail";
import VaccineDetail from "./VaccineDetail";

const RecordList = ({ petId }) => {
  const [type, setType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [recordList, setRecordList] = useState([]);
  const [vaccineList, setVaccineList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const records = await doctorService.getPetRecords(petId);
      if (records) {
        setLoading(false);
        setRecordList(records[0]);
        setVaccineList(records[1]);
      }
      console.log(records);
    };
    fetchData();
  }, [petId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
      <div className="w-full sm:w-48">
        <select
          value={type}
          onChange={(e) => {
            console.log(e.target.value);
            return setType(e.target.value);
          }}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <option value="all">Filter by Type</option>
          <option value="all">All Types</option>
          <option value="0">Hồ sơ</option>
          <option value="1">Lịch sử tiêm</option>
        </select>
      </div>

      {(type === "all" || type === "0") && (
        <div className="space-y-4">
          {recordList.map((record, index) => {
            return (
              <div
                key={record.mahoso}
                onClick={() => setSelectedRecord(record)}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex justify-between items-center group"
              >
                <div key={record.mahoso}>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {record.mahoso}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Ngày khám: {formatDateVN(record.ngaykham)}
                  </p>
                </div>

                <div className="font-bold text-blue-600 text-lg">
                  Hồ sơ {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(type === "all" || type === "1") && (
        <div className="space-y-4">
          {vaccineList.map((vaccine, index) => {
            return (
              <div
                key={vaccine.malichsutiem}
                onClick={() => setSelectedVaccine(vaccine)}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex justify-between items-center group"
              >
                <div key={vaccine.malichsutiem}>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {vaccine.malichsutiem}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Ngày tiêm: {formatDateVN(vaccine.ngaytiem)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Mã sản phẩm: {vaccine.masanpham}
                  </p>
                </div>

                <div className="font-bold text-blue-600 text-lg">
                  Tiêm chủng {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!recordList.length && !vaccineList.length && (
        <div className="flex justify-center py-4">
          No medical records or vaccination history were found.
        </div>
      )}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* <RecordDetail
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      /> */}
      {selectedVaccine && (
        <VaccineDetail
          vaccine={selectedVaccine}
          onClose={() => setSelectedVaccine(null)}
        />
      )}
    </div>
  );
};

export default RecordList;
