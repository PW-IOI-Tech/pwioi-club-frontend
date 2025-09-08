"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
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
  Award,
  Target,
  BarChart3,
  FileText,
  ChevronRight,
} from "lucide-react";

interface FilterState {
  center: string;
  school: string;
  batch: string;
  division: string;
  semesterId: string;
  subject: string;
  examType: string;
  examNumber: string;
}

const MarksDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    center: "",
    school: "",
    batch: "",
    division: "",
    semesterId: "",
    subject: "",
    examType: "",
    examNumber: "",
  });

  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [testType, setTestType] = useState<any[]>([]);
  const [testNumbers, _setTestNumbers] = useState<any[]>([]);

  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [_examTypes, setExamTypes] = useState<string[]>([]);
  const [_examNumbers, setExamNumbers] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`, {
        withCredentials: true,
      })
      .then((res) => {
        setCenters(res.data.data || []);
      })
      .catch(() => console.error("Failed to fetch centers"));
  }, []);

  useEffect(() => {
    if (filters.center) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${filters.center}`,
          { withCredentials: true }
        )
        .then((res) => setSchools(res.data?.data || []));
    }
  }, [filters.center]);

  useEffect(() => {
    if (filters.school) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${filters.school}`,
          { withCredentials: true }
        )
        .then((res) => setBatches(res.data?.data || []));
    }
  }, [filters.school]);

  useEffect(() => {
    if (filters.batch) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${filters.batch}`,
          { withCredentials: true }
        )
        .then((res) => setDivisions(res.data?.data || []));
    }
  }, [filters.batch]);

  useEffect(() => {
    if (filters.division) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${filters.division}`,
          { withCredentials: true }
        )
        .then((res) => setSemesters(res.data?.data || []));
    }
  }, [filters.division]);

  useEffect(() => {
    if (filters.semesterId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${filters.semesterId}`,
          { withCredentials: true }
        )
        .then((res) => setSubjects(res.data?.data || []));
    }
  }, [filters.semesterId]);

  useEffect(() => {
    if (filters.subject) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-academics/exams/subject/${filters.subject}/past-exam-types`,
          { withCredentials: true }
        )
        .then((res) => setTestType(res.data?.data || []));
    }
  }, [filters.subject]);

  useEffect(() => {
   const fetchAnalytics = async () => {
    if(!filters?.subject) {
      return
    }
  try {
    setLoading(true);
    setError(null);

    const queryParams: any = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams[key] = value;
    });

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/exam-analytics`,
      {
        params: queryParams,
        withCredentials: true,
      }
    );

    const data = res.data?.data || {};

    setDashboardStats({
      totalStudents: data.overview?.totalStudents || 0,
      averageScore: data.overview?.averageScore || 0,
      passPercentage: data.overview?.passRate || 0,
      highestScore: data.overview?.highestScore || 0,
      totalExams: data.overview?.totalExams || 0,
      subjectsCount: data.overview?.subjects?.length || 0,
    });

    setChartData(data.performanceBreakdown || []);

    setExamTypes(data.examTypes || []);
    setExamNumbers(data.examNumbers || []);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch analytics");
  } finally {
    setLoading(false);
  }
};


    if (Object.values(filters).some((v) => v)) {
      fetchAnalytics();
    }
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#12294c] rounded-lg shadow-sm border border-slate-700 p-6 py-8 mb-6">
          <h1 className="text-2xl md:text-3xl text-white font-semibold mb-2">
            Marks Dashboard
          </h1>
          <p className="text-slate-200 text-sm">
            Track, analyze, and manage student performance.
          </p>
        </div>

        <section className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
            {[
              { label: "Center", key: "center", options: centers },
              { label: "School", key: "school", options: schools },
              { label: "Batch", key: "batch", options: batches },
              { label: "Division", key: "division", options: divisions },
              { label: "Semester", key: "semesterId", options: semesters },
              { label: "Subject", key: "subject", options: subjects },
              { label: "Exam Type", key: "examType", options: testType },
              { label: "Exam Number", key: "examNumber", options: testNumbers },
            ].map((filter) => (
              <div key={filter.key}>
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
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-white cursor-pointer"
                >
                  <option value="">Select {filter.label}</option>
                  {filter.options.map((opt: any, i: number) => (
                    <option key={i} value={opt.id || opt}>
                      {opt.name || opt.code || opt.number}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        {dashboardStats && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {[
              {
                label: "Total Students",
                value: dashboardStats.totalStudents,
                icon: Users,
              },
              {
                label: "Avg Score",
                value: `${dashboardStats.averageScore}%`,
                icon: Target,
              },
              {
                label: "Pass Rate",
                value: `${dashboardStats.passPercentage}%`,
                icon: Award,
              },
              {
                label: "Highest Score",
                value: dashboardStats.highestScore,
                icon: TrendingUp,
              },
              {
                label: "Total Exams",
                value: dashboardStats.totalExams,
                icon: FileText,
              },
              {
                label: "Subjects",
                value: dashboardStats.subjectsCount,
                icon: BookOpen,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="h-5 w-5 text-indigo-600" />
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

        {/* Charts */}
        {chartData.length > 0 ? (
          <section className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Performance Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="6 6" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#3b82f6" />
                    <Bar dataKey="passPercentage" fill="#1d4ed8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="6 6" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line dataKey="averageScore" stroke="#3b82f6" />
                    <Line dataKey="highestScore" stroke="#10b981" />
                    <Line dataKey="lowestScore" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 p-12 text-center shadow-sm">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select Filters to View Data
            </h3>
            <p className="text-gray-500">
              Please apply filters to view analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksDashboard;
