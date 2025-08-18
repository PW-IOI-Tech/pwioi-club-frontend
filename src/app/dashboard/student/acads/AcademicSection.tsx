"use client";

import React, { useState } from "react";
import {
  X,
  Users,
  Trophy,
  Medal,
  Award,
  Filter,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  BookOpen,
  GraduationCap,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy Data
const studentProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  gender: "Male",
  phoneNumber: "+91 9876543210",
  enrollmentNumber: "2023BCS001",
  semesterNo: 3,
  center: { name: "Delhi Center" },
  department: { name: "Computer Science" },
  batch: { name: "2023-BCS-A" },
  courseCount: 6,
};

const academicData = {
  id: "1",
  courses: [
    { id: "1", name: "Data Structures", code: "CSE201S1", credits: 4 },
    { id: "2", name: "Database Systems", code: "CSE202S1", credits: 3 },
    { id: "3", name: "Operating Systems", code: "CSE301S2", credits: 4 },
    { id: "4", name: "Computer Networks", code: "CSE302S2", credits: 3 },
    { id: "5", name: "Software Engineering", code: "CSE401S3", credits: 4 },
    { id: "6", name: "Web Development", code: "CSE402S3", credits: 3 },
    { id: "7", name: "Artificial Intelligence", code: "CSE403S3", credits: 4 },
  ],
  scores: [],
};

const courseScores = [
  {
    id: "1",
    marksObtained: 85,
    totalObtained: 100,
    dateOfExam: "2024-01-15",
    gradedAt: "2024-01-18",
  },
  {
    id: "2",
    marksObtained: 78,
    totalObtained: 100,
    dateOfExam: "2024-02-01",
    gradedAt: "2024-02-03",
  },
  {
    id: "3",
    marksObtained: 92,
    totalObtained: 100,
    dateOfExam: "2024-02-15",
    gradedAt: "2024-02-17",
  },
  {
    id: "4",
    marksObtained: 88,
    totalObtained: 100,
    dateOfExam: "2024-03-01",
    gradedAt: "2024-03-03",
  },
  {
    id: "5",
    marksObtained: 76,
    totalObtained: 100,
    dateOfExam: "2024-03-15",
    gradedAt: "2024-03-17",
  },
];

const batchLeaderboard = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    enrollmentNumber: "2023BCS001",
    totalMarks: 450,
    rank: 1,
    center: { name: "Delhi Center" },
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice@example.com",
    enrollmentNumber: "2023BCS002",
    totalMarks: 445,
    rank: 2,
    center: { name: "Delhi Center" },
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    enrollmentNumber: "2023BCS003",
    totalMarks: 440,
    rank: 3,
    center: { name: "Delhi Center" },
  },
  {
    id: "4",
    name: "Carol Davis",
    email: "carol@example.com",
    enrollmentNumber: "2023BCS004",
    totalMarks: 435,
    rank: 4,
    center: { name: "Delhi Center" },
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    enrollmentNumber: "2023BCS005",
    totalMarks: 430,
    rank: 5,
    center: { name: "Delhi Center" },
  },
];

const departmentLeaderboard = [
  {
    id: "1",
    name: "Sarah Connor",
    email: "sarah@example.com",
    enrollmentNumber: "2023BCS101",
    totalMarks: 465,
    rank: 1,
    center: { name: "Mumbai Center" },
  },
  {
    id: "2",
    name: "Mike Ross",
    email: "mike@example.com",
    enrollmentNumber: "2023BCS102",
    totalMarks: 455,
    rank: 2,
    center: { name: "Bangalore Center" },
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    enrollmentNumber: "2023BCS001",
    totalMarks: 450,
    rank: 3,
    center: { name: "Delhi Center" },
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@example.com",
    enrollmentNumber: "2023BCS103",
    totalMarks: 448,
    rank: 4,
    center: { name: "Chennai Center" },
  },
  {
    id: "5",
    name: "James Bond",
    email: "james@example.com",
    enrollmentNumber: "2023BCS104",
    totalMarks: 442,
    rank: 5,
    center: { name: "Hyderabad Center" },
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: unknown;
  }>;
  label?: string;
}

interface FilterState {
  semester: number;
  course: string;
  testType: string;
  testNumber: string;
}

export default function AcademicsSection() {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    semester: 3,
    course: "CSE401S3",
    testType: "FORTNIGHTLY_TEST",
    testNumber: "1",
  });

  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    semester: 3,
    course: "CSE401S3",
    testType: "FORTNIGHTLY_TEST",
    testNumber: "1",
  });

  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<"class" | "overall">(
    "class"
  );
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);

  // Check if filters have changed
  const hasFiltersChanged = () => {
    return (
      pendingFilters.semester !== activeFilters.semester ||
      pendingFilters.course !== activeFilters.course ||
      pendingFilters.testType !== activeFilters.testType ||
      pendingFilters.testNumber !== activeFilters.testNumber
    );
  };

  const handleUpdateFilters = () => {
    setActiveFilters(pendingFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      semester: 3,
      course: "CSE401S3",
      testType: "FORTNIGHTLY_TEST",
      testNumber: "1",
    };
    setPendingFilters(resetFilters);
  };

  // Utility functions
  const getAvailableSemesters = () => {
    const semesters = [];
    for (let i = 1; i <= studentProfile.semesterNo; i++) {
      semesters.push(i);
    }
    return semesters;
  };

  const getCoursesForSemester = (semester: number) => {
    return academicData.courses.filter((course) => {
      const semesterPart = course.code.slice(-2);
      if (semesterPart.startsWith("S")) {
        const semesterNumber = parseInt(semesterPart.substring(1));
        return semesterNumber === semester;
      }
      return false;
    });
  };

  const getTestTypes = () => {
    return [
      { value: "FORTNIGHTLY_TEST", label: "Fortnightly Test" },
      { value: "ASSIGNMENT", label: "Assignment" },
      { value: "MID_SEM", label: "Mid Semester" },
      { value: "END_SEM", label: "End Semester" },
      { value: "INTERVIEW", label: "Interview" },
    ];
  };

  const getTestNumbers = () => {
    const numbers = [];
    const maxTests =
      pendingFilters.testType === "FORTNIGHTLY_TEST"
        ? 12
        : pendingFilters.testType === "ASSIGNMENT"
        ? 5
        : pendingFilters.testType === "INTERVIEW"
        ? 4
        : 2;

    for (let i = 1; i <= maxTests; i++) {
      numbers.push(i.toString());
    }
    return numbers;
  };

  const getTestTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      FORTNIGHTLY_TEST: "Fortnightly Tests",
      ASSIGNMENT: "Assignments",
      MID_SEM: "Mid Semester Exams",
      END_SEM: "End Semester Exams",
      INTERVIEW: "Interviews",
    };
    return typeMap[type] || type;
  };

  const getChartData = () => {
    return courseScores.map((score, index) => ({
      test: `Test ${index + 1}`,
      percentage: Math.round((score.marksObtained / score.totalObtained) * 100),
      marks: score.marksObtained,
      maxMarks: score.totalObtained,
    }));
  };

  const getLeaderboardData = (type: "class" | "overall") => {
    const data = type === "class" ? batchLeaderboard : departmentLeaderboard;
    return data.map((student) => ({
      rank: student.rank,
      name: student.id === studentProfile.id ? "You" : student.name,
      avatar: student.id === studentProfile.id ? "Y" : student.name.charAt(0),
      marks: student.totalMarks,
      percentage: Math.round((student.totalMarks / 500) * 100),
      isCurrentUser: student.id === studentProfile.id,
      location:
        type === "class"
          ? `Batch ${studentProfile.batch.name}`
          : `Department ${studentProfile.department.name}`,
    }));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">
        #{rank}
      </span>
    );
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
  };

  const getSemesterFromCode = (code: string): number => {
    const semesterPart = code.slice(-2);
    if (semesterPart.startsWith("S")) {
      const semesterNumber = parseInt(semesterPart.substring(1));
      return isNaN(semesterNumber) ? 0 : semesterNumber;
    }
    return 0;
  };

  const getOngoingCourses = () => {
    return academicData.courses.filter(
      (course) => getSemesterFromCode(course.code) === studentProfile.semesterNo
    );
  };

  const getCompletedCourses = () => {
    return academicData.courses.filter(
      (course) => getSemesterFromCode(course.code) < studentProfile.semesterNo
    );
  };

  const getUniqueSemesters = () => {
    const completedCourses = getCompletedCourses();
    const semesters = new Set<number>();
    completedCourses.forEach((course) => {
      const semester = getSemesterFromCode(course.code);
      if (semester > 0) semesters.add(semester);
    });
    return Array.from(semesters).sort((a, b) => a - b);
  };

  const getFilteredCompletedCourses = () => {
    const completed = getCompletedCourses();
    if (semesterFilter === "all") return completed;
    return completed.filter(
      (course) => getSemesterFromCode(course.code) === semesterFilter
    );
  };

  const LeaderboardTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-3">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const openLeaderboardModal = (type: "class" | "overall") => {
    setLeaderboardType(type);
    setIsLeaderboardModalOpen(true);
  };

  const ongoingCourses = getOngoingCourses();
  const availableCourses = getCoursesForSemester(pendingFilters.semester);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm border border-gray-400  shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Academics & Performance
              </h1>
              <p className="text-gray-200">
                Track your academic progress and performance metrics
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-br from-white to-indigo-50 px-4 py-3 rounded-sm border border-gray-200">
                <div className="text-sm text-slate-900 font-medium">Batch</div>
                <div className="text-xl font-bold text-slate-800">
                  {studentProfile.batch.name}
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 px-4 py-3 rounded-sm border border-gray-200">
                <div className="text-sm text-slate-900 font-medium">
                  Semester
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {studentProfile.semesterNo}rd
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 px-4 py-3 rounded-sm border border-gray-200">
                <div className="text-sm text-slate-900 font-medium">
                  Active Courses
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {ongoingCourses.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls - More Prominent */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg p-6 border border-gray-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Performance Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white rounded-sm px-4 py-3 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer shadow-sm"
                  value={pendingFilters.semester}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      semester: parseInt(e.target.value),
                    }))
                  }
                >
                  {getAvailableSemesters().map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white rounded-sm px-4 py-3 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer shadow-sm"
                  value={pendingFilters.course}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      course: e.target.value,
                    }))
                  }
                >
                  {availableCourses.length === 0 ? (
                    <option value="">No courses available</option>
                  ) : (
                    availableCourses.map((course) => (
                      <option key={course.id} value={course.code}>
                        {course.code.toUpperCase()}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white rounded-sm px-4 py-3 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer shadow-sm"
                  value={pendingFilters.testType}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      testType: e.target.value,
                    }))
                  }
                >
                  {getTestTypes().map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Number
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white rounded-sm px-4 py-3 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer shadow-sm"
                  value={pendingFilters.testNumber}
                  onChange={(e) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      testNumber: e.target.value,
                    }))
                  }
                >
                  {getTestNumbers().map((test) => (
                    <option key={test} value={test}>
                      Test {test}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleUpdateFilters}
                disabled={!hasFiltersChanged() || !pendingFilters.course}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium transition-all duration-200 ${
                  hasFiltersChanged() && pendingFilters.course
                    ? "bg-slate-900 hover:bg-slate-700 text-white shadow-md hover:shadow-lg transform cursor-pointer duration-200"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Update Results
              </button>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-medium text-gray-600 hover:bg-slate-900 hover:text-white transition-all border border-gray-400 duration-200 ease-in-out cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>

            {hasFiltersChanged() && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-sm text-sm font-medium">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Click &ldquo;Update Results&ldquo; to apply changes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart - Full Width */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
          <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4 drop-shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              {activeFilters.course.toUpperCase()} -{" "}
              {getTestTypeLabel(activeFilters.testType)} Performance Trend
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="test"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickLine={{ stroke: "#6b7280" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickLine={{ stroke: "#6b7280" }}
                  />
                  <Tooltip content={<LeaderboardTooltip />} />
                  <Bar
                    dataKey="percentage"
                    fill="#1c398e"
                    radius={[6, 6, 0, 0]}
                    name="Performance"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Leaderboards Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Class Leaderboard */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
            <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Class Leaderboard - Test {activeFilters.testNumber}
                </h3>
              </div>
              <button
                onClick={() => openLeaderboardModal("class")}
                className="text-slate-900 hover:scale-110 duration-200 transition-transform ease-in-out text-sm font-medium cursor-pointer"
              >
                <ArrowUpRight className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Compact Info Tiles */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Rank
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    #
                    {getLeaderboardData("class").find((s) => s.isCurrentUser)
                      ?.rank || "-"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Score
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {getLeaderboardData("class").find((s) => s.isCurrentUser)
                      ?.marks || "-"}
                  </div>
                </div>
              </div>

              {/* Top 3 Students */}
              <div className="space-y-3">
                {getLeaderboardData("class")
                  .slice(0, 3)
                  .map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center gap-4 p-4 rounded-sm border-2 transition-all duration-200 ${
                        student.rank === 1
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(student.rank)}
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full ${getRankColor(
                          student.rank
                        )} flex items-center justify-center text-white font-bold`}
                      >
                        {student.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.marks} marks • {student.percentage}%
                        </p>
                      </div>
                      {student.isCurrentUser && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Overall Leaderboard */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
            <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Overall Leaderboard - Test {activeFilters.testNumber}
                </h3>
              </div>
              <button
                onClick={() => openLeaderboardModal("overall")}
                className="text-slate-900 hover:scale-110 duration-200 transition-transform ease-in-out text-sm font-medium cursor-pointer"
              >
                <ArrowUpRight className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Compact Info Tiles */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Rank
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    #
                    {getLeaderboardData("overall").find((s) => s.isCurrentUser)
                      ?.rank || "-"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  {" "}
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Score
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {getLeaderboardData("overall").find((s) => s.isCurrentUser)
                      ?.marks || "-"}
                  </div>
                </div>
              </div>

              {/* Top 3 Students */}
              <div className="space-y-3">
                {getLeaderboardData("overall")
                  .slice(0, 3)
                  .map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center gap-4 p-4 rounded-sm border-2 transition-all duration-200 ${
                        student.rank === 1
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(student.rank)}
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full ${getRankColor(
                          student.rank
                        )} flex items-center justify-center text-white font-bold`}
                      >
                        {student.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.marks} marks • {student.percentage}%
                        </p>
                      </div>
                      {student.isCurrentUser && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Tables - Collapsible Sections */}
        <div className="space-y-6">
          {/* Ongoing Courses */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
            <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Current Courses - Semester {studentProfile.semesterNo}
                </h3>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {ongoingCourses.length} courses
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-4 font-semibold text-gray-800">
                        Course Code
                      </th>
                      <th className="text-left py-4 font-semibold text-gray-800">
                        Semester
                      </th>
                      <th className="text-left py-4 font-semibold text-gray-800">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ongoingCourses.map((course, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                      >
                        <td className="py-4 font-medium text-gray-900">
                          {course.code}
                        </td>
                        <td className="py-4 text-gray-600">
                          Semester {getSemesterFromCode(course.code)}
                        </td>
                        <td className="py-4 text-gray-600">{course.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Completed Courses - Collapsible */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
            <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Completed Courses
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-slate-900" />
                    <select
                      className="bg-slate-900 text-white rounded-sm px-3 py-2 text-sm appearance-none cursor-pointer min-w-[100px]"
                      value={semesterFilter}
                      onChange={(e) =>
                        setSemesterFilter(
                          e.target.value === "all"
                            ? "all"
                            : parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="all">All Semesters</option>
                      {getUniqueSemesters().map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() =>
                      setShowCompletedCourses(!showCompletedCourses)
                    }
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    {showCompletedCourses ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {showCompletedCourses ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {showCompletedCourses && (
              <div className="p-6">
                {getFilteredCompletedCourses().length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      No completed courses found
                    </h4>
                    <p className="text-gray-500">
                      No courses match the selected semester filter.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="text-left py-4 font-semibold text-gray-800">
                            Course Code
                          </th>
                          <th className="text-left py-4 font-semibold text-gray-800">
                            Semester
                          </th>
                          <th className="text-left py-4 font-semibold text-gray-800">
                            Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredCompletedCourses().map((course, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                          >
                            <td className="py-4 font-medium text-gray-900">
                              {course.code}
                            </td>
                            <td className="py-4 text-gray-600">
                              Semester {getSemesterFromCode(course.code)}
                            </td>
                            <td className="py-4 text-gray-600">
                              {course.credits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Modal - Improved */}
        {isLeaderboardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-sm flex items-center justify-center">
                      {leaderboardType === "class" ? (
                        <Users className="w-4 h-4 text-white" />
                      ) : (
                        <Trophy className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      {leaderboardType === "class" ? "Class" : "Overall"}{" "}
                      Leaderboard - Test {activeFilters.testNumber}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsLeaderboardModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-sm transition-colors duration-200 cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-3">
                  {getLeaderboardData(leaderboardType).map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                        student.isCurrentUser
                          ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(student.rank)}
                      </div>
                      <div
                        className={`w-14 h-14 rounded-full ${getRankColor(
                          student.rank
                        )} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {student.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-lg">
                          {student.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {student.location}
                          </span>
                          <span className="text-sm text-gray-600">
                            Rank #{student.rank}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {student.marks}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.percentage}%
                        </p>
                      </div>
                      {student.isCurrentUser && (
                        <span className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
