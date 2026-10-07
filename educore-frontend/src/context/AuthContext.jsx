import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("educoreToken")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("educoreUser");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);

    const newToken = response.data.token;
    const newUser = response.data.user;

    if (!newToken || !newUser) {
      throw new Error("Invalid login response.");
    }

    localStorage.setItem("educoreToken", newToken);
    localStorage.setItem("educoreUser", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    return newUser;
  }

  function logout() {
    localStorage.removeItem("educoreToken");
    localStorage.removeItem("educoreUser");

    setToken(null);
    setUser(null);
  }

  function hasPermission(permission) {
    return user?.permissions?.some(
      (item) => item.code === permission
    );
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };