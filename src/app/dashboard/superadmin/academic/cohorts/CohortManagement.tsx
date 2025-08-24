"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, ChevronDown, Users, Component } from "lucide-react";
import Table from "../../Table";
import AddCohortModal from "./AddCohortModal";

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

const LOCATIONS = ["Bangalore", "Lucknow", "Pune", "Noida"] as const;

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOD", label: "School of Design" },
];

const initialCohorts: TableCohort[] = [
  {
    id: "1",
    cohortName: "Web Dev Cohort A",
    startDate: "2025-01-10",
    endDate: "2025-06-15",
    teacherCount: 2,
    studentCount: 35,
    center: "Bangalore",
    school: "SOT",
  },
  {
    id: "2",
    cohortName: "MBA Leadership Batch",
    startDate: "2025-02-01",
    endDate: "2025-07-30",
    teacherCount: 3,
    studentCount: 42,
    center: "Noida",
    school: "SOM",
  },
];

export default function CohortManagement() {
  const [cohorts, setCohorts] = useState<TableCohort[]>(initialCohorts);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddCohortModalOpen, setIsAddCohortModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredCohorts = useMemo(() => {
    if (!selectedLocation) return [];
    return cohorts.filter((c) => c.center === selectedLocation);
  }, [cohorts, selectedLocation]);

  const statistics = useMemo(() => {
    const filtered = cohorts.filter((c) => c.center === selectedLocation);
    return {
      totalCohorts: filtered.length,
      totalStudents: filtered.reduce((sum, c) => sum + c.studentCount, 0),
      totalTeachers: filtered.reduce((sum, c) => sum + c.teacherCount, 0),
    };
  }, [cohorts, selectedLocation]);

  const handleUpdateCohort = useCallback((updatedItem: any) => {
    const cohort = updatedItem as TableCohort;
    setCohorts((prev) =>
      prev.map((c) => (c.id === cohort.id ? { ...c, ...cohort } : c))
    );
  }, []);

  const handleDeleteCohort = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setCohorts((prev) => prev.filter((c) => c.id !== deleteId));
  }, []);

  const handleAddCohort = useCallback(
    (newCohortData: {
      cohortName: string;
      startDate: string;
      endDate: string;
      school: string;
    }) => {
      const newCohort: TableCohort = {
        id: Date.now().toString(),
        ...newCohortData,
        center: selectedLocation,
        teacherCount: 0,
        studentCount: 0,
      };

      setCohorts((prev) => [...prev, newCohort]);
      setIsAddCohortModalOpen(false);
    },
    [selectedLocation]
  );

  const handleOpenAddModal = useCallback(() => {
    if (!selectedLocation) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddCohortModalOpen(true);
  }, [selectedLocation]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddCohortModalOpen(false);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);

    if (value) {
      setTimeout(() => {
        setShowContent(true);
      }, 400);
    } else {
      setShowContent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Cohort Management</h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-100 mb-2"
          >
            Select Center Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
            >
              <option value="">Select Location to Proceed</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {!selectedLocation ? (
          <ShimmerSkeleton />
        ) : !showContent ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Component className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Cohorts</h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalCohorts}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Students</h4>
                <p className="text-5xl font-bold text-green-600">
                  {statistics.totalStudents}
                </p>
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

            <Table
              data={filteredCohorts}
              title={`Cohorts in ${selectedLocation}`}
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
          prefillLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-sm border border-gray-300 text-center"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
