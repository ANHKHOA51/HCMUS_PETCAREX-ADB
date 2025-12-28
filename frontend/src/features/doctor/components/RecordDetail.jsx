import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import medicineService from "../../doctor/services/medicalService";
import { formatDateVN } from "@/utils/format";
import { Pill } from "lucide-react";

/**
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close dialog
 */
const RecordDetail = ({ record, onClose }) => {
  const [prescription, setPrescription] = useState([]);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  useEffect(() => {
    if (!record?.matoathuoc) {
      setPrescription([]);
      return;
    }

    const fetchPrescription = async () => {
      setLoadingPrescription(true);
      try {
        const items = await medicineService.getPrescriptionDetails(
          record.matoathuoc
        );
        setPrescription(items || []);
      } catch (error) {
        console.error("Failed to fetch prescription:", error);
      } finally {
        setLoadingPrescription(false);
      }
    };

    fetchPrescription();
  }, [record?.matoathuoc]);

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="py-4">
          {record ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="font-extrabold text-2xl text-gray-900">
                  Chi tiết hồ sơ bệnh án
                </h3>
                <p className="text-sm text-gray-500">
                  Mã hồ sơ: {record.mahoso}
                </p>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">Bác sĩ:</span>
                  <span className="ml-2 text-blue-600 font-bold">
                    {record.mabacsi}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Chi nhánh:</span>
                  <span className="ml-2">{record.machinhanh}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ngày khám:</span>
                  <span className="ml-2">{formatDateVN(record.ngaykham)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tái khám:</span>
                  <span className="ml-2 text-red-600 font-medium">
                    {record.ngaytaikham
                      ? formatDateVN(record.ngaytaikham)
                      : "Không có"}
                  </span>
                </div>
              </div>

              {/* Clinical Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Triệu chứng
                  </h4>
                  <div className="bg-white border border-gray-200 p-3 rounded-md text-sm text-gray-700">
                    {record.trieuchung}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Chẩn đoán
                  </h4>
                  <div className="bg-white border border-gray-200 p-3 rounded-md text-sm text-gray-700">
                    {record.chuandoan}
                  </div>
                </div>
              </div>

              {/* Prescription Section */}
              {record.matoathuoc && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-lg text-gray-900">
                      Toa thuốc
                    </h4>
                  </div>

                  {loadingPrescription ? (
                    <div className="text-center py-4 text-gray-500">
                      Đang tải toa thuốc...
                    </div>
                  ) : prescription.length > 0 ? (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tên thuốc
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SL
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ghi chú
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescription.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {item.tenThuoc}
                                <div className="text-xs text-gray-400 font-normal">
                                  {item.masanpham}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                {item.soluong}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 italic">
                                {item.ghichu || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Không có chi tiết toa thuốc.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Không tìm thấy hồ sơ
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDetail;
