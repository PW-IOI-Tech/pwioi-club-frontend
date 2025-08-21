"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StudentHome from "./StudentHome";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  designation?: string;
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let res;
        try {
          res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
            withCredentials: true,
          });
        } catch (err: any) {
          if (err.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token found");

            const refreshRes = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
              { token:refreshToken },
              { withCredentials: true }
            );
           window.location.reload();
          } else {
            throw err;
          }
        }

        const userData: User = res?.data?.data?.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        fetchUserDetails(userData.id);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchUserDetails = async (userId: string) => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${userId}/basic-details`,
          { withCredentials: true }
        );

        const userDetailsData = res.data.data;
        localStorage.setItem("userDetails", JSON.stringify(userDetailsData));
        setUserDetails(userDetailsData);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUser();
  }, []);

  return <StudentHome userDetails={userDetails} />;
};

export default Page;
