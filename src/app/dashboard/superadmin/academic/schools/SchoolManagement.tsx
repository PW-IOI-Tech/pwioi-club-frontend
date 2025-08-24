"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus, School, UserRoundPen, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddSchoolModal from "./AddSchoolModal";

interface TableSchool {
  id: string;
  location: string;
  schoolName: string;
  divisionsCount: number;
  batchesCount: number;
  stdCount: number;
  teachersCount: number;
}

const initialSchools: TableSchool[] = [
  {
    id: "1",
    location: "Bangalore",
    schoolName: "SOT",
    divisionsCount: 8,
    batchesCount: 12,
    stdCount: 480,
    teachersCount: 35,
  },
  {
    id: "2",
    location: "Lucknow",
    schoolName: "SOM",
    divisionsCount: 6,
    batchesCount: 10,
    stdCount: 350,
    teachersCount: 28,
  },
  {
    id: "3",
    location: "Pune",
    schoolName: "SOH",
    divisionsCount: 5,
    batchesCount: 8,
    stdCount: 280,
    teachersCount: 22,
  },
  {
    id: "4",
    location: "Noida",
    schoolName: "SOT",
    divisionsCount: 7,
    batchesCount: 11,
    stdCount: 420,
    teachersCount: 32,
  },
  {
    id: "5",
    location: "Bangalore",
    schoolName: "SOM",
    divisionsCount: 6,
    batchesCount: 9,
    stdCount: 315,
    teachersCount: 25,
  },
];

const LOCATIONS = ["Bangalore", "Lucknow", "Pune", "Noida"] as const;

export default function SchoolManagement() {
  const [schools, setSchools] = useState<TableSchool[]>(initialSchools);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredSchools = useMemo(() => {
    if (!selectedLocation) return [];
    return schools.filter((school) => school.location === selectedLocation);
  }, [schools, selectedLocation]);

  const statistics = useMemo(() => {
    const filtered = schools.filter((s) => s.location === selectedLocation);
    return {
      totalSchools: filtered.length,
      totalStudents: filtered.reduce((sum, s) => sum + s.stdCount, 0),
      totalTeachers: filtered.reduce((sum, s) => sum + s.teachersCount, 0),
    };
  }, [schools, selectedLocation]);

  const handleUpdateSchool = useCallback((updatedItem: any) => {
    const schoolItem = updatedItem as TableSchool;
    setSchools((prev) =>
      prev.map((school) =>
        school.id === schoolItem.id ? { ...school, ...schoolItem } : school
      )
    );
  }, []);

  const handleDeleteSchool = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setSchools((prev) => prev.filter((school) => school.id !== deleteId));
  }, []);

  const handleAddSchool = useCallback(
    (newSchoolData: { location: string; schoolName: string }) => {
      const newSchool: TableSchool = {
        id: Date.now().toString(),
        location: newSchoolData.location,
        schoolName: newSchoolData.schoolName,
        divisionsCount: 0,
        batchesCount: 0,
        stdCount: 0,
        teachersCount: 0,
      };

      setSchools((prev) => [...prev, newSchool]);
      setIsAddSchoolModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    if (!selectedLocation) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddSchoolModalOpen(true);
  }, [selectedLocation]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddSchoolModalOpen(false);
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
        <h2 className="text-3xl font-bold text-slate-900">School Management</h2>

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <School className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Schools</h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalSchools}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Students</h4>
                <p className="text-5xl font-bold text-green-600">
                  {statistics.totalStudents.toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400 p-6 text-center">
                <UserRoundPen className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Teachers</h4>
                <p className="text-5xl font-bold text-blue-600">
                  {statistics.totalTeachers}
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
                  <h3 className="text-lg font-semibold">Add New School</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new school record
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredSchools}
              title={`Schools in ${selectedLocation}`}
              filterField="schoolName"
              badgeFields={["location", "schoolName"]}
              selectFields={{
                schoolName: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={[
                "id",
                "location",
                "divisionsCount",
                "batchesCount",
                "stdCount",
                "teachersCount",
              ]}
              onDelete={handleDeleteSchool}
              onEdit={handleUpdateSchool}
              hiddenColumns={["id"]}
            />
          </>
        )}

        <AddSchoolModal
          isOpen={isAddSchoolModalOpen}
          onClose={handleCloseAddModal}
          onSchoolCreated={handleAddSchool}
          prefillLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
