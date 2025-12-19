import { useRef, useCallback } from "react";
import { useBranches } from "../hooks/useBranches";
import { Loader2, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SERVICE_MAP = {
  0: "Bán lẻ",
  1: "Khám bệnh",
  2: "Tiêm phòng",
};

const BranchList = () => {
  const { branches, loading, error, hasMore, loadMore } = useBranches();

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
      <h2 className="text-2xl font-bold text-gray-900">Chi Nhánh</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => {
          const isLast = index === branches.length - 1;
          return (
            <div
              key={branch.machinhanh}
              ref={isLast ? lastElementRef : null}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{branch.tenchinhanh}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{branch.diachi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{branch.sodienthoai}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{branch.thoigianmo} - {branch.thoigiandong}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Dịch vụ</p>
                <div className="flex flex-wrap gap-2">
                  {branch.services && branch.services.length > 0 ? (
                    branch.services.map((serviceId) => (
                      <Badge key={serviceId} variant="secondary">
                        {SERVICE_MAP[serviceId]}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Không có dịch vụ</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default BranchList;
