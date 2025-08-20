"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StudentHome from "./StudentHome";

interface User {
  sub: string;
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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
          { withCredentials: true }
        );

        const userData: User = res.data.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        fetchUserDetails(userData.sub);
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

  return <StudentHome />;
};

export default Page;
