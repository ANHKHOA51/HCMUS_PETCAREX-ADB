import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { authService } from "../features/auth/services/authService"
import { LogOut, Calendar, PawPrint, Stethoscope, BarChart3, Menu, X, Box, MapPin, ChevronDown } from "lucide-react"
import { useState } from "react"
import { ROLES } from "../features/auth/constants/roles"

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Normalize user roles to an array
  const userRoles = Array.isArray(user?.roles)
    ? user.roles
    : (user?.role ? [user.role] : []);

  const [currentRole, setCurrentRole] = useState(userRoles[0] || ROLES.CUSTOMER)

  const handleLogout = async () => {
    await authService.logout()
    navigate("/login")
  }

  // Navigation items based on role
  const getNavItems = () => {
    switch (currentRole) {
      case ROLES.CUSTOMER:
        return [
          { path: "/client/dashboard", icon: PawPrint, label: "My Pets" },
          { path: "/client/booking", icon: Calendar, label: "Book Appointment" },
          { path: "/client/products", icon: Box, label: "Products" },
          { path: "/client/branches", icon: MapPin, label: "Branches" },
        ]
      case ROLES.DOCTOR:
        return [{ path: "/doctor/exam", icon: Stethoscope, label: "Patient Examination" }, ]
      case ROLES.MANAGER:
        return [{ path: "/manager/dashboard", icon: BarChart3, label: "Dashboard" }]
      case ROLES.RECEPTIONIST:
        return [{ path: "/receptionist/dashboard", icon: Calendar, label: "Reception" }]
      default:
        return []
    }
  }

  const navItems = getNavItems()
  const isCustomer = userRoles.includes(ROLES.CUSTOMER)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - Fixed on mobile, static on desktop */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 shrink-0 h-full transform transition-transform duration-200 ${sidebarOpen
          ? "translate-x-0 fixed inset-y-0 left-0 z-50 lg:static lg:z-auto"
          : "-translate-x-full fixed inset-y-0 left-0 z-50 lg:translate-x-0 lg:static lg:z-auto"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600 leading-none">PETCAREX</span>
            </div>
            {!isCustomer && (
              <div className="mt-1">
                <select
                  value={currentRole}
                  onChange={(e) => {
                    setCurrentRole(e.target.value);
                  }}
                  className="text-xs font-semibold text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer appearance-none uppercase tracking-wider outline-none"
                >
                  {userRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{user?.hovaten?.charAt(0) || user?.name?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.hovaten || user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{Array.isArray(user?.roles) ? user.roles.join(", ") : user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">PETCAREX</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default MainLayout
