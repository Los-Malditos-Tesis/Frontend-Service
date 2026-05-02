import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/get-me");
        setUser(data?.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // LOGIN
  const login = async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);

      localStorage.setItem("token", data?.data?.content);
      setUser(data?.data);

      toast.success("Bienvenido");
    } catch (error) {
      toast.error("Credenciales inválidas");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);