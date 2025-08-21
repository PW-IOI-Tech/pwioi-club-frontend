"use client";

import React, { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  ArrowUpDown,
  ChevronDown,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOH", label: "School of Healthcare" },
];

const batchOptions = [
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
  { value: "24", label: "24" },
];

const divisionOptions = [
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "B3", label: "B3" },
];

const semesterOptions = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
  { value: "5", label: "Semester 5" },
  { value: "6", label: "Semester 6" },
  { value: "7", label: "Semester 7" },
  { value: "8", label: "Semester 8" },
];

const subjectOptions = [
  { value: "data-structures", label: "Data Structures & Algorithms" },
  { value: "database-systems", label: "Database Management Systems" },
  { value: "computer-networks", label: "Computer Networks" },
  { value: "operating-systems", label: "Operating Systems" },
  { value: "software-engineering", label: "Software Engineering" },
  { value: "web-development", label: "Web Development" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
];

const monthlyAttendanceData = [
  { month: "Jan", percentage: 85 },
  { month: "Feb", percentage: 78 },
  { month: "Mar", percentage: 92 },
  { month: "Apr", percentage: 88 },
  { month: "May", percentage: 75 },
  { month: "Jun", percentage: 82 },
];

const attendanceRangeData = [
  { range: "<50%", students: 5, color: "#ef4444" },
  { range: "50-75%", students: 12, color: "#f59e0b" },
  { range: ">75%", students: 28, color: "#10b981" },
];

const pieChartData = [
  { name: "Present", value: 38, color: "#10b981" },
  { name: "Absent", value: 7, color: "#ef4444" },
];

const studentOverviewData = [
  {
    enrollmentId: "ENG001",
    name: "John Doe",
    overallAttendance: 85,
    jan: 90,
    feb: 85,
    mar: 88,
    apr: 82,
    may: 78,
    jun: 85,
  },
  {
    enrollmentId: "ENG002",
    name: "Jane Smith",
    overallAttendance: 92,
    jan: 95,
    feb: 90,
    mar: 95,
    apr: 88,
    may: 92,
    jun: 90,
  },
  {
    enrollmentId: "ENG003",
    name: "Mike Johnson",
    overallAttendance: 78,
    jan: 80,
    feb: 75,
    mar: 82,
    apr: 78,
    may: 75,
    jun: 78,
  },
  {
    enrollmentId: "ENG004",
    name: "Sarah Wilson",
    overallAttendance: 88,
    jan: 85,
    feb: 90,
    mar: 85,
    apr: 92,
    may: 85,
    jun: 90,
  },
  {
    enrollmentId: "ENG005",
    name: "Alex Brown",
    overallAttendance: 65,
    jan: 70,
    feb: 65,
    mar: 60,
    apr: 68,
    may: 62,
    jun: 65,
  },
];

const studentDailyData = [
  { enrollmentId: "ENG001", name: "John Doe", status: "Present" },
  { enrollmentId: "ENG002", name: "Jane Smith", status: "Present" },
  { enrollmentId: "ENG003", name: "Mike Johnson", status: "Absent" },
  { enrollmentId: "ENG004", name: "Sarah Wilson", status: "Present" },
  { enrollmentId: "ENG005", name: "Alex Brown", status: "Present" },
];

const AttendanceTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "daily">("overview");
  const [filters, setFilters] = useState({
    school: "",
    batch: "",
    division: "",
    semester: "",
    subject: "",
  });
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedStudents = (data: any[]) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const canShowData =
    filters.school &&
    filters.batch &&
    filters.division &&
    filters.semester &&
    filters.subject;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">{`Attendance: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-400 mb-8 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Class Attendance Insights
          </h1>
          <p className="text-blue-100">
            Monitor and analyze your class attendance patterns
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Class Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={filters.school}
                  onChange={(e) => handleFilterChange("school", e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white cursor-pointer text-sm"
                >
                  <option value="">Select School</option>
                  {schoolOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <div className="relative">
                <select
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  disabled={!filters.school}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Batch</option>
                  {batchOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {filters.school}
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !filters.school ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={filters.division}
                  onChange={(e) =>
                    handleFilterChange("division", e.target.value)
                  }
                  disabled={!filters.batch}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Division</option>
                  {divisionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {filters.school}
                      {filters.batch}
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !filters.batch ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  value={filters.semester}
                  onChange={(e) =>
                    handleFilterChange("semester", e.target.value)
                  }
                  disabled={!filters.division}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !filters.division ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  value={filters.subject}
                  onChange={(e) =>
                    handleFilterChange("subject", e.target.value)
                  }
                  disabled={!filters.semester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !filters.semester ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {canShowData && (
          <>
            <div className="mb-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-4">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-2 px-4 rounded-sm font-medium text-sm transition-all cursor-pointer ${
                      activeTab === "overview"
                        ? "bg-slate-900 text-white shadow-md border"
                        : "text-gray-600 hover:text-slate-900 hover:bg-slate-200 border border-gray-400"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("daily")}
                    className={`py-2 px-4 rounded-sm font-medium text-sm transition-all cursor-pointer ${
                      activeTab === "daily"
                        ? "bg-slate-900 text-white shadow-md border"
                        : "text-gray-600 hover:text-slate-900 hover:bg-slate-200 border border-gray-400"
                    }`}
                  >
                    Daily Basis
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Average Attendance
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                          83.5%
                        </p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <TrendingUp className="w-6 h-6 text-slate-900" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Students
                        </p>
                        <p className="text-3xl font-bold text-slate-900">45</p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <Users className="w-6 h-6 text-slate-900" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Months Tracked
                        </p>
                        <p className="text-3xl font-bold text-slate-900">6</p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <Calendar className="w-6 h-6 text-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-400">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Monthly Attendance Trend
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyAttendanceData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 12 }}
                              stroke="#6b7280"
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 12 }}
                              stroke="#6b7280"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                              dataKey="percentage"
                              fill="#1c398e"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-400">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Student Distribution by Attendance
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceRangeData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="range"
                              tick={{ fontSize: 12 }}
                              stroke="#6b7280"
                            />
                            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                            <Tooltip />
                            <Bar
                              dataKey="students"
                              fill="#1c398e"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-400">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Student Attendance Details
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("enrollmentId")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Enrollment ID <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("name")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Name <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("overallAttendance")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Overall % <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Jan
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Feb
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Mar
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Apr
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            May
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Jun
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedStudents(studentOverviewData).map(
                          (student, _index) => (
                            <tr
                              key={student.enrollmentId}
                              className="border-b border-gray-100 hover:bg-blue-25 transition-colors"
                            >
                              <td className="py-3 px-6 font-medium text-gray-900">
                                {student.enrollmentId}
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.name}
                              </td>
                              <td className="py-3 px-6">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                                    student.overallAttendance >= 85
                                      ? "bg-green-100 text-green-800"
                                      : student.overallAttendance >= 75
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.overallAttendance}%
                                </span>
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.jan}%
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.feb}%
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.mar}%
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.apr}%
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.may}%
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.jun}%
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "daily" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-sm border border-gray-400 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-400">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Today&lsquo;s Attendance - August 19, 2025
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center space-x-8 mt-4">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Present (38)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Absent (7)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Insights */}
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-sm border border-gray-400">
                    <div className="px-6 py-4 border-b border-gray-400">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Daily Insights
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-sm shadow-sm border border-gray-400">
                        <div className="flex items-center">
                          <UserCheck className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Present Percentage
                            </p>
                            <p className="text-sm text-gray-600">
                              84.4% Present
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          84.4%
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-sm shadow-sm border border-gray-400">
                        <div className="flex items-center">
                          <UserX className="w-6 h-6 text-red-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Absent Percetnage
                            </p>
                            <p className="text-sm text-gray-600">
                              84.4% Absent
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          84.4%
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-sm shadow-sm border border-gray-400">
                        <div className="flex items-center">
                          <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Change from Yesterday
                            </p>
                            <p className="text-sm text-gray-600">
                              +2.1% improvement
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          +2.1%
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm shadow-sm border border-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-6 h-6 text-gray-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Last Updated
                            </p>
                            <p className="text-sm text-gray-600">
                              9:00 AM today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Students Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Today&lsquo;s Student Status
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("enrollmentId")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Enrollment ID <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("name")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Name <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            <button
                              onClick={() => handleSort("status")}
                              className="flex items-center gap-1 hover:text-blue-600"
                            >
                              Status <ArrowUpDown className="w-4 h-4" />
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedStudents(studentDailyData).map(
                          (student, _index) => (
                            <tr
                              key={student.enrollmentId}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-6 font-medium text-gray-900">
                                {student.enrollmentId}
                              </td>
                              <td className="py-3 px-6 text-gray-600">
                                {student.name}
                              </td>
                              <td className="py-3 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit ${
                                    student.status === "Present"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.status === "Present" ? (
                                    <UserCheck className="w-4 h-4" />
                                  ) : (
                                    <UserX className="w-4 h-4" />
                                  )}
                                  {student.status}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {!canShowData && (
          <div className="text-center py-12 bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-900" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Select All Filters
            </h3>
            <p className="text-gray-500">
              Please select all required filters (School, Batch, Division,
              Semester, and Subject) to view attendance insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
