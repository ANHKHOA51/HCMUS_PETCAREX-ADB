import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProduct } from "../hooks/useProducts";
import { Loader2, Store } from "lucide-react";

/**
 * @param {Object} props
 * @param {string|null} props.productId - ID of product to show, null to hide
 * @param {Function} props.onClose - Callback to close dialog
 */
const ProductDetail = ({ productId, onClose }) => {
  const { product, loading, error } = useProduct(productId);

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : product ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{product.ten}</h3>
                <p className="text-sm text-gray-500">ID: {product.masanpham}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Giá:</span>
                  <span className="ml-2 text-blue-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Nhà sản xuất:</span>
                  <span className="ml-2">{product.nhasanxuat}</span>
                </div>
              </div>

              {product.mota && (
                <>
                  <span className="font-medium text-gray-700">Mô tả:</span>
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                    {product.mota}
                  </div>
                </>
              )}

              {product.stock && product.stock.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-500" /> Tồn kho các chi nhánh
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
                              <span className="border-b border-dotted border-gray-400">{item.tenchinhanh}</span>
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 shadow-lg">
                                {item.diachi}
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900">{item.soluongtonkho}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">Không tìm thấy sản phẩm</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
