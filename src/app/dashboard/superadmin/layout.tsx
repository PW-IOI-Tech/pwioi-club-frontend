"use client";

import "../../../app/globals.css";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  Settings,
  MessageCircle,
  House,
  Calendar,
  Users,
  ChevronDown,
  ChartPie,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: House,
      href: "/dashboard/superadmin/home",
    },
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
          href: "/dashboard/superadmin/academic/divisions",
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
          id: "marks",
          label: "Marks Management",
          href: "/dashboard/superadmin/academic/marks",
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
        {
          id: "cpr",
          label: "CPR Dashboard",
          href: "/dashboard/superadmin/dashboard/cpr",
        },
      ],
    },
  ];

  const getActiveSection = () => {
    if (pathname === "/dashboard/superadmin") return "feed";
    if (pathname === "/dashboard/superadmin/home") return "home";
    if (pathname.includes("/people/")) return "people";
    if (pathname.includes("/academic/")) return "academic";
    if (pathname.includes("/operations/")) return "operations";
    if (pathname.includes("/resources/")) return "resources";
    if (pathname.includes("/dashboard/")) return "dashboard";
    return null;
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

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout("/auth/admin/login");
  };

  const goToFeed = () => {
    router.push("/dashboard/superadmin");
  };

  const goToHome = () => {
    router.push("/dashboard/superadmin/home");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-[#12294c] text-white rounded-xl shadow-lg hover:bg-[#12294c]/90 hover:scale-105 active:scale-95 transition-all duration-200 border border-[#12294c]/20 cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex sticky top-0 h-screen bg-gradient-to-br from-white to-indigo-50 border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out max-h-screen overflow-y-scroll ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-200 flex items-center space-x-3 bg-gray-50">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
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

          {/* Feed Button */}
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <button
              onClick={goToFeed}
              className={`w-full flex items-center hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                isSidebarExpanded ? "space-x-3" : "justify-center"
              } ${
                activeSection === "feed"
                  ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                  : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
              }`}
            >
              <div className="p-3 bg-[#12294c] rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="text-left">
                  <p className="text-gray-900 font-semibold text-sm tracking-wide">
                    Feed
                  </p>
                  <p className="text-gray-500 text-xs font-medium">
                    Social Updates
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isExpanded = expandedItems.includes(item.id);
              const hasSubItems = !!item.subItems?.length;

              if (hasSubItems) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border hover:scale-105 active:scale-95 ${
                        isActive
                          ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                          : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
                      }`}
                      title={!isSidebarExpanded ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3">
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
                      </div>
                      {isSidebarExpanded && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {!isSidebarExpanded && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-600/50 scale-95 group-hover:scale-100">
                          {item.label}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-600/50 rotate-45"></div>
                        </div>
                      )}
                    </button>

                    {isSidebarExpanded && isExpanded && item.subItems && (
                      <div className="ml-6 space-y-1 border-l border-[#12294c]/10 pl-4">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.id}
                            href={subItem.href}
                            className={`block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                              isSubItemActive(subItem.href)
                                ? "bg-[#12294c]/10 text-[#12294c] font-medium border border-[#12294c]/20"
                                : "text-gray-600 hover:text-[#12294c] hover:bg-[#12294c]/5"
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
                      ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                      : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
                  }`}
                  title={!isSidebarExpanded ? item.label : undefined}
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
                  {!isSidebarExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-600/50 scale-95 group-hover:scale-100">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-600/50 rotate-45"></div>
                    </div>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] hover:scale-105 active:scale-95 py-2.5 px-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative border border-transparent hover:border-[#12294c]/10 ${
                isSidebarExpanded ? "space-x-3" : "justify-center"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
                <LogOut className="w-4 h-4 text-white" />
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-gray-900 tracking-wide">
                    Sign Out
                  </p>
                </div>
              )}
              {!isSidebarExpanded && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-600/50 scale-95 group-hover:scale-100">
                  Sign Out
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-600/50 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
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
              src="/PWIOILogo.webp"
              alt="PW IOI Logo"
              width={160}
              height={0}
            />
          </div>
        </div>

        {/* Feed Button - Mobile */}
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <button
            onClick={goToFeed}
            className={`w-full flex items-center space-x-3 hover:scale-105 active:scale-95 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
              activeSection === "feed"
                ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
            }`}
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm tracking-wide">
                Feed
              </p>
              <p className="text-gray-500 text-xs font-medium">
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
            const hasSubItems = !!item.subItems?.length;

            if (hasSubItems) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border hover:scale-105 active:scale-95 ${
                      isActive
                        ? "bg-[#12294c]/10 text-[#12294c] shadow-md border-[#12294c]/20 backdrop-blur-sm"
                        : "text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] border-transparent hover:border-[#12294c]/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                          isActive ? "text-[#12294c]" : ""
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

                  {isExpanded && item.subItems && (
                    <div className="ml-8 space-y-1 border-l border-[#12294c]/10 pl-4">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.id}
                          href={subItem.href}
                          className={`block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                            isSubItemActive(subItem.href)
                              ? "bg-[#12294c]/10 text-[#12294c] font-medium border border-[#12294c]/20"
                              : "text-gray-600 hover:text-[#12294c] hover:bg-[#12294c]/5"
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
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-gray-600 hover:bg-[#12294c]/5 hover:text-[#12294c] hover:scale-105 active:scale-95 py-3.5 px-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer font-medium border border-transparent hover:border-[#12294c]/10"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span>Sign Out</span>
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
