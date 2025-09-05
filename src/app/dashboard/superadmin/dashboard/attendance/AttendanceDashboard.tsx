"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  ChevronDown,
} from "lucide-react";
import axios from "axios";

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
  presentYesterday: number;
  absentYesterday: number;
}

const AttendanceDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    center: "",
    school: "",
    batch: "",
    division: "",
    semester: "",
    subject: "",
  });

  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  const getLabel = (list: any[], value: string, fallback = "") => {
    if (!value) return fallback;
    const found = list.find(
      (opt: any) => opt.id === value || opt._id === value || opt.code === value
    );
    return (
      found?.name ||
      found?.division ||
      found?.number ||
      found?.code ||
      found?.id ||
      value
    );
  };

  // Fetch Centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        if (res.data.success) setCenters(res.data.data);
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  // Fetch Schools
  useEffect(() => {
    if (!filters.center) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${filters.center}`,
        { withCredentials: true }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"));
  }, [filters.center]);

  // Fetch Batches
  useEffect(() => {
    if (!filters.school) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${filters.school}`,
        { withCredentials: true }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"));
  }, [filters.school]);

  // Fetch Divisions
  useEffect(() => {
    if (!filters.batch) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${filters.batch}`,
        { withCredentials: true }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"));
  }, [filters.batch]);

  // Fetch Semesters
  useEffect(() => {
    if (!filters.division) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${filters.division}`,
        { withCredentials: true }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"));
  }, [filters.division]);

  // Fetch Subjects
  useEffect(() => {
    if (!filters.semester) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${filters.semester}`,
        { withCredentials: true }
      )
      .then((res) => setSubjects(res.data?.data || []))
      .catch(() => console.error("Failed to fetch subjects"));
  }, [filters.semester]);

  // Fetch Attendance Analytics
  useEffect(() => {
    const fetchAttendanceAnalytics = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/attendance-analytics`,
          {
            params: {
              center: filters.center || undefined,
              school: filters.school || undefined,
              batch: filters.batch || undefined,
              division: filters.division || undefined,
              semester: filters.semester || undefined,
              subject: filters.subject || undefined,
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const { overview, trends } = res.data.data;

          setDashboardStats(overview);

          const mappedData = (trends[timeRange] || []).map((t: any) => ({
            date: t.period,
            percentage: t.percentage,
          }));

          setAttendanceData(mappedData);
        }
      } catch (err: any) {
        console.error(
          err.response?.data?.message || "Failed to fetch attendance analytics"
        );
      }
    };

    fetchAttendanceAnalytics();
  }, [filters, timeRange]);

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

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#12294c] rounded-lg shadow-sm border border-slate-700 p-6 py-8 mb-6">
          <h1 className="text-2xl md:text-3xl text-white font-semibold mb-2">
            Attendance Dashboard
          </h1>
          <p className="text-slate-200 text-sm">
            Track, analyze, and manage student attendance across all centers and
            programs.
          </p>
        </div>

        {/* Active Filters */}
        <div className="bg-white rounded-lg border border-gray-300 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {hasAnyFilterSelected() ? (
              <>
                {filters.center && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-medium">
                    {getLabel(centers, filters.center)}
                  </span>
                )}
                {filters.school && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                    {getLabel(schools, filters.school)}
                  </span>
                )}
                {filters.batch && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    Batch {getLabel(batches, filters.batch)}
                  </span>
                )}
                {filters.division && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    {getLabel(divisions, filters.division)}
                  </span>
                )}
                {filters.semester && (
                  <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full font-medium">
                    Sem {getLabel(semesters, filters.semester)}
                  </span>
                )}
                {filters.subject && (
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full font-medium">
                    {getLabel(subjects, filters.subject)}
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

        {/* Filters */}
        <section className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-5 w-5 text-[#12294c]" />
            <h2 className="text-lg font-bold text-[#12294c]">
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
                options: schools,
                disabled: !filters.center,
              },
              {
                label: "Batch",
                key: "batch",
                options: batches,
                disabled: !filters.school,
              },
              {
                label: "Division",
                key: "division",
                options: divisions,
                disabled: !filters.batch,
              },
              {
                label: "Semester",
                key: "semester",
                options: semesters,
                disabled: !filters.division,
              },
              {
                label: "Subject",
                key: "subject",
                options: subjects,
                disabled: !filters.semester,
              },
            ].map((filter, idx) => (
              <div key={idx} className="relative min-w-36">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filters[filter.key as keyof FilterState]}
                    onChange={(e) =>
                      handleFilterChange(
                        filter.key as keyof FilterState,
                        e.target.value
                      )
                    }
                    disabled={filter.disabled}
                    className="w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{`Select ${filter.label}`}</option>
                    {filter.options.map((opt: any) => {
                      const value = opt.id || opt._id || opt;
                      const label =
                        typeof opt === "string"
                          ? opt
                          : opt.name ||
                            opt.division ||
                            opt.number ||
                            opt.code ||
                            opt.id ||
                            "Unknown";
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 w-4 h-4 text-gray-400 pointer-events-none -translate-y-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        {dashboardStats && (
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
                label: "Present Yesterday",
                value: dashboardStats.presentYesterday.toLocaleString(),
                icon: Calendar,
                color: "bg-blue-100",
                textColor: "text-blue-800",
              },
              {
                label: "Absent Yesterday",
                value: dashboardStats.absentYesterday.toLocaleString(),
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
        )}

        {/* Attendance Trends */}
        <section className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-[#12294c]" />
              <h2 className="text-lg font-bold text-[#12294c]">
                Attendance Trends
              </h2>
            </div>
            <div className="flex space-x-2">
              {(["daily", "weekly", "monthly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-[#12294c] text-white"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Attendance"]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ fill: "#0f172a", r: 3 }}
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
