"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, ChevronDown, Users, Component } from "lucide-react";
import Table from "../../Table";
import AddCohortModal from "./AddCohortModal";

// Types
interface TableCohort {
  id: string;
  cohortName: string;
  startDate: string;
  endDate: string;
  teacherCount: number;
  studentCount: number;
  center: string;
  school: string;
}

// Center options
const centerOptions = [
  { value: "bangalore", label: "Bangalore" },
  { value: "lucknow", label: "Lucknow" },
  { value: "pune", label: "Pune" },
  { value: "noida", label: "Noida" },
];

// School options
const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

// Sample data
const initialCohorts: TableCohort[] = [
  {
    id: "1",
    cohortName: "Web Dev Cohort A",
    startDate: "2025-01-10",
    endDate: "2025-06-15",
    teacherCount: 2,
    studentCount: 35,
    center: "bangalore",
    school: "SOT",
  },
  {
    id: "2",
    cohortName: "MBA Leadership Batch",
    startDate: "2025-02-01",
    endDate: "2025-07-30",
    teacherCount: 3,
    studentCount: 42,
    center: "noida",
    school: "SOM",
  },
];

export default function CohortManagement() {
  const [cohorts, setCohorts] = useState<TableCohort[]>([]);
  const [filteredCohorts, setFilteredCohorts] = useState<TableCohort[]>([]);
  const [error, setError] = useState("");
  const [isAddCohortModalOpen, setIsAddCohortModalOpen] = useState(false);

  // Filter state
  const [selectedCenter, setSelectedCenter] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

  // Load sample data
  React.useEffect(() => {
    setCohorts(initialCohorts);
  }, []);

  const statistics = useMemo(() => {
    const filtered = cohorts.filter((c) => c.center === selectedCenter);
    return {
      totalCohorts: filtered.length,
      totalStudents: filtered.reduce((sum, c) => sum + c.studentCount, 0),
      totalTeachers: filtered.reduce((sum, c) => sum + c.teacherCount, 0),
    };
  }, [cohorts, selectedCenter]);

  const handleCenterChange = (center: string) => {
    setSelectedCenter(center);
    setFiltersComplete(!!center);
    if (center) {
      const filtered = cohorts.filter((c) => c.center === center);
      setFilteredCohorts(filtered);
    } else {
      setFilteredCohorts([]);
    }
  };

  const handleUpdateCohort = useCallback((updatedItem: any) => {
    const cohort = updatedItem as TableCohort;
    setCohorts((prev) =>
      prev.map((c) => (c.id === cohort.id ? { ...c, ...cohort } : c))
    );
    setFilteredCohorts((prev) =>
      prev.map((c) => (c.id === cohort.id ? { ...c, ...cohort } : c))
    );
  }, []);

  const handleDeleteCohort = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setCohorts((prev) => prev.filter((c) => c.id !== deleteId));
    setFilteredCohorts((prev) => prev.filter((c) => c.id !== deleteId));
  }, []);

  const handleAddCohort = useCallback(
    (
      newCohortData: Omit<
        TableCohort,
        "id" | "center" | "teacherCount" | "studentCount"
      >
    ) => {
      const newCohort: TableCohort = {
        id: Date.now().toString(),
        ...newCohortData,
        center: selectedCenter,
        teacherCount: 0, // Will be updated later via backend
        studentCount: 0,
      };

      setCohorts((prev) => [...prev, newCohort]);
      setFilteredCohorts((prev) => [...prev, newCohort]);
      setIsAddCohortModalOpen(false);
    },
    [selectedCenter]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddCohortModalOpen(true);
    }
  }, [filtersComplete]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddCohortModalOpen(false);
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
          Cohort Management
        </h2>

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Center
          </h3>
          <div className="max-w-md">
            <div className="relative">
              <select
                value={selectedCenter}
                onChange={(e) => handleCenterChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Select Center</option>
                {centerOptions.map((option) => (
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
        </div>

        {!filtersComplete ? (
          /* Shimmer while no center selected */
          <div className="space-y-6">
            Please select center location to Proceed
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <Component className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">Total Cohorts</h4>
                  <p className="text-5xl font-bold text-[#1B3A6A]">
                    {statistics.totalCohorts}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">
                    Total Students
                  </h4>
                  <p className="text-5xl font-bold text-green-600">
                    {statistics.totalStudents}
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
                  <h3 className="text-lg font-semibold">Add New Cohort</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new cohort
                  </p>
                </button>
              </div>
            </div>

            {/* Table */}
            <Table
              data={filteredCohorts}
              title="Cohorts Overview"
              filterField="cohortName"
              badgeFields={["teacherCount", "studentCount"]}
              selectFields={{
                school: schoolOptions.map((opt) => opt.value),
              }}
              nonEditableFields={[
                "id",
                "center",
                "teacherCount",
                "studentCount",
              ]}
              onDelete={handleDeleteCohort}
              onEdit={handleUpdateCohort}
              hiddenColumns={["id", "center"]}
            />
          </>
        )}

        <AddCohortModal
          isOpen={isAddCohortModalOpen}
          onClose={handleCloseAddModal}
          onCohortCreated={handleAddCohort}
          center={selectedCenter}
        />
      </div>
    </div>
  );
}
