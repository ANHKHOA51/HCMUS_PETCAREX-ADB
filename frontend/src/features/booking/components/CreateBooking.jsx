import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    PawPrint,
    Phone,
    Plus,
    Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../auth/hooks/useAuth";
import { clientService } from "../../client-dashboard/services/clientService";
import { bookingService } from "../services/bookingService";

const normalizePhone10 = (value) => {
    if (!value) return "";
    const digits = String(value).replace(/\D/g, "");
    if (digits.length === 10) return digits;
    if (digits.length === 11 && digits.startsWith("0")) return digits.slice(0, 10);
    return digits.slice(0, 10);
};

const pad2 = (n) => String(n).padStart(2, "0");

const getNowDateTimeStrings = () => {
    const now = new Date();
    const date = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    return { date, time };
};

const formatTimeDisplay = (value) => {
    if (!value) return "--:--";
    if (typeof value === "string") {
        const match = value.match(/^\d{2}:\d{2}/);
        if (match) return match[0];
        const asDate = new Date(value);
        if (!Number.isNaN(asDate.getTime())) {
            return `${pad2(asDate.getHours())}:${pad2(asDate.getMinutes())}`;
        }
    }
    if (typeof value === "number") {
        const asDate = new Date(value);
        if (!Number.isNaN(asDate.getTime())) {
            return `${pad2(asDate.getHours())}:${pad2(asDate.getMinutes())}`;
        }
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
    }
    return String(value);
};

const formatDateDisplay = (value) => {
    if (!value) return "";
    const asDate = new Date(value);
    if (!Number.isNaN(asDate.getTime())) {
        return asDate.toLocaleDateString();
    }
    if (typeof value === "string") {
        const [datePart] = value.split("T");
        return datePart || value;
    }
    return String(value);
};

const CreateBooking = () => {
    const { user } = useAuth();
    const branchId = useMemo(() => user?.chinhanh || user?.machinhanh || null, [user]);

    const [phone, setPhone] = useState("");
    const [customer, setCustomer] = useState(null);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState("");

    const [loadingLookup, setLoadingLookup] = useState(false);
    const [loadingCreatePet, setLoadingCreatePet] = useState(false);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [error, setError] = useState("");

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loadingToday, setLoadingToday] = useState(false);
    const [todayError, setTodayError] = useState("");
    const [refreshTodayKey, setRefreshTodayKey] = useState(0);

    const [petForm, setPetForm] = useState({
        Ten: "",
        NgaySinh: "",
        Loai: "",
        Giong: "",
    });

    const doLookup = async (rawPhone) => {
        const p = normalizePhone10(rawPhone);
        if (p.length !== 10) {
            setError("Số điện thoại phải đúng 10 chữ số");
            setCustomer(null);
            setPets([]);
            setSelectedPetId("");
            return;
        }

        setLoadingLookup(true);
        setError("");
        setCustomer(null);
        setPets([]);
        setSelectedPetId("");

        try {
            const petsData = await clientService.getPetsByPhone(p);
            const list = Array.isArray(petsData) ? petsData : [];
            setPets(list);

            const params = { SoDienThoai: p, NgayHen: new Date() };
            const data = await bookingService.getTodayAppointments(params);
            const appointments = Array.isArray(data) ? data : [];
            setTodayAppointments(appointments);

            if (list.length > 0) {
                const first = list[0];
                setCustomer({
                    makhachhang: first.makhachhang,
                    hovaten: first.hovaten,
                    sodienthoai: first.sodienthoai,
                });
                setSelectedPetId(first.mathucung || "");
                return;
            }

            setCustomer(null);
            setError(
                "Không tìm thấy thú cưng với số điện thoại này. Không thể xác định khách hàng để đăng ký thú cưng (chỉ dùng API hiện có)."
            );
        } catch (e) {
            setError(typeof e === "string" ? e : "Không thể tra cứu khách hàng");
        } finally {
            setLoadingLookup(false);
        }
    };

    const handleCreatePet = async (e) => {
        e.preventDefault();
        if (!customer?.makhachhang) {
            toast.error("Vui lòng tra cứu khách hàng trước");
            return;
        }

        if (!petForm.Ten?.trim()) {
            toast.error("Vui lòng nhập tên thú cưng");
            return;
        }

        setLoadingCreatePet(true);
        try {
            const payload = {
                Ten: petForm.Ten.trim(),
                NgaySinh: petForm.NgaySinh || null,
                Loai: petForm.Loai || null,
                Giong: petForm.Giong || null,
                MaKhachHang: customer.makhachhang,
            };

            const created = await clientService.createPet(payload);

            await doLookup(phone);
            if (created?.MaThuCung) setSelectedPetId(created.MaThuCung);
            setPetForm({ Ten: "", NgaySinh: "", Loai: "", Giong: "" });
            toast.success("Đăng ký thú cưng thành công");
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Đăng ký thú cưng thất bại");
        } finally {
            setLoadingCreatePet(false);
        }
    };

    const handleBookNow = async () => {
        if (!branchId) {
            toast.error("Không xác định được chi nhánh của lễ tân");
            return;
        }

        if (!selectedPetId) {
            toast.error("Vui lòng chọn thú cưng");
            return;
        }

        // const { date, time } = getNowDateTimeStrings();

        setLoadingBooking(true);
        try {
            const date = new Date().toLocaleString('sv-SE');
            await bookingService.createAppointment({
                MaThuCung: selectedPetId,
                MaChiNhanh: branchId,
                NgayDen: date,
                ThoiGianDen: date,
            });

            toast.success("Đặt lịch thành công");
            setRefreshTodayKey((prev) => prev + 1);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Đặt lịch thất bại");
        } finally {
            setLoadingBooking(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Create Booking
                </h1>
                <p className="text-gray-500 mt-2">
                    Lookup customer by phone → select/create pet → book now
                </p>
            </div>

            {/* Phone Lookup */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer phone</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        doLookup(phone);
                    }}
                    className="flex flex-col md:flex-row gap-3"
                >
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(normalizePhone10(e.target.value))}
                            placeholder="0900000001"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            inputMode="numeric"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loadingLookup}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search size={18} />
                        {loadingLookup ? "Looking up..." : "Lookup"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {customer && (
                    <div className="mt-4 flex items-start justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <div>
                            <div className="text-sm text-gray-500">Customer</div>
                            <div className="font-semibold text-gray-900">{customer.hovaten || "(Không có tên)"}</div>
                            <div className="text-sm text-gray-600">{customer.sodienthoai}</div>
                            <div className="text-xs text-gray-400 mt-1">MaKhachHang: {customer.makhachhang}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            Ready
                        </div>
                    </div>
                )}
            </div>
            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <Calendar className="text-indigo-600" size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Hôm nay</h2>
                            <p className="text-sm text-gray-500">Danh sách lịch hẹn trong ngày</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">{todayAppointments.length} lịch hẹn</div>
                </div>

                {loadingToday ? (
                    <div className="text-sm text-gray-500">Đang tải danh sách...</div>
                ) : todayError ? (
                    <div className="text-sm text-red-600">{todayError}</div>
                ) : todayAppointments.length === 0 ? (
                    <div className="text-sm text-gray-500">Chưa có lịch hẹn nào hôm nay.</div>
                ) : (
                    <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                            <div
                                key={appointment.maphieudatlich}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 rounded-2xl border border-gray-100"
                            >
                                <div className="flex flex-col">
                                    <div className="font-semibold text-gray-900">
                                        {formatTimeDisplay(appointment.thoigianden)} &middot; {appointment.tenThuCung || "(Không tên)"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {appointment.tenKhachHang || "Khách lẻ"}
                                        {appointment.sodienthoai ? ` · ${appointment.sodienthoai}` : ""}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {formatDateDisplay(appointment.ngayden)} · {appointment.maphieudatlich}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 md:text-right">
                                    <div>{appointment.tenchinhanh || ""}</div>
                                    <div className="text-xs text-gray-400">{appointment.mathucung}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pets */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Pets</h2>
                    <div className="text-sm text-gray-500">Found: {pets.length}</div>
                </div>

                {pets.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <PawPrint className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <div className="font-medium text-gray-900">No pets</div>
                        <div className="text-sm text-gray-500">Create a new pet below</div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {pets.map((pet) => {
                            const selected = selectedPetId === pet.mathucung;
                            return (
                                <button
                                    type="button"
                                    key={pet.mathucung}
                                    onClick={() => setSelectedPetId(pet.mathucung)}
                                    className={`text-left p-4 rounded-2xl border transition-all ${selected
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <PawPrint className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-gray-900 truncate">{pet.ten}</div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {pet.loai || "(Loại?)"} {pet.giong ? `- ${pet.giong}` : ""}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">MaThuCung: {pet.mathucung}</div>
                                        </div>
                                        {selected && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Pet */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Create new pet</h2>
                    <div className="text-sm text-gray-500">For customer by phone</div>
                </div>

                <form onSubmit={handleCreatePet} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <input
                                value={petForm.Ten}
                                onChange={(e) => setPetForm((p) => ({ ...p, Ten: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="Milo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Birth date</label>
                            <input
                                type="date"
                                value={petForm.NgaySinh}
                                onChange={(e) => setPetForm((p) => ({ ...p, NgaySinh: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                            <input
                                value={petForm.Loai}
                                onChange={(e) => setPetForm((p) => ({ ...p, Loai: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="Dog/Cat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                            <input
                                value={petForm.Giong}
                                onChange={(e) => setPetForm((p) => ({ ...p, Giong: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="Poodle"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loadingCreatePet || !customer?.makhachhang}
                        className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} />
                        {loadingCreatePet ? "Creating..." : "Create pet"}
                    </button>

                    {!customer?.makhachhang && (
                        <div className="text-sm text-gray-500">
                            Cần tra cứu ra ít nhất 1 thú cưng để suy ra khách hàng (MaKhachHang).
                        </div>
                    )}
                </form>
            </div>

            {/* Book Now */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Book now</h2>
                        <p className="text-sm text-gray-500">
                            Uses current time and receptionist branch.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBookNow}
                        disabled={loadingBooking || !selectedPetId}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingBooking ? "Booking..." : "Book now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBooking;