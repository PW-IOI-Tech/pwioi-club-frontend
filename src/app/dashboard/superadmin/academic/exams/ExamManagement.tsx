"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, ChevronDown, NotepadText } from "lucide-react";
import Table from "../../Table";
import AddExamModal from "./AddExamModal";

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
  const [exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

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

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSelectedBatch("");
    setSelectedDivision("");
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    setSelectedDivision("");
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    const isComplete =
      selectedSchool && selectedBatch && selectedDivision && semester;
    setFiltersComplete(!!isComplete);

    if (isComplete) {
      const filtered = exams.filter(
        (exam) =>
          exam.school === selectedSchool &&
          exam.batch === selectedBatch &&
          exam.division === selectedDivision &&
          exam.semester === parseInt(semester)
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams([]);
    }
  };

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => handleSchoolChange(e.target.value)}
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
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => handleBatchChange(e.target.value)}
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
                  onChange={(e) => handleDivisionChange(e.target.value)}
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
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  disabled={!selectedDivision}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map((sem) => (
                    <option key={sem} value={sem.toString()}>
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
