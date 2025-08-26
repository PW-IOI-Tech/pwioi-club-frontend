"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, ChevronDown, NotepadText } from "lucide-react";
import Table from "../../Table";
import AddExamModal from "./AddExamModal";

const examTypeOptions = ["Fortnightly", "Internal", "Interview"] as const;
type ExamType = (typeof examTypeOptions)[number];

interface TableExam {
  id: string;
  examName: string;
  weightage: number;
  maxMarks: number;
  passingMarks: number;
  examType: ExamType;
  examNumber: string;
  subject: string;
  date: string;
  center: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
}

const centerOptions = ["Bangalore", "Pune", "Noida", "Lucknow"] as const;

const schoolOptionsByCenter: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  Bangalore: [
    { value: "SOT", label: "School of Technology" },
    { value: "SOM", label: "School of Management" },
    { value: "SOD", label: "School of Design" },
  ],
  Pune: [
    { value: "SOT", label: "School of Technology" },
    { value: "SOM", label: "School of Management" },
  ],
  Noida: [
    { value: "SOT", label: "School of Technology" },
    { value: "SOM", label: "School of Management" },
  ],
  Lucknow: [
    { value: "SOT", label: "School of Technology" },
    { value: "SOD", label: "School of Design" },
  ],
};

const examTypeOptionsForDropdown = [...examTypeOptions];

const subjectsBySchool: Record<string, string[]> = {
  SOT: [
    "CS201 Data Structures",
    "CS202 Algorithms",
    "IT301 Web Development",
    "CS305 DBMS",
  ],
  SOM: ["MG201 Marketing", "MG302 Finance", "HR401 Organizational Behavior"],
  SOD: ["DS101 Design Thinking", "DS205 UI/UX", "DS301 Branding"],
};

const initialExams: TableExam[] = [
  {
    id: "1",
    examName: "Fortnightly Test 1",
    weightage: 10,
    maxMarks: 20,
    passingMarks: 8,
    examType: "Fortnightly",
    examNumber: "F1",
    subject: "CS201 Data Structures",
    date: "2025-04-05",
    center: "Bangalore",
    school: "SOT",
    batch: "23",
    division: "B1",
    semester: 3,
  },
  {
    id: "2",
    examName: "Internal Assessment",
    weightage: 25,
    maxMarks: 50,
    passingMarks: 20,
    examType: "Internal",
    examNumber: "I1",
    subject: "MG201 Marketing",
    date: "2025-04-12",
    center: "Noida",
    school: "SOM",
    batch: "22",
    division: "B2",
    semester: 5,
  },
  {
    id: "3",
    examName: "Interview Round 1",
    weightage: 15,
    maxMarks: 30,
    passingMarks: 12,
    examType: "Interview",
    examNumber: "IR1",
    subject: "DS101 Design Thinking",
    date: "2025-04-08",
    center: "Lucknow",
    school: "SOD",
    batch: "24",
    division: "B1",
    semester: 2,
  },
];

export default function ExamManagement() {
  const [exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<ExamType | "">("");
  const [selectedExamNumber, setSelectedExamNumber] = useState<string>("");

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

  const batchOptions = ["22", "23", "24", "25"];
  const divisionOptions = ["B1", "B2", "B3"];
  const examNumberOptions = ["1", "2", "3", "4"];

  const handleCenterChange = (center: string) => {
    setSelectedCenter(center);
    setSelectedSchool("");
    setSelectedBatch("");
    setSelectedDivision("");
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSelectedBatch("");
    setSelectedDivision("");
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    setSelectedDivision("");
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setSelectedSubject("");
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedExamType("");
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleExamTypeChange = (type: string) => {
    if (examTypeOptions.includes(type as ExamType)) {
      setSelectedExamType(type as ExamType);
    } else {
      setSelectedExamType("");
    }
    setSelectedExamNumber("");
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleExamNumberChange = (num: string) => {
    setSelectedExamNumber(num);
    const isComplete =
      selectedCenter &&
      selectedSchool &&
      selectedBatch &&
      selectedDivision &&
      selectedSemester &&
      selectedSubject &&
      selectedExamType &&
      num;

    setFiltersComplete(!!isComplete);

    if (isComplete) {
      const examNumber = `${selectedExamType.charAt(0).toUpperCase()}${num}`;
      const filtered = exams.filter(
        (exam) =>
          exam.center === selectedCenter &&
          exam.school === selectedSchool &&
          exam.batch === selectedBatch &&
          exam.division === selectedDivision &&
          exam.semester === parseInt(selectedSemester) &&
          exam.subject === selectedSubject &&
          exam.examType === selectedExamType &&
          exam.examNumber === examNumber
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
        | "id"
        | "examNumber"
        | "center"
        | "school"
        | "batch"
        | "division"
        | "semester"
      >
    ) => {
      const examNumber = selectedExamType
        ? `${selectedExamType.charAt(0).toUpperCase()}${selectedExamNumber}`
        : "UNK";

      const newExam: TableExam = {
        id: Date.now().toString(),
        ...newExamData,
        examNumber,
        center: selectedCenter,
        school: selectedSchool,
        batch: selectedBatch,
        division: selectedDivision,
        semester: parseInt(selectedSemester),
      };

      setExams((prev) => [...prev, newExam]);
      setFilteredExams((prev) => [...prev, newExam]);
      setIsAddExamModalOpen(false);
    },
    [
      selectedCenter,
      selectedSchool,
      selectedBatch,
      selectedDivision,
      selectedSemester,
      selectedExamType,
      selectedExamNumber,
    ]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete && selectedExamType) {
      setIsAddExamModalOpen(true);
    }
  }, [filtersComplete, selectedExamType]);

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

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Center
              </label>
              <div className="relative">
                <select
                  value={selectedCenter}
                  onChange={(e) => handleCenterChange(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Center</option>
                  {centerOptions.map((center) => (
                    <option key={center} value={center}>
                      {center}
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
                School
              </label>
              <div className="relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  disabled={!selectedCenter}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select School</option>
                  {schoolOptionsByCenter[selectedCenter]?.map((school) => (
                    <option key={school.value} value={school.value}>
                      {school.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedCenter ? "text-gray-300" : "text-gray-400"
                  }`}
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
                  {divisionOptions.map((div) => (
                    <option key={div} value={div}>
                      {selectedSchool}
                      {selectedBatch}
                      {div}
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
                  <option value="">Sem</option>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                    <option key={sem} value={sem.toString()}>
                      S{sem}
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
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!selectedSemester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Subject</option>
                  {subjectsBySchool[selectedSchool]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
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
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={selectedExamType}
                  onChange={(e) => handleExamTypeChange(e.target.value)}
                  disabled={!selectedSubject}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Type</option>
                  {examTypeOptionsForDropdown.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSubject ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                No.
              </label>
              <div className="relative">
                <select
                  value={selectedExamNumber}
                  onChange={(e) => handleExamNumberChange(e.target.value)}
                  disabled={!selectedExamType}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">#</option>
                  {examNumberOptions.map((num) => (
                    <option key={num} value={num}>
                      {selectedExamType?.charAt(0).toUpperCase() || "?"}
                      {num}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedExamType ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {!filtersComplete && (
            <div className="mt-4 p-3 text-slate-900 rounded-sm">
              <p className="text-sm">
                * Select all filters to view and manage exams.
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
              badgeFields={["examType", "weightage", "subject"]}
              selectFields={{
                examType: examTypeOptionsForDropdown,
                subject: subjectsBySchool[selectedSchool] || [],
              }}
              nonEditableFields={[
                "id",
                "center",
                "school",
                "batch",
                "division",
                "semester",
                "examNumber",
              ]}
              onDelete={handleDeleteExam}
              onEdit={handleUpdateExam}
              hiddenColumns={[
                "id",
                "center",
                "school",
                "batch",
                "division",
                "semester",
              ]}
            />
          </>
        )}

        {filtersComplete && selectedExamType && (
          <AddExamModal
            isOpen={isAddExamModalOpen}
            onClose={handleCloseAddModal}
            onExamCreated={handleAddExam}
            selectedCenter={selectedCenter}
            selectedSchool={selectedSchool}
            selectedBatch={selectedBatch}
            selectedDivision={selectedDivision}
            selectedSemester={selectedSemester}
            selectedSubject={selectedSubject}
            selectedExamType={selectedExamType}
            selectedExamNumber={selectedExamNumber}
          />
        )}
      </div>
    </div>
  );
}
