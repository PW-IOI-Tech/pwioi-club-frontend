"use client";
import React, { useState } from "react";
import ProfileHeader from "./Components/ProfileHeader";
import ContactCard from "./Components/ContactCard";
import AcademicHistoryCard from "./Components/AcademicHistoryCard";
import SocialLinksCard from "./Components/SocialLinksCard";

const TeacherProfileBuilder = () => {
  const [contactData, setContactData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader />
            <AcademicHistoryCard />
          </div>

          <div className="space-y-6">
            <SocialLinksCard />
            <ContactCard contactData={contactData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileBuilder;
