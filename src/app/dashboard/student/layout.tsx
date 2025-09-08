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
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

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
    logout("/auth/student/login");
  };

  const handleCodingPlatformRedirect = () => {
    if (!isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
    router.push("/codelab");
  };

  const handleNavigationClick = (href: string) => {
    if (!isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }
    router.push(href);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white text-[#12294c] rounded-xl shadow-lg transition-all duration-200 border border-[#12294c]/20 cursor-pointer scale-75"
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 cursor-pointer"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileSidebarOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`hidden lg:flex sticky top-0 h-screen bg-gradient-to-br from-white to-indigo-50 border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Logo & Toggle */}
          <div className="p-5 border-b border-gray-200 flex items-center space-x-3 bg-gray-50">
            <button
              onClick={toggleSidebar}
              className="p-2.5 text-gray-600 hover:bg-[#12294c]/10 hover:text-[#12294c] hover:scale-105 active:scale-95 rounded-xl transition-all duration-200 border border-transparent hover:border-[#12294c]/20 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {isSidebarExpanded && (
              <div className="flex-1 cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <Image
                  src="/PWIOILogoBlack.png"
                  alt="PW IOI Logo"
                  width={130}
                  height={0}
                  className="transition-opacity duration-300"
                />
              </div>
            )}
          </div>

          {/* Coding Platform Button */}
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <button
              onClick={handleCodingPlatformRedirect}
              className={`w-full flex items-center hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                isSidebarExpanded ? "space-x-3" : "justify-center"
              }`}
            >
              <div className="p-3 bg-[#12294c] rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                <Code className="w-5 h-5 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="text-left">
                  <p className="text-gray-900 font-semibold text-sm tracking-wide">
                    CodeLab Pro
                  </p>
                  <p className="text-gray-500 text-xs font-medium">
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
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item.href)}
                  className={`flex items-center space-x-3 px-3 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                      : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      isActive ? "text-[#12294c]" : ""
                    }`}
                  />
                  {isSidebarExpanded && (
                    <span className="font-medium text-sm whitespace-nowrap tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {/* ✅ TOOLTIP REMOVED — no more floating label on hover */}
                </button>
              );
            })}
          </nav>

          {/* Profile Button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              className={`w-full flex items-center text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] hover:scale-105 active:scale-95 py-2.5 px-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border border-transparent hover:border-[#12294c]/10 ${
                !isSidebarExpanded ? "justify-center" : "space-x-3"
              }`}
              onClick={() => {
                if (!isSidebarExpanded) {
                  setIsSidebarExpanded(true);
                }
                setIsProfileSidebarOpen(true);
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#12294c] flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
                <User className="w-4 h-4 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm text-gray-900 tracking-wide truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {userData.studentId}
                  </p>
                </div>
              )}
              {/* ✅ TOOLTIP REMOVED — no more floating label on hover */}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sidebar (Right Side Panel) */}
      <div
        id="profile-sidebar"
        className={`fixed inset-y-0 right-0 z-50 w-80 h-screen bg-white shadow-xl flex flex-col transition-transform duration-400 ease-in-out border-l border-gray-200 ${
          isProfileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#12294c] p-4 text-white relative">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold tracking-wide">
                Student Profile
              </h2>
              <button
                onClick={() => setIsProfileSidebarOpen(false)}
                className="p-1.5 hover:bg-white/10 hover:scale-110 active:scale-95 rounded-lg transition-all duration-200 border border-white/20 flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center shadow-lg border border-white/30 hover:shadow-xl transition-all duration-200">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg tracking-wide">
                    {userData.name}
                  </h3>
                  <p className="text-blue-100 text-xs font-medium">
                    {userData.course}
                  </p>
                  <p className="text-blue-50 text-[11px] font-medium">
                    {userData.studentId} • {userData.batch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 py-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Quick Actions
            </h3>
            <nav className="space-y-2">
              <Link
                href="/dashboard/student/profile"
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-gray-700 hover:bg-[#12294c] hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-[#12294c] shadow-sm hover:shadow-md text-sm cursor-pointer group"
              >
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">My Profile</span>
              </Link>

              <button
                onClick={handleCodingPlatformRedirect}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-gray-700 hover:bg-[#12294c] hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 border border-transparent hover:border-[#12294c] shadow-sm hover:shadow-md text-sm cursor-pointer group"
              >
                <Code className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Coding Platform</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </nav>
          </div>

          <div className="p-4 py-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer">
                <Mail className="w-3.5 h-3.5 text-[#12294c]" />
                <span className="text-sm text-gray-700 font-medium">
                  {userData.email}
                </span>
              </div>
              <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer">
                <Phone className="w-3.5 h-3.5 text-[#12294c]" />
                <span className="text-sm text-gray-700 font-medium">
                  {userData.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:scale-105 active:scale-95 rounded-lg transition-all duration-200 font-semibold border border-red-200 hover:border-red-600 shadow-sm hover:shadow-md text-sm cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 h-screen bg-white border-l border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
            <Image
              src="/PWIOILogoBlack.png"
              alt="PW IOI Logo"
              width={160}
              height={0}
            />
          </div>
        </div>

        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <button
            onClick={handleCodingPlatformRedirect}
            className="w-full flex items-center space-x-3 hover:bg-[#12294c]/5 hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 bg-[#12294c] rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm tracking-wide">
                CodeLab Pro
              </p>
              <p className="text-gray-500 text-xs font-medium">
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
              <button
                key={item.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavigationClick(item.href);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                    : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    isActive ? "text-[#12294c]" : ""
                  }`}
                />
                <span className="font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            className="w-full flex items-center space-x-3 text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] hover:scale-105 active:scale-95 py-3.5 px-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer font-medium border border-transparent hover:border-[#12294c]/10"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsProfileSidebarOpen(true);
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-[#12294c] flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
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
