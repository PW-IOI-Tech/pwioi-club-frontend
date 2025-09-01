"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";

interface JwtPayload {
  exp: number; // standard expiry field (in seconds)
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Routes that don’t require auth
  const publicRoutes = [
    "/auth/student/login",
    "/auth/teacher/login",
    "/auth/admin/login",
    "/auth/student/callback",
    "/auth/teacher/callback",
    "/auth/admin/callback",
  ];

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    if (!publicRoutes.includes(pathname)) {
      router.push("/login");
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return logout();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        }
      );

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      scheduleRefresh(data.accessToken);
    } catch (err) {
      logout();
    }
  };

  const scheduleRefresh = (token: string | null) => {
    if (!token) return;

    const decoded: JwtPayload = jwtDecode(token);
    const expiryTime = decoded.exp * 1000; // convert seconds → ms
    const now = Date.now();

    const refreshTime = expiryTime - now - 60 * 1000; // refresh 1 min early

    // clear old timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (refreshTime > 0) {
      refreshTimeoutRef.current = setTimeout(refreshAccessToken, refreshTime);
    } else {
      refreshAccessToken();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setAccessToken(storedToken);
    if (storedToken) {
      scheduleRefresh(storedToken);
    } else if (!publicRoutes.includes(pathname)) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
