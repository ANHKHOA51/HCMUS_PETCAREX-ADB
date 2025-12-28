import { useState, useRef, useCallback } from "react";
import { useProducts } from "../hooks/useProducts";
import SearchBar from "@/components/SearchBar";
import ProductDetail from "./ProductDetail";
import { Loader2 } from "lucide-react";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Convert "all" to undefined for API
  const apiType = type === "all" ? undefined : type;

  const { products, loading, error, hasMore, loadMore } = useProducts({
    search,
    type: apiType
  });

  // Infinite Scroll Observer
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
        <div className="w-full sm:w-1/2">
          <SearchBar onSearch={setSearch} placeholder="Tìm kiếm sản phẩm..." />
        </div>
        <div className="w-full sm:w-48">
          <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
            <option value="all">Lọc theo loại</option>
            <option value="all">Tất cả các loại</option>
            <option value="0">Thuốc</option>
            <option value="1">Vaccine</option>
            <option value="2">Bán lẻ</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Lỗi: {error}
        </div>
      )}

      <div className="space-y-4">
        {products.map((product, index) => {
          const isLast = index === products.length - 1;
          return (
            <div
              key={product.masanpham}
              ref={isLast ? lastElementRef : null}
              onClick={() => setSelectedProductId(product.masanpham)}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex justify-between items-center group"
            >
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{product.ten}</h4>
                <p className="text-xs text-gray-500">ID: {product.masanpham}</p>
              </div>
              <div className="font-bold text-blue-600 text-lg">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          Không tìm thấy sản phẩm.
        </div>
      )}

      <ProductDetail
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};

export default ProductList;
