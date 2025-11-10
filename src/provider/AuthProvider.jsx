"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "@/context/AuthContext";

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const addAuthInfo = useCallback((data) => {
    setAuthInfo(data);
    localStorage.setItem("authInfo", JSON.stringify(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authInfo");
    setAuthInfo(null);
    toast.success("Successfully logged out");
  };

  useEffect(() => {
    try {
      const localAuthInfo = localStorage.getItem("authInfo");
      if (localAuthInfo) {
        setAuthInfo(JSON.parse(localAuthInfo));
      }
    } catch (error) {
      console.error("Error parsing stored auth info:", error);
      localStorage.removeItem("authInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    authInfo,
    addAuthInfo,
    handleLogout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
