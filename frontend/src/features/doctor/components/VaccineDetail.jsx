import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { useProduct } from "../hooks/useProducts";
import { Loader2, Store } from "lucide-react";
import { productService } from "@/features/product/services/productService";
import { formatDateVN } from "@/utils/format";
import { useEffect, useState } from "react";
/**
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close dialog
 */
const VaccineDetail = ({ vaccine, onClose }) => {
  {
    console.log(vaccine);
  }
  const [product, setProduct] = useState();

  useEffect(() => {
    if (!vaccine?.masanpham) return;
    const fetchData = async () => {
      console.log(vaccine.masanpham);
      const data = await productService.getProductById(vaccine.masanpham);
      console.log(data);
      if (data) {
        console.log(data);
        setProduct(data);
      }
    };
    fetchData();
  }, [vaccine?.masanpham]);

  return (
    <Dialog open={!!vaccine} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <div className="py-4">
          {vaccine ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-2xl text-gray-900 text-center">
                  Lịch sử tiêm chủng
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {vaccine.malichsutiem}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Bác sĩ:</span>
                  <span className="ml-2 text-blue-600 font-bold">
                    {vaccine.manhanvien}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Chi nhánh tiêm:
                  </span>
                  <span className="ml-2">{vaccine.machinhanh}</span>
                </div>
              </div>

              <span className="font-medium text-gray-700">
                <b>Vaccine:</b>
              </span>
              {product && (
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <div>
                    <b>Tên sản phẩm: </b>
                    {product.ten}
                  </div>
                  <div>
                    <b>Mô tả: </b>
                    {product.mota}
                  </div>
                  <div>
                    <b>Nhà sản xuất: </b>
                    {product.nhasanxuat}
                  </div>
                  <div>
                    <b>Loại: </b> {product.loai}
                  </div>
                </div>
              )}

              <span className="font-medium text-gray-700">
                <b>Ngày tiêm:</b>
              </span>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                {formatDateVN(vaccine.ngaytiem)}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Không tìm thấy lịch sử tiêm
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VaccineDetail;
