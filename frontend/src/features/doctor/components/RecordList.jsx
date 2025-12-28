import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { doctorService } from "../services/doctorService";
import { formatDateVN } from "../../../utils/format.js";
import RecordDetail from "./RecordDetail";
import VaccineDetail from "./VaccineDetail";
import { Button } from "@/components/ui/button";

const RecordList = ({ petId }) => {
  const [type, setType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [recordList, setRecordList] = useState([]);
  const [vaccineList, setVaccineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursors, setCursors] = useState({
    nextCursorMaHoSo: null,
    nextCursorMaLichSuTiem: null,
  });

  const loadRecords = async (reset = false) => {
    setLoading(true);
    try {
      const cursorMaHoSo = reset ? null : cursors.nextCursorMaHoSo;
      const cursorMaLichSuTiem = reset ? null : cursors.nextCursorMaLichSuTiem;

      const response = await doctorService.getPetRecords(
        petId,
        3, 
        cursorMaHoSo,
        cursorMaLichSuTiem
      );

      if (response) {
        setRecordList((prev) =>
          reset
            ? response.medicalRecords || []
            : [...prev, ...(response.medicalRecords || [])]
        );
        setVaccineList((prev) =>
          reset
            ? response.vaccineHistory || []
            : [...prev, ...(response.vaccineHistory || [])]
        );
        setCursors({
          nextCursorMaHoSo: response.nextCursorMaHoSo,
          nextCursorMaLichSuTiem: response.nextCursorMaLichSuTiem,
        });
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords(true);
  }, [petId]);

  const hasMore = cursors.nextCursorMaHoSo || cursors.nextCursorMaLichSuTiem;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
      <div className="w-full sm:w-48">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <option value="all">All Types</option>
          <option value="0">Hồ sơ</option>
          <option value="1">Lịch sử tiêm</option>
        </select>
      </div>

      {(type === "all" || type === "0") && (
        <div className="space-y-4">
          {recordList.map((record, index) => (
            <div
              key={record.mahoso}
              onClick={() => setSelectedRecord(record)}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex justify-between items-center group"
            >
              <div>
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
          ))}
        </div>
      )}

      {(type === "all" || type === "1") && (
        <div className="space-y-4">
          {vaccineList.map((vaccine, index) => (
            <div
              key={vaccine.malichsutiem}
              onClick={() => setSelectedVaccine(vaccine)}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex justify-between items-center group"
            >
              <div>
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
          ))}
        </div>
      )}

      {!loading && recordList.length === 0 && vaccineList.length === 0 && (
        <div className="flex justify-center py-4 text-gray-500">
          No medical records or vaccination history found.
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => loadRecords(false)}
            className="w-full sm:w-auto"
          >
            Load More
          </Button>
        </div>
      )}

      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
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
