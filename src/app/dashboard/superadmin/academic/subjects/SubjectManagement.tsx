"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddSubjectModal from "./AddSubjectModal";

interface SchoolOption {
  value: string;
  label: string;
}

interface TableSubject {
  id: string;
  subjectName: string;
  credits: string;
  subjectCode: string;
  teacher: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
}

const schoolOptions: SchoolOption[] = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

const batchOptions: string[] = ["21", "22", "23", "24"];
const divisionOptions: string[] = ["B1", "B2", "B3"];
const semesterOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

const initialSubjects: TableSubject[] = [
  {
    id: "1",
    subjectName: "Data Structures",
    credits: "4",
    subjectCode: "CS201",
    teacher: "Dr. John Smith",
    school: "SOT",
    batch: "22",
    division: "B1",
    semester: 3,
  },
  {
    id: "2",
    subjectName: "Marketing Management",
    credits: "3",
    subjectCode: "MG301",
    teacher: "Prof. Sarah Johnson",
    school: "SOM",
    batch: "21",
    division: "B2",
    semester: 5,
  },
  {
    id: "3",
    subjectName: "Design Thinking",
    credits: "3",
    subjectCode: "DS101",
    teacher: "Ms. Emily Davis",
    school: "SOD",
    batch: "23",
    division: "B1",
    semester: 2,
  },
];

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<TableSubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<TableSubject[]>([]);
  const [error, setError] = useState("");
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Filter state
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

  const statistics = useMemo(
    () => ({
      totalSubjects: filteredSubjects.length,
      totalCredits: filteredSubjects.reduce(
        (sum, subject) => sum + parseInt(subject.credits || "0"),
        0
      ),
    }),
    [filteredSubjects]
  );

  // Handle filter changes with cascading logic
  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSelectedBatch("");
    setSelectedDivision("");
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredSubjects([]);
  };

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    setSelectedDivision("");
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredSubjects([]);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedSemester("");
    setFiltersComplete(false);
    setFilteredSubjects([]);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    const isComplete =
      selectedSchool && selectedBatch && selectedDivision && semester;
    setFiltersComplete(!!isComplete);

    if (isComplete) {
      // Filter subjects based on all selections
      const filtered = subjects.filter(
        (subject) =>
          subject.school === selectedSchool &&
          subject.batch === selectedBatch &&
          subject.division === selectedDivision &&
          subject.semester === parseInt(semester)
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  };

  // Initialize with sample data
  React.useEffect(() => {
    setSubjects(initialSubjects);
  }, []);

  const handleUpdateSubject = useCallback(
    (updatedItem: any) => {
      const subjectItem = updatedItem as TableSubject;
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === subjectItem.id
            ? { ...subject, ...subjectItem }
            : subject
        )
      );

      // Update filtered subjects if they match current filters
      if (filtersComplete) {
        setFilteredSubjects((prev) =>
          prev.map((subject) =>
            subject.id === subjectItem.id
              ? { ...subject, ...subjectItem }
              : subject
          )
        );
      }
    },
    [filtersComplete]
  );

  const handleDeleteSubject = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setSubjects((prev) => prev.filter((subject) => subject.id !== deleteId));
    setFilteredSubjects((prev) =>
      prev.filter((subject) => subject.id !== deleteId)
    );
  }, []);

  const handleAddSubject = useCallback(
    (newSubjectData: {
      subjectName: string;
      credits: string;
      subjectCode: string;
      teacher: string;
    }) => {
      const newSubject: TableSubject = {
        id: Date.now().toString(),
        subjectName: newSubjectData.subjectName,
        credits: newSubjectData.credits,
        subjectCode: newSubjectData.subjectCode,
        teacher: newSubjectData.teacher,
        school: selectedSchool,
        batch: selectedBatch,
        division: selectedDivision,
        semester: parseInt(selectedSemester),
      };

      setSubjects((prev) => [...prev, newSubject]);
      setFilteredSubjects((prev) => [...prev, newSubject]);
      setIsAddSubjectModalOpen(false);
    },
    [selectedSchool, selectedBatch, selectedDivision, selectedSemester]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddSubjectModalOpen(true);
    }
  }, [filtersComplete]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddSubjectModalOpen(false);
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
          Subject Management
        </h2>

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-white to-indigo-50  p-6 rounded-sm border border-gray-400">
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
                * Please select all filters to view and manage subjects.
              </p>
            </div>
          )}
        </div>

        {filtersComplete && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">
                    Total Subjects
                  </h4>
                  <p className="text-5xl font-bold text-[#1B3A6A]">
                    {statistics.totalSubjects}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">Total Credits</h4>
                  <p className="text-5xl font-bold text-green-600">
                    {statistics.totalCredits}
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
                  <h3 className="text-lg font-semibold">Add New Subject</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new subject record
                  </p>
                </button>
              </div>
            </div>

            {/* Table */}
            <Table
              data={filteredSubjects}
              title="Subjects Overview"
              filterField="teacher"
              badgeFields={["subjectCode", "credits"]}
              selectFields={{}}
              nonEditableFields={[
                "id",
                "school",
                "batch",
                "division",
                "semester",
              ]}
              onDelete={handleDeleteSubject}
              onEdit={handleUpdateSubject}
              hiddenColumns={["id", "school", "batch", "division", "semester"]}
            />
          </>
        )}

        <AddSubjectModal
          isOpen={isAddSubjectModalOpen}
          onClose={handleCloseAddModal}
          onSubjectCreated={handleAddSubject}
          selectedSchool={selectedSchool}
          selectedBatch={selectedBatch}
          selectedDivision={selectedDivision}
          selectedSemester={selectedSemester}
        />
      </div>
    </div>
  );
}
