// Mock Authentication Service
// Simulates backend API calls for authentication

const MOCK_USERS = [
  { id: 1, sodienthoai: "0901234567", matkhau: "client123", role: "client", hovaten: "John Doe" },
  { id: 2, sodienthoai: "0902345678", matkhau: "doctor123", role: "doctor", hovaten: "Dr. Sarah Smith" },
  { id: 3, sodienthoai: "0903456789", matkhau: "admin123", role: "admin", hovaten: "Admin User" },
]

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  // Logout user
  logout: async () => {
    await delay(300)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },
}
