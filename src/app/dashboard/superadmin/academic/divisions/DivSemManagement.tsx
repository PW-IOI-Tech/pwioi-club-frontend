"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddDivisionModal from "./AddDivisionModal";
import AddSemesterModal from "./AddSemesterModal";
import axios from "axios";

interface Division {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  semesterCount: number;
  studentCount: number;
  teacherCount: number;
  center: string;
  school: string;
  batch: string;
}

interface Semester {
  id: string;
  division: string;
  number: number;
  startDate: string;
  endDate: string;
}

export default function DivSemManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([]);

  const [error, setError] = useState("");
  const [isAddDivisionModalOpen, setIsAddDivisionModalOpen] = useState(false);
  const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [filtersComplete, setFiltersComplete] = useState(false);

  // ---- SEMESTER HANDLERS ----
  const fetchSemesters = useCallback(async (divisionId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${divisionId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const mapped = res.data.data.map((sem: any) => ({
          id: sem.id,
          division: sem.division_id,
          number: sem.semester_number,
          startDate: new Date(sem.start_date).toLocaleDateString(),
          endDate: new Date(sem.end_date).toLocaleDateString(),
        }));
        setSemesters((prev) => [...prev, ...mapped]);
        setFilteredSemesters((prev) => [...prev, ...mapped]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch semesters");
    }
  }, []);

  const handleAddSemester = useCallback(
    async (semesterData: {
      divisionId: string;
      number: number;
      startDate: string;
      endDate: string;
    }) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester`,
          {
            divisionId: semesterData.divisionId,
            number: semesterData.number,
            startDate: semesterData.startDate,
            endDate: semesterData.endDate,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          const newSemester: Semester = {
            id: res.data.data.id,
            division: res.data.data.division_id,
            number: res.data.data.semester_number,
            startDate: new Date(res.data.data.start_date).toLocaleDateString(),
            endDate: new Date(res.data.data.end_date).toLocaleDateString(),
          };
          setSemesters((prev) => [...prev, newSemester]);
          setFilteredSemesters((prev) => [...prev, newSemester]);

          setDivisions((prev) =>
            prev.map((d) =>
              d.id === semesterData.divisionId
                ? {
                    ...d,
                    semesterCount: Math.max(
                      d.semesterCount,
                      semesterData.number
                    ),
                  }
                : d
            )
          );

          setIsAddSemesterModalOpen(false);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add semester");
      }
    },
    []
  );

  const handleUpdateSemester = useCallback(async (updated: any) => {
    const sem = updated as Semester;
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/${sem.id}`,
        {
          number: Number(sem.number),
          startDate: sem.startDate,
          endDate: sem.endDate,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSemesters((prev) =>
          prev.map((s) =>
            s.id === sem.id
              ? {
                  ...s,
                  number: res.data.data.semester_number,
                  startDate: new Date(
                    res.data.data.start_date
                  ).toLocaleDateString(),
                  endDate: new Date(
                    res.data.data.end_date
                  ).toLocaleDateString(),
                }
              : s
          )
        );
        setFilteredSemesters((prev) =>
          prev.map((s) =>
            s.id === sem.id
              ? {
                  ...s,
                  number: res.data.data.semester_number,
                  startDate: new Date(
                    res.data.data.start_date
                  ).toLocaleDateString(),
                  endDate: new Date(
                    res.data.data.end_date
                  ).toLocaleDateString(),
                }
              : s
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update semester");
    }
  }, []);

  const handleDeleteSemester = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/${deleteId}`,
        { withCredentials: true }
      );

      setSemesters((prev) => prev.filter((s) => s.id !== deleteId));
      setFilteredSemesters((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete semester");
    }
  }, []);

  // ---- FILTERS ----
  const handleCenterChange = (center: string) => {
    setSelectedCenter(center);
    setSelectedSchool("");
    setSelectedBatch("");
    setFiltersComplete(false);
    setFilteredDivisions([]);
    setFilteredSemesters([]);
  };

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSelectedBatch("");
    setFiltersComplete(false);
    setFilteredDivisions([]);
    setFilteredSemesters([]);
  };

  useEffect(() => {
    const isComplete = !!(selectedCenter && selectedSchool && selectedBatch);
    setFiltersComplete(isComplete);

    if (isComplete) {
      const fetchDivisions = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
            { withCredentials: true }
          );

          if (res.data.success) {
            const mapped = res.data.data.map((div: any) => ({
              id: div.id,
              code: div.code,
              startDate: new Date(div.start_date).toLocaleDateString(),
              endDate: new Date(div.end_date).toLocaleDateString(),
              center:
                centers.find((c) => c.id === div.center_id)?.name ||
                div.center_id,
              school:
                schools.find((s) => s.id === div.school_id)?.name ||
                div.school_id,
              batch:
                batches.find((b) => b.id === div.batch_id)?.name || div.batch_id,
              currentSemester: div.current_semester || null,
              semesterCount: 0,
              studentCount: 0,
              teacherCount: 0,
            }));

            setDivisions(mapped);
            setFilteredDivisions(mapped);

            // fetch semesters for each division
            mapped.forEach((d:any) => fetchSemesters(d.id));
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch divisions");
        }
      };

      fetchDivisions();
    } else {
      setFilteredDivisions([]);
    }
    setFilteredSemesters([]);
  }, [selectedCenter, selectedSchool, selectedBatch]);

  // ---- CENTERS/SCHOOLS/BATCHES ----
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
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

  // ---- DIVISION HANDLERS ----
  const handleUpdateDivision = useCallback(async (updated: any) => {
    const div = updated as Division;
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/${div.id}`,
        div,
        { withCredentials: true }
      );
      if (res.data.success) {
        setDivisions((prev) =>
          prev.map((d) => (d.id === div.id ? { ...d, ...res.data.data } : d))
        );
        setFilteredDivisions((prev) =>
          prev.map((d) => (d.id === div.id ? { ...d, ...res.data.data } : d))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update division");
    }
  }, []);

  const handleDeleteDivision = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/${deleteId}`,
        { withCredentials: true }
      );
      setDivisions((prev) => prev.filter((d) => d.id !== deleteId));
      setFilteredDivisions((prev) => prev.filter((d) => d.id !== deleteId));
      setFilteredSemesters((prev) =>
        prev.filter((s) => s.division !== deleteId)
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete division");
    }
  }, []);

  const handleAddDivision = useCallback(
    async (divisionData: {
      division: string;
      startDate: string;
      endDate: string;
    }) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division`,
          {
            code: divisionData.division,
            startDate: divisionData.startDate,
            endDate: divisionData.endDate,
            centerId: selectedCenter,
            schoolId: selectedSchool,
            batchId: selectedBatch,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          const newDivision: Division = res.data.data;
          setDivisions((prev) => [...prev, newDivision]);
          setFilteredDivisions((prev) => [...prev, newDivision]);
          setIsAddDivisionModalOpen(false);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add division");
      }
    },
    [selectedCenter, selectedSchool, selectedBatch]
  );

  // ---- MODAL HANDLERS ----
  const canAddSemester = filtersComplete && filteredDivisions.length > 0;

  const handleOpenAddDivisionModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddDivisionModalOpen(true);
    }
  }, [filtersComplete]);

  const handleOpenAddSemesterModal = useCallback(() => {
    if (canAddSemester) {
      setIsAddSemesterModalOpen(true);
    }
  }, [canAddSemester]);

  const handleCloseAddDivisionModal = useCallback(() => {
    setIsAddDivisionModalOpen(false);
  }, []);

  const handleCloseAddSemesterModal = useCallback(() => {
    setIsAddSemesterModalOpen(false);
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
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Division & Semester Management
        </h2>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onChange={(e) => handleCenterChange(e.target.value)}
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
                  onChange={(e) => handleSchoolChange(e.target.value)}
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
                  onChange={(e) => setSelectedBatch(e.target.value)}
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
          </div>
        </div>

        {!filtersComplete ? (
          <div className="h-64 bg-gray-200 rounded-sm animate-pulse"></div>
        ) : (
          <>
            {/* Add Division Button */}
            <div className="flex justify-end">
              <button
                onClick={handleOpenAddDivisionModal}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors"
              >
                <Plus size={16} />
                Add Division
              </button>
            </div>

{/* Table: Divisions */}
            <Table
              data={filteredDivisions}
              title="Divisions"
              filterField="code"
              nonEditableFields={["id", "semesterCount", "studentCount", "teacherCount"]}
              onDelete={handleDeleteDivision}
              onEdit={handleUpdateDivision}
              hiddenColumns={["id"]}
              columns={[
                { accessorKey: "code", header: "Code" },
                { accessorKey: "center", header: "Center" },
                { accessorKey: "school", header: "School" },
                { accessorKey: "batch", header: "Batch" },
                { accessorKey: "startDate", header: "Start Date" },
                { accessorKey: "endDate", header: "End Date" },
              ]}
            />

            {/* Add Semester Button */}
            {canAddSemester && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleOpenAddSemesterModal}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-sm hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Semester
                </button>
              </div>
            )}

            {/* Table: Semesters */}
            {canAddSemester && (
              <Table
                data={filteredSemesters.filter((sem) =>
                  filteredDivisions.some((div) => div.id === sem.division)
                )}
                title="Semesters"
                filterField="division"
                nonEditableFields={["id"]}
                onDelete={handleDeleteSemester}
                onEdit={handleUpdateSemester}
                hiddenColumns={["id"]}
              />
            )}
          </>
        )}

        <AddDivisionModal
          isOpen={isAddDivisionModalOpen}
          onClose={handleCloseAddDivisionModal}
          onDivisionCreated={handleAddDivision}
          selectedCenter={selectedCenter}
          selectedSchool={selectedSchool}
          selectedBatch={selectedBatch}
        />

        <AddSemesterModal
          isOpen={isAddSemesterModalOpen}
          onClose={handleCloseAddSemesterModal}
          onSemesterCreated={handleAddSemester}
          divisions={filteredDivisions}
        />
      </div>
    </div>
  );
}