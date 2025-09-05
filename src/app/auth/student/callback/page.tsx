"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Loader from "../../Loader";

function StudentCallbackContent() {
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

          setTimeout(()=>{
            router.push("/dashboard/student")
          },1000)
        })
        .catch((err) => {
          console.error("Login failed:", err.response?.data || err.message);
          router.push("/");
        });
    }
  }, [code, backendUrl, router, setAccessToken]);

  return <Loader />;
}

export default function StudentCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StudentCallbackContent />
    </Suspense>
  );
}
