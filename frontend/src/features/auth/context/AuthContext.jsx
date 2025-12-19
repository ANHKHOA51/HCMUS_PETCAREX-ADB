import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (data) => {
    const response = await authService.login(data);

    // Assuming backend returns { user: {...}, token: "..." } structure
    // Adjust if necessary based on actual backend response
    // Logic from LoginPage.jsx:
    // const token = `mock_token...` (it was mock in LoginPage, but real backend returns something?)
    // Let's assume standard response structure from backend/routes/auth.route.js

    // Wait, backend auth.route.js returns:
    // res.json({ message: "Login successful", user: { ... }, role })
    // It does NOT seem to return a token in the real backend yet (checked auth.route.js previously).
    // But LoginPage.jsx was generating a mock token.
    // For now we replicate LoginPage logic: generate mock token if backend doesn't provide one.

    const token = response.token || `mock_token_${response.user.makhachhang || response.user.manhanvien}_${Date.now()}`;

    localStorage.setItem("token", token);
    const userWithRole = { ...response.user, roles: response.roles };
    localStorage.setItem("user", JSON.stringify(userWithRole));
    console.log(userWithRole);
    setUser(userWithRole);
    return userWithRole;
  }, []);

  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    // Backend register returns { message, user, role }

    const token = response.token || `mock_token_${response.user.makhachhang}_${Date.now()}`;
    localStorage.setItem("token", token);

    const userWithRole = { ...response.user, role: "customer" }; // Register is always customer for now
    localStorage.setItem("user", JSON.stringify(userWithRole));

    setUser(userWithRole);
    return userWithRole;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
