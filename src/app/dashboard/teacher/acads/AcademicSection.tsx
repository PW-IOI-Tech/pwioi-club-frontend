"use client";

import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  Filter,
  AlertCircle,
  BarChart3,
  Users,
  Search,
  ArrowUpDown,
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

interface Course {
  class: string;
  semester: number;
  subject: string;
  totalStudents: number;
}

interface PerformanceData {
  test: string;
  percentage: number;
}

interface StudentMark {
  enrollmentId: string;
  name: string;
  marks: number;
  percentage: number;
  rank: number;
}

interface SchoolOption {
  value: string;
  label: string;
}

interface TestType {
  value: string;
  label: string;
}

interface SelectedFilters {
  school: string;
  batch: string;
  division: string;
  semester: string;
  subject: string;
  testType: string;
  testNumber: string;
}

type SortField = "enrollmentId" | "name" | "marks" | "percentage" | "rank";
type SortOrder = "asc" | "desc";

// Mock data
const mockOngoingCourses: Course[] = [
  {
    class: "SOT23B1",
    semester: 3,
    subject: "Data Structures",
    totalStudents: 118,
  },
  {
    class: "SOT23B2",
    semester: 3,
    subject: "Database Management",
    totalStudents: 115,
  },
];

const mockCompletedCourses: Course[] = [
  {
    class: "SOT22B1",
    semester: 4,
    subject: "Operating Systems",
    totalStudents: 110,
  },
  {
    class: "SOT22B2",
    semester: 4,
    subject: "Computer Networks",
    totalStudents: 105,
  },
  {
    class: "SOM23B1",
    semester: 2,
    subject: "Object Oriented Programming",
    totalStudents: 112,
  },
  {
    class: "SOT21B1",
    semester: 6,
    subject: "Machine Learning",
    totalStudents: 98,
  },
  {
    class: "SOT21B2",
    semester: 6,
    subject: "Web Development",
    totalStudents: 102,
  },
];

const mockPerformanceData: PerformanceData[] = [
  { test: "Test 1", percentage: 78 },
  { test: "Test 2", percentage: 82 },
  { test: "Test 3", percentage: 75 },
  { test: "Mid-term", percentage: 85 },
];

const mockStudentMarks: StudentMark[] = [
  {
    enrollmentId: "SOT23B1001",
    name: "Aarav Sharma",
    marks: 85,
    percentage: 85,
    rank: 1,
  },
  {
    enrollmentId: "SOT23B1002",
    name: "Priya Patel",
    marks: 82,
    percentage: 82,
    rank: 2,
  },
  {
    enrollmentId: "SOT23B1003",
    name: "Rahul Kumar",
    marks: 78,
    percentage: 78,
    rank: 3,
  },
  {
    enrollmentId: "SOT23B1004",
    name: "Ananya Singh",
    marks: 75,
    percentage: 75,
    rank: 4,
  },
  {
    enrollmentId: "SOT23B1005",
    name: "Vikram Gupta",
    marks: 88,
    percentage: 88,
    rank: 1,
  },
  {
    enrollmentId: "SOT23B1006",
    name: "Kavya Reddy",
    marks: 72,
    percentage: 72,
    rank: 6,
  },
  {
    enrollmentId: "SOT23B1007",
    name: "Arjun Nair",
    marks: 80,
    percentage: 80,
    rank: 5,
  },
  {
    enrollmentId: "SOT23B1008",
    name: "Shreya Joshi",
    marks: 90,
    percentage: 90,
    rank: 1,
  },
];

const schoolOptions: SchoolOption[] = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

const batchOptions: string[] = ["21", "22", "23", "24"];
const divisionOptions: string[] = ["B1", "B2", "B3"];
const semesterOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

const testTypes: TestType[] = [
  { value: "test", label: "Test" },
  { value: "midterm", label: "Mid-term" },
  { value: "final", label: "Final Exam" },
];

const testNumbers: Record<string, number[]> = {
  test: [1, 2, 3],
  midterm: [1, 2],
  final: [1],
};

const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-4 mb-6 py-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Student Marks Dashboard
            </h1>
            <p className="text-md text-gray-200">
              View and analyze student performance across courses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OngoingCoursesTable: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
      <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Ongoing Courses
          </h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {mockOngoingCourses.length} courses
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 font-semibold text-gray-800">
                  Class
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  Semester
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  Subject
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  Total Students
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOngoingCourses.map((course, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {course.class}
                  </td>
                  <td className="py-4 text-gray-600">{course.semester}</td>
                  <td className="py-4 text-gray-600">{course.subject}</td>
                  <td className="py-4 text-gray-600">{course.totalStudents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CompletedCoursesTable: React.FC = () => {
  const [showCompletedCourses, setShowCompletedCourses] =
    useState<boolean>(false);
  const [classFilter, setClassFilter] = useState<string | "all">("all");

  const getFilteredCompletedCourses = (): Course[] => {
    if (classFilter === "all") return mockCompletedCourses;
    return mockCompletedCourses.filter(
      (course) => course.class === classFilter
    );
  };

  const getUniqueClasses = (): string[] => {
    return [
      ...new Set(mockCompletedCourses.map((course) => course.class)),
    ].sort();
  };

  return (
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
              {getFilteredCompletedCourses().length} courses
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 bg-slate-900 text-white rounded-sm px-3 py-2 cursor-pointer group">
              <Filter className="w-4 h-4" />
              <select
                className="text-sm appearance-none cursor-pointer"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All Classes</option>
                {getUniqueClasses().map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowCompletedCourses(!showCompletedCourses)}
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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-4 font-semibold text-gray-800">
                      Class
                    </th>
                    <th className="text-left py-4 font-semibold text-gray-800">
                      Semester
                    </th>
                    <th className="text-left py-4 font-semibold text-gray-800">
                      Subject
                    </th>
                    <th className="text-left py-4 font-semibold text-gray-800">
                      Total Students
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
                        {course.class}
                      </td>
                      <td className="py-4 text-gray-600">{course.semester}</td>
                      <td className="py-4 text-gray-600">{course.subject}</td>
                      <td className="py-4 text-gray-600">
                        {course.totalStudents}
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
  );
};

interface MarksSelectionFormProps {
  onShowAnalysis: (filters: SelectedFilters) => void;
}

const MarksSelectionForm: React.FC<MarksSelectionFormProps> = ({
  onShowAnalysis,
}) => {
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTestType, setSelectedTestType] = useState<string>("");
  const [selectedTestNumber, setSelectedTestNumber] = useState<string>("");

  const canShowMarksDetails =
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester &&
    selectedSubject &&
    selectedTestType &&
    selectedTestNumber;

  const handleShowAnalysis = () => {
    if (canShowMarksDetails) {
      onShowAnalysis({
        school: selectedSchool,
        batch: selectedBatch,
        division: selectedDivision,
        semester: selectedSemester,
        subject: selectedSubject,
        testType: selectedTestType,
        testNumber: selectedTestNumber,
      });
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Marks Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4 text-sm">
        <div>
          <label className="block font-medium text-gray-700 mb-2">School</label>
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
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
          <label className="block font-medium text-gray-700 mb-2">Batch</label>
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={!selectedSchool}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Batch</option>
              {batchOptions.map((batch) => (
                <option key={batch} value={batch}>
                  {selectedSchool}20{batch}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                !selectedSchool ? "text-gray-300" : "text-gray-400"
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
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              disabled={!selectedBatch}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Division</option>
              {divisionOptions.map((division) => (
                <option key={division} value={division}>
                  {selectedSchool}
                  {selectedBatch}
                  {division}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                !selectedBatch ? "text-gray-300" : "text-gray-400"
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
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedDivision}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                !selectedDivision ? "text-gray-300" : "text-gray-400"
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
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Subject</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Database Management">Database Management</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                !selectedSemester ? "text-gray-300" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Test Type
          </label>
          <div className="relative">
            <select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Test Type</option>
              {testTypes.map((option) => (
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
            Test Number
          </label>
          <div className="relative">
            <select
              value={selectedTestNumber}
              onChange={(e) => setSelectedTestNumber(e.target.value)}
              disabled={!selectedTestType}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Test Number</option>
              {selectedTestType &&
                testNumbers[selectedTestType]?.map((num) => (
                  <option key={num} value={num}>
                    {selectedTestType === "test"
                      ? `Test ${num}`
                      : selectedTestType === "midterm"
                      ? `Mid-term ${num}`
                      : "Final Exam"}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={16}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                !selectedTestType ? "text-gray-300" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleShowAnalysis}
          disabled={!canShowMarksDetails}
          className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-sm transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer group"
        >
          <BarChart3 size={16} className="group-hover:scale-110" />
          Show Performance Analysis
        </button>
      </div>
    </div>
  );
};

interface PerformanceChartProps {
  selectedFilters: SelectedFilters;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  selectedFilters,
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-blue-600">{`Average: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
      <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4 drop-shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">
          {selectedFilters.subject} -{" "}
          {testTypes.find((t) => t.value === selectedFilters.testType)?.label}{" "}
          Performance Trend
        </h3>
      </div>
      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockPerformanceData}
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
              <Tooltip content={<CustomTooltip />} />
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
  );
};

interface StudentMarksTableProps {
  selectedFilters: SelectedFilters;
}

const StudentMarksTable: React.FC<StudentMarksTableProps> = ({
  selectedFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const getFilteredStudents = (): StudentMark[] => {
    const filtered = mockStudentMarks.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
      <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Student Marks -{" "}
              {
                testTypes.find((t) => t.value === selectedFilters.testType)
                  ?.label
              }{" "}
              {selectedFilters.testNumber}
            </h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {mockStudentMarks.length} students
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 font-semibold text-gray-800">
                  <button
                    onClick={() => handleSort("enrollmentId")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Enrollment ID
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  <button
                    onClick={() => handleSort("marks")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Marks
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  <button
                    onClick={() => handleSort("percentage")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Percentage
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-4 font-semibold text-gray-800">
                  <button
                    onClick={() => handleSort("rank")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Rank
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStudents().map((student, _index) => (
                <tr
                  key={student.enrollmentId}
                  className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {student.enrollmentId}
                  </td>
                  <td className="py-4 text-gray-600">{student.name}</td>
                  <td className="py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        student.marks >= 85
                          ? "bg-green-100 text-green-800"
                          : student.marks >= 75
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.marks}/100
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            student.percentage >= 85
                              ? "bg-green-500"
                              : student.percentage >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${student.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {student.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        student.rank <= 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      #{student.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {getFilteredStudents().length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No students found
            </h4>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TeacherMarksDashboard: React.FC = () => {
  const [showMarksDetails, setShowMarksDetails] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters | null>(null);

  const handleShowAnalysis = (filters: SelectedFilters) => {
    setSelectedFilters(filters);
    setShowMarksDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <OngoingCoursesTable />
        <CompletedCoursesTable />
        <MarksSelectionForm onShowAnalysis={handleShowAnalysis} />
        {showMarksDetails && selectedFilters && (
          <PerformanceChart selectedFilters={selectedFilters} />
        )}
        {showMarksDetails && selectedFilters && (
          <StudentMarksTable selectedFilters={selectedFilters} />
        )}
      </div>
    </div>
  );
};

export default TeacherMarksDashboard;
