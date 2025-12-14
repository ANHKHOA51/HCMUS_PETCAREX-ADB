// Mock Authentication Service
// Simulates backend API calls for authentication

const MOCK_USERS = [
  { id: 1, email: "client@petcarex.com", password: "client123", role: "client", name: "John Doe" },
  { id: 2, email: "doctor@petcarex.com", password: "doctor123", role: "doctor", name: "Dr. Sarah Smith" },
  { id: 3, email: "admin@petcarex.com", password: "admin123", role: "admin", name: "Admin User" },
]

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  // Login user
  login: async (email, password) => {
    await delay(800)

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const { password: _, ...userWithoutPassword } = user
    const token = `mock_token_${user.id}_${Date.now()}`

    // Store in localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return { user: userWithoutPassword, token }
  },

  // Register new user
  register: async (email, password, name, role = "client") => {
    await delay(800)

    const existingUser = MOCK_USERS.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("Email already registered")
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      email,
      name,
      role,
    }

    MOCK_USERS.push({ ...newUser, password })

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
