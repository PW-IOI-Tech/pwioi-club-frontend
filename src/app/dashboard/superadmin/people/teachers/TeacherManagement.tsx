"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, ChevronDown } from "lucide-react";
import Table from "../../Table";
import UploadSection from "../UploadSection";
import teacherSchemaInfo from "./TeacherSchemaInfo";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  center: string; // currently name in mock data
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

export default function TeacherManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [selectedLocation, setSelectedLocation] = useState<string>(""); // store centerId
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [schools, setSchools] = useState<any[]>([]);

  const bothFiltersSelected = !!selectedLocation && !!selectedSchool;

  // Fetch centers
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/center/all`, {
          withCredentials: true,
        });
        const data = res.data.data || [];
        setCenters(data);
        if (data.length > 0) {
          setSelectedLocation(data[0].id); // default to first centerId
        }
      } catch (err: any) {
        console.error("Failed to fetch centers:", err);
      }
    })();
  }, []);

  // Fetch schools for a center
  useEffect(() => {
    if (!selectedLocation) return;
    const fetchSchools = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/schools/${selectedLocation}`,
          { withCredentials: true }
        );
        setSchools(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };
    fetchSchools();
  }, [selectedLocation]);

  // For filtering, get centerName from centers
  const selectedCenterName = useMemo(() => {
    const c = centers.find((c) => c.id === selectedLocation);
    return c?.name || "";
  }, [centers, selectedLocation]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.center === selectedCenterName &&
        teacher.department === selectedSchool
    );
  }, [teachers, selectedCenterName, selectedSchool]);

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

  const handleUploadComplete = () => {
    console.log("Upload completed");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Teacher Management
        </h2>

        {/* Filter Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-white text-sm font-semibold mb-4">
            Filter Teachers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Center Filter */}
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
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            {/* School Filter */}
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
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
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

        {/* Content */}
        {!bothFiltersSelected ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">
                  Teachers in {selectedSchool} ({selectedCenterName})
                </h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalTeachers}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 flex items-center justify-center">
                <UploadSection
  onSuccess={handleUploadComplete}
  uploadUrl={`${backendUrl}/api/teachers/upload`}
  schemaInfo={teacherSchemaInfo}
  extraData={{
    centerId: selectedLocation,
    schoolIds: [selectedSchool],
  }}
/>

              </div>
            </div>

            <Table
              data={filteredTeachers}
              title={`Teachers - ${selectedSchool} at ${selectedCenterName}`}
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
