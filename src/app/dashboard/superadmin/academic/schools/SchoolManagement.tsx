"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus, School, UserRoundPen } from "lucide-react";
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

export default function SchoolManagement() {
  const [schools, setSchools] = useState<TableSchool[]>(initialSchools);
  const [error, setError] = useState("");
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalSchools: schools.length,
      totalStudents: schools.reduce((sum, school) => sum + school.stdCount, 0),
      totalTeachers: schools.reduce(
        (sum, school) => sum + school.teachersCount,
        0
      ),
    }),
    [schools]
  );

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
    setIsAddSchoolModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddSchoolModalOpen(false);
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
          School Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <School className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Schools</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalSchools}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Students</h4>
              <p className="text-5xl font-bold text-green-600">
                {statistics.totalStudents.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <UserRoundPen className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Teachers</h4>
              <p className="text-5xl font-bold text-blue-600">
                {statistics.totalTeachers}
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
              <h3 className="text-lg font-semibold">Add New School</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new school record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={schools}
          title="Schools Overview"
          filterField="location"
          badgeFields={["location", "schoolName"]}
          selectFields={{
            location: ["bangalore", "lucknow", "pune", "noida"],
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

        <AddSchoolModal
          isOpen={isAddSchoolModalOpen}
          onClose={handleCloseAddModal}
          onSchoolCreated={handleAddSchool}
        />
      </div>
    </div>
  );
}
