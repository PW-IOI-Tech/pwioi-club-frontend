"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
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

interface TeachingDetailsResponse {
  success: boolean;
  teacher: {
    id: string;
    name: string;
    email: string;
    designation: string;
  };
  schools: {
    id: string;
    name: string;
    batches: {
      id: string;
      name: string;
      divisions: {
        id: string;
        code: string;
        total_students: number;
        semesters: {
          id: string;
          number: number;
          start_date: string;
          end_date: string;
          is_current: boolean;
          subjects: {
            id: string;
            name: string;
            code: string;
            credits: number;
            exam_types: any;
            total_exam_types: number;
            total_exams: number;
          }[];
          total_subjects: number;
        }[];
        total_semesters: number;
      }[];
      total_divisions: number;
    }[];
    total_batches: number;
  }[];
  summary: {
    total_schools: number;
    total_batches: number;
    total_divisions: number;
    total_semesters: number;
    total_subjects: number;
    total_exams: number;
    exam_type_breakdown: Record<string, number>;
  };
}

interface OverallStudentDetail {
  enrollmentId: string;
  name: string;
  overallAttendance: number;
  totalClassesAttended: number;
  totalClassesConducted: number;
}

interface OverallDistribution {
  below50: number;
  between50And75: number;
  above75: number;
}

interface OverallData {
  averageAttendance: number;
  totalStudents: number;
  totalClasses: number;
  monthsTracked: number;
  monthlyTrends: any[];
  distributionByAttendance: OverallDistribution;
  studentDetails: OverallStudentDetail[];
}

interface OverallDetailsResponse {
  success: boolean;
  subject: { id: string; name: string; code: string; credits: number };
  division: {
    id: string;
    code: string;
    batch: { id: string; name: string };
    school: { id: string; name: string };
    center: { id: string; name: string };
  };
  dateRange: { from: string; to: string };
  data: OverallData;
}

interface DailyStudentDetail {
  enrollmentId: string;
  name: string;
  status: "PRESENT" | "ABSENT" | "NOT_MARKED";
  classesPresent: number;
  classesAbsent: number;
  totalClasses: number;
  attendancePercentage: number;
}

interface DailySummary {
  totalStudents: number;
  totalClasses: number;
  studentsPresent: number;
  studentsAbsent: number;
  studentsNotMarked: number;
  overallAttendancePercentage: number;
  totalPresentCount: number;
  totalAbsentCount: number;
}

interface DailyDetailsResponse {
  success: boolean;
  date: string;
  subject: { id: string; name: string; code: string; credits: number };
  division: {
    id: string;
    code: string;
    batch: { id: string; name: string };
    school: { id: string; name: string };
    center: { id: string; name: string };
  };
  summary: DailySummary;
  classDetails: any[];
  studentDetails: DailyStudentDetail[];
}

const AttendanceTracker: React.FC = () => {
  const [teachingDetails, setTeachingDetails] =
    useState<TeachingDetailsResponse | null>(null);
  const [school, setSchool] = useState("");
  const [batch, setBatch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "daily">("overview");
  const [filters, setFilters] = useState({
    school: "",
    batch: "",
    division: "",
    semester: "",
    subject: "",
  });
  const [sortField, setSortField] = useState<string>("");
  const [overallDetails, setOverallDetails] =
    useState<OverallDetailsResponse | null>(null);
  const [dailyDetails, setDailyDetails] = useState<DailyDetailsResponse | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const attendanceRangeData = [
    {
      range: "<50%",
      students: overallDetails?.data?.distributionByAttendance?.below50,
      color: "#ef4444",
    },
    {
      range: "50-75%",
      students: overallDetails?.data?.distributionByAttendance?.between50And75,
      color: "#f59e0b",
    },
    {
      range: ">75%",
      students: overallDetails?.data?.distributionByAttendance?.above75,
      color: "#10b981",
    },
  ];

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

  const pieChartData = [
    {
      name: "Present",
      value: dailyDetails?.summary?.totalPresentCount,
      color: "#10b981",
    },
    {
      name: "Absent",
      value: dailyDetails?.summary?.totalAbsentCount,
      color: "#ef4444",
    },
  ];

  const schoolOptions =
    teachingDetails?.schools.map((s) => ({
      value: s.id,
      label: s.name,
    })) || [];

  const getBatchOptions = (schoolId: string) => {
    const school = teachingDetails?.schools.find((s) => s.id === schoolId);
    return (
      school?.batches.map((b) => ({
        value: b.id,
        label: b.name,
      })) || []
    );
  };

  const getDivisionOptions = (schoolId: string, batchId: string) => {
    const batch = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId);

    return (
      batch?.divisions.map((d) => ({
        value: d.id,
        label: d.code,
      })) || []
    );
  };

  const getSemesterOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string
  ) => {
    const division = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId)
      ?.divisions.find((d) => d.id === divisionId);

    return (
      division?.semesters.map((sem) => ({
        value: sem.id,
        label: `Semester ${sem.number}`,
      })) || []
    );
  };

  const getTeachingDetails = async () => {
    try {
      const response = await axios.get<TeachingDetailsResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/teaching-details`,
        { withCredentials: true }
      );
      setTeachingDetails(response.data);
    } catch (error) {
      console.error("Error fetching teaching details:", error);
    }
  };

  const getOverallAttendence = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-attendance/${subject}/overall`,
        { withCredentials: true }
      );
      setOverallDetails(response?.data);
    } catch (error) {
      console.error("Error fetching Overall details:", error);
    }
  };

  const getDailyAttendence = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-attendance/${subject}/daily`,
        { withCredentials: true }
      );
      setDailyDetails(response?.data);
    } catch (error) {
      console.error("Error fetching Overall details:", error);
    }
  };

  const getSubjectOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string
  ) => {
    const semester = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId)
      ?.divisions.find((d) => d.id === divisionId)
      ?.semesters.find((sem) => sem.id === semesterId);

    return (
      semester?.subjects.map((subj) => ({
        value: subj.id,
        label: subj.name,
      })) || []
    );
  };

  const getMonthRange = (from: string, to: string): string[] => {
    const start = new Date(from);
    const end = new Date(to);

    const months: string[] = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      months.push(monthNames[current.getMonth()]);
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  const canShowData = school && batch && division && semester && subject;

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

  useEffect(() => {
    getTeachingDetails();
  }, []);

  useEffect(() => {
    const allDetailsPresent =
      school && batch && division && semester && subject;

    if (allDetailsPresent) {
      getOverallAttendence();
      getDailyAttendence();
    }
  }, [school, batch, division, semester, subject]);

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#12294c] rounded-sm shadow-lg border border-gray-400 mb-6 p-8">
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

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent appearance-none bg-white cursor-pointer text-sm"
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
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  disabled={!school}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Batch</option>
                  {getBatchOptions(school).map((option) => (
                    <option key={option.value} value={option.value}>
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
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  disabled={!batch}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Division</option>
                  {getDivisionOptions(school, batch).map((option) => (
                    <option key={option.value} value={option.value}>
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
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={!division}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Semester</option>
                  {getSemesterOptions(school, batch, division).map((option) => (
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
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!semester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed appearance-none bg-white text-sm"
                >
                  <option value="">Select Subject</option>
                  {getSubjectOptions(school, batch, division, semester).map(
                    (option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
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
                        ? "bg-[#12294c] text-white shadow-md border"
                        : "text-gray-600 hover:text-[#12294c] hover:bg-slate-200 border border-gray-400"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("daily")}
                    className={`py-2 px-4 rounded-sm font-medium text-sm transition-all cursor-pointer ${
                      activeTab === "daily"
                        ? "bg-[#12294c] text-white shadow-md border"
                        : "text-gray-600 hover:text-[#12294c] hover:bg-slate-200 border border-gray-400"
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
                        <p className="text-3xl font-bold text-[#12294c]">
                          {overallDetails?.data?.averageAttendance || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <TrendingUp className="w-6 h-6 text-[#12294c]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Students
                        </p>
                        <p className="text-3xl font-bold text-[#12294c]">
                          {" "}
                          {overallDetails?.data?.totalStudents || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <Users className="w-6 h-6 text-[#12294c]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Months Tracked
                        </p>
                        <p className="text-3xl font-bold text-[#12294c]">
                          {" "}
                          {overallDetails?.data?.monthsTracked || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-200 rounded-full border border-gray-400">
                        <Calendar className="w-6 h-6 text-[#12294c]" />
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
                          <BarChart data={overallDetails?.data?.monthlyTrends}>
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
                          {overallDetails && (
                            <thead>
                              <tr>
                                {getMonthRange(
                                  overallDetails.dateRange.from,
                                  overallDetails.dateRange.to
                                ).map((month) => (
                                  <th
                                    key={month}
                                    className="text-left py-3 px-6 font-medium text-gray-700"
                                  >
                                    {month}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedStudents(
                          overallDetails?.data?.studentDetails || []
                        ).map((student, _index) => (
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
                        ))}
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
                            Present ({dailyDetails?.summary?.totalPresentCount})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Absent ({dailyDetails?.summary?.totalAbsentCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                              {dailyDetails?.summary?.studentsPresent} Present
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {dailyDetails?.summary?.studentsPresent}
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
                              {dailyDetails?.summary?.studentsAbsent} Absent
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {dailyDetails?.summary?.studentsAbsent}
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
                        {getSortedStudents(
                          dailyDetails?.studentDetails || []
                        ).map((student, _index) => (
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
                        ))}
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
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#12294c]" />
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
