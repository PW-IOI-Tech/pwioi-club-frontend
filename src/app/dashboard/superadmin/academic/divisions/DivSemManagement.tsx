"use client";

import React, { useState, useCallback } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddDivisionModal from "./AddDivisionModal";
import AddSemesterModal from "./AddSemesterModal";

interface Division {
  id: string;
  division: string;
  startDate: string;
  endDate: string;
  semesterCount: number;
  currentSemester: number | null;
  studentCount: number;
  teacherCount: number;
  center: string;
  school: string;
  batch: string;
}

interface Semester {
  id: string;
  division: string;
  semesterNumber: number;
  startDate: string;
  endDate: string;
}

const centerOptions = [
  { value: "bangalore", label: "Bangalore" },
  { value: "lucknow", label: "Lucknow" },
  { value: "pune", label: "Pune" },
  { value: "noida", label: "Noida" },
];

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

const batchOptions = ["21", "22", "23", "24"];

const initialDivisions: Division[] = [];
const initialSemesters: Semester[] = [];

export default function DivSemManagement() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [_semesters, setSemesters] = useState<Semester[]>([]);

  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([]);

  const [error, setError] = useState("");
  const [isAddDivisionModalOpen, setIsAddDivisionModalOpen] = useState(false);
  const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

  React.useEffect(() => {
    setDivisions(initialDivisions);
    setSemesters(initialSemesters);
  }, []);

  const handleCenterChange = (center: string) => {
    setSelectedCenter(center);
    setSelectedSchool("");
    setSelectedBatch("");
    setFiltersComplete(false);
    setFilteredDivisions([]);
    setFilteredSemesters([]);
  };

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSelectedBatch("");
    setFiltersComplete(false);
    setFilteredDivisions([]);
    setFilteredSemesters([]);
  };

  const handleBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    const isComplete = selectedCenter && selectedSchool && batch;
    setFiltersComplete(!!isComplete);

    if (isComplete) {
      const filtered = divisions.filter(
        (d) =>
          d.center === selectedCenter &&
          d.school === selectedSchool &&
          d.batch === selectedBatch
      );
      setFilteredDivisions(filtered);
    } else {
      setFilteredDivisions([]);
    }
    setFilteredSemesters([]);
  };

  // const stats = useMemo(
  //   () => ({
  //     totalDivisions: filteredDivisions.length,
  //     totalStudents: filteredDivisions.reduce(
  //       (sum, d) => sum + d.studentCount,
  //       0
  //     ),
  //     totalTeachers: filteredDivisions.reduce(
  //       (sum, d) => sum + d.teacherCount,
  //       0
  //     ),
  //   }),
  //   [filteredDivisions]
  // );

  const canAddSemester = filtersComplete && filteredDivisions.length > 0;

  const handleUpdateDivision = useCallback((updated: any) => {
    const div = updated as Division;
    setDivisions((prev) =>
      prev.map((d) => (d.id === div.id ? { ...d, ...div } : d))
    );
    setFilteredDivisions((prev) =>
      prev.map((d) => (d.id === div.id ? { ...d, ...div } : d))
    );
  }, []);

  const handleDeleteDivision = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setDivisions((prev) => prev.filter((d) => d.id !== deleteId));
    setFilteredDivisions((prev) => prev.filter((d) => d.id !== deleteId));
    setFilteredSemesters((prev) => prev.filter((s) => s.division !== deleteId));
  }, []);

  const handleAddDivision = useCallback(
    (divisionData: {
      division: string;
      startDate: string;
      endDate: string;
    }) => {
      const newDivision: Division = {
        id: Date.now().toString(),
        division: divisionData.division,
        startDate: divisionData.startDate,
        endDate: divisionData.endDate,
        currentSemester: null,
        semesterCount: 0,
        studentCount: 0,
        teacherCount: 0,
        center: selectedCenter,
        school: selectedSchool,
        batch: selectedBatch,
      };
      setDivisions((prev) => [...prev, newDivision]);
      setFilteredDivisions((prev) => [...prev, newDivision]);
      setIsAddDivisionModalOpen(false);
    },
    [selectedCenter, selectedSchool, selectedBatch]
  );

  const handleUpdateSemester = useCallback((updated: any) => {
    const sem = updated as Semester;
    setSemesters((prev) =>
      prev.map((s) => (s.id === sem.id ? { ...s, ...sem } : s))
    );
    setFilteredSemesters((prev) =>
      prev.map((s) => (s.id === sem.id ? { ...s, ...sem } : s))
    );
  }, []);

  const handleDeleteSemester = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setSemesters((prev) => prev.filter((s) => s.id !== deleteId));
    setFilteredSemesters((prev) => prev.filter((s) => s.id !== deleteId));
  }, []);

  const handleAddSemester = useCallback(
    (semesterData: {
      divisionId: string;
      semesterNumber: number;
      startDate: string;
      endDate: string;
    }) => {
      const newSemester: Semester = {
        id: Date.now().toString(),
        division: semesterData.divisionId,
        semesterNumber: semesterData.semesterNumber,
        startDate: semesterData.startDate,
        endDate: semesterData.endDate,
      };
      setSemesters((prev) => [...prev, newSemester]);

      setDivisions((prev) =>
        prev.map((d) =>
          d.id === semesterData.divisionId
            ? {
                ...d,
                semesterCount: Math.max(
                  d.semesterCount,
                  semesterData.semesterNumber
                ),
              }
            : d
        )
      );

      setFilteredSemesters((prev) => [...prev, newSemester]);
      setIsAddSemesterModalOpen(false);
    },
    []
  );

  const handleOpenAddDivisionModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddDivisionModalOpen(true);
    }
  }, [filtersComplete]);

  const handleOpenAddSemesterModal = useCallback(() => {
    if (canAddSemester) {
      setIsAddSemesterModalOpen(true);
    }
  }, [canAddSemester]);

  const handleCloseAddDivisionModal = useCallback(() => {
    setIsAddDivisionModalOpen(false);
  }, []);

  const handleCloseAddSemesterModal = useCallback(() => {
    setIsAddSemesterModalOpen(false);
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
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Division & Semester Management
        </h2>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {centerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
                  {schoolOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
          </div>
        </div>

        {!filtersComplete ? (
          <div className="h-64 bg-gray-200 rounded-sm animate-pulse"></div>
        ) : (
          <>
            {/* Add Division Button */}
            <div className="flex justify-end">
              <button
                onClick={handleOpenAddDivisionModal}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors"
              >
                <Plus size={16} />
                Add Division
              </button>
            </div>

            {/* Table 1: Divisions */}
            <Table
              data={filteredDivisions}
              title="Divisions"
              filterField="division"
              // badgeFields={["semesterCount", "currentSemester"]}
              selectFields={{
                currentSemester: Array.from(
                  { length: 8 },
                  (_, i) => `Semester ${i + 1}`
                ),
              }}
              nonEditableFields={[
                "id",
                "center",
                "school",
                "batch",
                "semesterCount",
                "studentCount",
                "teacherCount",
              ]}
              onDelete={handleDeleteDivision}
              onEdit={handleUpdateDivision}
              hiddenColumns={["id", "center", "school", "batch"]}
            />

            {/* Add Semester Button (only if divisions exist) */}
            {canAddSemester && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleOpenAddSemesterModal}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-sm hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Semester
                </button>
              </div>
            )}

            {/* Table 2: Semesters */}
            {canAddSemester && (
              <Table
                data={filteredSemesters.filter((sem) =>
                  filteredDivisions.some((div) => div.id === sem.division)
                )}
                title="Semesters"
                filterField="division"
                // badgeFields={["semesterNumber"]}
                selectFields={{}}
                nonEditableFields={["id"]}
                onDelete={handleDeleteSemester}
                onEdit={handleUpdateSemester}
                hiddenColumns={["id"]}
              />
            )}
          </>
        )}

        <AddDivisionModal
          isOpen={isAddDivisionModalOpen}
          onClose={handleCloseAddDivisionModal}
          onDivisionCreated={handleAddDivision}
          selectedCenter={selectedCenter}
          selectedSchool={selectedSchool}
          selectedBatch={selectedBatch}
        />

        <AddSemesterModal
          isOpen={isAddSemesterModalOpen}
          onClose={handleCloseAddSemesterModal}
          onSemesterCreated={handleAddSemester}
          divisions={filteredDivisions}
        />
      </div>
    </div>
  );
}
