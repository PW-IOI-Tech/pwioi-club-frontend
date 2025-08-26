"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, ChevronDown } from "lucide-react";
import Table from "../../Table";
import UploadSection from "../UploadSection";
import studentSchemaInfo from "./StudentSchemaInfo";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  center: string;
  school: string;
  division: string;
  batch: string;
  phoneNumber: string;
}

const initialStudents: Student[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    email: "arjun.sot@edu.com",
    rollNo: "SOT24B1-001",
    center: "Bangalore",
    school: "SOT",
    division: "24",
    batch: "SOT24B1",
    phoneNumber: "9876543210",
  },
  {
    id: "2",
    name: "Priya Nair",
    email: "priya.som@edu.com",
    rollNo: "SOM24B2-023",
    center: "Pune",
    school: "SOM",
    division: "24",
    batch: "SOM24B2",
    phoneNumber: "9876501234",
  },
  {
    id: "3",
    name: "Vikram Singh",
    email: "vikram.soh@edu.com",
    rollNo: "SOH25B1-011",
    center: "Noida",
    school: "SOH",
    division: "25",
    batch: "SOH25B1",
    phoneNumber: "9988776655",
  },
  {
    id: "4",
    name: "Anjali Patel",
    email: "anjali.sot@edu.com",
    rollNo: "SOT23B2-007",
    center: "Lucknow",
    school: "SOT",
    division: "23",
    batch: "SOT23B2",
    phoneNumber: "8877665544",
  },
];

const LOCATIONS = ["Bangalore", "Noida", "Pune", "Lucknow"] as const;
const SCHOOLS = ["SOT", "SOM", "SOH"] as const;
const DIVISIONS = ["23", "24", "25"] as const;

export default function StudentManagement() {
  const [students] = useState<Student[]>(initialStudents);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const allFiltersSelected =
    !!selectedLocation &&
    !!selectedSchool &&
    !!selectedDivision &&
    !!selectedBatch;

  const availableBatches = useMemo(() => {
    if (!selectedSchool || !selectedDivision) return [];
    return ["B1", "B2", "B3"].map(
      (b) => `${selectedSchool}${selectedDivision}${b}`
    );
  }, [selectedSchool, selectedDivision]);

  const filteredStudents = useMemo(() => {
    if (!allFiltersSelected) return [];
    return students.filter(
      (s) => s.batch === selectedBatch && s.center === selectedLocation
    );
  }, [students, selectedBatch, selectedLocation, allFiltersSelected]);

  const statistics = useMemo(() => {
    return {
      totalStudents: filteredStudents.length,
    };
  }, [filteredStudents]);

  const handleUpdateStudent = useCallback((updatedItem: any) => {
    console.log("Updating student:", updatedItem);
  }, []);

  const handleDeleteStudent = useCallback((id: string | number) => {
    console.log("Deleting student with id:", id);
  }, []);

  const handleUploadComplete = () => setIsUploading(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Student Management
        </h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-white text-sm font-semibold mb-4">
            Filter Students
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label
                htmlFor="center"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                Center
              </label>
              <div className="relative">
                <select
                  id="center"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setSelectedSchool("");
                    setSelectedDivision("");
                    setSelectedBatch("");
                  }}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm"
                >
                  <option value="">Select Center</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="school"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                School
              </label>
              <div className="relative">
                <select
                  id="school"
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedDivision("");
                    setSelectedBatch("");
                  }}
                  disabled={!selectedLocation}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select School</option>
                  {SCHOOLS.map((sch) => (
                    <option key={sch} value={sch}>
                      {sch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="division"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                Division
              </label>
              <div className="relative">
                <select
                  id="division"
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedBatch("");
                  }}
                  disabled={!selectedSchool}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Division</option>
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="batch"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                Batch
              </label>
              <div className="relative">
                <select
                  id="batch"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  disabled={!selectedDivision || availableBatches.length === 0}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Batch</option>
                  {availableBatches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>
          </div>

          {!allFiltersSelected && (
            <p className="text-gray-200 text-sm mt-4">
              Please select all filters to view student data.
            </p>
          )}
        </div>

        {!allFiltersSelected ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">
                  Students in {selectedBatch}
                </h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalStudents}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 flex items-center justify-center">
                <UploadSection
                  onSuccess={handleUploadComplete}
                  uploadUrl={`${backendUrl}/api/student/add-student`}
                  schemaInfo={studentSchemaInfo}
                />
              </div>
            </div>

            <Table
              data={filteredStudents}
              title={`Students - Batch ${selectedBatch}`}
              filterField="school"
              badgeFields={["school"]}
              selectFields={{
                school: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={["id", "center", "batch"]}
              onDelete={handleDeleteStudent}
              onEdit={handleUpdateStudent}
              hiddenColumns={["id"]}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
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
