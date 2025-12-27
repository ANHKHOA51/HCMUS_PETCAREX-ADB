/**
 * Format ngày từ DB sang định dạng VN: DD/MM/YYYY
 */
export const formatDateVN = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

/**
 * Tính số tuổi dựa trên ngày sinh
 */
export const calculateAge = (birthDateString) => {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
