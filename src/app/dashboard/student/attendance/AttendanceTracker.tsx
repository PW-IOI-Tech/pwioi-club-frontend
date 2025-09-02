"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  ChevronDown,
  X,
  Filter,
  Search,
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
import {
  AttendanceDetailsShimmer,
  CourseInformationShimmer,
} from "./AttendanceShimmer";

interface MonthlyBreakdown {
  month: string;
  attended: number;
  totalClasses: number;
}

interface WeeklyBreakdown {
  weekStart: string;
  weekEnd: string;
  attended: number;
  totalClasses: number;
}

interface SubjectAttendance {
  studentId: string;
  semesterId: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  attendancePercentage: number;
  classesAttended: number;
  classesMissed: number;
  monthlyBreakdown: MonthlyBreakdown[];
  weeklyBreakdown: WeeklyBreakdown[];
  dailyStatus: Record<string, "PRESENT" | "ABSENT">;
}

const AttendanceTracker: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [subjectAttendence, setSubjectAttendence] =
    useState<SubjectAttendance | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalView, setModalView] = useState<"monthly" | "daily">("monthly");
  const [modalLoading, setModalLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent"
  >("all");
  const [previousAttendance, setPreviousAttendance] = useState<number | null>(
    null
  );

  const previousSemesterId =
    semesters.length > 1 ? semesters[semesters.length - 2].id : null;

  useEffect(() => {
    const fetchSemesters = async () => {
      const storedUserData = localStorage.getItem("userDetails");
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      const divisionId = userData?.division?.id;

      if (!divisionId) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${divisionId}`,
          { withCredentials: true }
        );
        const sems = response.data.data || [];
        setSemesters(sems);

        if (sems.length > 0) {
          setSelectedSemester(sems[sems.length - 1].id);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedSemester) return;

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const studentId = user?.id;

      if (!studentId) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-attendance/${studentId}/attendance/?semesterId=${selectedSemester}`,
          { withCredentials: true }
        );
        setUserDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [selectedSemester]);

  useEffect(() => {
    const fetchPreviousAttendance = async () => {
      if (!previousSemesterId) return;

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const studentId = user?.id;

      if (!studentId) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-attendance/${studentId}/attendance/?semesterId=${previousSemesterId}`,
          { withCredentials: true }
        );
        setPreviousAttendance(
          response.data.data?.overallAttendancePercentage || null
        );
      } catch (error) {
        console.error("Error fetching previous semester attendance:", error);
      }
    };

    fetchPreviousAttendance();
  }, [previousSemesterId]);

  const subjectWiseAttendance = async (
    subjectId: string,
    semesterId: string
  ) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const studentId = user?.id;

    if (!studentId || !subjectId || !semesterId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-attendance/${studentId}/attendance/subject/${subjectId}?semesterId=${semesterId}`,
        { withCredentials: true }
      );
      setSubjectAttendence(response.data.data);
    } catch (error) {
      console.error("Error fetching subject Attendance", error);
    }
  };

  const handleSubjectAttendenceData = async (course: any) => {
    setSelectedCourse(course);
    setModalLoading(true);

    await subjectWiseAttendance(course.subjectId, selectedSemester);

    setModalLoading(false);
  };

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

  const dailyDataArray = Object.entries(
    subjectAttendence?.dailyStatus || {}
  ).map(([date, status]) => ({
    date,
    status,
  }));

  const filteredDailyData = dailyDataArray.filter((day: any) => {
    const matchesSearch = day.date.includes(searchFilter);

    const matchesStatus = statusFilter === "all" || day.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getAttendanceInsight = (percentage: number) => {
    if (percentage >= 90)
      return { text: "Excellent", color: "text-green-600", icon: Award };
    if (percentage >= 80)
      return { text: "Good", color: "text-blue-600", icon: Target };
    if (percentage >= 70)
      return { text: "Fair", color: "text-yellow-600", icon: BarChart3 };
    return { text: "Poor", color: "text-red-600", icon: AlertCircle };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
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
                  {semesters?.map((sem: any) => (
                    <option key={sem.number} value={sem.id}>
                      {sem.number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                  userDetails?.overallAttendancePercentage
                )}`}
              >
                {userDetails?.overallAttendancePercentage >= 85
                  ? "Excellent"
                  : userDetails?.overallAttendancePercentage >= 75
                  ? "Good"
                  : "At Risk"}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">
                Overall Attendance
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {userDetails?.overallAttendancePercentage || 0}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-[10px]">
                <div
                  className={`h-2 rounded-full ${getProgressColor(
                    userDetails?.overallAttendancePercentage
                  )}`}
                  style={{
                    width: `${userDetails?.overallAttendancePercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

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
                {userDetails?.classesAttended || 0}
              </p>
              <p className="text-xs text-gray-500">
                out of {userDetails?.totalClasses || 0} classes
              </p>
            </div>
          </div>

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
                {userDetails?.totalSubjects || 0}
              </p>
              <p className="text-xs text-gray-500">courses this semester</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-3 space-y-4 border border-gray-400 p-4 rounded-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Breakdown
              </h2>
              <span className="text-sm text-gray-500">
                {userDetails?.totalSubjects || 0} courses
              </span>
            </div>
            {userDetails?.totalSubjects > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {userDetails?.subjectWiseAttendance?.map((course: any) => {
                  const insight = getAttendanceInsight(
                    course.attendancePercentage
                  );
                  const Icon = insight.icon;

                  return (
                    <div
                      key={course.subjectId}
                      className="bg-white border border-gray-400 rounded-sm shadow-sm p-4 hover:shadow-md transition-all duration-300 cursor-pointer group ease-in-out"
                      onClick={() => handleSubjectAttendenceData(course)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-slate-900 transition-colors truncate">
                            {course.subjectName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                              {course.subjectCode}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                                course.attendancePercentage
                              )}`}
                            >
                              {course.attendancePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Icon
                          className={`w-4 h-4 ${insight.color} flex-shrink-0`}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span className={insight.color + " font-medium"}>
                            {insight.text}
                          </span>
                          <span className="font-medium">
                            {course.classesAttended}/
                            {course.classesAttended + course.classesMissed}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                              course.attendancePercentage
                            )}`}
                            style={{ width: `${course.attendancePercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-green-50 rounded-sm">
                          <p className="text-sm font-bold text-green-600">
                            {course.classesAttended}
                          </p>
                          <p className="text-xs text-green-700">Attended</p>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-sm">
                          <p className="text-sm font-bold text-red-600">
                            {course?.classesMissed}
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
            ) : (
              <CourseInformationShimmer />
            )}
          </div>
        </div>

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] border border-slate-900 overflow-hidden shadow-2xl">
              {modalLoading ? (
                <AttendanceDetailsShimmer />
              ) : (
                <>
                  <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {subjectAttendence?.subjectName}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                            {subjectAttendence?.subjectCode}
                          </span>
                          <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                            {subjectAttendence?.attendancePercentage.toFixed(1)}
                            % Attendance
                          </span>
                          <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">
                            {subjectAttendence?.classesAttended} Classes
                            Attended
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="p-1.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => setModalView("monthly")}
                        className={`px-4 py-2 rounded-sm text-sm font-medium transition-all cursor-pointer ${
                          modalView === "monthly"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                        Monthly Overview
                      </button>
                      <button
                        onClick={() => setModalView("daily")}
                        className={`px-4 py-2 rounded-sm text-sm font-medium transition-all cursor-pointer ${
                          modalView === "daily"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                        Daily Records
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-white to-indigo-50 rounded-sm p-4 mb-6 border border-gray-400">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Course Statistics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            {subjectAttendence?.attendancePercentage?.toFixed(
                              1
                            )}
                            %
                          </p>
                          <p className="text-xs text-gray-600">Overall</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {subjectAttendence?.classesAttended}
                          </p>
                          <p className="text-xs text-gray-600">Present</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-red-600">
                            {subjectAttendence?.classesMissed}
                          </p>
                          <p className="text-xs text-gray-600">Absent</p>
                        </div>
                      </div>
                    </div>

                    {modalView === "monthly" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectAttendence?.monthlyBreakdown?.map(
                          (month: any, index: number) => {
                            const percentage = month.totalClasses
                              ? (month.attended / month.totalClasses) * 100
                              : 0;

                            const formattedMonth = new Date(
                              `${month.month}-01`
                            ).toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            });

                            return (
                              <div
                                key={index}
                                className="bg-gradient-to-br from-white to-indigo-50 rounded-sm p-4 border border-gray-400"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {formattedMonth}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(
                                      percentage
                                    )}`}
                                  >
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-2 bg-white rounded-sm border border-gray-400">
                                      <p className="text-lg font-bold text-green-600">
                                        {month.attended}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Attended
                                      </p>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded-sm border border-gray-400">
                                      <p className="text-lg font-bold text-gray-900">
                                        {month.totalClasses}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Total
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full bg-white rounded-full h-2 border border-gray-400">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                                        percentage
                                      )}`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {modalView === "daily" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-sm p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search by date..."
                                value={searchFilter}
                                onChange={(e) =>
                                  setSearchFilter(e.target.value)
                                }
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
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {filteredDailyData.length === 0 ? (
                            <div className="text-center py-8">
                              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                                No Records Found
                              </h4>
                              <p className="text-xs text-gray-500">
                                No attendance records match your search
                                criteria.
                              </p>
                            </div>
                          ) : (
                            filteredDailyData.map((day: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white rounded-sm border border-gray-400 p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                                        day.status === "present"
                                          ? "bg-green-100"
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
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span
                                      className={`px-3 py-1 rounded-sm text-xs font-medium ${
                                        day.status === "present"
                                          ? "bg-green-50 text-green-700 border border-green-200"
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
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
