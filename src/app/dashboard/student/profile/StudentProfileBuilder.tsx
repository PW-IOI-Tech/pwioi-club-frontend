"use client";

import React, { useState } from "react";
import {
  User,
  Edit3,
  Plus,
  Calendar,
  ExternalLink,
  Award,
  GraduationCap,
  Building,
  UserCheck,
  School,
  Code,
} from "lucide-react";
import { VscGithub } from "react-icons/vsc";
import { IoLogoLinkedin } from "react-icons/io";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";

// Define types for better type safety
interface SocialLink {
  platform: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  name: string;
  organisation: string;
  startDate: string;
  endDate: string;
  link: string;
}

interface Achievement {
  title: string;
  description: string;
  organisation: string;
  startDate: string;
}

interface AcademicHistory {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade: number;
  startDate: string;
  endDate: string;
}

interface ProfileData {
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    enrollmentId: string;
    centerId: string;
    schoolId: string;
    batchId: string;
    semesterId: string;
    divisionId: string;
    profileImage: string | null;
  };
  degreePartner: {
    collegeName: string;
    degreeName: string;
    specialization: string;
    startDate: string;
    endDate: string;
  };
  personalDetails: {
    personalEmail: string;
    fathersName: string;
    mothersName: string;
    fathersContact: string;
    mothersContact: string;
    fathersOccupation: string;
    mothersOccupation: string;
  };
  socialLinks: SocialLink[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  academicHistory: AcademicHistory[];
}

const StudentProfileDashboard = () => {
  // Utility function for consistent date formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [profileData] = useState<ProfileData>({
    basicInfo: {
      name: "Nishchay Bhatia",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      gender: "Male",
      enrollmentId: "STU2024001",
      centerId: "NYC001",
      schoolId: "CS001",
      batchId: "BATCH2024",
      semesterId: "SEM4",
      divisionId: "DIV-A",
      profileImage: null,
    },
    degreePartner: {
      collegeName: "Institute of Innovation",
      degreeName: "Bachelor of Technology",
      specialization: "Computer Science & Engineering",
      startDate: "2024-08-01",
      endDate: "2028-05-31",
    },
    personalDetails: {
      personalEmail: "john.personal@gmail.com",
      fathersName: "Robert Doe",
      mothersName: "Sarah Doe",
      fathersContact: "+1 (555) 123-4560",
      mothersContact: "+1 (555) 123-4561",
      fathersOccupation: "Software Engineer",
      mothersOccupation: "Teacher",
    },
    socialLinks: [
      {
        platform: "GitHub",
        link: "https://github.com/johndoe",
        icon: VscGithub,
      },
      {
        platform: "LinkedIn",
        link: "https://linkedin.com/in/johndoe",
        icon: IoLogoLinkedin,
      },
    ],
    projects: [
      {
        name: "E-Commerce Platform",
        description:
          "Full-stack e-commerce solution with payment integration and admin dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        githubLink: "https://github.com/johndoe/ecommerce",
        liveLink: "https://ecommerce-demo.com",
        startDate: "2024-01-15",
        endDate: "2024-03-20",
      },
    ],
    certifications: [
      {
        name: "AWS Cloud Practitioner",
        organisation: "Amazon Web Services",
        startDate: "2024-02-01",
        endDate: "2027-02-01",
        link: "https://aws.amazon.com/certification",
      },
    ],
    achievements: [
      {
        title: "National Coding Championship Winner",
        description:
          "Secured first place among 10,000+ participants nationwide",
        organisation: "TechFest India",
        startDate: "2024-03-15",
      },
    ],
    academicHistory: [
      {
        institution: "City High School",
        degree: "High School Diploma",
        fieldOfStudy: "Science (PCM)",
        grade: 92.5,
        startDate: "2020-04-01",
        endDate: "2022-03-31",
      },
      {
        institution: "Metro College",
        degree: "Intermediate",
        fieldOfStudy: "Physics, Chemistry, Mathematics",
        grade: 88.5,
        startDate: "2018-04-01",
        endDate: "2020-03-31",
      },
    ],
  });

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

  const ProfileHeader = () => (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-white">
                {profileData.basicInfo.name}
              </h1>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 space-x-8 space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="font-medium">ID:</span>
                <span>{profileData.basicInfo.enrollmentId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Center:</span>
                <span>{profileData.basicInfo.centerId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4 text-blue-600" />
                <span className="font-medium">School:</span>
                <span>{profileData.basicInfo.schoolId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Batch:</span>
                <span>{profileData.basicInfo.batchId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Semester:</span>
                <span>{profileData.basicInfo.semesterId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Division:</span>
                <span>{profileData.basicInfo.divisionId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

  const ContactCard = () => (
    <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
            <IoMdMail className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
              Email
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {profileData.basicInfo.email}
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
            <FaPhoneAlt className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
              Phone
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {profileData.basicInfo.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OtherDetailsCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Other Details</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
            <FaLocationDot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
              Address
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {profileData.basicInfo.address}
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
            <FaUser className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
              Gender
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {profileData.basicInfo.gender}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DegreePartnerCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Degree Partner</h3>
      </div>
      <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
          <RiGraduationCapFill className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900">
            {profileData.degreePartner.collegeName}
          </h4>
          <p className="font-semibold text-xs text-slate-800 mb-2 pb-2 mr-4 border-b-[0.25px] border-b-slate-700">
            {profileData.degreePartner.degreeName}
          </p>
          <p className="text-sm text-slate-700 mb-2 leading-tight">
            {profileData.degreePartner.specialization}
          </p>
          <p className="text-xs rounded-full px-4 py-1 bg-blue-800 text-white w-fit mt-3">
            {new Date(profileData.degreePartner.startDate).getFullYear()} -{" "}
            {new Date(profileData.degreePartner.endDate).getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );

  const SocialLinksCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {profileData.socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
                  <IconComponent className="text-white w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {social.platform}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer mt-1">
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto" />
          <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
            Add Social Link
          </span>
        </button>
      </div>
    </div>
  );

  const ProjectsCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">Projects</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            {profileData.projects.length}/4
          </span>
        </div>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileData.projects.map((project, index) => (
          <div
            key={index}
            className="p-5 hover:shadow-md hover:border-blue-300 transition-all bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-slate-900">{project.name}</h4>
              <button className="text-gray-400 hover:text-blue-700 p-1 cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-700 mb-4 leading-tight">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-slate-200 text-gray-600 text-xs font-medium rounded">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 mb-4">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </div>
            <div className="flex items-center space-x-2">
              <button className="h-8 w-8 rounded-full bg-slate-300 p-1 flex items-center justify-center cursor-pointer group">
                <VscGithub className="text-slate-900 w-4 h-4 group-hover:scale-110 duration-100 ease-in-out transition-transform" />
              </button>
              <button className="h-8 w-8 rounded-full bg-slate-300 p-1 flex items-center justify-center cursor-pointer group">
                <ExternalLink className="text-slate-900 w-4 h-4 group-hover:scale-110 duration-100 ease-in-out transition-transform" />
              </button>
            </div>
          </div>
        ))}
        {profileData.projects.length < 4 && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group flex items-center justify-center flex-col">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto" />
            <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
              Add New Project
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const CertificationsCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            {profileData.certifications.length}/3
          </span>
        </div>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {profileData.certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:shadow-md hover:border-blue-800 transition-all bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 p-1 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{cert.name}</h4>
                <p className="text-sm text-slate-800">{cert.organisation}</p>
                <p className="text-xs text-slate-700">
                  {new Date(cert.startDate).getFullYear()} -{" "}
                  {new Date(cert.endDate).getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-500 p-1 cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {profileData.certifications.length < 3 && (
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
            <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
              Add Certification
            </span>
          </button>
        )}
      </div>
    </div>
  );

  const AchievementsCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {profileData.achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4  hover:shadow-md hover:border-blue-900 transition-all bg-slate-900 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
          >
            <div className="h-12 w-12 rounded-full bg-slate-900 p-1 flex items-center justify-center">
              <FaStar className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-slate-800">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-slate-700">
                    {achievement.organisation} •{" "}
                    {new Date(achievement.startDate).getFullYear()}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-500 p-1 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto" />
          <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
            Add Achievement
          </span>
        </button>
      </div>
    </div>
  );

  const PersonalDetailsCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Father's Name
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.fathersName}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Mother's Name
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.mothersName}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Contact
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.fathersContact}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Contact
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.mothersContact}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Occupation
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.fathersOccupation}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Occupation
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {profileData.personalDetails.mothersOccupation}
          </p>
        </div>
      </div>
    </div>
  );

  const AcademicHistoryCard = () => (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Academic History</h3>
        <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {profileData.academicHistory.map((edu, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 transition-all bg-slate-900 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
              <RiGraduationCapFill className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {edu.degree}
                  </h4>
                  <p className="text-sm text-slate-800">{edu.institution}</p>
                  <p className="text-sm text-slate-700 font-medium mb-3">
                    {edu.fieldOfStudy}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="text-xs rounded-full px-4 py-1 bg-slate-900 text-white w-fit ">
                      Grade: {edu.grade}%
                    </span>
                    <span className="text-xs rounded-full px-4 py-1 bg-slate-900 text-white w-fit ">
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {new Date(edu.endDate).getFullYear()}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500 p-1 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto" />
          <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
            Add Education
          </span>
        </button>
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
