import { useState, useEffect, useContext } from "react";
import { formatCurrency } from "@/utils/format";
import medicineService from "../../doctor/services/medicalService";
import { productService } from "../../product/services/productService";
import { AuthContext } from "../../auth/context/AuthContext";
import { Check, ChevronsUpDown, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AddMedicineForm = ({ prescriptionItems, setPrescriptionItems }) => {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedMedicineData, setSelectedMedicineData] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [nextCursor, setNextCursor] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMedicines(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const loadMedicines = async (search = "") => {
    try {
      const data = await medicineService.getMedicines({
        search: searchTerm, // Từ khóa tìm kiếm
        limit: 20,
        type: 0, // Only fetch medicines
      });

      setMedicines(data.items);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Update selected medicine data when selection changes
  useEffect(() => {
    const fetchMedicineDetail = async () => {
      if (selectedMedicine) {
        try {
          // Fetch full detail to get stock
          const fullData = await productService.getProductById(
            selectedMedicine
          );

          // Find stock for current branch
          const currentBranchStock = fullData.stock?.find(
            (s) => s.machinhanh === user?.chinhanh
          );

          // Merge basic info with specific stock info
          setSelectedMedicineData({
            ...fullData,
            soluongtonkho: currentBranchStock
              ? currentBranchStock.soluongtonkho
              : 0,
          });
        } catch (error) {
          console.error("Error fetching medicine detail:", error);
          setSelectedMedicineData(null);
        }
      } else {
        setSelectedMedicineData(null);
      }
    };

    fetchMedicineDetail();
  }, [selectedMedicine, user]);

  const handleAddMedicine = () => {
    const newErrors = {};

    // Validate medicine selection
    if (!selectedMedicine) {
      newErrors.medicine = "Please select a medicine";
    }

    // Validate quantity
    const qty = Number.parseInt(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = "Quantity must be a positive integer";
    } else if (selectedMedicineData) {
      if (qty > selectedMedicineData.soluongtonkho) {
        newErrors.quantity = `Insufficient stock. Available: ${selectedMedicineData.soluongtonkho}`;
      }
    }

    // Validate note
    if (!note.trim()) {
      newErrors.note = "Usage instructions are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if medicine already added
    const existingItem = prescriptionItems.find(
      (item) => item.masanpham === selectedMedicine
    );
    if (existingItem) {
      newErrors.medicine = "Medicine already added to prescription";
      setErrors(newErrors);
      return;
    }

    // Add to prescription list
    const newItem = {
      masanpham: selectedMedicine,
      ten: selectedMedicineData.ten,
      soluong: qty,
      ghichu: note,
      gia: selectedMedicineData.gia,
      total: selectedMedicineData.gia * qty,
    };

    setPrescriptionItems([...prescriptionItems, newItem]);

    // Reset form
    setSelectedMedicine("");
    setSelectedMedicineData(null);
    setQuantity("");
    setNote("");
    setErrors({});
  };

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
        Add Medicine
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Medicine Selection */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Medicine *
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedMedicine
                  ? medicines.find((m) => m.masanpham === selectedMedicine)?.ten
                  : "Select medicine..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] p-0 bg-white border border-gray-200"
              align="start"
            >
              <Command
                shouldFilter={false}
                className="border border-gray-100 rounded-md"
              >
                <CommandInput
                  placeholder="Search medicine..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="border-b border-gray-100"
                />
                <CommandList>
                  <CommandEmpty>No medicine found.</CommandEmpty>
                  <CommandGroup>
                    {medicines.map((medicine) => (
                      <CommandItem
                        key={medicine.masanpham}
                        value={medicine.masanpham}
                        onSelect={(currentValue) => {
                          setSelectedMedicine(
                            currentValue === selectedMedicine
                              ? ""
                              : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMedicine === medicine.masanpham
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {medicine.ten} - {formatCurrency(medicine.gia)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.medicine && (
            <div className="text-red-500 text-xs mt-1">{errors.medicine}</div>
          )}
        </div>

        {/* Stock Display */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Available Stock
          </label>
          <div
            style={{
              padding: "10px 12px",
              background: selectedMedicineData
                ? selectedMedicineData.soluongtonkho > 0
                  ? "#d4edda"
                  : "#f8d7da"
                : "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              color: selectedMedicineData
                ? selectedMedicineData.soluongtonkho > 0
                  ? "#155724"
                  : "#721c24"
                : "#6c757d",
            }}
          >
            {selectedMedicineData
              ? `${selectedMedicineData.soluongtonkho} units`
              : "Select a medicine"}
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Quantity *
          </label>
          <input
            type="number"
            min="1"
            max={
              selectedMedicineData
                ? selectedMedicineData.soluongtonkho
                : undefined
            }
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              setQuantity(val);

              // Real-time validation
              if (selectedMedicineData) {
                const numVal = parseInt(val);
                if (numVal > selectedMedicineData.soluongtonkho) {
                  setErrors((prev) => ({
                    ...prev,
                    quantity: `Max available: ${selectedMedicineData.soluongtonkho}`,
                  }));
                } else {
                  setErrors((prev) => {
                    const newErrs = { ...prev };
                    delete newErrs.quantity;
                    return newErrs;
                  });
                }
              }
            }}
            placeholder="Enter quantity"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: errors.quantity ? "2px solid #dc3545" : "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          {errors.quantity && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {errors.quantity}
            </div>
          )}
        </div>

        {/* Note Input */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Usage Instructions *
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., 2 times/day after meals"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: errors.note ? "2px solid #dc3545" : "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          {errors.note && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {errors.note}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAddMedicine}
        style={{
          marginTop: "16px",
          padding: "10px 24px",
          background: "#667eea",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.target.style.background = "#5568d3")}
        onMouseOut={(e) => (e.target.style.background = "#667eea")}
      >
        Add to Prescription
      </button>
    </div>
  );
};

export default AddMedicineForm;
