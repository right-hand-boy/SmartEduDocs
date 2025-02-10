import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import { toast } from "react-toastify";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);
  const fetchUserByToken = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/validate-token",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return { success: true };
      } else {
        handleInvalidToken(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      handleInvalidToken();
    } finally {
      setLoading(false);
    }
    return { success: false };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserByToken(token);
    } else {
      setLoading(false);
    }
  }, []);
  const handleInvalidToken = (message) => {
    if (message === "Token has expired") {
      //   toast.error("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }
    localStorage.removeItem("token");
    navigate("/login");
  };
  const userLogged = async (userData) => {
    setUser(userData);
  };
  const logout = async () => {
    await navigate("/");
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        userLogged,
        logout,
      }}
    >
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
