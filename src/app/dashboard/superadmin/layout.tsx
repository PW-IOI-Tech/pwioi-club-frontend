"use client";

import "../../../app/globals.css";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  House,
  Calendar,
  Users,
  School,
  ChevronDown,
  ChartPie,
} from "lucide-react";
import Image from "next/image";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "/api/placeholder/120/120",
    teacherId: "TCHR2024001",
    course: "Computer Science & Engineering",
    phone: "+1 (555) 123-4567",
    ttlStudents: "120",
    ttlBatches: "4",
  };

  const menuItems = [
    { id: "home", label: "Home", icon: House, href: "/dashboard/superadmin" },
    {
      id: "people",
      label: "People Management",
      icon: Users,
      subItems: [
        {
          id: "admins",
          label: "Admins Management",
          href: "/dashboard/superadmin/people/admins",
        },
        {
          id: "teachers",
          label: "Teachers Management",
          href: "/dashboard/superadmin/people/teachers",
        },
        {
          id: "students",
          label: "Students Management",
          href: "/dashboard/superadmin/people/students",
        },
        {
          id: "mentors",
          label: "Mentors Management",
          href: "/dashboard/superadmin/people/mentors",
        },
      ],
    },
    {
      id: "academic",
      label: "Academic Structure",
      icon: GraduationCap,
      subItems: [
        {
          id: "centers",
          label: "Centers Management",
          href: "/dashboard/superadmin/academic/centers",
        },
        {
          id: "schools",
          label: "Schools Management",
          href: "/dashboard/superadmin/academic/schools",
        },
        {
          id: "batches",
          label: "Batches Management",
          href: "/dashboard/superadmin/academic/batches",
        },
        {
          id: "divisions",
          label: "Divisions Management",
          href: "/dashboard/superadmin/academic/divisions",
        },
        {
          id: "semester",
          label: "Semester Management",
          href: "/dashboard/superadmin/academic/semester",
        },
        {
          id: "subjects",
          label: "Subjects Management",
          href: "/dashboard/superadmin/academic/subjects",
        },
        {
          id: "exams",
          label: "Exams Management",
          href: "/dashboard/superadmin/academic/exams",
        },
        {
          id: "classes",
          label: "Class Management",
          href: "/dashboard/superadmin/academic/classes",
        },
        {
          id: "cohorts",
          label: "Cohorts Management",
          href: "/dashboard/superadmin/academic/cohorts",
        },
      ],
    },
    {
      id: "operations",
      label: "Operations & Events",
      icon: Calendar,
      subItems: [
        {
          id: "jobs",
          label: "Jobs Management",
          href: "/dashboard/superadmin/operations/jobs",
        },
        {
          id: "events",
          label: "Events Management",
          href: "/dashboard/superadmin/operations/events",
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      icon: Settings,
      subItems: [
        {
          id: "rooms",
          label: "Rooms Management",
          href: "/dashboard/superadmin/resources/rooms",
        },
        {
          id: "clubs",
          label: "Clubs Management",
          href: "/dashboard/superadmin/resources/clubs",
        },
        {
          id: "policies",
          label: "Policies Management",
          href: "/dashboard/superadmin/resources/policies",
        },
        {
          id: "flags",
          label: "Flag Management",
          href: "/dashboard/superadmin/resources/flags",
        },
        {
          id: "cpr",
          label: "CPR Management",
          href: "/dashboard/superadmin/resources/cpr",
        },
      ],
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ChartPie,
      subItems: [
        {
          id: "attendance",
          label: "Attendance Dashboard",
          href: "/dashboard/superadmin/dashboard/attendance",
        },
        {
          id: "marks",
          label: "Marks Dashboard",
          href: "/dashboard/superadmin/dashboard/marks",
        },
      ],
    },
  ];

  const getActiveSection = () => {
    if (pathname === "/dashboard/superadmin/feed") return "feed";
    if (pathname.includes("/people/")) return "people";
    if (pathname.includes("/academic/")) return "academic";
    if (pathname.includes("/operations/")) return "operations";
    if (pathname.includes("/resources/")) return "resources";
    if (pathname.includes("/dashboard/")) return "dashboard";
    return "home";
  };

  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const activeSection = getActiveSection();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");
      const profileSidebar = document.getElementById("profile-sidebar");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }

      if (
        isProfileSidebarOpen &&
        profileSidebar &&
        !profileSidebar.contains(event.target as Node)
      ) {
        setIsProfileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isProfileSidebarOpen]);

  useEffect(() => {
    if (isMobileMenuOpen || isProfileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isProfileSidebarOpen]);

  const handleLogout = () => {
    console.log("Logout clicked");
    router.push("/auth/login/student");
  };

  const goToFeed = () => {
    router.push("/dashboard/superadmin/feed");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-700/50 cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {(isMobileMenuOpen || isProfileSidebarOpen) && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-all duration-300 cursor-pointer"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileSidebarOpen(false);
          }}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex sticky top-0 h-screen bg-slate-900 border-r border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out max-h-screen overflow-y-scroll ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col w-full">
          <div className="p-5 border-b border-slate-700/50 flex items-center space-x-3 bg-slate-800/50">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-2.5 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105 active:scale-95 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600/50 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {isSidebarExpanded && (
              <div className="flex-1 cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <Image
                  src="/PWIOILogo.webp"
                  alt="PW IOI Logo"
                  width={130}
                  height={0}
                  className="transition-opacity duration-300"
                />
              </div>
            )}
          </div>

          {/* Feed Button */}
          <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
            <button
              onClick={goToFeed}
              className={`w-full flex items-center hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                isSidebarExpanded ? "space-x-3" : "justify-center"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg border border-blue-500/20 hover:shadow-xl transition-all duration-200">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="text-left">
                  <p className="text-white font-semibold text-sm tracking-wide">
                    Feed
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    Social Updates
                  </p>
                </div>
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isExpanded = expandedItems.includes(item.id);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border hover:scale-105 active:scale-95 ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 shadow-lg border-blue-500/30 backdrop-blur-sm"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
                      }`}
                      title={!isSidebarExpanded ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                            isActive ? "text-blue-400" : ""
                          }`}
                        />
                        {isSidebarExpanded && (
                          <span className="font-medium text-sm whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {isSidebarExpanded && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {!isSidebarExpanded && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-slate-600/50 scale-95 group-hover:scale-100">
                          {item.label}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
                        </div>
                      )}
                    </button>

                    {isSidebarExpanded && isExpanded && (
                      <div className="ml-6 space-y-1 border-l border-slate-700/50 pl-4">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.id}
                            href={subItem.href}
                            className={`block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                              isSubItemActive(subItem.href)
                                ? "bg-blue-600/30 text-blue-300 font-medium border border-blue-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                            }`}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 shadow-lg border-blue-500/30 backdrop-blur-sm"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
                  }`}
                  title={!isSidebarExpanded ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      isActive ? "text-blue-400" : ""
                    }`}
                  />
                  {isSidebarExpanded && (
                    <span className="font-medium text-sm whitespace-nowrap tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {!isSidebarExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-slate-600/50 scale-95 group-hover:scale-100">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
                    </div>
                  )}
                </a>
              );
            })}

            <a
              href="/dashboard/superadmin/feed"
              className={`flex items-center space-x-3 px-3 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border ${
                activeSection === "feed"
                  ? "bg-blue-600/20 text-blue-400 shadow-lg border-blue-500/30 backdrop-blur-sm"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
              }`}
              title={!isSidebarExpanded ? "Feed" : undefined}
            >
              <MessageCircle
                className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                  activeSection === "feed" ? "text-blue-400" : ""
                }`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm whitespace-nowrap tracking-wide">
                  Feed
                </span>
              )}
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-slate-600/50 scale-95 group-hover:scale-100">
                  Feed
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
                </div>
              )}
            </a>
          </nav>

          <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/20">
            <button
              className={`w-full flex items-center text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105 active:scale-95 py-2.5 px-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border border-transparent hover:border-slate-600/30 ${
                !isSidebarExpanded ? "justify-center" : "space-x-3"
              }`}
              onClick={() => setIsProfileSidebarOpen(true)}
              title={!isSidebarExpanded ? "Profile" : undefined}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-lg border border-blue-400/20 hover:shadow-xl transition-all duration-200">
                <User className="w-4 h-4 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm text-white tracking-wide truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate font-medium">
                    {userData.teacherId}
                  </p>
                </div>
              )}
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-slate-600/50 scale-95 group-hover:scale-100">
                  Profile
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div
        id="profile-sidebar"
        className={`fixed inset-y-0 right-0 z-50 w-80 h-screen bg-white shadow-xl flex flex-col transition-transform duration-400 ease-in-out border-l border-slate-200 overflow-y-auto ${
          isProfileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold tracking-wide">
                Teacher Profile
              </h2>
              <button
                onClick={() => setIsProfileSidebarOpen(false)}
                className="p-1.5 hover:bg-slate-700/50 hover:scale-110 active:scale-95 rounded-lg transition-all duration-200 border border-slate-600/30 flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg tracking-wide">
                    {userData.name}
                  </h3>
                  <p className="text-blue-200 text-xs font-medium">
                    {userData.course}
                  </p>
                  <p className="text-slate-300 text-[11px] font-medium mt-1">
                    {userData.teacherId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Academic Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Batches
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800 mt-0.5">
                {userData.ttlBatches}
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg p-3 border border-indigo-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Students
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800 mt-0.5">
                {userData.ttlStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 py-6 bg-gradient-to-b from-white to-slate-50">
          <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Quick Actions
          </h3>
          <nav className="space-y-2">
            <a
              href="/dashboard/teacher/profile"
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 shadow-sm hover:shadow-md text-sm cursor-pointer group"
            >
              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">My Profile</span>
            </a>

            <a
              href="/dashboard/superadmin/feed"
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200 shadow-sm hover:shadow-md text-sm cursor-pointer group"
              onClick={(e) => {
                e.preventDefault();
                router.push("/dashboard/superadmin/feed");
              }}
            >
              <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">View Feed</span>
            </a>
          </nav>
        </div>

        <div className="p-4 py-6 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Contact Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white/70 transition-all duration-200 cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium">
                {userData.email}
              </span>
            </div>
            <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white/70 transition-all duration-200 cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium">
                {userData.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-red-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-500 hover:to-red-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 font-semibold border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md text-sm cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 h-screen bg-slate-900 border-l border-slate-700/50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
            <Image
              src="/PWIOILogo.webp"
              alt="PW IOI Logo"
              width={160}
              height={0}
            />
          </div>
        </div>

        {/* Mobile Feed Button */}
        <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
          <button
            onClick={goToFeed}
            className="w-full flex items-center space-x-3 hover:bg-slate-700/30 hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-xl shadow-lg border border-green-500/20 hover:shadow-xl transition-all duration-200">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm tracking-wide">
                Feed
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Social Updates
              </p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isExpanded = expandedItems.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (hasSubItems) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border hover:scale-105 active:scale-95 ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 shadow-lg border-blue-500/30 backdrop-blur-sm"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                          isActive ? "text-blue-400" : ""
                        }`}
                      />
                      <span className="font-medium tracking-wide">
                        {item.label}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-8 space-y-1 border-l border-slate-700/50 pl-4">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.id}
                          href={subItem.href}
                          className={`block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                            isSubItemActive(subItem.href)
                              ? "bg-blue-600/30 text-blue-300 font-medium border border-blue-500/20"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                          }`}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 shadow-lg border-blue-500/30 backdrop-blur-sm"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    isActive ? "text-blue-400" : ""
                  }`}
                />
                <span className="font-medium tracking-wide">{item.label}</span>
              </a>
            );
          })}

          {/* Mobile Feed Link */}
          <a
            href="/dashboard/superadmin/feed"
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border ${
              activeSection === "feed"
                ? "bg-green-600/20 text-green-400 shadow-lg border-green-500/30 backdrop-blur-sm"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent hover:border-slate-600/30"
            }`}
          >
            <MessageCircle
              className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                activeSection === "feed" ? "text-green-400" : ""
              }`}
            />
            <span className="font-medium tracking-wide">Feed</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/20">
          <button
            className="w-full flex items-center space-x-3 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105 active:scale-95 py-3.5 px-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer font-medium border border-transparent hover:border-slate-600/30"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsProfileSidebarOpen(true);
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-lg border border-blue-400/20 hover:shadow-xl transition-all duration-200">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <div
          className={`p-1 lg:p-8 ${
            isSidebarExpanded ? "max-w-5xl" : "max-w-6xl"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
