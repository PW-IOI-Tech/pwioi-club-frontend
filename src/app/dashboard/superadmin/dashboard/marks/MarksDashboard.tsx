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
} from "recharts";
import {
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  MapPin,
  Award,
  Target,
  BarChart3,
  FileText,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

interface MarksData {
  subject: string;
  examType: string;
  examNumber: number;
  maxMarks: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  passPercentage: number;
  studentsAppeared: number;
}

interface FilterState {
  center: string;
  school: string;
  batch: string;
  division: string;
  semester: string;
  subject: string;
  examType: string;
  examNumber: string;
}

interface DashboardStats {
  totalStudents: number;
  averageScore: number;
  passPercentage: number;
  highestScore: number;
  totalExams: number;
  subjectsCount: number;
}

const MarksDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    center: "",
    school: "",
    batch: "",
    division: "",
    semester: "",
    subject: "",
    examType: "",
    examNumber: "",
  });

  const centers = ["bangalore", "noida", "pune", "lucknow"];
  const schools = ["SOT", "SOH", "SOM"];
  const batches = ["23", "24", "25"];
  const divisions = ["B1", "B2"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Machine Learning",
    "Computer Graphics",
    "Artificial Intelligence",
    "Cybersecurity",
    "Mobile Development",
  ];
  const examTypes = [
    "Internal Assessment",
    "Mid-Term",
    "End-Term",
    "Assignment",
    "Quiz",
    "Project",
  ];

  const getExamNumbers = (examType: string) => {
    switch (examType) {
      case "Internal Assessment":
        return ["1", "2", "3"];
      case "Mid-Term":
        return ["1", "2"];
      case "End-Term":
        return ["1"];
      case "Assignment":
        return ["1", "2", "3", "4", "5"];
      case "Quiz":
        return ["1", "2", "3", "4", "5", "6"];
      case "Project":
        return ["1", "2"];
      default:
        return [];
    }
  };

  const generateMarksData = useMemo(() => {
    const data: MarksData[] = [];
    if (!filters.semester) return data;

    const semesterSubjects = subjects.slice(
      0,
      Math.min(6, parseInt(filters.semester) + 2)
    );

    if (!filters.subject) {
      semesterSubjects.forEach((subject) => {
        examTypes.forEach((examType) => {
          const examNums = getExamNumbers(examType);
          examNums.forEach((examNum) => {
            const maxMarks =
              examType === "End-Term"
                ? 100
                : examType === "Mid-Term"
                ? 50
                : examType === "Assignment"
                ? 20
                : examType === "Quiz"
                ? 10
                : examType === "Project"
                ? 50
                : 30;
            const avgMarks = Math.floor(maxMarks * (0.6 + Math.random() * 0.3));
            data.push({
              subject,
              examType,
              examNumber: parseInt(examNum),
              maxMarks,
              averageMarks: avgMarks,
              highestMarks: Math.min(
                maxMarks,
                avgMarks + Math.floor(Math.random() * (maxMarks - avgMarks))
              ),
              lowestMarks: Math.max(
                0,
                avgMarks - Math.floor(Math.random() * avgMarks * 0.5)
              ),
              passPercentage: Math.floor(60 + Math.random() * 35),
              studentsAppeared: Math.floor(20 + Math.random() * 80),
            });
          });
        });
      });
    } else if (!filters.examType) {
      examTypes.forEach((examType) => {
        const examNums = getExamNumbers(examType);
        examNums.forEach((examNum) => {
          const maxMarks =
            examType === "End-Term"
              ? 100
              : examType === "Mid-Term"
              ? 50
              : examType === "Assignment"
              ? 20
              : examType === "Quiz"
              ? 10
              : examType === "Project"
              ? 50
              : 30;
          const avgMarks = Math.floor(maxMarks * (0.6 + Math.random() * 0.3));
          data.push({
            subject: filters.subject,
            examType,
            examNumber: parseInt(examNum),
            maxMarks,
            averageMarks: avgMarks,
            highestMarks: Math.min(
              maxMarks,
              avgMarks + Math.floor(Math.random() * (maxMarks - avgMarks))
            ),
            lowestMarks: Math.max(
              0,
              avgMarks - Math.floor(Math.random() * avgMarks * 0.5)
            ),
            passPercentage: Math.floor(60 + Math.random() * 35),
            studentsAppeared: Math.floor(20 + Math.random() * 80),
          });
        });
      });
    } else if (!filters.examNumber) {
      const examNums = getExamNumbers(filters.examType);
      examNums.forEach((examNum) => {
        const maxMarks =
          filters.examType === "End-Term"
            ? 100
            : filters.examType === "Mid-Term"
            ? 50
            : filters.examType === "Assignment"
            ? 20
            : filters.examType === "Quiz"
            ? 10
            : filters.examType === "Project"
            ? 50
            : 30;
        const avgMarks = Math.floor(maxMarks * (0.6 + Math.random() * 0.3));
        data.push({
          subject: filters.subject,
          examType: filters.examType,
          examNumber: parseInt(examNum),
          maxMarks,
          averageMarks: avgMarks,
          highestMarks: Math.min(
            maxMarks,
            avgMarks + Math.floor(Math.random() * (maxMarks - avgMarks))
          ),
          lowestMarks: Math.max(
            0,
            avgMarks - Math.floor(Math.random() * avgMarks * 0.5)
          ),
          passPercentage: Math.floor(60 + Math.random() * 35),
          studentsAppeared: Math.floor(20 + Math.random() * 80),
        });
      });
    } else {
      const maxMarks =
        filters.examType === "End-Term"
          ? 100
          : filters.examType === "Mid-Term"
          ? 50
          : filters.examType === "Assignment"
          ? 20
          : filters.examType === "Quiz"
          ? 10
          : filters.examType === "Project"
          ? 50
          : 30;
      const avgMarks = Math.floor(maxMarks * (0.6 + Math.random() * 0.3));
      data.push({
        subject: filters.subject,
        examType: filters.examType,
        examNumber: parseInt(filters.examNumber),
        maxMarks,
        averageMarks: avgMarks,
        highestMarks: Math.min(
          maxMarks,
          avgMarks + Math.floor(Math.random() * (maxMarks - avgMarks))
        ),
        lowestMarks: Math.max(
          0,
          avgMarks - Math.floor(Math.random() * avgMarks * 0.5)
        ),
        passPercentage: Math.floor(60 + Math.random() * 35),
        studentsAppeared: Math.floor(20 + Math.random() * 80),
      });
    }
    return data;
  }, [filters]);

  const dashboardStats = useMemo((): DashboardStats => {
    if (generateMarksData.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        passPercentage: 0,
        highestScore: 0,
        totalExams: 0,
        subjectsCount: 0,
      };
    }
    const totalStudents = generateMarksData.reduce(
      (acc, data) => acc + data.studentsAppeared,
      0
    );
    const avgScore = Math.round(
      generateMarksData.reduce(
        (acc, data) => acc + (data.averageMarks / data.maxMarks) * 100,
        0
      ) / generateMarksData.length
    );
    const avgPassPercentage = Math.round(
      generateMarksData.reduce((acc, data) => acc + data.passPercentage, 0) /
        generateMarksData.length
    );
    const highestScore = Math.max(
      ...generateMarksData.map((data) => data.highestMarks)
    );
    const uniqueSubjects = new Set(
      generateMarksData.map((data) => data.subject)
    ).size;
    return {
      totalStudents,
      averageScore: avgScore,
      passPercentage: avgPassPercentage,
      highestScore,
      totalExams: generateMarksData.length,
      subjectsCount: uniqueSubjects,
    };
  }, [generateMarksData]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      if (key === "center") {
        newFilters.school = "";
        newFilters.batch = "";
        newFilters.division = "";
        newFilters.semester = "";
        newFilters.subject = "";
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "school") {
        newFilters.batch = "";
        newFilters.division = "";
        newFilters.semester = "";
        newFilters.subject = "";
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "batch") {
        newFilters.division = "";
        newFilters.semester = "";
        newFilters.subject = "";
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "division") {
        newFilters.semester = "";
        newFilters.subject = "";
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "semester") {
        newFilters.subject = "";
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "subject") {
        newFilters.examType = "";
        newFilters.examNumber = "";
      }
      if (key === "examType") {
        newFilters.examNumber = "";
      }
      return newFilters;
    });
  };

  const hasAnyFilterSelected = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  const clearAllFilters = () => {
    setFilters({
      center: "",
      school: "",
      batch: "",
      division: "",
      semester: "",
      subject: "",
      examType: "",
      examNumber: "",
    });
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
      case "subjects":
        return filters.semester
          ? subjects.slice(0, Math.min(6, parseInt(filters.semester) + 2))
          : [];
      case "examNumbers":
        return filters.examType ? getExamNumbers(filters.examType) : [];
      default:
        return [];
    }
  };

  const getChartData = () => {
    if (!filters.subject) {
      const subjectData = new Map();
      generateMarksData.forEach((item) => {
        if (!subjectData.has(item.subject)) {
          subjectData.set(item.subject, {
            subject: item.subject,
            averageScore: 0,
            totalExams: 0,
            passPercentage: 0,
          });
        }
        const existing = subjectData.get(item.subject);
        existing.averageScore += (item.averageMarks / item.maxMarks) * 100;
        existing.totalExams += 1;
        existing.passPercentage += item.passPercentage;
      });
      return Array.from(subjectData.values()).map((item) => ({
        ...item,
        averageScore: Math.round(item.averageScore / item.totalExams),
        passPercentage: Math.round(item.passPercentage / item.totalExams),
      }));
    } else if (!filters.examType) {
      const examTypeData = new Map();
      generateMarksData.forEach((item) => {
        if (!examTypeData.has(item.examType)) {
          examTypeData.set(item.examType, {
            examType: item.examType,
            averageScore: 0,
            totalExams: 0,
            passPercentage: 0,
          });
        }
        const existing = examTypeData.get(item.examType);
        existing.averageScore += (item.averageMarks / item.maxMarks) * 100;
        existing.totalExams += 1;
        existing.passPercentage += item.passPercentage;
      });
      return Array.from(examTypeData.values()).map((item) => ({
        ...item,
        averageScore: Math.round(item.averageScore / item.totalExams),
        passPercentage: Math.round(item.passPercentage / item.totalExams),
      }));
    } else {
      return generateMarksData.map((item) => ({
        examName: `${item.examType} ${item.examNumber}`,
        averageScore: Math.round((item.averageMarks / item.maxMarks) * 100),
        passPercentage: item.passPercentage,
        highestScore: Math.round((item.highestMarks / item.maxMarks) * 100),
        lowestScore: Math.round((item.lowestMarks / item.maxMarks) * 100),
      }));
    }
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 rounded-lg shadow-sm border border-slate-700 p-6 py-8 mb-6">
          <h1 className="text-2xl md:text-3xl text-white font-semibold mb-2">
            📊 Marks Dashboard
          </h1>
          <p className="text-slate-200 text-sm">
            Track, analyze, and manage student performance across all
            examinations and assessments.
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
                    Batch {filters.batch.slice(-2)}
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
                {filters.examType && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {filters.examType.split(" ")[0]}
                  </span>
                )}
                {filters.examNumber && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                    Exam {filters.examNumber}
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
              Filter Marks Data
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
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
                options: getFilteredOptions("subjects"),
                disabled: !filters.semester,
              },
              {
                label: "Exam Type",
                key: "examType",
                options: filters.semester ? examTypes : [],
                disabled: !filters.semester,
              },
              {
                label: "Exam Number",
                key: "examNumber",
                options: getFilteredOptions("examNumbers"),
                disabled: !filters.examType,
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
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {[
            {
              label: "Total Students",
              value: dashboardStats.totalStudents.toLocaleString(),
              icon: Users,
              color: "bg-slate-100",
              textColor: "text-slate-800",
            },
            {
              label: "Avg Score",
              value: `${dashboardStats.averageScore}%`,
              icon: Target,
              color: "bg-blue-100",
              textColor: "text-blue-800",
            },
            {
              label: "Pass Rate",
              value: `${dashboardStats.passPercentage}%`,
              icon: Award,
              color: "bg-indigo-100",
              textColor: "text-indigo-800",
            },
            {
              label: "Highest Score",
              value: dashboardStats.highestScore.toString(),
              icon: TrendingUp,
              color: "bg-purple-100",
              textColor: "text-purple-800",
            },
            {
              label: "Total Exams",
              value: dashboardStats.totalExams.toString(),
              icon: FileText,
              color: "bg-orange-100",
              textColor: "text-orange-800",
            },
            {
              label: "Subjects",
              value: dashboardStats.subjectsCount.toString(),
              icon: BookOpen,
              color: "bg-pink-100",
              textColor: "text-pink-800",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm hover:shadow-md transition-all duration-200"
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

        {filters.semester ? (
          <>
            <section className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="h-5 w-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900">
                  Performance Analytics
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: -15, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" />
                      <XAxis
                        dataKey={
                          !filters.subject
                            ? "subject"
                            : !filters.examType
                            ? "examType"
                            : "examName"
                        }
                        tick={{ fontSize: 11, fill: "#0f172a" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#0f172a" }}
                        label={{
                          value: "Percentage (%)",
                          angle: -90,
                          position: "insideLeft",
                          offset: -10,
                          fill: "#0f172a",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#cbd5e1",
                          borderRadius: "0.375rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          color: "#0f172a",
                          fontSize: "12px",
                        }}
                        formatter={(value, name, props) => [
                          `${value}%`,
                          props.dataKey === "averageScore"
                            ? "Average Score"
                            : "Pass Rate",
                        ]}
                        labelStyle={{ color: "#0f172a" }}
                      />
                      <Bar
                        dataKey="averageScore"
                        name="Average Score"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="passPercentage"
                        name="Pass Rate"
                        fill="#1d4ed8"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: -15, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" />
                      <XAxis
                        dataKey={
                          !filters.subject
                            ? "subject"
                            : !filters.examType
                            ? "examType"
                            : "examName"
                        }
                        tick={{ fontSize: 11, fill: "#0f172a" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#0f172a" }}
                        label={{
                          value: "Score (%)",
                          angle: -90,
                          position: "insideLeft",
                          offset: -10,
                          fill: "#0f172a",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#cbd5e1",
                          borderRadius: "0.375rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          color: "#0f172a",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        name="Average Score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", r: 3 }}
                      />
                      {filters.examType && filters.subject && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="highestScore"
                            name="Highest Score"
                            stroke="#10b981"
                            strokeWidth={1}
                            dot={{ fill: "#10b981", r: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="lowestScore"
                            name="Lowest Score"
                            stroke="#ef4444"
                            strokeWidth={1}
                            dot={{ fill: "#ef4444", r: 2 }}
                          />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-5 w-5 text-slate-900" />
                <h3 className="text-lg font-bold text-slate-900">
                  Performance Summary
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {!filters.subject
                          ? "Subject"
                          : !filters.examType
                          ? "Exam Type"
                          : "Exam"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pass Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.map((item, index) => {
                      const displayName = !filters.subject
                        ? item.subject
                        : !filters.examType
                        ? item.examType
                        : item.examName;
                      const avgScore = item.averageScore;
                      const passRate = item.passPercentage;

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {displayName}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                avgScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : avgScore >= 70
                                  ? "bg-yellow-100 text-yellow-800"
                                  : avgScore >= 60
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {avgScore}%
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {passRate}%
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    avgScore >= 80
                                      ? "bg-blue-500"
                                      : avgScore >= 70
                                      ? "bg-blue-400"
                                      : avgScore >= 60
                                      ? "bg-blue-300"
                                      : "bg-red-400"
                                  }`}
                                  style={{ width: `${avgScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {avgScore}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 p-12 text-center shadow-sm">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select Semester to View Data
            </h3>
            <p className="text-gray-500">
              Please select a semester from the filters above to view student
              marks and performance analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksDashboard;
