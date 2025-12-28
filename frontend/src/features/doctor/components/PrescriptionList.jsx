import { formatCurrency } from "@/utils/format";
import { Pill, Trash2 } from "lucide-react";

const PrescriptionList = ({ items, onRemove }) => {
  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
        <Pill className="h-5 w-5" />
        Prescription Items
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left font-semibold text-gray-700">
                Medicine Name
              </th>
              <th className="p-3 text-center font-semibold text-gray-700">
                Quantity
              </th>
              <th className="p-3 text-left font-semibold text-gray-700">
                Usage Instructions
              </th>
              <th className="p-3 text-right font-semibold text-gray-700">
                Unit Price
              </th>
              <th className="p-3 text-right font-semibold text-gray-700">
                Total
              </th>
              <th className="p-3 text-center font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.masanpham}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 text-gray-900">{item.ten}</td>
                <td className="p-3 text-center text-gray-900">
                  {item.soluong}
                </td>
                <td className="p-3 text-gray-600">{item.ghichu}</td>
                <td className="p-3 text-right text-gray-900">
                  {formatCurrency(item.gia)}
                </td>
                <td className="p-3 text-right font-semibold text-blue-600">
                  {formatCurrency(item.total)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onRemove(item.masanpham)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionList;
