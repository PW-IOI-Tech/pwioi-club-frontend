"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StudentHome from './StudentHome'


interface User {
  sub: string;
  email: string;
  name: string;
  role: string;
  designation?: string;
}

const page = () => {
    const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          withCredentials: true, 
        });

        const userData = res.data.data.user;

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <StudentHome />
  )
}

export default page

