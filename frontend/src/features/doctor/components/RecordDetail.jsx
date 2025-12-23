import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { useProduct } from "../hooks/useProducts";
import { Loader2, Store } from "lucide-react";

/**
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close dialog
 */
const RecordDetail = ({ record, onClose }) => {
  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="py-4">
          {record ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Hồ sơ bệnh án
                </h3>
                <p className="text-sm text-gray-500">ID: {record.mahoso}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Bác sĩ:</span>
                  <span className="ml-2 text-blue-600 font-bold">
                    {record.mabacsi}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Chi nhánh khám:
                  </span>
                  <span className="ml-2">{record.machinhanh}</span>
                </div>
              </div>

              <span className="font-medium text-gray-700">Triệu chứng:</span>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                {record.trieuchung}
              </div>

              <span className="font-medium text-gray-700">Chẩn đoán:</span>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                {record.chuandoan}
              </div>

              {product.stock && product.stock.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-500" /> Tồn kho các chi
                    nhánh
                  </h4>
                  <div className="bg-gray-50 rounded-md border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-medium">
                        <tr>
                          <th className="px-3 py-2">Chi nhánh</th>
                          <th className="px-3 py-2 text-right">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {product.stock.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 text-gray-700 relative group cursor-help">
                              <span className="border-b border-dotted border-gray-400">
                                {item.tenchinhanh}
                              </span>
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 shadow-lg">
                                {item.diachi}
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900">
                              {item.soluongtonkho}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
