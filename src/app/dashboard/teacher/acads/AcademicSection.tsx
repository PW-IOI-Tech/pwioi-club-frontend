"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

interface Course {
  class: string;
  semester: number;
  subjectName: string;
  batchName: string;
  divisionCode: string;
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

const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-[#12294c] rounded-sm shadow-lg border border-gray-200 p-4 py-6">
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
  const [ongoingCourses, setOngoingCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-courses/active-subject`,
        { withCredentials: true }
      )
      .then((res) => setOngoingCourses(res.data.data))
      .catch((err) => console.error("Error fetching ongoing courses:", err));
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 overflow-hidden">
      <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Ongoing Courses
          </h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {ongoingCourses.length} courses
          </span>
        </div>
      </div>
      <div className="p-6">
        {ongoingCourses.length === 0 ? (
          <p className="text-gray-500">No ongoing courses available</p>
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
                {ongoingCourses?.map((course, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-4 font-medium text-gray-900">
                      {course?.batchName + course?.divisionCode}
                    </td>
                    <td className="py-4 text-gray-600">{course?.semester}</td>
                    <td className="py-4 text-gray-600">
                      {course?.subjectName}
                    </td>
                    <td className="py-4 text-gray-600">
                      {course?.totalStudents}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const CompletedCoursesTable: React.FC = () => {
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [showCompletedCourses, setShowCompletedCourses] = useState(false);
  const [classFilter, setClassFilter] = useState<string | "all">("all");

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-courses/completedSubject`,
        { withCredentials: true }
      )
      .then((res) => setCompletedCourses(res?.data?.data))
      .catch((err) => console.error("Error fetching completed courses:", err));
  }, []);

  const getFilteredCompletedCourses = () =>
    classFilter === "all"
      ? completedCourses
      : completedCourses.filter((c) => c.class === classFilter);

  const getUniqueClasses = () =>
    [...new Set(completedCourses?.map((c) => c.class))].sort();

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 overflow-hidden">
      <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 drop-shadow-sm px-6 py-4">
        <div className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
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
            <div className="flex items-center gap-3 bg-[#12294c] text-white rounded-sm px-3 py-2 cursor-pointer group">
              <Filter className="w-4 h-4" />
              <select
                className="text-sm appearance-none cursor-pointer"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All Classes</option>
                {getUniqueClasses().map((cls, idx) => (
                  <option key={`${cls}-${idx}`} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowCompletedCourses(!showCompletedCourses)}
              className="flex items-center gap-2 bg-[#12294c] hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200 cursor-pointer"
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
                    <tr key={index} className="border-b border-gray-50">
                      <td className="py-4">
                        {course?.batchName + course?.divisionCode}
                      </td>
                      <td className="py-4">{course.semester}</td>
                      <td className="py-4">{course?.subjectName}</td>
                      <td className="py-4">{course.totalStudents}</td>
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
  const [teachingDetails, setTeachingDetails] = useState<any | null>(null);

  const getTeachingDetails = async () => {
    try {
      const response = await axios.get<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/teaching-details`,
        { withCredentials: true }
      );
      setTeachingDetails(response.data);
    } catch (error) {
      console.error("Error fetching teaching details:", error);
    }
  };

  useEffect(() => {
    getTeachingDetails();
  }, []);

  const schoolOptions =
    teachingDetails?.schools.map((s: any) => ({
      value: s.id,
      label: s.name,
    })) || [];

  const getBatchOptions = (schoolId: string) => {
    const school = teachingDetails?.schools.find((s: any) => s.id === schoolId);
    return (
      school?.batches.map((b: any) => ({
        value: b.id,
        label: b.name,
      })) || []
    );
  };

  const getDivisionOptions = (schoolId: string, batchId: string) => {
    const batch = teachingDetails?.schools
      .find((s: any) => s.id === schoolId)
      ?.batches.find((b: any) => b.id === batchId);

    return (
      batch?.divisions.map((d: any) => ({
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
      .find((s: any) => s.id === schoolId)
      ?.batches.find((b: any) => b.id === batchId)
      ?.divisions.find((d: any) => d.id === divisionId);

    return (
      division?.semesters.map((sem: any) => ({
        value: sem.id,
        label: `Semester ${sem.number}`,
      })) || []
    );
  };

  const getSubjectOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string
  ) => {
    const semester = teachingDetails?.schools
      .find((s: any) => s.id === schoolId)
      ?.batches.find((b: any) => b.id === batchId)
      ?.divisions.find((d: any) => d.id === divisionId)
      ?.semesters.find((sem: any) => sem.id === semesterId);

    return (
      semester?.subjects.map((subj: any) => ({
        value: subj.id,
        label: subj.name,
      })) || []
    );
  };

  const getExamTypeOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string,
    subjectId: string
  ) => {
    const subject = teachingDetails?.schools
      ?.find((s: any) => s.id === schoolId)
      ?.batches?.find((b: any) => b.id === batchId)
      ?.divisions?.find((d: any) => d.id === divisionId)
      ?.semesters?.find((sem: any) => sem.id === semesterId)
      ?.subjects?.find((sub: any) => sub.id === subjectId);

    return (
      subject?.exam_types?.map((et: any) => ({
        value: et.exam_type,
        label: et.exam_type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: any) => c.toUpperCase()),
      })) ?? []
    );
  };

  const getExamNumberOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string,
    subjectId: string,
    examType: string
  ) => {
    const examTypeObj = teachingDetails?.schools
      ?.find((s: any) => s.id === schoolId)
      ?.batches?.find((b: any) => b.id === batchId)
      ?.divisions?.find((d: any) => d.id === divisionId)
      ?.semesters?.find((sem: any) => sem.id === semesterId)
      ?.subjects?.find((sub: any) => sub.id === subjectId)
      ?.exam_types?.find((et: any) => et.exam_type === examType);

    return (
      examTypeObj?.exams?.map((exam: any) => ({
        value: exam.id,
        label: exam.name,
      })) || []
    );
  };

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
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4 sm:p-6 lg:p-8 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Marks Details
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-4 text-sm">
        <div>
          <label className="block font-medium text-gray-700 mb-2">School</label>
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setSelectedBatch("");
                setSelectedDivision("");
                setSelectedSemester("");
                setSelectedSubject("");
                setSelectedTestType("");
                setSelectedTestNumber("");
              }}
              disabled={schoolOptions.length === 0}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select School</option>
              {schoolOptions.map((option: any) => (
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
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setSelectedDivision("");
                setSelectedSemester("");
                setSelectedSubject("");
                setSelectedTestType("");
                setSelectedTestNumber("");
              }}
              disabled={!selectedSchool}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Batch</option>
              {getBatchOptions(selectedSchool).map((batch: any) => (
                <option key={batch.value} value={batch.value}>
                  {batch.label}
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
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedSemester("");
                setSelectedSubject("");
                setSelectedTestType("");
                setSelectedTestNumber("");
              }}
              disabled={!selectedBatch}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Division</option>
              {getDivisionOptions(selectedSchool, selectedBatch).map(
                (division: any) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                )
              )}
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
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedSubject("");
                setSelectedTestType("");
                setSelectedTestNumber("");
              }}
              disabled={!selectedDivision}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Semester</option>
              {getSemesterOptions(
                selectedSchool,
                selectedBatch,
                selectedDivision
              ).map((sem: any) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
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
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTestType("");
                setSelectedTestNumber("");
              }}
              disabled={!selectedSemester}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Subject</option>
              {getSubjectOptions(
                selectedSchool,
                selectedBatch,
                selectedDivision,
                selectedSemester
              ).map((subj: any) => (
                <option key={subj.value} value={subj.value}>
                  {subj.label}
                </option>
              ))}
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
              onChange={(e) => {
                setSelectedTestType(e.target.value);
                setSelectedTestNumber("");
              }}
              disabled={!selectedSubject}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Test Type</option>
              {getExamTypeOptions(
                selectedSchool,
                selectedBatch,
                selectedDivision,
                selectedSemester,
                selectedSubject
              ).map((option: any) => (
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
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm 
              focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent 
              disabled:bg-gray-100 disabled:cursor-not-allowed 
              appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Test Number</option>
              {getExamNumberOptions(
                selectedSchool,
                selectedBatch,
                selectedDivision,
                selectedSemester,
                selectedSubject,
                selectedTestType
              ).map((num: any) => (
                <option key={num.value} value={num.value}>
                  {num.label}
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
          className="flex items-center gap-2 px-6 py-2 bg-[#12294c] text-white rounded-sm 
          transition-colors font-medium disabled:bg-gray-300 
          disabled:cursor-not-allowed cursor-pointer group"
        >
          <BarChart3 size={16} className="group-hover:scale-110" />
          Show Performance Analysis
        </button>
      </div>
    </div>
  );
};

const PerformanceChart: React.FC<{ selectedFilters: SelectedFilters }> = ({
  selectedFilters,
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    if (!selectedFilters.testNumber) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-courses/exam-student-result/${selectedFilters.testNumber}`,
        { withCredentials: true }
      )
      .then((res) => {
        const exam = res.data.exam;
        const summary = res.data.summary;

        const transformed = [
          {
            test: exam.name,
            percentage: summary.passPercentage,
          },
        ];
        setPerformanceData(transformed);
      })
      .catch((err) => console.error("Error fetching exam performance:", err));
  }, [selectedFilters]);

  return (
    <div className="bg-white border p-4 rounded-sm">
      <h3 className="text-lg font-semibold mb-2">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="test" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="percentage" fill="#1c398e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StudentMarksTableProps {
  selectedFilters: SelectedFilters;
}

const StudentMarksTable: React.FC<StudentMarksTableProps> = ({
  selectedFilters,
}) => {
  const [students, setStudents] = useState<StudentMark[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    if (!selectedFilters.testNumber) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher-courses/exam-student-result/${selectedFilters.testNumber}`,
        { withCredentials: true }
      )
      .then((res) => {
        const exam = res.data.exam;
        const mapped = res.data.students.map((s: any) => ({
          enrollmentId: s.enrollmentId,
          name: s.name,
          marks: s.marksObtained ?? 0,
          percentage: exam.full_marks
            ? Math.round(((s.marksObtained ?? 0) / exam.full_marks) * 100)
            : 0,
          rank: s.rank ?? 0,
        }));
        setStudents(mapped);
      })
      .catch((err) => console.error("Error fetching student marks:", err));
  }, [selectedFilters]);

  const getFilteredStudents = (): StudentMark[] => {
    const filtered = students.filter(
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
            <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Student Marks
            </h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {students.length} students
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
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-4">
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
    </div>
  );
};

export default TeacherMarksDashboard;
