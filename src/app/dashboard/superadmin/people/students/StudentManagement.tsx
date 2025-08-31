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

export default function StudentManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [students] = useState<Student[]>(initialStudents);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          {
            withCredentials: true,
          }
        );
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

  // ✅ Fetch Schools when Center selected
  useEffect(() => {
    if (!selectedCenter) return;
    const fetchSchools = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
          { withCredentials: true }
        );
        setSchools(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch schools");
      }
    };
    fetchSchools();
  }, [selectedCenter]);

  // ✅ Fetch Batches when School selected
  useEffect(() => {
    if (!selectedSchool) return;
    const fetchBatches = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
          { withCredentials: true }
        );
        setBatches(res.data?.data || []);
      } catch {
        console.error("Failed to fetch batches");
      }
    };
    fetchBatches();
  }, [selectedSchool]);

  // ✅ Fetch Divisions when Batch selected
  useEffect(() => {
    if (!selectedBatch) return;
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
          { withCredentials: true }
        );
        setDivisions(res.data?.data || []);
      } catch {
        console.error("Failed to fetch divisions");
      }
    };
    fetchDivisions();
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) return;
    const fetchSemesters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
          { withCredentials: true }
        );
        setSemesters(res.data?.data || []);
      } catch {
        console.error("Failed to fetch semesters");
      }
    };
    fetchSemesters();
  }, [selectedDivision]);

  const allFiltersSelected =
    !!selectedCenter &&
    !!selectedSchool &&
    !!selectedDivision &&
    !!selectedBatch &&
    !!selectedSemester;

  const filteredStudents = useMemo(() => {
    if (!allFiltersSelected) return [];
    return students.filter(
      (s) => s.batch === selectedBatch && s.center === selectedCenter
    );
  }, [students, selectedBatch, selectedCenter, allFiltersSelected]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    setSelectedDivision("");
                    setSelectedBatch("");
                  }}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm"
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
                  disabled={!selectedCenter}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select School</option>
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name}
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
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSelectedDivision("");
                  }}
                  disabled={!selectedSchool || batches.length === 0}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
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
                  }}
                  disabled={!selectedBatch}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.code}
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
                Semester
              </label>
              <div className="relative">
                <select
                  id="semster"
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                  }}
                  disabled={!selectedDivision}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.number}
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
                  Students in selected batch
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
                    semesterId: selectedSemester,
                  }}
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
