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

const formatDate = (date: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ExamManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [_exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  const allFiltersSelected =
    selectedCenter &&
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester &&
    selectedSubject;

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
    if (!selectedCenter) {
      setSchools([]);
      setSelectedSchool("");
      return;
    }
    setLoadingSchools(true);
    setSchools([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"))
      .finally(() => setLoadingSchools(false));
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) {
      setBatches([]);
      setSelectedBatch("");
      return;
    }
    setLoadingBatches(true);
    setBatches([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"))
      .finally(() => setLoadingBatches(false));
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) {
      setDivisions([]);
      setSelectedDivision("");
      return;
    }
    setLoadingDivisions(true);
    setDivisions([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
        { withCredentials: true }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"))
      .finally(() => setLoadingDivisions(false));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) {
      setSemesters([]);
      setSelectedSemester("");
      return;
    }
    setLoadingSemesters(true);
    setSemesters([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
        { withCredentials: true }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"))
      .finally(() => setLoadingSemesters(false));
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      setSelectedSubject("");
      return;
    }
    setLoadingSubjects(true);
    setSubjects([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${selectedSemester}`,
        { withCredentials: true }
      )
      .then((res) => setSubjects(res.data?.data || []))
      .catch(() => console.error("Failed to fetch subjects"))
      .finally(() => setLoadingSubjects(false));
  }, [selectedSemester]);

  useEffect(() => {
    if (!allFiltersSelected) {
      setExams([]);
      setFilteredExams([]);
      return;
    }

    setLoadingExams(true);
    setExams([]);
    setFilteredExams([]);

    const fetchExams = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/subject/${selectedSubject}`,
          { withCredentials: true }
        );

        const examsData = res.data.data?.exams || [];
        setExams(examsData);
        setFilteredExams(examsData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch exams");
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [allFiltersSelected, selectedSubject]);

  const statistics = useMemo(
    () => ({
      totalExams: Array.isArray(filteredExams) ? filteredExams.length : 0,
      totalWeightage: Array.isArray(filteredExams)
        ? filteredExams.reduce((sum, exam) => sum + exam.weightage, 0)
        : 0,
      avgMaxMarks:
        Array.isArray(filteredExams) && filteredExams.length
          ? Math.round(
              filteredExams.reduce((sum, exam) => sum + exam.maxMarks, 0) /
                filteredExams.length
            )
          : 0,
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
    [
      selectedSchool,
      selectedBatch,
      selectedDivision,
      selectedSemester,
      selectedSubject,
    ]
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

  const formattedExams = useMemo(() => {
    return filteredExams.map((exam) => ({
      ...exam,
      date: formatDate(exam.date),
      examType: exam.examType,
      weightage: `${exam.weightage}%`,
      maxMarks: exam.maxMarks?.toLocaleString(),
      passingMarks: exam.passingMarks?.toLocaleString(),
    }));
  }, [filteredExams]);

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

  const showShimmer = !allFiltersSelected || loadingExams;

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Exam Management
        </h2>

        <div className="bg-[#12294c] p-6 rounded-sm border border-gray-400">
          <h3 className="text-lg font-semibold text-white mb-2">
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
                loading: false,
              },
              {
                label: "School",
                value: selectedSchool,
                options: schools,
                setter: setSelectedSchool,
                disabled: !selectedCenter,
                loading: loadingSchools,
              },
              {
                label: "Batch",
                value: selectedBatch,
                options: batches,
                setter: setSelectedBatch,
                disabled: !selectedSchool,
                loading: loadingBatches,
              },
              {
                label: "Division",
                value: selectedDivision,
                options: divisions,
                setter: setSelectedDivision,
                disabled: !selectedBatch,
                loading: loadingDivisions,
              },
              {
                label: "Semester",
                value: selectedSemester,
                options: semesters,
                setter: setSelectedSemester,
                disabled: !selectedDivision,
                loading: loadingSemesters,
              },
              {
                label: "Subject",
                value: selectedSubject,
                options: subjects,
                setter: setSelectedSubject,
                disabled: !selectedSemester,
                loading: loadingSubjects,
              },
            ].map((filter, idx) => (
              <div key={idx} className="relative min-w-36">
                <div className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    disabled={filter.disabled || filter.loading}
                    className={`
                      w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none cursor-pointer
                      ${
                        filter.disabled || filter.loading
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-white text-gray-900"
                      }
                    `}
                  >
                    <option value="">
                      {filter.loading ? "Loading..." : `Select ${filter.label}`}
                    </option>
                    {!filter.loading &&
                      filter.options.map((opt: any) => {
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
            <div className="text-gray-200 rounded-sm">
              <p className="text-sm">
                * Please select all filters to view and manage exams.
              </p>
            </div>
          )}
        </div>

        {showShimmer ? (
          <ShimmerTableSkeleton />
        ) : (
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
              data={formattedExams}
              title="Exams Overview"
              filterField="examName"
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
              hiddenColumns={[
                "id",
                "school",
                "batch",
                "division",
                "semester",
                "createdAt",
                "updatedAt",
                "subject_id",
              ]}
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

function ShimmerTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
