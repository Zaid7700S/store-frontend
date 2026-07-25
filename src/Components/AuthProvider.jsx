import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const loadUser = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUserId(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setUserId(decoded.nameid);
      setRole(decoded.role);
    } catch (error) {
      console.error("Invalid token", error);
      setUserId(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userId,role, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);