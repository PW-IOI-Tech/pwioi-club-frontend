"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  BookOpen,
  MapPin,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface FilterState {
  center: string;
  school: string;
  batch: string;
  division: string;
  semester: string;
  subject: string;
}

interface DashboardStats {
  totalStudents: number;
  averageAttendance: number;
  presentToday: number;
  absentToday: number;
}

// Deterministic pseudo-random generator with seed
const createSeededRandom = (seed: number) => {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x); // returns float between 0 and 1
  };
};

const AttendanceDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    center: "",
    school: "",
    batch: "",
    division: "",
    semester: "",
    subject: "",
  });

  const [timeRange, setTimeRange] = useState<
    "daily" | "weekly" | "monthly" | "overall"
  >("weekly");

  const centers = ["bangalore", "noida", "pune", "lucknow"];
  const schools = ["SOT", "SOH", "SOM"];
  const batches = ["23", "24", "25"];
  const divisions = ["B1", "B2"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const subjectData = {
    SOT: {
      1: [
        "Programming Fundamentals",
        "Mathematics I",
        "Physics",
        "English Communication",
        "Engineering Graphics",
      ],
      2: [
        "Data Structures",
        "Mathematics II",
        "Chemistry",
        "Environmental Science",
        "Workshop Practice",
      ],
      3: [
        "Object Oriented Programming",
        "Database Management",
        "Computer Networks",
        "Digital Electronics",
        "Technical Writing",
      ],
      4: [
        "Software Engineering",
        "Operating Systems",
        "Web Technologies",
        "Computer Architecture",
        "Project Management",
      ],
      5: [
        "Machine Learning",
        "Cloud Computing",
        "Mobile App Development",
        "Cybersecurity",
        "Research Methodology",
      ],
      6: [
        "Artificial Intelligence",
        "Big Data Analytics",
        "DevOps",
        "Blockchain Technology",
        "Industry Project I",
      ],
      7: [
        "Advanced AI",
        "IoT Systems",
        "Quantum Computing",
        "Capstone Project I",
        "Professional Ethics",
      ],
      8: [
        "Dissertation",
        "Industry Internship",
        "Capstone Project II",
        "Entrepreneurship",
        "Career Development",
      ],
    },
    SOH: {
      1: [
        "Human Anatomy",
        "Medical Terminology",
        "Healthcare Fundamentals",
        "Communication Skills",
        "Basic Sciences",
      ],
      2: [
        "Physiology",
        "Pathology",
        "Pharmacology",
        "Medical Ethics",
        "Healthcare Systems",
      ],
      3: [
        "Clinical Medicine",
        "Diagnostic Techniques",
        "Patient Care",
        "Medical Technology",
        "Healthcare Management",
      ],
      4: [
        "Advanced Clinical Practice",
        "Specialized Medicine",
        "Research Methods",
        "Healthcare Policy",
        "Quality Assurance",
      ],
      5: [
        "Clinical Specialization",
        "Advanced Diagnostics",
        "Healthcare Innovation",
        "Medical Research",
        "Leadership Skills",
      ],
      6: [
        "Clinical Internship I",
        "Advanced Patient Care",
        "Medical Informatics",
        "Healthcare Analytics",
        "Project Work",
      ],
      7: [
        "Clinical Internship II",
        "Specialized Practice",
        "Healthcare Consulting",
        "Medical Writing",
        "Thesis Work I",
      ],
      8: [
        "Final Internship",
        "Comprehensive Care",
        "Healthcare Leadership",
        "Professional Practice",
        "Thesis Work II",
      ],
    },
    SOM: {
      1: [
        "Business Fundamentals",
        "Financial Accounting",
        "Economics",
        "Business Communication",
        "Mathematics for Business",
      ],
      2: [
        "Management Principles",
        "Cost Accounting",
        "Statistics",
        "Organizational Behavior",
        "Business Law",
      ],
      3: [
        "Marketing Management",
        "Financial Management",
        "Operations Management",
        "Human Resource Management",
        "Business Analytics",
      ],
      4: [
        "Strategic Management",
        "International Business",
        "Digital Marketing",
        "Supply Chain Management",
        "Entrepreneurship",
      ],
      5: [
        "Advanced Strategy",
        "Investment Analysis",
        "Consumer Behavior",
        "Business Intelligence",
        "Innovation Management",
      ],
      6: [
        "Corporate Finance",
        "Global Markets",
        "Brand Management",
        "Project Management",
        "Industry Analysis",
      ],
      7: [
        "Management Consulting",
        "Mergers & Acquisitions",
        "Leadership Development",
        "Business Ethics",
        "Capstone Project I",
      ],
      8: [
        "Strategic Consulting",
        "Corporate Governance",
        "Change Management",
        "Thesis Work",
        "Capstone Project II",
      ],
    },
  };

  const getSubjectsForSchoolAndSemester = (
    school: string,
    semester: string
  ) => {
    if (!school || !semester) return [];
    return (
      subjectData[school as keyof typeof subjectData]?.[
        parseInt(semester) as keyof typeof subjectData.SOT
      ] || []
    );
  };

  const getFilteredOptions = (type: string) => {
    switch (type) {
      case "batch":
        return filters.school
          ? batches.map((b) => `${filters.school}${b}`)
          : [];
      case "division":
        return filters.school && filters.batch
          ? divisions.map(
              (d) => `${filters.school}${filters.batch.slice(-2)}${d}`
            )
          : [];
      default:
        return [];
    }
  };

  // Generate deterministic attendance data using seeded random
  const generateAttendanceData = useMemo(() => {
    const seededRandom = createSeededRandom(42); // fixed seed → consistent across renders

    const baseData: AttendanceData[] = [];
    const now = new Date();
    let days = 30;
    let step = 1;

    switch (timeRange) {
      case "daily":
        days = 7;
        break;
      case "weekly":
        days = 12;
        step = 7;
        break;
      case "monthly":
      case "overall":
        days = 24;
        step = 30;
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (timeRange === "weekly") {
        date.setDate(date.getDate() - i * 7);
      } else if (timeRange === "monthly" || timeRange === "overall") {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setDate(date.getDate() - i);
      }

      let totalStudents = 1000;
      if (filters.center) totalStudents = Math.floor(totalStudents * 0.25);
      if (filters.school) totalStudents = Math.floor(totalStudents * 0.33);
      if (filters.batch) totalStudents = Math.floor(totalStudents * 0.33);
      if (filters.division) totalStudents = Math.floor(totalStudents * 0.5);
      if (filters.semester) totalStudents = Math.floor(totalStudents * 0.12);
      if (filters.subject) totalStudents = Math.floor(totalStudents * 0.8);

      // Deterministic random value
      const randomValue = seededRandom();
      const attendanceRate = 0.75 + randomValue * 0.2;
      const present = Math.floor(totalStudents * attendanceRate);
      const absent = totalStudents - present;

      let dateLabel = "";
      if (timeRange === "daily") {
        dateLabel = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (timeRange === "weekly") {
        dateLabel = `Week ${i + 1}`;
      } else if (timeRange === "monthly") {
        dateLabel = date.toLocaleDateString("en-US", { month: "short" });
      } else {
        dateLabel = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
      }

      baseData.push({
        date: dateLabel,
        present,
        absent,
        total: totalStudents,
        percentage: Math.round((present / totalStudents) * 100),
      });
    }

    return baseData;
  }, [filters, timeRange]); // ✅ Now safe: deterministic

  const dashboardStats = useMemo((): DashboardStats => {
    if (generateAttendanceData.length === 0) {
      return {
        totalStudents: 0,
        averageAttendance: 0,
        presentToday: 0,
        absentToday: 0,
      };
    }

    const latestData =
      generateAttendanceData[generateAttendanceData.length - 1];
    const avgAttendance = Math.round(
      generateAttendanceData.reduce((acc, data) => acc + data.percentage, 0) /
        generateAttendanceData.length
    );

    return {
      totalStudents: latestData.total,
      averageAttendance: avgAttendance,
      presentToday: latestData.present,
      absentToday: latestData.absent,
    };
  }, [generateAttendanceData]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      if (key === "center") {
        newFilters.school =
          newFilters.batch =
          newFilters.division =
          newFilters.semester =
          newFilters.subject =
            "";
      } else if (key === "school") {
        newFilters.batch =
          newFilters.division =
          newFilters.semester =
          newFilters.subject =
            "";
      } else if (key === "batch") {
        newFilters.division = newFilters.semester = newFilters.subject = "";
      } else if (key === "division") {
        newFilters.semester = newFilters.subject = "";
      } else if (key === "semester") {
        newFilters.subject = "";
      }

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      center: "",
      school: "",
      batch: "",
      division: "",
      semester: "",
      subject: "",
    });
  };

  const hasAnyFilterSelected = () =>
    Object.values(filters).some((val) => val !== "");

  const pieData = [
    { name: "Present", value: dashboardStats.presentToday, color: "#0f172a" },
    { name: "Absent", value: dashboardStats.absentToday, color: "#3730a3" },
  ];

  const renderPieLabel = (props: any) => {
    const { name, value, percent } = props;
    if (!percent || !name || value === undefined) return "";
    return `${name}: ${Math.round(percent * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 rounded-lg shadow-sm border border-slate-700 p-6 py-8 mb-6">
          <h1 className="text-2xl md:text-3xl text-white font-semibold mb-2">
            Attendance Dashboard
          </h1>
          <p className="text-slate-200 text-sm">
            Track, analyze, and manage student attendance across all centers and
            programs.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {hasAnyFilterSelected() ? (
              <>
                {filters.center && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-medium">
                    {filters.center.charAt(0).toUpperCase() +
                      filters.center.slice(1)}
                  </span>
                )}
                {filters.school && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                    {filters.school}
                  </span>
                )}
                {filters.batch && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    Batch {filters.batch}
                  </span>
                )}
                {filters.division && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    {filters.division}
                  </span>
                )}
                {filters.semester && (
                  <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full font-medium">
                    Sem {filters.semester}
                  </span>
                )}
                {filters.subject && (
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full font-medium">
                    {filters.subject}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500 italic">
                All data • No filters applied
              </span>
            )}
          </div>
          {hasAnyFilterSelected() && (
            <button
              onClick={clearAllFilters}
              className="mt-2 text-xs text-indigo-700 hover:text-indigo-900 flex items-center hover:underline"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Clear filters
            </button>
          )}
        </div>

        <section className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-5 w-5 text-slate-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Filter Attendance Data
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: "Center",
                key: "center",
                options: centers,
                disabled: false,
              },
              {
                label: "School",
                key: "school",
                options: filters.center ? schools : [],
                disabled: !filters.center,
              },
              {
                label: "Batch",
                key: "batch",
                options: getFilteredOptions("batch"),
                disabled: !filters.school,
              },
              {
                label: "Division",
                key: "division",
                options: getFilteredOptions("division"),
                disabled: !filters.batch,
              },
              {
                label: "Semester",
                key: "semester",
                options: filters.division ? semesters : [],
                disabled: !filters.division,
              },
              {
                label: "Subject",
                key: "subject",
                options: filters.semester
                  ? getSubjectsForSchoolAndSemester(
                      filters.school,
                      filters.semester
                    )
                  : [],
                disabled: !filters.semester,
              },
            ].map((filter) => (
              <div key={filter.key} className="cursor-pointer">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <select
                  value={filters[filter.key as keyof FilterState]}
                  onChange={(e) =>
                    handleFilterChange(
                      filter.key as keyof FilterState,
                      e.target.value
                    )
                  }
                  disabled={filter.disabled}
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {filter.disabled
                      ? `Select ${filter.label} First`
                      : `Select ${filter.label}`}
                  </option>
                  {filter.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Students",
              value: dashboardStats.totalStudents.toLocaleString(),
              icon: Users,
              color: "bg-slate-100",
              textColor: "text-slate-800",
            },
            {
              label: "Avg Attendance",
              value: `${dashboardStats.averageAttendance}%`,
              icon: TrendingUp,
              color: "bg-indigo-100",
              textColor: "text-indigo-800",
            },
            {
              label: "Present Today",
              value: dashboardStats.presentToday.toLocaleString(),
              icon: Calendar,
              color: "bg-blue-100",
              textColor: "text-blue-800",
            },
            {
              label: "Absent Today",
              value: dashboardStats.absentToday.toLocaleString(),
              icon: Clock,
              color: "bg-red-100",
              textColor: "text-red-800",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded ${stat.color}`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                {stat.label}
              </h3>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-slate-900" />
              <h2 className="text-lg font-bold text-slate-900">
                Attendance Trends
              </h2>
            </div>
            <div className="flex space-x-2">
              {(["daily", "weekly", "monthly", "overall"] as const).map(
                (range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      timeRange === range
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={generateAttendanceData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} students`]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ fill: "#0f172a", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#3730a3"
                  strokeWidth={2}
                  dot={{ fill: "#3730a3", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
