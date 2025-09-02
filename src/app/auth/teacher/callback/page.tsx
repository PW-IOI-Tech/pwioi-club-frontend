"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { Loader } from "../../student/callback/page";

export default function StudentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (code) {
      axios
        .post(
          `${backendUrl}/api/auth/google`,
          { code, role: "TEACHER" },
          { withCredentials: true }
        )
        .then((res) => {
          const { tokens, user } = res.data;

          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          router.push("/dashboard/teacher");
        })
        .catch((err) => {
          console.error("Login failed:", err.response?.data || err.message);
          router.push("/auth");
        });
    }
  }, [code, backendUrl, router]);

  return <Loader />;
}
