"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, ChevronDown } from "lucide-react";
import Table from "../../Table";
import UploadSection from "../UploadSection";
import teacherSchemaInfo from "./TeacherSchemaInfo";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  center: string;
  phoneNumber: string;
  experience: number;
}

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Amit Sharma",
    email: "amit.sharma@som.edu",
    department: "SOM",
    center: "Bangalore",
    phoneNumber: "9876543210",
    experience: 8,
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya.singh@sot.edu",
    department: "SOT",
    center: "Pune",
    phoneNumber: "9876501234",
    experience: 5,
  },
  {
    id: "3",
    name: "Rahul Mehta",
    email: "rahul.mehta@soh.edu",
    department: "SOH",
    center: "Noida",
    phoneNumber: "9988776655",
    experience: 12,
  },
  {
    id: "4",
    name: "Neha Patel",
    email: "neha.patel@som.edu",
    department: "SOM",
    center: "Lucknow",
    phoneNumber: "8877665544",
    experience: 6,
  },
];

const LOCATIONS = ["Bangalore", "Noida", "Pune", "Lucknow"] as const;
const SCHOOLS = ["SOT", "SOM", "SOH"] as const;

export default function TeacherManagement() {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const bothFiltersSelected = !!selectedLocation && !!selectedSchool;

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      return (
        teacher.center === selectedLocation &&
        teacher.department === selectedSchool
      );
    });
  }, [teachers, selectedLocation, selectedSchool]);

  const statistics = useMemo(() => {
    return {
      totalTeachers: filteredTeachers.length,
    };
  }, [filteredTeachers]);

  const handleUpdateTeacher = useCallback((updatedItem: any) => {
    console.log("Updating teacher:", updatedItem);
  }, []);

  const handleDeleteTeacher = useCallback((id: string | number) => {
    console.log("Deleting teacher with id:", id);
  }, []);

  const handleUploadStart = () => setIsUploading(true);
  const handleUploadComplete = () => setIsUploading(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Teacher Management
        </h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-white text-sm font-semibold mb-4">
            Filter Teachers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="center"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                Center Location
              </label>
              <div className="relative">
                <select
                  id="center"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
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
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
                >
                  <option value="">Select School</option>
                  {SCHOOLS.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>
          </div>

          {!bothFiltersSelected && (
            <p className="text-gray-200 text-sm mt-4">
              Please select both a center and a school to view teacher data.
            </p>
          )}
        </div>

        {!bothFiltersSelected ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">
                  Teachers in {selectedSchool} ({selectedLocation})
                </h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalTeachers}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 flex items-center justify-center">
                <UploadSection
                  onSuccess={handleUploadComplete}
                  uploadUrl={`${backendUrl}/api/teacher/add-teacher`}
                  schemaInfo={teacherSchemaInfo}
                />
              </div>
            </div>

            {/* Table */}
            <Table
              data={filteredTeachers}
              title={`Teachers - ${selectedSchool} at ${selectedLocation}`}
              filterField="department"
              badgeFields={["department"]}
              selectFields={{
                department: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={["id", "center"]}
              onDelete={handleDeleteTeacher}
              onEdit={handleUpdateTeacher}
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
