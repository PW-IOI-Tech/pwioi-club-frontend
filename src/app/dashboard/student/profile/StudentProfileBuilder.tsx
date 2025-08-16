"use client";

import React, { useState } from "react";
import { Edit3, Plus, ExternalLink, Award } from "lucide-react";
import { VscGithub } from "react-icons/vsc";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";
import profileData from "./Constants/ProfileData";
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
  const calculateCompletionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Basic info (always available)
    completed += 1;
    total += 1;

    // Social links
    total += 1;
    if (profileData.socialLinks.length >= 2) completed += 1;
    else if (profileData.socialLinks.length >= 1) completed += 0.5;

    // Projects
    total += 1;
    if (profileData.projects.length >= 3) completed += 1;
    else if (profileData.projects.length >= 1) completed += 0.5;

    // Certifications
    total += 1;
    if (profileData.certifications.length >= 1) completed += 1;

    // Achievements
    total += 1;
    if (profileData.achievements.length >= 1) completed += 1;

    // Personal details
    total += 1;
    if (
      profileData.personalDetails.personalEmail &&
      profileData.personalDetails.fathersName
    )
      completed += 1;

    // Academic history
    total += 1;
    if (profileData.academicHistory.length >= 1) completed += 1;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  const Progress = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex space-x-3 mb-3 flex-col gap-1">
        <div className="text-sm font-semibold text-gray-700">
          Profile Completion
        </div>
        <div className="text-5xl font-bold text-blue-700">
          {completionPercentage}%
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r to-slate-800 via-slate-900 from-blue-900 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader />
            <ProjectsCard />
            <CertificationsCard />
            <AchievementsCard />
            <AcademicHistoryCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Progress />
            <SocialLinksCard />
            <DegreePartnerCard />
            <ContactCard />
            <OtherDetailsCard />
            <PersonalDetailsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDashboard;
