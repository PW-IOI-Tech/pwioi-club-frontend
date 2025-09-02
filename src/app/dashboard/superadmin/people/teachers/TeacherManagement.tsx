// TeacherManagement.tsx

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
  center: string;
  phoneNumber: string;
  experience: number;
}

export default function TeacherManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

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
          setSelectedLocation(data[0].id);
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

  useEffect(() => {
    if (!selectedSchool) return;
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/teachers/school/${selectedSchool}`,
          { withCredentials: true }
        );
        setTeachers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, [selectedSchool]);

  const selectedCenterName = useMemo(() => {
    const c = centers.find((c) => c.id === selectedLocation);
    return c?.name || "";
  }, [centers, selectedLocation]);

  const statistics = useMemo(() => {
    return {
      totalTeachers: teachers.length,
    };
  }, [teachers]);

  const handleUpdateTeacher = useCallback(
    async (updatedItem: any) => {
      try {
        const allowedFields = (({
          name,
          email,
          pwId,
          phoneNumber,
          gender,
          role,
        }) => ({
          name,
          email,
          pwId,
          phoneNumber,
          gender,
          role,
        }))(updatedItem);

        const res = await axios.patch(
          `${backendUrl}/api/teachers/${updatedItem.id}`,
          allowedFields,
          { withCredentials: true }
        );

        setTeachers((prev) =>
          prev.map((t) =>
            t.id === updatedItem.id
              ? res.data?.data || { ...t, ...allowedFields }
              : t
          )
        );

        console.log("Teacher updated:", res.data);
      } catch (err: any) {
        console.error("Failed to update teacher:", err.response?.data || err);
      }
    },
    [backendUrl]
  );

  const handleDeleteTeacher = useCallback(
    async (id: string | number) => {
      if (!confirm("Are you sure you want to delete this teacher?")) return;

      try {
        await axios.delete(`${backendUrl}/api/teachers/${id}`, {
          withCredentials: true,
        });

        // Remove from state
        setTeachers((prev) => prev.filter((t) => t.id !== id));

        console.log("Teacher deleted:", id);
      } catch (err: any) {
        console.error("Failed to delete teacher:", err);
      }
    },
    [backendUrl]
  );

  const handleUploadComplete = () => {
    if (selectedSchool) {
      axios
        .get(`${backendUrl}/api/teachers/school/${selectedSchool}`, {
          withCredentials: true,
        })
        .then((res) => setTeachers(res.data?.data || []));
    }
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
        {!bothFiltersSelected || loadingTeachers ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">
                  Teachers in selected center and school
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
              data={teachers}
              title={`Teachers of ${
                schools.find((s) => s.id === selectedSchool)?.name || ""
              } at ${selectedCenterName}`}
              filterField="department"
              badgeFields={["department"]}
              selectFields={{
                department: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={["id", "center"]}
              onDelete={handleDeleteTeacher}
              onEdit={handleUpdateTeacher}
              hiddenColumns={[
                "id",
                "designation",
                "linkedin",
                "github_link",
                "personal_mail",
                "createdAt",
              ]}
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
