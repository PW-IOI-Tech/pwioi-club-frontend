"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "./Components/ProfileHeader";
import ContactCard from "./Components/ContactCard";
import SocialLinksCard from "./Components/SocialLinksCard";
import Qualifications from "./Components/Qualifications";
import Experience from "./Components/Experience";
import About from "./Components/About";
import ResearchPapers from "./Components/ResearchPapers";

const TeacherProfileBuilder = () => {
const [aboutDetails, setAboutDetails] = useState<any>(null);


const getAboutDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/basic-details`,
        { withCredentials: true }
      );
      setAboutDetails(response?.data?.data); 
    } catch (error) {
      console.error("Error fetching about details:", error);
    }
  };

  useEffect(() => {
    getAboutDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader />
            <About aboutDetails={aboutDetails} />
            <Qualifications />
            <Experience />
            <ResearchPapers />
          </div>

          <div className="space-y-6">
            <SocialLinksCard aboutDetails={aboutDetails} />
            <ContactCard aboutDetails={aboutDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileBuilder;
