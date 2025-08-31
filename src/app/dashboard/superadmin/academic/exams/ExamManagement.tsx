"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, ChevronDown, NotepadText } from "lucide-react";
import Table from "../../Table";
import AddExamModal from "./AddExamModal";
import axios from "axios";

interface TableExam {
  id: string;
  examName: string;
  weightage: number;
  maxMarks: number;
  passingMarks: number;
  examType: "Midterm" | "Final" | "Quiz" | "Assignment" | "Practical";
  date: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
}

export default function ExamManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const allFiltersSelected =
    selectedCenter &&
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester;

  // ----------------- FETCH FILTER DATA -----------------
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        if (res.data.success) setCenters(res.data.data);
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (!selectedCenter) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
        { withCredentials: true }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"));
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
        { withCredentials: true }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"));
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
        { withCredentials: true }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
        { withCredentials: true }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"));
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedSemester) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${selectedSemester}`,
        { withCredentials: true }
      )
      .then((res) => setSubjects(res.data?.data || []))
      .catch(() => console.error("Failed to fetch subjects"));
  }, [selectedSemester]);

  useEffect(() => {
    if (!allFiltersSelected) return;

    const fetchExams = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${selectedSchool}`,
          {
            batch: selectedBatch,
            division: selectedDivision,
            semester: selectedSemester,
          },
          { withCredentials: true }
        );
        setExams(res.data.data || []);
        setFilteredExams(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch exams");
      }
    };
    fetchExams();
  }, [selectedSchool, selectedBatch, selectedDivision, selectedSemester]);

  // ----------------- STATISTICS -----------------
  const statistics = useMemo(
    () => ({
      totalExams: filteredExams.length,
      totalWeightage: filteredExams.reduce(
        (sum, exam) => sum + exam.weightage,
        0
      ),
      avgMaxMarks: Math.round(
        filteredExams.reduce((sum, exam) => sum + exam.maxMarks, 0) /
          Math.max(filteredExams.length, 1)
      ),
    }),
    [filteredExams]
  );

  const mapExamType = (type: TableExam["examType"]) => {
    const map: Record<TableExam["examType"], string> = {
      Midterm: "INTERNAL_ASSESSMENT",
      Final: "END_SEM",
      Quiz: "FORTNIGHTLY",
      Assignment: "PROJECT",
      Practical: "INTERVIEW",
    };
    return map[type];
  };

  const handleAddExam = useCallback(
    async (
      newExamData: Omit<
        TableExam,
        "id" | "school" | "batch" | "division" | "semester"
      > & { subjectId: string }
    ) => {
      if (!newExamData.subjectId) {
        setError("Please select a subject for the exam");
        return;
      }

      try {
        const payload = {
          name: newExamData.examName,
          weightage: Number(newExamData.weightage || 0),
          full_marks: newExamData.maxMarks,
          passing_marks: newExamData.passingMarks,
          exam_type: mapExamType(newExamData.examType),
          exam_date: newExamData.date,
          subject_id: newExamData.subjectId,
          school: selectedSchool,
          batch: selectedBatch,
          division: selectedDivision,
          semester: parseInt(selectedSemester),
          subjectId: selectedSubject,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams`,
          payload,
          { withCredentials: true }
        );

        setExams((prev) => [...prev, res.data.data]);
        setFilteredExams((prev) => [...prev, res.data.data]);
        setIsAddExamModalOpen(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add exam");
      }
    },
    [selectedSchool, selectedBatch, selectedDivision, selectedSemester, selectedSubject]
  );

  const handleUpdateExam = useCallback((item: any) => {
    const updatedExam = item as TableExam;
    const updateExam = async () => {
      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${updatedExam.id}`,
          updatedExam,
          { withCredentials: true }
        );
        setExams((prev) =>
          prev.map((e) => (e.id === updatedExam.id ? res.data.data : e))
        );
        setFilteredExams((prev) =>
          prev.map((e) => (e.id === updatedExam.id ? res.data.data : e))
        );
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update exam");
      }
    };
    updateExam();
  }, []);

  const handleDeleteExam = useCallback((id: string | number) => {
    const deleteExam = async () => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${id}`,
          {
            withCredentials: true,
          }
        );
        setExams((prev) => prev.filter((exam) => exam.id !== id));
        setFilteredExams((prev) => prev.filter((exam) => exam.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete exam");
      }
    };
    deleteExam();
  }, []);

  const handleOpenAddModal = useCallback(() => {
    if (allFiltersSelected) setIsAddExamModalOpen(true);
  }, [allFiltersSelected]);

  const handleCloseAddModal = useCallback(
    () => setIsAddExamModalOpen(false),
    []
  );

  // ----------------- RENDER -----------------
  if (error)
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
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Exam Management
        </h2>

        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Filters
          </h3>

          <div className="flex space-x-3 flex-wrap space-y-2">
            {[
              {
                label: "Center",
                value: selectedCenter,
                options: centers,
                setter: setSelectedCenter,
                disabled: false,
              },
              {
                label: "School",
                value: selectedSchool,
                options: schools,
                setter: setSelectedSchool,
                disabled: !selectedCenter,
              },

              {
                label: "Batch",
                value: selectedBatch,
                options: batches,
                setter: setSelectedBatch,
                disabled: !selectedSchool,
              },
              {
                label: "Division",
                value: selectedDivision,
                options: divisions,
                setter: setSelectedDivision,
                disabled: !selectedBatch,
              },
              {
                label: "Semester",
                value: selectedSemester,
                options: semesters,
                setter: setSelectedSemester,
                disabled: !selectedDivision,
              },
              {
                label: "Subject",
                value: selectedSubject,
                options: subjects,
                setter: setSelectedSubject,
                disabled: !selectedSemester,
              },
            ].map((filter, idx) => (
              <div key={idx} className="relative min-w-36">
                <label className="block text-xs font-medium text-gray-100 mb-1">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    disabled={filter.disabled}
                    className={`w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  >
                    <option value="">{`Select ${filter.label}`}</option>
                    {filter.options.map((opt: any) => {
                      const value = opt.id || opt;
                      const label =
                        typeof opt === "string"
                          ? opt
                          : opt.name ||
                            opt.division ||
                            opt.number ||
                            opt.code ||
                            opt.id ||
                            "Unknown";

                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 w-4 h-4 text-gray-400 pointer-events-none -translate-y-1/2" />
                </div>
              </div>
            ))}
          </div>

          {!allFiltersSelected && (
            <div className="mt-4 p-3 text-slate-900 rounded-sm">
              <p className="text-sm">
                * Please select all filters to view and manage exams.
              </p>
            </div>
          )}
        </div>

        {allFiltersSelected && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
                <div className="p-6 text-center">
                  <NotepadText className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                  <h4 className="text-lg text-slate-900 mb-1">Total Exams</h4>
                  <p className="text-5xl font-bold text-[#1B3A6A]">
                    {statistics.totalExams}
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
                  <h3 className="text-lg font-semibold">Add New Exam</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new exam record
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredExams}
              title="Exams Overview"
              filterField="examName"
              badgeFields={["examType", "weightage"]}
              selectFields={{
                examType: [
                  "Midterm",
                  "Final",
                  "Quiz",
                  "Assignment",
                  "Practical",
                ],
              }}
              nonEditableFields={[
                "id",
                "school",
                "batch",
                "division",
                "semester",
              ]}
              onDelete={handleDeleteExam}
              onEdit={handleUpdateExam}
              hiddenColumns={["id", "school", "batch", "division", "semester"]}
            />

            <AddExamModal
              isOpen={isAddExamModalOpen}
              onClose={handleCloseAddModal}
              onExamCreated={handleAddExam}
              selectedSchool={selectedSchool}
              selectedBatch={selectedBatch}
              selectedDivision={selectedDivision}
              selectedSemester={selectedSemester}
              selectedSubject={selectedSubject}
            />
          </>
        )}
      </div>
    </div>
  );
}
