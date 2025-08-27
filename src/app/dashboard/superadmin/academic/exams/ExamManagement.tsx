"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, ChevronDown, NotepadText } from "lucide-react";
import Table from "../../Table";
import AddExamModal from "./AddExamModal";
import axios from "axios";

interface TableExam {
  id: string;
  examName: string;
  weightage: number;
  maxMarks: number;
  passingMarks: number;
  examType: "Midterm" | "Final" | "Quiz" | "Assignment" | "Practical";
  date: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
}

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

const batchOptions = ["21", "22", "23", "24"];
const divisionOptions = ["B1", "B2", "B3"];
const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const examTypeOptions: TableExam["examType"][] = [
  "Midterm",
  "Final",
  "Quiz",
  "Assignment",
  "Practical",
];

const initialExams: TableExam[] = [
  {
    id: "1",
    examName: "Midterm Exam",
    weightage: 30,
    maxMarks: 100,
    passingMarks: 35,
    examType: "Midterm",
    date: "2025-04-10",
    school: "SOT",
    batch: "22",
    division: "B1",
    semester: 3,
  },
  {
    id: "2",
    examName: "Final Project",
    weightage: 50,
    maxMarks: 200,
    passingMarks: 100,
    examType: "Assignment",
    date: "2025-05-15",
    school: "SOM",
    batch: "21",
    division: "B2",
    semester: 5,
  },
  {
    id: "3",
    examName: "Lab Practical",
    weightage: 20,
    maxMarks: 50,
    passingMarks: 20,
    examType: "Practical",
    date: "2025-04-05",
    school: "SOD",
    batch: "23",
    division: "B1",
    semester: 2,
  },
];

export default function ExamManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [exams, setExams] = useState<TableExam[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisons, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

    useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setCenters(res.data.data);
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (!selectedCenter) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"));
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"));
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"));
  }, [selectedDivision]);

  const statistics = useMemo(
    () => ({
      totalExams: filteredExams.length,
      totalWeightage: filteredExams.reduce(
        (sum, exam) => sum + exam.weightage,
        0
      ),
      avgMaxMarks: Math.round(
        filteredExams.reduce((sum, exam) => sum + exam.maxMarks, 0) /
          Math.max(filteredExams.length, 1)
      ),
    }),
    [filteredExams]
  );



  React.useEffect(() => {
    setExams(initialExams);
  }, []);

  const handleUpdateExam = useCallback(
    (updatedItem: any) => {
      const examItem = updatedItem as TableExam;
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examItem.id ? { ...exam, ...examItem } : exam
        )
      );

      if (filtersComplete) {
        setFilteredExams((prev) =>
          prev.map((exam) =>
            exam.id === examItem.id ? { ...exam, ...examItem } : exam
          )
        );
      }
    },
    [filtersComplete]
  );

  const handleDeleteExam = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setExams((prev) => prev.filter((exam) => exam.id !== deleteId));
    setFilteredExams((prev) => prev.filter((exam) => exam.id !== deleteId));
  }, []);

  const handleAddExam = useCallback(
    (
      newExamData: Omit<
        TableExam,
        "id" | "school" | "batch" | "division" | "semester"
      >
    ) => {
      const newExam: TableExam = {
        id: Date.now().toString(),
        ...newExamData,
        school: selectedSchool,
        batch: selectedBatch,
        division: selectedDivision,
        semester: parseInt(selectedSemester),
      };

      setExams((prev) => [...prev, newExam]);
      setFilteredExams((prev) => [...prev, newExam]);
      setIsAddExamModalOpen(false);
    },
    [selectedSchool, selectedBatch, selectedDivision, selectedSemester]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddExamModalOpen(true);
    }
  }, [filtersComplete]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddExamModalOpen(false);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => setError("")}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Exam Management
        </h2>

        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Filters
          </h3>

          <div className="flex space-x-3 flex-wrap space-y-2">
                    {[
                      {
                        label: "Center",
                        value: selectedCenter,
                        options: centers,
                        setter: setSelectedCenter,
                        disabled: false,
                      },
                      {
                        label: "School",
                        value: selectedSchool,
                        options: schools,
                        setter: setSelectedSchool,
                        disabled: !selectedCenter,
                      },
          
                      {
                        label: "Batch",
                        value: selectedBatch,
                        options: batches,
                        setter: setSelectedBatch,
                        disabled: !selectedSchool,
                      },
                      {
                        label: "Division",
                        value: selectedDivision,
                        options: divisons,
                        setter: setSelectedDivision,
                        disabled: !selectedBatch,
                      },
                      {
                        label: "Semester",
                        value: selectedSemester,
                        options: semesters,
                        setter: setSelectedSemester,
                        disabled: !selectedDivision,
                      },
                    ].map((filter, idx) => (
                      <div key={idx} className="relative min-w-36">
                        <label className="block text-xs font-medium text-gray-100 mb-1">
                          {filter.label}
                        </label>
                        <div className="relative">
                          <select
                            value={filter.value}
                            onChange={(e) => filter.setter(e.target.value)}
                            disabled={filter.disabled}
                            className={`w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed`}
                          >
                            <option value="">{`Select ${filter.label}`}</option>
                            {filter.options.map((opt: any) => {
                              const value = opt.id || opt;
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

          {!filtersComplete && (
            <div className="mt-4 p-3 text-slate-900 rounded-sm">
              <p className="text-sm">
                * Please select all filters to view and manage exams.
              </p>
            </div>
          )}
        </div>

        {filtersComplete && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <NotepadText className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">Total Exams</h4>
                  <p className="text-5xl font-bold text-[#1B3A6A]">
                    {statistics.totalExams}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 flex items-center justify-center p-6">
                <button
                  onClick={handleOpenAddModal}
                  className="flex flex-col items-center justify-center w-full h-full text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="bg-gray-200 rounded-full p-3 mb-2 hover:bg-gray-300 transition-colors">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">Add New Exam</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new exam record
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredExams}
              title="Exams Overview"
              filterField="examName"
              badgeFields={["examType", "weightage"]}
              selectFields={{
                examType: examTypeOptions,
              }}
              nonEditableFields={[
                "id",
                "school",
                "batch",
                "division",
                "semester",
              ]}
              onDelete={handleDeleteExam}
              onEdit={handleUpdateExam}
              hiddenColumns={["id", "school", "batch", "division", "semester"]}
            />
          </>
        )}

        <AddExamModal
          isOpen={isAddExamModalOpen}
          onClose={handleCloseAddModal}
          onExamCreated={handleAddExam}
          selectedSchool={selectedSchool}
          selectedBatch={selectedBatch}
          selectedDivision={selectedDivision}
          selectedSemester={selectedSemester}
        />
      </div>
    </div>
  );
}
