"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
          router.push("/auth/student/login");
          return;
        }

        const res = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true,
        });

        if (res?.data?.data?.user?.role) {
          await axios.post(
            `${backendUrl}/api/auth/refresh-token`,
            { token: refreshToken },
            { withCredentials: true }
          );

          const role = res.data?.data?.user?.role;

          if (role === "TEACHER") {
            router.push("/dashboard/teacher");
          } else if (role === "STUDENT") {
            router.push("/dashboard/student");
          } else if (role === "ADMIN") {
            router.push("/dashboard/superadmin/feed");
          } else {
            router.push("/dashboard/superadmin/feed");
          }
        } else {
          router.push("/auth/student/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/student/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to your Dashboard...</p>
    </div>
  );
}
