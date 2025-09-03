"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, ChevronDown, Users, Component } from "lucide-react";
import Table from "../../Table";
import AddCohortModal from "./AddCohortModal";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

interface Center {
  id: string;
  name: string;
  location: string;
  code: string;
}

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOH", label: "School of Humanities" },
];

export default function CohortManagement() {
  const [cohorts, setCohorts] = useState<TableCohort[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isAddCohortModalOpen, setIsAddCohortModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingCohort, setCreatingCohort] = useState(false);

  // Fetch centers from backend
  useEffect(() => {
    const getCenters = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/center/all`, {
          withCredentials: true,
        });

        const fetchedCenters: Center[] = res.data.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          code: c.code,
        }));

        setCenters(fetchedCenters);
      } catch (err) {
        console.error("Error fetching centers:", err);
      }
    };

    getCenters();
  }, []);

  // Fetch cohorts - either all cohorts or by center
  const fetchCohorts = useCallback(
    async (centerId?: string, centerName?: string) => {
      setLoading(true);
      try {
        const endpoint = centerId
          ? `${BACKEND_URL}/api/cohort/center/${centerId}`
          : `${BACKEND_URL}/api/cohort/`;

        const res = await axios.get(endpoint, {
          withCredentials: true,
        });

        const fetchedCohorts: TableCohort[] = res.data.data.map(
          (cohort: any) => ({
            id: cohort.id,
            cohortName: cohort.name,
            startDate: cohort.start_date,
            endDate: cohort.end_date || "",
            teacherCount: cohort._count.teacherCohorts,
            studentCount: cohort._count.students,
            center: centerName || "", // For center-specific fetch, use provided name
            school: cohort.school.name,
          })
        );

        setCohorts(fetchedCohorts);
      } catch (err) {
        console.error("Error fetching cohorts:", err);
        setCohorts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch all cohorts on component mount if no center selected
  useEffect(() => {
    if (!selectedCenter) {
      fetchCohorts();
    }
  }, [fetchCohorts, selectedCenter]);

  const filteredCohorts = useMemo(() => {
    if (!selectedCenter) return [];
    return cohorts; // No need to filter since we fetch by center
  }, [cohorts, selectedCenter]);

  const statistics = useMemo(() => {
    const cohortsToCount = selectedCenter ? cohorts : [];
    return {
      totalCohorts: cohortsToCount.length,
      totalStudents: cohortsToCount.reduce((sum, c) => sum + c.studentCount, 0),
      totalTeachers: cohortsToCount.reduce((sum, c) => sum + c.teacherCount, 0),
    };
  }, [cohorts, selectedCenter]);

  const handleUpdateCohort = useCallback(async (updatedItem: any) => {
    const cohort = updatedItem as TableCohort;

    try {
      const updateData: any = {};

      // Map the fields for API
      if (cohort.cohortName !== undefined) updateData.name = cohort.cohortName;
      if (cohort.startDate !== undefined)
        updateData.start_date = cohort.startDate;
      if (cohort.endDate !== undefined && cohort.endDate !== "") {
        updateData.end_date = cohort.endDate;
      } else if (cohort.endDate === "") {
        updateData.end_date = null;
      }

      await axios.patch(`${BACKEND_URL}/api/cohort/${cohort.id}`, updateData, {
        withCredentials: true,
      });

      setCohorts((prev) =>
        prev.map((c) => (c.id === cohort.id ? { ...c, ...cohort } : c))
      );
    } catch (err) {
      console.error("Error updating cohort:", err);
      // Optionally show error message to user
    }
  }, []);

  const handleDeleteCohort = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;

    try {
      await axios.delete(`${BACKEND_URL}/api/cohort/${deleteId}`, {
        withCredentials: true,
      });

      setCohorts((prev) => prev.filter((c) => c.id !== deleteId));
    } catch (err) {
      console.error("Error deleting cohort:", err);
      // Optionally show error message to user
    }
  }, []);

  const handleAddCohort = useCallback(
    async (
      newCohortData: {
        cohortName: string;
        startDate: string;
        endDate: string;
        school: string;
      },
      selectedTeachers: string[],
      uploadedFile: File | null
    ) => {
      if (!selectedCenter) {
        console.error("No center selected");
        return;
      }

      if (!uploadedFile) {
        alert("Please upload a student Excel file to create the cohort.");
        return;
      }

      setCreatingCohort(true);

      try {
        const formData = new FormData();

        // Add cohort data
        formData.append("name", newCohortData.cohortName);
        formData.append("school_id", newCohortData.school);
        formData.append("center_id", selectedCenter.id);
        formData.append("start_date", newCohortData.startDate);

        if (newCohortData.endDate) {
          formData.append("end_date", newCohortData.endDate);
        }

        // Add teacher IDs as JSON string
        formData.append("teacher_ids", JSON.stringify(selectedTeachers));

        // Add the uploaded file
        formData.append("file", uploadedFile);

        const response = await axios.post(
          `${BACKEND_URL}/api/cohort/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // Refresh the cohorts list to get the latest data
          await fetchCohorts(selectedCenter.id, selectedCenter.name);
          setIsAddCohortModalOpen(false);
        }
      } catch (err: any) {
        console.error("Error creating cohort:", err);

        // Show error message to user
        const errorMessage =
          err.response?.data?.message ||
          "Failed to create cohort. Please try again.";
        console.log(errorMessage);
      } finally {
        setCreatingCohort(false);
      }
    },
    [selectedCenter, fetchCohorts]
  );

  const handleOpenAddModal = useCallback(() => {
    if (!selectedCenter) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddCohortModalOpen(true);
  }, [selectedCenter]);

  const handleCloseAddModal = useCallback(() => {
    if (creatingCohort) return; // Prevent closing while creating
    setIsAddCohortModalOpen(false);
  }, [creatingCohort]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const found = centers.find((c) => c.id === value) || null;
    setSelectedCenter(found);

    if (found) {
      fetchCohorts(found.id, found.name);
      setTimeout(() => {
        setShowContent(true);
      }, 400);
    } else {
      setShowContent(false);
      fetchCohorts(); // Fetch all cohorts when no center selected
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
              value={selectedCenter?.id || ""}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
            >
              <option value="">Select Location to Proceed</option>
              {centers.map((center) => (
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

        {!selectedCenter || !showContent || loading ? (
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
                  disabled={creatingCohort}
                  className="flex flex-col items-center justify-center w-full h-full text-slate-900 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="bg-gray-200 rounded-full p-3 mb-2 hover:bg-gray-300 transition-colors">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {creatingCohort ? "Creating..." : "Add New Cohort"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {creatingCohort ? "Please wait" : "Create a new cohort"}
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredCohorts}
              title={`Cohorts in ${selectedCenter.name}`}
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
          prefillLocation={selectedCenter?.name || ""}
          centerId={selectedCenter?.id || ""}
          isCreating={creatingCohort}
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
