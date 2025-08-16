"use client";

import ProfileData from "./Interfaces";
import { IoLogoLinkedin } from "react-icons/io5";
import { VscGithub } from "react-icons/vsc";

const profileData = <ProfileData>{
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
      description: "Secured first place among 10,000+ participants nationwide",
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
};

export default profileData;
