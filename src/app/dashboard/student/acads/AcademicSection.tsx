"use client";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
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

interface StudentProfile {
  batch: string;
  semesterNo: number;
  id: string;
}

interface AcademicData {
  current_semester: any;
  past_semesters: any[];
  courses: any[];
}

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-academics`;

export default function AcademicsSection() {
  const [studentProfile, _setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [pendingFilters, setPendingFilters] = useState<FilterState | null>(
    null
  );
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<"class" | "overall">(
    "class"
  );
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any>({
    class: [],
    overall: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]);

const fetchExams = useCallback(
  async (subjectId: string, examType: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${subjectId}`,
        {
          params: { exam_type: examType },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setExams(response.data.data.exams || []);
        return response.data.data.exams;
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
      setExams([]);
    }
  },
  []
);


  const fetchCurrentSemester = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/academics/current-semester`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.error("Error fetching current semester:", err);
       return null;
    }
  }, []);

  const fetchPastSemesters = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/academics/past-semesters`, {
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.error("Error fetching past semesters:", err);
      return null;
    }
  }, []);

  const fetchPerformanceTrends = useCallback(
    async (
      semesterId: string,
      subjectId: string,
      examType: string,
      examName: string
    ) => {
      try {
        const response = await axios.get(`${API_BASE}/performance/trends`, {
          params: {
            semester_id: semesterId,
            subject_id: subjectId,
            exam_type: examType,
            exam_name: examName,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          const trends = response.data.data.trends || [];
          const formatted = trends.map((t: any) => ({
            test: t.exam_name,
            percentage: Math.round(t.percentage),
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Error fetching performance trends:", err);
        setChartData([
          { test: "Test 1", percentage: 0 },
          { test: "Test 2", percentage: 0 },
          { test: "Test 3", percentage: 0 },
        ]);
      }
    },
    []
  );

  const fetchLeaderboard = useCallback(
    async (
      type: "class" | "overall",
      semesterId: string,
      subjectId: string,
      examType: string,
      examName: string
    ) => {
      try {
        const endpoint =
          type === "class" ? "/leaderboard/division" : "/leaderboard/overall";
        const response = await axios.get(`${API_BASE}${endpoint}`, {
          params: {
            semester_id: semesterId,
            subject_id: subjectId,
            exam_type: examType,
            exam_name: examName,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          const leaderboardEntries = response.data.data.leaderboard.map(
            (entry: any) => ({
              rank: entry.rank,
              name: entry.student_name,
              marks: entry.marks_obtained,
              percentage: entry.percentage,
              avatar: entry.student_name.charAt(0).toUpperCase(),
              isCurrentUser: entry.is_current_user,
              location:
                type === "overall" ? entry.center_name : entry.division_code,
            })
          );

          setLeaderboardData((prev: any) => ({
            ...prev,
            [type]: leaderboardEntries,
          }));
        }
      } catch (err) {
        console.error(`Error fetching ${type} leaderboard:`, err);
        // Set empty leaderboard data on error
        setLeaderboardData((prev: any) => ({
          ...prev,
          [type]: [],
        }));
      }
    },
    []
  );

useEffect(() => {
  const initializeAcademicData = async () => {
    try {
      setLoading(true);

      const [currentSemester, pastSemesters] = await Promise.all([
        fetchCurrentSemester(),
        fetchPastSemesters(),
      ]);

      // ✅ set student profile here
      if (currentSemester?.semester_info) {
        _setStudentProfile({
          batch: currentSemester.semester_info.batch_name || "N/A",
          semesterNo: currentSemester.semester_info.semester_number,
          id: currentSemester.semester_info.student_id,
        });
      }

      const allCourses: any[] = [];

      // Handle current semester subjects
      if (currentSemester?.subjects) {
        currentSemester.subjects.forEach((subject: any) => {
          allCourses.push({
            id: subject.subject_id,
            code: subject.subject_code,
            name: subject.subject_name,
            credits: subject.credits,
            semester: currentSemester.semester_info.semester_number,
            teacher_name: subject.teacher_name,
            teacher_email: subject.teacher_email,
          });
        });
      }

      // Handle past semesters...
      if (
        pastSemesters?.past_semesters &&
        pastSemesters.past_semesters.length > 0
      ) {
        pastSemesters.past_semesters.forEach((semester: any) => {
          if (semester.subjects) {
            semester.subjects.forEach((subject: any) => {
              allCourses.push({
                id: subject.subject_id,
                code: subject.subject_code,
                name: subject.subject_name,
                credits: subject.credits,
                semester: semester.semester_number,
                teacher_name: subject.teacher_name,
                teacher_email: subject.teacher_email,
              });
            });
          }
        });
      }

      setAcademicData({
        current_semester: currentSemester,
        past_semesters: pastSemesters?.past_semesters || [],
        courses: allCourses,
      });

      // Initialize filters...
      if (allCourses.length > 0) {
        const firstCourse = allCourses[0];
        const initialFilters = {
          semester: firstCourse.semester,
          course: firstCourse.code,
          testType: "FORTNIGHTLY",
          testNumber: "1",
        };
        setPendingFilters(initialFilters);
      }
    } catch (err) {
      console.error("Error initializing academic data:", err);
      setError("Failed to load academic data");
    } finally {
      setLoading(false);
    }
  };

  initializeAcademicData();
}, [fetchCurrentSemester, fetchPastSemesters]);


// Update trends and leaderboard when filters change
useEffect(() => {
  const updateData = async () => {
    if (
      !activeFilters ||
      !academicData ||
      !activeFilters.semester ||
      !activeFilters.course ||
      !activeFilters.testType ||
      !activeFilters.testNumber
    ) {
      return;
    }

    const selectedCourse = academicData.courses.find(
      (c) => c.code === activeFilters.course
    );
    if (!selectedCourse) return;

    let semesterId = "";

    // Find semester ID based on the selected semester
    if (
      academicData.current_semester?.semester_info.semester_number ===
      activeFilters.semester
    ) {
      semesterId = academicData.current_semester.semester_info.semester_id;
    } else {
      const pastSemester = academicData.past_semesters?.find(
        (s: any) => s.semester_number === activeFilters.semester
      );
      if (pastSemester) {
        semesterId = pastSemester.semester_id;
      }
    }

    if (!semesterId) return;

    const examName = `${getTestTypeLabel(activeFilters.testType)} ${
      activeFilters.testNumber
    }`;

    // Fetch performance trends
    await fetchPerformanceTrends(
      semesterId,
      selectedCourse.id,
      activeFilters.testType,
      examName
    );

    // Fetch both leaderboards
    await Promise.all([
      fetchLeaderboard(
        "class",
        semesterId,
        selectedCourse.id,
        activeFilters.testType,
        examName
      ),
      fetchLeaderboard(
        "overall",
        semesterId,
        selectedCourse.id,
        activeFilters.testType,
        examName
      ),
    ]);
  };

  updateData();
}, [activeFilters, academicData, fetchPerformanceTrends, fetchLeaderboard]);


  const hasFiltersChanged = () => {
    if (!activeFilters || !pendingFilters) return false;
    return (
      pendingFilters.semester !== activeFilters.semester ||
      pendingFilters.course !== activeFilters.course ||
      pendingFilters.testType !== activeFilters.testType ||
      pendingFilters.testNumber !== activeFilters.testNumber
    );
  };

  const handleUpdateFilters = () => {
    if (pendingFilters) setActiveFilters(pendingFilters);
  };

  const handleResetFilters = () => {
    if (academicData?.courses && academicData.courses.length > 0) {
      const firstCourse = academicData.courses[0];
      const resetFilters = {
        semester: firstCourse.semester,
        course: firstCourse.code,
        testType: "FORTNIGHTLY",
        testNumber: "1",
      };
      setPendingFilters(resetFilters);
      setActiveFilters(resetFilters);
    }
  };

  const getAvailableSemesters = () => {
    if (!studentProfile) return [];
    const semesters = [];
    for (let i = 1; i <= (studentProfile.semesterNo || 1); i++) {
      semesters.push(i);
    }
    return semesters;
  };

  const getAvailableCourses = () => {
    if (!academicData || !pendingFilters) return [];
    return academicData.courses.filter(
      (course) => course.semester === pendingFilters.semester
    );
  };

  const getTestTypes = () => {
    return [
      { value: "FORTNIGHTLY", label: "Fortnightly Test" },
      { value: "INTERNAL_ASSESSMENT", label: "Assignment" },
      { value: "MID_SEM", label: "Mid Semester" },
      { value: "END_SEM", label: "End Semester" },
      { value: "INTERVIEW", label: "Interview" },
      { value: "PROJECT", label: "Projects" },
    ];
  };

  const getTestNumbers = () => {
    return ["1", "2", "3", "4", "5"];
  };

  const getTestTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      FORTNIGHTLY: "Fortnightly Test",
      INTERNAL_ASSESSMENT: "Assignment",
      MID_SEM: "Mid Semester Exam",
      END_SEM: "End Semester Exam",
      INTERVIEW: "Interview",
      PROJECT: "Project",
    };
    return typeMap[type] || type;
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

  const getOngoingCourses = () => {
    if (!academicData || !studentProfile) return [];
    return academicData.courses.filter(
      (course: any) => course.semester === studentProfile.semesterNo
    );
  };

  const getCompletedCourses = () => {
    if (!academicData || !studentProfile) return [];
    return academicData.courses.filter(
      (course: any) => course.semester < studentProfile.semesterNo
    );
  };

  const getFilteredCompletedCourses = () => {
    const completed = getCompletedCourses();
    if (semesterFilter === "all") return completed;
    return completed.filter((course) => course.semester === semesterFilter);
  };

  const getUniqueSemesters = () => {
    const completed = getCompletedCourses();
    const semesters = [...new Set(completed.map((course) => course.semester))];
    return semesters.sort((a, b) => a - b);
  };

  const getChartData = () => {
    return chartData;
  };

  const getLeaderboardData = (type: "class" | "overall") => {
    return leaderboardData[type] || [];
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading academic data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!studentProfile || !academicData || !pendingFilters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading academic data...</div>
      </div>
    );
  }

  const ongoingCourses = getOngoingCourses();
  const availableCourses = getAvailableCourses();
  const currentSemester = academicData.current_semester;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm border border-gray-400 shadow-sm p-6">
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
                  {studentProfile.batch || "N/A"}
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-indigo-50 px-4 py-3 rounded-sm border border-gray-200">
                <div className="text-sm text-slate-900 font-medium">
                  Semester
                </div>
                <div className="text-xl font-bold text-slate-800">
                  {studentProfile.semesterNo}
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

        {/* Filter Controls */}
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
                    setPendingFilters((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        semester: parseInt(e.target.value),
                        course: "",
                      };
                    })
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
                  onChange={(e) => {
                    const selectedCourse = e.target.value;

                    setPendingFilters((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        course: selectedCourse, // ✅ update filter
                      };
                    });

                    // ✅ fetch exams only if we have testType
                    if (selectedCourse && pendingFilters?.testType) {
                      const selectedCourseObj = availableCourses.find(
                        (c: any) => c.code === selectedCourse
                      );
                      if (selectedCourseObj) {
                        fetchExams(
                          selectedCourseObj.id,
                          pendingFilters.testType
                        );
                      }
                    }
                  }}
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((course: any, idx: number) => (
                    <option key={course.id || idx} value={course.code}>
                      {course.code?.toUpperCase?.() || ""}
                    </option>
                  ))}
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
                  onChange={(e) =>
                    setPendingFilters((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        testType: e.target.value,
                      };
                    })
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
                    setPendingFilters((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        testNumber: e.target.value,
                      };
                    })
                  }
                >
                  {exams.map((test) => (
                    <option key={test} value={test}>
                      {test?.name}
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
                  Click &quot;Update Results&quot; to apply changes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
          <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4 drop-shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              {activeFilters?.course.toUpperCase()} -{" "}
                {getTestTypeLabel(activeFilters?.testType ?? "Exam")} Performance Trend
            </h3>
          </div>
          <div className="p-6">
            {getChartData().length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No Performance Data
                  </h4>
                  <p className="text-gray-500">
                    Performance trends will appear here once exam results are
                    available.
                  </p>
                </div>
              </div>
            ) : (
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
            )}
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
                  Class Leaderboard - Test {activeFilters?.testNumber}
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
                    {getLeaderboardData("class").find(
                      (s: any) => s.isCurrentUser
                    )?.rank || "-"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Score
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {getLeaderboardData("class").find(
                      (s: any) => s.isCurrentUser
                    )?.marks || "-"}
                  </div>
                </div>
              </div>

              {/* Top 3 Students */}
              <div className="space-y-3">
                {getLeaderboardData("class")
                  .slice(0, 3)
                  .map((student: any) => (
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
                  Overall Leaderboard - Test {activeFilters?.testNumber}
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
                    {getLeaderboardData("overall").find(
                      (s: any) => s.isCurrentUser
                    )?.rank || "-"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-indigo-50 p-3 rounded-sm shadow-sm border border-gray-400 text-center">
                  <div className="text-xs text-slate-900 font-medium mb-1">
                    Your Score
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {getLeaderboardData("overall").find(
                      (s: any) => s.isCurrentUser
                    )?.marks || "-"}
                  </div>
                </div>
              </div>

              {/* Top 3 Students */}
              <div className="space-y-3">
                {getLeaderboardData("overall")
                  .slice(0, 3)
                  .map((student: any) => (
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
                  Current Courses - Semester{" "}
                  {currentSemester?.semester_info?.semester_number}
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
                        Course Name
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
                    {ongoingCourses.map((course: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                      >
                        <td className="py-4 font-medium text-gray-900">
                          {course.code}
                        </td>
                        <td className="py-4 text-gray-600">
                          {course.name || "N/A"}
                        </td>
                        <td className="py-4 text-gray-600">
                          Semester {course.semester}
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
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getCompletedCourses().length} courses
                  </span>
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
                      {semesterFilter === "all"
                        ? "You haven't completed any courses yet."
                        : "No courses match the selected semester filter."}
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
                            Course Name
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
                        {getFilteredCompletedCourses().map(
                          (course: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                            >
                              <td className="py-4 font-medium text-gray-900">
                                {course.code}
                              </td>
                              <td className="py-4 text-gray-600">
                                {course.name || "N/A"}
                              </td>
                              <td className="py-4 text-gray-600">
                                Semester {course.semester}
                              </td>
                              <td className="py-4 text-gray-600">
                                {course.credits}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Modal */}
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
                      Leaderboard - Test {activeFilters?.testNumber}
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
                {getLeaderboardData(leaderboardType).length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No data available
                    </h3>
                    <p className="text-gray-500">
                      Leaderboard data will appear here once results are
                      published.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getLeaderboardData(leaderboardType).map((student: any) => (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
