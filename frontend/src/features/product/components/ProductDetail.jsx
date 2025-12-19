import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useProduct } from "../hooks/useProducts";
import { Loader2 } from "lucide-react";

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

              {/* {product.mota && ( */}
              <span className="font-medium text-gray-700">Mô tả:</span>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                {product.mota}
              </div>
              {/* )} */}
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
