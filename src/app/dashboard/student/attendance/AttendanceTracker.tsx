"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  X,
  Filter,
  Search,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Award,
} from "lucide-react";

interface AttendanceData {
  semester: string;
  overall: number;
  attended: number;
  total: number;
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  attendance: number;
  attended: number;
  total: number;
  monthlyData: MonthlyData[];
  dailyData: DailyData[];
}

interface MonthlyData {
  month: string;
  percentage: number;
  attended: number;
  total: number;
}

interface DailyData {
  date: string;
  status: "present" | "absent" | "late";
  topic?: string;
}

const AttendanceTracker: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState("Semester 6");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalView, setModalView] = useState<"monthly" | "daily">("monthly");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "late"
  >("all");

  // Dummy data
  const attendanceData: Record<string, AttendanceData> = {
    "Semester 6": {
      semester: "Semester 6",
      overall: 78.5,
      attended: 157,
      total: 200,
      courses: [
        {
          id: "CS301",
          name: "Data Structures & Algorithms",
          code: "CS301",
          attendance: 85.2,
          attended: 23,
          total: 27,
          monthlyData: [
            { month: "January", percentage: 88.9, attended: 8, total: 9 },
            { month: "February", percentage: 81.8, attended: 9, total: 11 },
            { month: "March", percentage: 85.7, attended: 6, total: 7 },
          ],
          dailyData: [
            { date: "2024-03-15", status: "present", topic: "Binary Trees" },
            {
              date: "2024-03-14",
              status: "present",
              topic: "Graph Algorithms",
            },
            {
              date: "2024-03-13",
              status: "absent",
              topic: "Dynamic Programming",
            },
            {
              date: "2024-03-12",
              status: "present",
              topic: "Sorting Algorithms",
            },
            { date: "2024-03-11", status: "late", topic: "Hash Tables" },
            { date: "2024-03-10", status: "present", topic: "AVL Trees" },
            { date: "2024-03-08", status: "present", topic: "B+ Trees" },
            { date: "2024-03-07", status: "absent", topic: "Red-Black Trees" },
          ],
        },
        {
          id: "CS302",
          name: "Database Management Systems",
          code: "CS302",
          attendance: 72.0,
          attended: 18,
          total: 25,
          monthlyData: [
            { month: "January", percentage: 75.0, attended: 6, total: 8 },
            { month: "February", percentage: 70.0, attended: 7, total: 10 },
            { month: "March", percentage: 71.4, attended: 5, total: 7 },
          ],
          dailyData: [
            { date: "2024-03-15", status: "absent", topic: "Normalization" },
            { date: "2024-03-13", status: "present", topic: "SQL Joins" },
            { date: "2024-03-12", status: "late", topic: "Query Optimization" },
            { date: "2024-03-11", status: "present", topic: "Indexing" },
            { date: "2024-03-08", status: "present", topic: "ACID Properties" },
            { date: "2024-03-07", status: "absent", topic: "Transactions" },
            {
              date: "2024-03-06",
              status: "present",
              topic: "Concurrency Control",
            },
          ],
        },
        {
          id: "CS303",
          name: "Operating Systems",
          code: "CS303",
          attendance: 91.3,
          attended: 21,
          total: 23,
          monthlyData: [
            { month: "January", percentage: 100.0, attended: 8, total: 8 },
            { month: "February", percentage: 88.9, attended: 8, total: 9 },
            { month: "March", percentage: 83.3, attended: 5, total: 6 },
          ],
          dailyData: [
            {
              date: "2024-03-15",
              status: "present",
              topic: "Process Scheduling",
            },
            {
              date: "2024-03-13",
              status: "present",
              topic: "Memory Management",
            },
            { date: "2024-03-11", status: "absent", topic: "File Systems" },
            { date: "2024-03-08", status: "present", topic: "Deadlocks" },
            { date: "2024-03-07", status: "present", topic: "Synchronization" },
            { date: "2024-03-06", status: "present", topic: "Virtual Memory" },
            { date: "2024-03-05", status: "absent", topic: "System Calls" },
          ],
        },
        {
          id: "CS304",
          name: "Computer Networks",
          code: "CS304",
          attendance: 68.4,
          attended: 13,
          total: 19,
          monthlyData: [
            { month: "January", percentage: 71.4, attended: 5, total: 7 },
            { month: "February", percentage: 62.5, attended: 5, total: 8 },
            { month: "March", percentage: 75.0, attended: 3, total: 4 },
          ],
          dailyData: [
            { date: "2024-03-15", status: "present", topic: "TCP/IP Protocol" },
            {
              date: "2024-03-13",
              status: "absent",
              topic: "Routing Algorithms",
            },
            { date: "2024-03-11", status: "late", topic: "Network Security" },
            { date: "2024-03-08", status: "absent", topic: "OSI Model" },
            { date: "2024-03-07", status: "present", topic: "HTTP/HTTPS" },
            { date: "2024-03-06", status: "present", topic: "DNS" },
          ],
        },
      ],
    },
    "Semester 5": {
      semester: "Semester 5",
      overall: 82.1,
      attended: 164,
      total: 200,
      courses: [
        {
          id: "CS201",
          name: "Computer Networks",
          code: "CS201",
          attendance: 79.2,
          attended: 19,
          total: 24,
          monthlyData: [
            { month: "September", percentage: 87.5, attended: 7, total: 8 },
            { month: "October", percentage: 75.0, attended: 6, total: 8 },
            { month: "November", percentage: 75.0, attended: 6, total: 8 },
          ],
          dailyData: [
            {
              date: "2023-11-20",
              status: "present",
              topic: "Network Protocols",
            },
            { date: "2023-11-18", status: "absent", topic: "Data Link Layer" },
            { date: "2023-11-16", status: "present", topic: "Physical Layer" },
            {
              date: "2023-11-14",
              status: "present",
              topic: "Network Topology",
            },
          ],
        },
        {
          id: "CS202",
          name: "Machine Learning",
          code: "CS202",
          attendance: 85.7,
          attended: 24,
          total: 28,
          monthlyData: [
            { month: "September", percentage: 90.0, attended: 9, total: 10 },
            { month: "October", percentage: 83.3, attended: 10, total: 12 },
            { month: "November", percentage: 83.3, attended: 5, total: 6 },
          ],
          dailyData: [
            { date: "2023-11-20", status: "present", topic: "Neural Networks" },
            { date: "2023-11-18", status: "present", topic: "Deep Learning" },
            {
              date: "2023-11-16",
              status: "late",
              topic: "Supervised Learning",
            },
            {
              date: "2023-11-14",
              status: "absent",
              topic: "Unsupervised Learning",
            },
          ],
        },
      ],
    },
  };

  const currentData = attendanceData[selectedSemester];

  const getBadgeColor = (percentage: number): string => {
    if (percentage >= 85)
      return "bg-green-50 text-green-700 border border-green-200";
    if (percentage >= 75)
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-red-50 text-red-700 border border-red-200";
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 85) return "bg-gradient-to-r from-green-400 to-green-500";
    if (percentage >= 75)
      return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    return "bg-gradient-to-r from-red-400 to-red-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
      case "absent":
        return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      case "late":
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const filteredDailyData =
    selectedCourse?.dailyData.filter((day) => {
      const matchesSearch =
        day.topic?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        day.date.includes(searchFilter);
      const matchesStatus =
        statusFilter === "all" || day.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const getAttendanceInsight = (percentage: number) => {
    if (percentage >= 90)
      return {
        text: "Excellent",
        color: "text-green-600",
        icon: Award,
      };
    if (percentage >= 80)
      return { text: "Good", color: "text-blue-600", icon: Target };
    if (percentage >= 70)
      return { text: "Fair", color: "text-yellow-600", icon: BarChart3 };
    return {
      text: "Poor",
      color: "text-red-600",
      icon: AlertCircle,
    };
  };

  // Calculate additional statistics
  const coursesAbove85 = currentData.courses.filter(
    (c) => c.attendance >= 85
  ).length;
  const coursesBelow75 = currentData.courses.filter(
    (c) => c.attendance < 75
  ).length;
  const averageAttendance =
    currentData.courses.reduce((sum, course) => sum + course.attendance, 0) /
    currentData.courses.length;
  const classesNeededFor75 = Math.max(
    0,
    Math.ceil((75 * currentData.total) / 100 - currentData.attended)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Attendance Dashboard
                </h1>
                <p className="text-md text-gray-200">
                  Track your academic progress
                </p>
              </div>
            </div>

            {/* Semester Selector */}
            <div className="bg-gradient-to-br from-white/25 to-indigo-50/25 p-3 w-1/4 rounded-sm border border-gray-200/25 backdrop-blur-sm">
              <label className="block text-xs font-medium text-gray-100 mb-2">
                Academic Term
              </label>
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full min-w-[160px] p-2 text-sm border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
                >
                  {Object.keys(attendanceData).map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Overall Attendance */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                  currentData.overall
                )}`}
              >
                {currentData.overall >= 85
                  ? "Excellent"
                  : currentData.overall >= 75
                  ? "Good"
                  : "At Risk"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">
                Overall Attendance
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {currentData.overall}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-[10px]">
                <div
                  className={`h-2 rounded-full ${getProgressColor(
                    currentData.overall
                  )}`}
                  style={{ width: `${currentData.overall}%` }}
                />
              </div>
            </div>
          </div>

          {/* Classes Attended */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">This Semester</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">
                Classes Attended
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {currentData.attended}
              </p>
              <p className="text-xs text-gray-500">
                out of {currentData.total} classes
              </p>
            </div>
          </div>

          {/* Active Courses */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">
                Enrolled Courses
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {currentData.courses.length}
              </p>
              <p className="text-xs text-gray-500">courses this semester</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Course Cards */}
          <div className="xl:col-span-2 space-y-4 border border-gray-400 p-4 rounded-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Breakdown
              </h2>
              <span className="text-sm text-gray-500">
                {currentData.courses.length} courses
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentData.courses.map((course) => {
                const insight = getAttendanceInsight(course.attendance);
                const Icon = insight.icon;

                return (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-400 rounded-sm shadow-sm p-4 hover:shadow-md transition-all duration-300 cursor-pointer group ease-in-out"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-slate-900 transition-colors truncate">
                          {course.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            {course.code}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                              course.attendance
                            )}`}
                          >
                            {course.attendance.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Icon
                        className={`w-4 h-4 ${insight.color} flex-shrink-0`}
                      />
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span className={insight.color + " font-medium"}>
                          {insight.text}
                        </span>
                        <span className="font-medium">
                          {course.attended}/{course.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                            course.attendance
                          )}`}
                          style={{ width: `${course.attendance}%` }}
                        />
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-green-50 rounded-sm">
                        <p className="text-sm font-bold text-green-600">
                          {course.attended}
                        </p>
                        <p className="text-xs text-green-700">Attended</p>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded-sm">
                        <p className="text-sm font-bold text-red-600">
                          {course.total - course.attended}
                        </p>
                        <p className="text-xs text-red-700">Missed</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs text-gray-500 text-center group-hover:text-slate-900 transition-colors">
                        Click to view details →
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Sidebar */}
          <div className="space-y-4">
            {/* Quick Insights */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-400 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Quick Insights
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="text-green-600 w-3 h-3" />
                    <span className="text-xs font-medium text-green-900">
                      Best Performing
                    </span>
                  </div>
                  <p className="font-semibold text-green-800 text-sm">
                    {
                      currentData.courses.reduce((best, course) =>
                        course.attendance > best.attendance ? course : best
                      ).code
                    }
                  </p>
                  <p className="text-xs text-green-700">
                    {currentData.courses
                      .reduce((best, course) =>
                        course.attendance > best.attendance ? course : best
                      )
                      .attendance.toFixed(1)}
                    % attendance
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-sm border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="text-blue-600 w-3 h-3" />
                    <span className="text-xs font-medium text-blue-900">
                      Average Performance
                    </span>
                  </div>
                  <p className="font-semibold text-blue-800 text-sm">
                    {averageAttendance.toFixed(1)}%
                  </p>
                  <p className="text-xs text-blue-700">Across all courses</p>
                </div>

                {coursesAbove85 > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-sm border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="text-emerald-600 w-3 h-3" />
                      <span className="text-xs font-medium text-emerald-900">
                        Excellent Courses
                      </span>
                    </div>
                    <p className="font-semibold text-emerald-800 text-sm">
                      {coursesAbove85} courses
                    </p>
                    <p className="text-xs text-emerald-700">
                      Above 85% attendance
                    </p>
                  </div>
                )}

                {coursesBelow75 > 0 && (
                  <div className="p-3 bg-red-50 rounded-sm border border-red-100">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="text-red-600 w-3 h-3" />
                      <span className="text-xs font-medium text-red-900">
                        Attention Needed
                      </span>
                    </div>
                    <p className="font-semibold text-red-800 text-sm">
                      {coursesBelow75} courses
                    </p>
                    <p className="text-xs text-red-700">Below 75% threshold</p>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Alert */}
            {currentData.overall < 75 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-sm p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold">Action Required</h3>
                </div>
                <p className="text-red-100 text-xs leading-relaxed mb-3">
                  Your overall attendance is below the 75% minimum requirement.
                  Focus on attending upcoming classes to improve your standing.
                </p>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-red-100">
                    Need {classesNeededFor75} more classes to reach 75%
                  </p>
                </div>
              </div>
            )}

            {/* Monthly Progress */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-400 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Performance Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Target</span>
                  <span className="font-medium text-gray-900 text-sm">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Current</span>
                  <span
                    className={`font-medium text-sm ${
                      currentData.overall >= 75
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {currentData.overall}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Average</span>
                  <span className="font-medium text-blue-600 text-sm">
                    {averageAttendance.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Trend</span>
                  <span className="font-medium text-emerald-600 text-sm">
                    ↗ Improving
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-sm max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedCourse.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                        {selectedCourse.code}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                        {selectedCourse.attendance.toFixed(1)}% Attendance
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                        {selectedCourse.attended}/{selectedCourse.total} Classes
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                {/* View Toggle */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setModalView("monthly")}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                      modalView === "monthly"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    Monthly Overview
                  </button>
                  <button
                    onClick={() => setModalView("daily")}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                      modalView === "daily"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                    Daily Records
                  </button>
                </div>

                {/* Course Statistics Summary */}
                <div className="bg-gray-50 rounded-sm p-4 mb-6 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Course Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {selectedCourse.attendance.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-600">Overall</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        {selectedCourse.attended}
                      </p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">
                        {selectedCourse.total - selectedCourse.attended}
                      </p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600">
                        {
                          selectedCourse.dailyData.filter(
                            (d) => d.status === "late"
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-600">Late</p>
                    </div>
                  </div>
                </div>

                {/* Monthly View */}
                {modalView === "monthly" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCourse.monthlyData.map((month, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {month.month}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                              month.percentage
                            )}`}
                          >
                            {month.percentage.toFixed(1)}%
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-white rounded-sm">
                              <p className="text-lg font-bold text-green-600">
                                {month.attended}
                              </p>
                              <p className="text-xs text-gray-600">Attended</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-sm">
                              <p className="text-lg font-bold text-gray-900">
                                {month.total}
                              </p>
                              <p className="text-xs text-gray-600">Total</p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                                month.percentage
                              )}`}
                              style={{ width: `${month.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Daily View */}
                {modalView === "daily" && (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search by topic or date..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <select
                            value={statusFilter}
                            onChange={(e) =>
                              setStatusFilter(e.target.value as any)
                            }
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="all">All Status</option>
                            <option value="present">Present Only</option>
                            <option value="absent">Absent Only</option>
                            <option value="late">Late Only</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Daily Records */}
                    <div className="space-y-3">
                      {filteredDailyData.length === 0 ? (
                        <div className="text-center py-8">
                          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">
                            No Records Found
                          </h4>
                          <p className="text-xs text-gray-500">
                            No attendance records match your search criteria.
                          </p>
                        </div>
                      ) : (
                        filteredDailyData.map((day, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                                    day.status === "present"
                                      ? "bg-green-100"
                                      : day.status === "late"
                                      ? "bg-yellow-100"
                                      : "bg-red-100"
                                  }`}
                                >
                                  {getStatusIcon(day.status)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {new Date(day.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                  {day.topic && (
                                    <p className="text-gray-600 text-xs mt-1">
                                      <span className="font-medium">
                                        Topic:
                                      </span>{" "}
                                      {day.topic}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right">
                                <span
                                  className={`px-3 py-1 rounded-sm text-xs font-medium ${
                                    day.status === "present"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : day.status === "late"
                                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                      : "bg-red-50 text-red-700 border border-red-200"
                                  }`}
                                >
                                  {day.status.charAt(0).toUpperCase() +
                                    day.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Daily Summary Stats */}
                    {filteredDailyData.length > 0 && (
                      <div className="bg-gray-50 rounded-sm p-4 border border-gray-200 mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Filter Summary
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600">
                              {
                                filteredDailyData.filter(
                                  (d) => d.status === "present"
                                ).length
                              }
                            </p>
                            <p className="text-xs text-gray-600">Present</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-red-600">
                              {
                                filteredDailyData.filter(
                                  (d) => d.status === "absent"
                                ).length
                              }
                            </p>
                            <p className="text-xs text-gray-600">Absent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-yellow-600">
                              {
                                filteredDailyData.filter(
                                  (d) => d.status === "late"
                                ).length
                              }
                            </p>
                            <p className="text-xs text-gray-600">Late</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
