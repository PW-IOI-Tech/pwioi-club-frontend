"use client";

import { useEffect, useState } from "react";
import Feed from "./Feed";

const mockUser = {
  id: "usr_123",
  email: "student@university.edu",
  name: "Alice Johnson",
  role: "Student",
};

const mockUserDetails = {
  name: "Alice Johnson",
  enrollmentId: "E2020001",
  batch: { name: "Batch of 2024" },
  school: { name: "School of Computer Science" },
};

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    // Simulate loading user from localStorage or session
    setUser(mockUser);
    setUserDetails(mockUserDetails);
  }, []);

  if (!user || !userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return <Feed user={user} userDetails={userDetails} />;
};

export default Page;
