"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: (redirectPath: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
  }, []);

  const refreshTokenFn = async () => {

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      setAccessToken(data?.tokens?.accessToken);
      localStorage.setItem("accessToken", data?.tokens?.accessToken);

      if (data.refreshToken) {
        setRefreshToken(data?.tokens?.refreshToken);
        localStorage.setItem("refreshToken", data?.tokens?.refreshToken);
      }
    } catch (err) {
      console.error("Token refresh failed", err);
      logout("/");
    }
  };

  useEffect(() => {
    if (!refreshToken) return;

    const intervalId = setInterval(refreshTokenFn, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refreshToken]);

  const logout = async (redirectPath: string): Promise<void> => {
    if (!redirectPath) {
      console.error("Logout failed: redirectPath is required");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userDetails");

      router.push(redirectPath);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
