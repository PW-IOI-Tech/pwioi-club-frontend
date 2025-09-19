"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, ChevronDown } from "lucide-react";
import Table from "../../Table";
import UploadSection from "./UploadSection";
import studentSchemaInfo from "./StudentSchemaInfo";
import axios from "axios";

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

export default function StudentManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [_isUploading, setIsUploading] = useState(false);

  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/center/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCenters(
            res.data.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              location: c.location,
              code: c.code,
            }))
          );
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (!selectedCenter) {
      setSchools([]);
      setSelectedSchool("");
      setBatches([]);
      setSelectedBatch("");
      setDivisions([]);
      setSelectedDivision("");
      return;
    }

    const fetchSchools = async () => {
      setLoadingSchools(true);
      setSchools([]);
      try {
        const res = await axios.get(
          `${backendUrl}/api/schools/${selectedCenter}`,
          {
            withCredentials: true,
          }
        );
        setSchools(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch schools", err);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) {
      setBatches([]);
      setSelectedBatch("");
      setDivisions([]);
      setSelectedDivision("");
      return;
    }

    const fetchBatches = async () => {
      setLoadingBatches(true);
      setBatches([]);
      try {
        const res = await axios.get(
          `${backendUrl}/api/batches/${selectedSchool}`,
          {
            withCredentials: true,
          }
        );
        setBatches(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch batches", err);
        setBatches([]);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) {
      setDivisions([]);
      setSelectedDivision("");
      return;
    }

    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      setDivisions([]);
      try {
        const res = await axios.get(
          `${backendUrl}/api/division/by-batch/${selectedBatch}`,
          { withCredentials: true }
        );
        setDivisions(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch divisions", err);
        setDivisions([]);
      } finally {
        setLoadingDivisions(false);
      }
    };
    fetchDivisions();
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/students/division/${selectedDivision}`,
          { withCredentials: true }
        );
        if (res.data?.success) {
          setStudents(res.data.data || []);
        } else {
          setStudents([]);
        }
      } catch (err: any) {
        console.error(
          err.response?.data?.message || "Failed to fetch students"
        );
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedDivision]);

  const selectedCenterName = useMemo(() => {
    const c = centers.find((c) => c.id === selectedCenter);
    return c?.name || "";
  }, [centers, selectedCenter]);

  const selectedSchoolName = useMemo(() => {
    const c = schools.find((c) => c.id === selectedSchool);
    return c?.name || "";
  }, [schools, selectedSchool]);

  const selectedBatchName = useMemo(() => {
    const c = batches.find((c) => c.id === selectedBatch);
    return c?.name || "";
  }, [batches, selectedBatch]);

  const selectedDivisionName = useMemo(() => {
    const c = divisions.find((c) => c.id === selectedDivision);
    return c?.code || "";
  }, [divisions, selectedDivision]);

  const allFiltersSelected =
    !!selectedCenter &&
    !!selectedSchool &&
    !!selectedDivision &&
    !!selectedBatch;

  const statistics = useMemo(() => {
    return {
      totalStudents: students.length,
    };
  }, [students]);

  const handleUpdateStudent = useCallback(
    async (updatedItem: any) => {
      try {
        const res = await axios.patch(
          `${backendUrl}/api/students/${updatedItem.id}`,
          updatedItem,
          { withCredentials: true }
        );

        if (res.data.success) {
          setStudents((prev) =>
            prev.map((s) =>
              s.id === updatedItem.id ? { ...s, ...updatedItem } : s
            )
          );
        }
      } catch (err: any) {
        console.error(
          err.response?.data?.message || "Failed to update student"
        );
      }
    },
    [backendUrl]
  );

  const handleDeleteStudent = useCallback(
    async (id: string | number) => {
      if (!confirm("Are you sure you want to delete this student ?"))
        return;

      try {
        const res = await axios.patch(
          `${backendUrl}/api/students/${id}/deactivate`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setStudents((prev) => prev.filter((s) => s.id !== id));
        }
      } catch (err: any) {
        console.error(
          err.response?.data?.message || "Failed to delete student"
        );
      }
    },
    [backendUrl]
  );

  const handleUploadComplete = () => setIsUploading(false);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Student Management
        </h2>

        <div className="bg-[#12294c] p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-white text-sm font-semibold mb-4">
            Filter Students
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Center Dropdown */}
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
                  value={selectedCenter}
                  onChange={(e) => {
                    setSelectedCenter(e.target.value);
                    setSelectedSchool("");
                    setSelectedBatch("");
                    setSelectedDivision("");
                  }}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm cursor-pointer"
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

            {/* School Dropdown */}
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
                    setSelectedBatch("");
                    setSelectedDivision("");
                  }}
                  disabled={!selectedCenter || loadingSchools}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {loadingSchools ? "Loading..." : "Select School"}
                  </option>
                  {!loadingSchools &&
                    schools.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            {/* Batch Dropdown */}
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
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSelectedDivision("");
                  }}
                  disabled={!selectedSchool || loadingBatches}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {loadingBatches ? "Loading..." : "Select Batch"}
                  </option>
                  {!loadingBatches &&
                    batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            {/* Division Dropdown */}
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
                  }}
                  disabled={!selectedBatch || loadingDivisions}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {loadingDivisions ? "Loading..." : "Select Division"}
                  </option>
                  {!loadingDivisions &&
                    divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.code}
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
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center flex flex-col items-center justify-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">
                  Students in{" "}
                  <span className="font-bold"></span>{" "}
                  <span className="font-bold">
                    {selectedSchoolName +
                      selectedBatchName +
                      selectedDivisionName}
                  </span>
                </h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalStudents}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 flex items-center justify-center">
                <UploadSection
                  onSuccess={handleUploadComplete}
                  uploadUrl={`${backendUrl}/api/students/bulk-excel`}
                  schemaInfo={studentSchemaInfo}
                  extraData={{
                    divisionId: selectedDivision,
                  }}
                />
              </div>
            </div>

            <Table
              data={students}
              title={`Students - Batch ${selectedDivisionName}`}
              filterField="school"
              badgeFields={["school"]}
              selectFields={{
                school: [
                  { label: "SOT", value: "SOT" },
                  { label: "SOM", value: "SOM" },
                  { label: "SOH", value: "SOH" },
                ],
              }}
              nonEditableFields={["id", "center", "batch"]}
              onDelete={handleDeleteStudent}
              onEdit={handleUpdateStudent}
              hiddenColumns={["id", "createdAt", "is_active"]}
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
