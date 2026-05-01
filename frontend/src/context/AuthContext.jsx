import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("sed_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("sed_token");
      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("sed_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("sed_token");
        localStorage.removeItem("sed_user");
        setUser(null);
      } finally {
        setBooting(false);
      }
    }

    loadUser();
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("sed_token", data.token);
    localStorage.setItem("sed_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("sed_token", data.token);
    localStorage.setItem("sed_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("sed_token");
    localStorage.removeItem("sed_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, booting, isAdmin: user?.role === "admin", login, logout, register }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
