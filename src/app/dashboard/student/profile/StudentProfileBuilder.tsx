"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProfileHeader from "./Components/ProfileHeader";
import ContactCard from "./Components/ContactCard";
import OtherDetailsCard from "./Components/OtherDetailsCard";
import AcademicHistoryCard from "./Components/AcademicHistoryCard";
import AchievementsCard from "./Components/AchievementsCard";
import CertificationsCard from "./Components/CertificationsCard";
import DegreePartnerCard from "./Components/DegreePartnerCard";
import PersonalDetailsCard from "./Components/PersonalDetailsCard";
import ProjectsCard from "./Components/ProjectsCard";
import SocialLinksCard from "./Components/SocialLinksCard";

const StudentProfileDashboard = () => {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const student = storedUser ? JSON.parse(storedUser) : null;
        if (!student) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${student.id}/contact`,
          { withCredentials: true }
        );

        setContactData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader />
            <ProjectsCard />
            <CertificationsCard />
            <AchievementsCard />
            <AcademicHistoryCard />
          </div>

          <div className="space-y-6">
            <SocialLinksCard />
            <DegreePartnerCard />
            <ContactCard contactData={contactData} />
            <OtherDetailsCard contactData={contactData} />
            <PersonalDetailsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDashboard;
