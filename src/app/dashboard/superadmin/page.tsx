"use client";

import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  Building,
  Calendar,
  FileText,
  ChevronRight,
  UserCheck,
  School,
  BookOpen,
  Clock,
  Briefcase,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  Shield,
  Flag,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = "John Anderson";

  const managementSections = [
    {
      category: "People Management",
      items: [
        {
          id: "admins",
          label: "Admins Management",
          icon: UserCheck,
          description: "Manage administrative users and permissions",
        },
        {
          id: "teachers",
          label: "Teachers Management",
          icon: Users,
          description: "Handle teacher profiles and assignments",
        },
        {
          id: "students",
          label: "Students Management",
          icon: GraduationCap,
          description: "Student enrollment and academic records",
        },
        {
          id: "mentors",
          label: "Mentors Management",
          icon: Users,
          description: "Mentor assignments and guidance tracking",
        },
      ],
    },
    {
      category: "Academic Structure",
      items: [
        {
          id: "centers",
          label: "Centers Management",
          icon: Building,
          description: "Manage educational centers and locations",
        },
        {
          id: "schools",
          label: "Schools Management",
          icon: School,
          description: "School administration and operations",
        },
        {
          id: "batches",
          label: "Batches Management",
          icon: Users,
          description: "Student batch organization and tracking",
        },
        {
          id: "divisions",
          label: "Divisions Management",
          icon: FileText,
          description: "Academic division structure management",
        },
        {
          id: "semesters",
          label: "Semester Management",
          icon: Calendar,
          description: "Academic calendar and semester planning",
        },
        {
          id: "subjects",
          label: "Subjects Management",
          icon: BookOpen,
          description: "Curriculum and subject administration",
        },
        {
          id: "classes",
          label: "Class Management",
          icon: Clock,
          description: "Class scheduling and timetable management",
        },
        {
          id: "cohorts",
          label: "Cohorts Management",
          icon: Users,
          description: "Student cohort organization and tracking",
        },
      ],
    },
    {
      category: "Operations & Events",
      items: [
        {
          id: "jobs",
          label: "Jobs Management",
          icon: Briefcase,
          description: "Career services and job placement",
        },
        {
          id: "events",
          label: "Events Management",
          icon: CalendarDays,
          description: "Event planning and coordination",
        },
        {
          id: "exams",
          label: "Exams Management",
          icon: ClipboardList,
          description: "Examination scheduling and results",
        },
      ],
    },
    {
      category: "Resources & Governance",
      items: [
        {
          id: "rooms",
          label: "Rooms Management",
          icon: DoorOpen,
          description: "Facility and room allocation management",
        },
        {
          id: "policies",
          label: "Policies Management",
          icon: Shield,
          description: "Institutional policies and compliance",
        },
        {
          id: "flags",
          label: "Flag Management",
          icon: Flag,
          description: "System flags and status indicators",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-lg shadow-sm border border-gray-400 p-6 py-8 mb-8">
          <h1 className="text-2xl md:text-3xl text-white mb-2">
            Welcome back, <br className="block sm:hidden" />
            <span className="font-bold">{userName}</span>!{" "}
            <span className="">👋</span>
          </h1>
          <p className="text-gray-300 leading-tight sm:w-3/4 text-sm">
            Stay connected with your academic community. Share your progress,
            learn from others, and explore new opportunities.
          </p>
        </div>

        <div className="space-y-6">
          {managementSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-1 h-8 bg-gradient-to-b bg-slate-900 rounded-full`}
                ></div>
                <h2 className="text-xl font-bold text-gray-900">
                  {section.category}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 shadow-sm  cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-sm bg-gradient-to-br bg-slate-900 shadow-sm`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors group-hover:scale-110" />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
