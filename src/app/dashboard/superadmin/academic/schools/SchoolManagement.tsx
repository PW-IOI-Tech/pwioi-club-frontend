"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus, School, UserRoundPen, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddSchoolModal from "./AddSchoolModal";
import axios from "axios";

interface TableSchool {
  id: string;
  location: string;
  schoolName: string;
  divisionsCount: number;
  batchesCount: number;
  stdCount: number;
  teachersCount: number;
}

export default function SchoolManagement() {
  const [schools, setSchools] = useState<TableSchool[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools`,
  });

  const fetchSchools = async (centerId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/${centerId}`, { withCredentials: true });
      const schoolsData = res.data.data;

      const schoolsWithStats = await Promise.all(
        schoolsData.map(async (school: any) => {
          try {
            const statsRes = await api.get(`/school-stats/${school.id}`, {
              withCredentials: true,
            });
            const stats = statsRes.data.data;
            return {
              id: school.id,
              location:
                centers.find((c) => c.id === selectedLocation)?.name || "",
              schoolName: school.name,
              batchesCount: stats.batches,
              divisionsCount: stats.divisions,
              stdCount: stats.students,
              teachersCount: stats.teachers,
            };
          } catch {
            return {
              location: selectedLocation,
              schoolName: school.name,
              divisionsCount: 0,
              batchesCount: 0,
              stdCount: 0,
              teachersCount: 0,
            };
          }
        })
      );

      setSchools(schoolsWithStats);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  // Fetch centers & auto-select the first one
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        const data = res.data.data || [];
        setCenters(data);
        if (data.length > 0) {
          setSelectedLocation(data[0].id); // auto-select first
          setShowContent(true);
        }
      } catch (err: any) {
        console.error("Failed to fetch centers:", err);
      }
    })();
  }, []);

  // Fetch schools whenever location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchSchools(selectedLocation);
    }
  }, [selectedLocation]);

  const handleAddSchool = async (newSchoolData: {
    location: string;
    schoolName: string;
  }) => {
    try {
      await api.post(
        "/create",
        {
          centerId: selectedLocation,
          schoolNames: [newSchoolData.schoolName],
        },
        { withCredentials: true }
      );
      fetchSchools(selectedLocation);
      setIsAddSchoolModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add school");
    }
  };

  const handleUpdateSchool = async (updatedItem: any) => {
    try {
      await api.patch(
        `/${updatedItem.id}`,
        { name: updatedItem.schoolName },
        { withCredentials: true }
      );
      fetchSchools(selectedLocation);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update school");
    }
  };

  const handleDeleteSchool = async (id: string | number) => {
    try {
      await api.delete(`/${id}`, { withCredentials: true });
      fetchSchools(selectedLocation);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete school");
    }
  };

  const statistics = useMemo(
    () => ({
      totalSchools: schools.length,
      totalStudents: schools.reduce((sum, s) => sum + s.stdCount, 0),
      totalTeachers: schools.reduce((sum, s) => sum + s.teachersCount, 0),
    }),
    [schools]
  );

  const handleOpenAddModal = useCallback(() => {
    if (!selectedLocation) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddSchoolModalOpen(true);
  }, [selectedLocation]);

  const handleCloseAddModal = useCallback(
    () => setIsAddSchoolModalOpen(false),
    []
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);
    if (value) {
      setTimeout(() => setShowContent(true), 400);
    } else {
      setShowContent(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            if (selectedLocation) fetchSchools(selectedLocation);
          }}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">School Management</h2>

        {/* Location Dropdown */}
        <div className="bg-[#12294c] p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-100 mb-2">
            Select Center Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer text-sm appearance-none"
            >
              <option value="">Select Location to Proceed</option>
              {centers.map((center: any) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {!selectedLocation || !showContent || loading ? (
          <ShimmerSkeleton />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={<School />}
                label="Total Schools"
                value={statistics.totalSchools}
                color="text-[#1B3A6A]"
              />
              <StatCard
                icon={<Users />}
                label="Total Students"
                value={statistics.totalStudents.toLocaleString()}
                color="text-green-600"
              />
              <StatCard
                icon={<UserRoundPen />}
                label="Total Teachers"
                value={statistics.totalTeachers}
                color="text-blue-600"
              />
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
              title={`Schools in ${
                centers.find((c) => c.id === selectedLocation)?.name || ""
              }`}
              filterField="schoolName"
              badgeFields={["location", "schoolName"]}
              nonEditableFields={[
                "selectedLocation",
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

        {/* Modal */}
        <AddSchoolModal
          isOpen={isAddSchoolModalOpen}
          onClose={handleCloseAddModal}
          onSchoolCreated={handleAddSchool}
          prefillLocation={selectedLocation}
          centers={centers}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
      <div className="w-8 h-8 text-slate-900 mx-auto mb-2">{icon}</div>
      <h4 className="text-lg text-slate-900 mb-1">{label}</h4>
      <p className={`text-5xl font-bold ${color}`}>{value}</p>
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
