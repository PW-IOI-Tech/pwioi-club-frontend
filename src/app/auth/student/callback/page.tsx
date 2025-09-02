"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function StudentCallbackPage() {
  const searchParams = useSearchParams();
     const { setAccessToken } = useAuth();
  const router = useRouter();
  const code = searchParams.get("code");
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (code) {
      axios
        .post(
          `${backendUrl}/api/auth/google`,
          { code, role: "STUDENT" },
          { withCredentials: true }
        )
        .then((res) => {
          const { tokens, user } = res.data;

          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          setAccessToken(tokens.accessToken);
          localStorage.setItem("user", JSON.stringify(user));

          router.push("/dashboard/student");
        })
        .catch((err) => {
          console.error("Login failed:", err.response?.data || err.message);
          router.push("/auth");
        });
    }
  }, [code, backendUrl, router]);

  return <Loader />;
}

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-20 h-20 border-6 border-t-slate-900 border-r-transparent border-b-slate-400 border-l-transparent rounded-full animate-spin"></div>

      <p className="text-slate-600 text-sm mt-6 font-medium">
        Authenticating...
      </p>
    </div>
  );
};
