"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, Save, Loader2 } from "lucide-react";
import axios from "axios";

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

const centers = [
  { value: "center-bangalore", label: "Bangalore" },
  { value: "center-pune", label: "Pune" },
  { value: "center-noida", label: "Noida" },
  { value: "center-lucknow", label: "Lucknow" },
];

const schools = [
  { value: "sot", label: "School of Technology" },
  { value: "soh", label: "School of Humanities" },
  { value: "som", label: "School of Management" },
];

const batches = [
  { value: "23", label: "2023" },
  { value: "24", label: "2024" },
  { value: "25", label: "2025" },
];

const divisions = [
  { value: "b1", label: "B1" },
  { value: "b2", label: "B2" },
];

const semesters = Array.from({ length: 8 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Semester ${i + 1}`,
}));

const subjects = [
  { value: "cs101", label: "Programming Fundamentals" },
  { value: "cs201", label: "Data Structures" },
  { value: "cs301", label: "Algorithms" },
  { value: "cs401", label: "Database Systems" },
  { value: "cs501", label: "Web Development" },
  { value: "cs601", label: "Machine Learning" },
];

interface CPRRow {
  id: string;
  module: string;
  topic: string;
  subTopic: string;
  lectureCount: number;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  actualStartDate: string | null;
  completionDate: string;
  actualCompletionDate: string | null;
  lectureId: string;
}

const dummyCPRData: CPRRow[] = [
  {
    id: "1",
    module: "Module 1",
    topic: "Introduction to Programming",
    subTopic: "Variables and Data Types",
    lectureCount: 2,
    status: "Pending",
    startDate: "2025-03-01",
    actualStartDate: null,
    completionDate: "2025-03-05",
    actualCompletionDate: null,
    lectureId: "L101",
  },
  {
    id: "2",
    module: "Module 1",
    topic: "Control Structures",
    subTopic: "Loops and Conditions",
    lectureCount: 3,
    status: "In Progress",
    startDate: "2025-03-06",
    actualStartDate: null,
    completionDate: "2025-03-10",
    actualCompletionDate: null,
    lectureId: "L102",
  },
  {
    id: "3",
    module: "Module 2",
    topic: "Functions",
    subTopic: "Scope and Closures",
    lectureCount: 4,
    status: "Completed",
    startDate: "2025-03-11",
    actualStartDate: "2025-03-11T10:00:00",
    completionDate: "2025-03-15",
    actualCompletionDate: "2025-03-15T14:30:00",
    lectureId: "L103",
  },
  {
    id: "4",
    module: "Module 2",
    topic: "Arrays and Strings",
    subTopic: "String Manipulation",
    lectureCount: 3,
    status: "Pending",
    startDate: "2025-03-16",
    actualStartDate: null,
    completionDate: "2025-03-20",
    actualCompletionDate: null,
    lectureId: "L104",
  },
];

export default function CPRManagement() {
  const [teachingDetails, setTeachingDetails] =
    useState<TeachingDetailsResponse | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [center, setCenter] = useState("");
  const [school, setSchool] = useState("");
  const [batch, setBatch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const [cprData, setCprData] = useState<CPRRow[]>([]);
  const [originalCprData, setOriginalCprData] = useState<CPRRow[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleViewCPR = () => {
    if (center && school && batch && division && semester && subject) {
      const data = dummyCPRData.map((row) => ({ ...row }));
      setCprData(data);
      setOriginalCprData(data);
      setHasChanges(false);
      setShowTable(true);
    }
  };

const handleStatusChange = async (id: string, newStatus: CPRRow["status"]) => {
  const now = new Date().toISOString();

  setCprData((prev) =>
    prev.map((row) => {
      if (row.id !== id) return row;

      let updated = { ...row, status: newStatus };

      if (row.status === "Pending" && newStatus === "In Progress") {
        updated.actualStartDate = now;
      }

      if (row.status === "In Progress" && newStatus === "Completed") {
        updated.actualCompletionDate = now;
      }

      return updated;
    })
  );

  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/sub-topics/${id}/status`,
      { status: newStatus },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error updating status:", error);

    setCprData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: row.status } : row
      )
    );

    alert("Failed to update status. Please try again.");
  }
};


  const saveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setOriginalCprData([...cprData]);
      setHasChanges(false);
      setIsSaving(false);
      alert("CPR changes saved successfully!");
    }, 800);
  };
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

  useEffect(() => {
    getTeachingDetails();
  }, []);

  useEffect(() => {
    if (originalCprData.length > 0 && cprData.length > 0) {
      const changed =
        JSON.stringify(cprData) !== JSON.stringify(originalCprData);
      setHasChanges(changed);
    }
  }, [cprData, originalCprData]);

  const allSelected =
    center && school && batch && division && semester && subject;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-white">CPR Management</h1>
          <p className="text-md text-gray-200">
            Track and manage course progress for your subjects
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm">
          {/* School */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              School
            </label>
            <div className="relative">
              <select
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setSelectedBatch("");
                  setSelectedDivision("");
                  setSelectedSemester("");
                  setSelectedSubject("");
                }}
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

          {/* Batch */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Batch
            </label>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedDivision("");
                  setSelectedSemester("");
                  setSelectedSubject("");
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

          {/* Division */}
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

          {/* Semester */}
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

          {/* Subject */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
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
        </div>

        {showTable && (
          <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Course Progress Report
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Topic
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Sub Topic
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Lecture Count
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                      style={{ width: "180px" }}
                    >
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Planned Start
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Actual Start
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Planned End
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Actual End
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Lecture ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cprData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {row.module}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {row.topic}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {row.subTopic}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-center text-gray-800">
                        {row.lectureCount}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="relative inline-block w-full max-w-xs">
                          <select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(
                                row.id,
                                e.target.value as CPRRow["status"]
                              )
                            }
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-sm bg-white appearance-none text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {row.startDate}
                      </td>
                      <td className="px-4 py-3 border-b text-sm">
                        {row.actualStartDate
                          ? new Date(row.actualStartDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {row.completionDate}
                      </td>
                      <td className="px-4 py-3 border-b text-sm">
                        {row.actualCompletionDate
                          ? new Date(row.actualCompletionDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-3 border-b text-sm font-mono text-gray-800">
                        {row.lectureId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasChanges && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
