"use client";

import "../../../app/globals.css";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Settings,
  Code,
  ExternalLink,
  Phone,
  Mail,
  House,
  Calendar,
} from "lucide-react";
import Image from "next/image";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const userData = localStorage.getItem("userDetails");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (userData) {
        setUserInfo(JSON.parse(userData));
      }
    }
  }, []);

  const userData = {
    name: user?.name || "",
    email: user?.email || "",
    profilePicture: "/api/placeholder/120/120",
    studentId: userInfo?.enrollmentId || "",
    course: userInfo?.school?.name || "",
    semester: "4th Semester",
    batch: userInfo?.batch?.name || "",
    gpa: "8.7",
    phone: user?.phone || "",
    completionRate: 87,
    coursesEnrolled: 6,
    certificatesEarned: 12,
    rank: "#142",
  };

  // Removed "Academics & Course" from menu items
  const menuItems = [
    { id: "home", label: "Home", icon: House, href: "/dashboard/student" },
    {
      id: "academics",
      label: "Academics & Course",
      icon: GraduationCap,
      href: "/dashboard/student/acads",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Calendar,
      href: "/dashboard/student/attendance",
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      href: "/dashboard/student/help",
    },
  ];

  const getActiveSection = () => {
    if (pathname.includes("/acads")) return "academics";
    if (pathname.includes("/attendance")) return "attendance";
    if (pathname.includes("/help")) return "help";
    return "home";
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
    router.push("/auth/student/login");
  };

  const handleCodingPlatformRedirect = () => {
    window.open("https://your-coding-platform.com", "_blank");
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

      {/* Sidebar */}
      <div
        className={`hidden lg:flex sticky top-0 h-screen bg-slate-900 border-r border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Logo & Toggle */}
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

          {/* Coding Platform Button */}
          <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
            <button
              onClick={handleCodingPlatformRedirect}
              className={`w-full flex items-center hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                isSidebarExpanded ? "space-x-3" : "justify-center"
              }`}
            >
              <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-lg border border-blue-500/20 hover:shadow-xl transition-all duration-200">
                <Code className="w-5 h-5 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="text-left">
                  <p className="text-white font-semibold text-sm tracking-wide">
                    CodeLab Pro
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    Coding Platform
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

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
          </nav>

          {/* Profile Button */}
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
                    {userData.studentId}
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

      {/* Profile Sidebar (Right Side Panel) */}
      <div
        id="profile-sidebar"
        className={`fixed inset-y-0 right-0 z-50 w-80 h-screen bg-white shadow-xl flex flex-col transition-transform duration-400 ease-in-out border-l border-slate-200 ${
          isProfileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold tracking-wide">
                Student Profile
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
                  <p className="text-slate-300 text-[11px] font-medium">
                    {userData.studentId} • {userData.batch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 py-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
              Quick Actions
            </h3>
            <nav className="space-y-2">
              <a
                href="/dashboard/student/profile"
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 shadow-sm hover:shadow-md text-sm cursor-pointer group"
              >
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">My Profile</span>
              </a>

              <button
                onClick={handleCodingPlatformRedirect}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-slate-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md text-sm cursor-pointer group"
              >
                <Code className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Coding Platform</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
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
        </div>

        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-red-50 shadow-t-lg">
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

        <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
          <button
            onClick={handleCodingPlatformRedirect}
            className="w-full flex items-center space-x-3 hover:bg-slate-700/30 hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-lg border border-blue-500/20 hover:shadow-xl transition-all duration-200">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm tracking-wide">
                CodeLab Pro
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Coding Platform
              </p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

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

      {/* Page Content */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <div className="p-1 lg:p-8">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
