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
  // Login user
  login: async (sodienthoai, matkhau) => {
    await delay(800)

    const user = MOCK_USERS.find((u) => u.sodienthoai === sodienthoai && u.matkhau === matkhau)

    if (!user) {
      throw new Error("Invalid phone number or password")
    }

    const { matkhau: _, ...userWithoutPassword } = user
    const token = `mock_token_${user.id}_${Date.now()}`

    // Store in localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return { user: userWithoutPassword, token }
  },

  // Register new user
  register: async (sodienthoai, matkhau, hovaten, role = "client") => {
    await delay(800)

    const existingUser = MOCK_USERS.find((u) => u.sodienthoai === sodienthoai)
    if (existingUser) {
      throw new Error("Phone number already registered")
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      sodienthoai,
      hovaten,
      role,
    }

    MOCK_USERS.push({ ...newUser, matkhau })

    const token = `mock_token_${newUser.id}_${Date.now()}`

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(newUser))

    return { user: newUser, token }
  },

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
