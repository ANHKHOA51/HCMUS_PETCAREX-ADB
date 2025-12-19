import { useState, useCallback, useEffect } from "react";
import { clientService } from "../services/clientService";
// import { petService } from "../../../services/petService"; // Removed
import { useAuth } from "../../auth/hooks/useAuth"; // Assuming we use auth context now

export const useClientPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // If converted to AuthContext, otherwise fallback to localStorage like before

  const loadPets = useCallback(async () => {
    // Fallback if not using AuthContext globally yet or user not set
    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.sodienthoai) { // Using sodienthoai from 'user' object structure seen in Login
      // Try phone from user object
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Use phone number for lookup as preferred by user request
      const data = await clientService.getPetsByUserId(currentUser.makhachhang);
      setPets(data);
    } catch (err) {
      console.error("Failed to load pets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const addPet = async (petData) => {
    // Ensure we send MaKhachHang if not in data, derived from current user context
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    const payload = { ...petData, MaKhachHang: currentUser?.makhachhang };

    // Map frontend fields (ten, loai, giong, ngaysinh) to backend expected defaults (Ten, Loai, Giong, NgaySinh)
    // The form uses: ten, loai, giong, ngaysinh
    // Backend expects: Ten, Loai, Giong, NgaySinh
    const backendPayload = {
      Ten: payload.ten,
      Loai: payload.loai,
      Giong: payload.giong,
      NgaySinh: payload.ngaysinh,
      MaKhachHang: payload.MaKhachHang
      // Note: Weight/CanNang handling might be missing in backend SP, but we send what we can.
    };

    await clientService.createPet(backendPayload);
    await loadPets();
  };

  const updatePet = async (id, petData) => {
    const backendPayload = {
      Ten: petData.ten,
      Loai: petData.loai,
      Giong: petData.giong,
      NgaySinh: petData.ngaysinh,
    };
    await clientService.updatePet(id, backendPayload);
    await loadPets();
  };

  const deletePet = async (id) => {
    await clientService.deletePet(id);
    await loadPets();
  };

  return { pets, loading, error, loadPets, addPet, updatePet, deletePet };
};
