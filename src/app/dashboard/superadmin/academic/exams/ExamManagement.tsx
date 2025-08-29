"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, ChevronDown, NotepadText } from "lucide-react";
import Table from "../../Table";
import AddExamModal from "./AddExamModal";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const examTypeOptions = ["FORTNIGHTLY", "INTERNAL_ASSESSMENT", "INTERVIEW", "PROJECT", "END_SEM"] as const;
type ExamType = (typeof examTypeOptions)[number];

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

interface Center {
  id: string;
  name: string;
  location: string;
  code: string;
}

interface School {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  year: number;
}

interface Division {
  id: string;
  code: string;
  name: string;
}

interface Semester {
  id: string;
  number: number;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ExamOption {
  id: string;
  name: string;
}

const initialExams: TableExam[] = [
  {
    id: "1",
    examName: "Fortnightly Test 1",
    weightage: 10,
    maxMarks: 20,
    passingMarks: 8,
    examType: "FORTNIGHTLY",
    examNumber: "F1",
    subject: "CS201 Data Structures",
    date: "2025-04-05",
    center: "Bangalore",
    school: "SOT",
    batch: "23",
    division: "B1",
    semester: 3,
  },
  {
    id: "2",
    examName: "Internal Assessment",
    weightage: 25,
    maxMarks: 50,
    passingMarks: 20,
    examType: "INTERNAL_ASSESSMENT",
    examNumber: "I1",
    subject: "MG201 Marketing",
    date: "2025-04-12",
    center: "Noida",
    school: "SOM",
    batch: "22",
    division: "B2",
    semester: 5,
  },
  {
    id: "3",
    examName: "Interview Round 1",
    weightage: 15,
    maxMarks: 30,
    passingMarks: 12,
    examType: "INTERVIEW",
    examNumber: "IR1",
    subject: "DS101 Design Thinking",
    date: "2025-04-08",
    center: "Lucknow",
    school: "SOD",
    batch: "24",
    division: "B1",
    semester: 2,
  },
];

export default function ExamManagement() {
  // Data state
  const [centers, setCenters] = useState<Center[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examOptions, setExamOptions] = useState<ExamOption[]>([]);

  // Filter state
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<ExamType | "">("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  // Loading states
  const [loadingState, setLoadingState] = useState({
    centersLoading: false,
    schoolsLoading: false,
    batchesLoading: false,
    divisionsLoading: false,
    semestersLoading: false,
    subjectsLoading: false,
    examsLoading: false,
  });

  // Exam data state
  const [exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [filtersComplete, setFiltersComplete] = useState(false);

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

  // Fetch centers on component mount
  useEffect(() => {
    const getCenters = async () => {
      try {
        setLoadingState(prev => ({ ...prev, centersLoading: true }));
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
        setError("Failed to fetch centers. Please try again.");
      } finally {
        setLoadingState(prev => ({ ...prev, centersLoading: false }));
      }
    };

    getCenters();
    setExams(initialExams); // Keep initial exams for demo
  }, []);

  // Fetch schools when center is selected
  useEffect(() => {
    const fetchSchools = async () => {
      if (!selectedCenterId) return;

      setLoadingState(prev => ({ ...prev, schoolsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/schools/${selectedCenterId}`, {
          withCredentials: true,
        });

        const fetchedSchools: School[] = res.data.data.map((school: any) => ({
          id: school.id,
          name: school.name,
        }));

        setSchools(fetchedSchools);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      } finally {
        setLoadingState(prev => ({ ...prev, schoolsLoading: false }));
      }
    };

    if (selectedCenterId) {
      fetchSchools();
    } else {
      setSchools([]);
    }
  }, [selectedCenterId]);

  // Fetch batches when school is selected
  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedSchoolId) return;

      setLoadingState(prev => ({ ...prev, batchesLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/batches/${selectedSchoolId}`, {
          withCredentials: true,
        });

        const fetchedBatches: Batch[] = res.data.data.map((batch: any) => ({
          id: batch.id,
          name: batch.name,
          year: batch.year,
        }));

        setBatches(fetchedBatches);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setBatches([]);
      } finally {
        setLoadingState(prev => ({ ...prev, batchesLoading: false }));
      }
    };

    if (selectedSchoolId) {
      fetchBatches();
    } else {
      setBatches([]);
    }
  }, [selectedSchoolId]);

  // Fetch divisions when batch is selected
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!selectedBatchId) return;

      setLoadingState(prev => ({ ...prev, divisionsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/division/by-batch/${selectedBatchId}`, {
          withCredentials: true,
        });

        const fetchedDivisions: Division[] = res.data.data.map((division: any) => ({
          id: division.id,
          code: division.code,
          name: division.name || division.code,
        }));

        setDivisions(fetchedDivisions);
      } catch (err) {
        console.error("Error fetching divisions:", err);
        setDivisions([]);
      } finally {
        setLoadingState(prev => ({ ...prev, divisionsLoading: false }));
      }
    };

    if (selectedBatchId) {
      fetchDivisions();
    } else {
      setDivisions([]);
    }
  }, [selectedBatchId]);

  // Fetch semesters when division is selected
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedDivisionId) return;

      setLoadingState(prev => ({ ...prev, semestersLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/semester/all/${selectedDivisionId}`, {
          withCredentials: true,
        });

        const fetchedSemesters: Semester[] = res.data.data.map((semester: any) => ({
          id: semester.id,
          number: semester.number,
          name: semester.name || `Semester ${semester.number}`,
        }));

        setSemesters(fetchedSemesters);
      } catch (err) {
        console.error("Error fetching semesters:", err);
        setSemesters([]);
      } finally {
        setLoadingState(prev => ({ ...prev, semestersLoading: false }));
      }
    };

    if (selectedDivisionId) {
      fetchSemesters();
    } else {
      setSemesters([]);
    }
  }, [selectedDivisionId]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedSemesterId) return;

      setLoadingState(prev => ({ ...prev, subjectsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/subjects/semesters/${selectedSemesterId}`, {
          withCredentials: true,
        });

        const fetchedSubjects: Subject[] = res.data.data.map((subject: any) => ({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          teacher: subject.teacher,
        }));

        setSubjects(fetchedSubjects);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      } finally {
        setLoadingState(prev => ({ ...prev, subjectsLoading: false }));
      }
    };

    if (selectedSemesterId) {
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedSemesterId]);

  // Fetch exams when subject and exam type are selected
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedSubjectId || !selectedExamType) return;

      setLoadingState(prev => ({ ...prev, examsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/exams/${selectedSubjectId}/?exam_type=${selectedExamType}`, {
          withCredentials: true,
        });

        const fetchedExams: ExamOption[] = res.data.data.exams.map((exam: any) => ({
          id: exam.id,
          name: exam.name,
        }));

        setExamOptions(fetchedExams);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setExamOptions([]);
      } finally {
        setLoadingState(prev => ({ ...prev, examsLoading: false }));
      }
    };

    if (selectedSubjectId && selectedExamType) {
      fetchExams();
    } else {
      setExamOptions([]);
    }
  }, [selectedSubjectId, selectedExamType]);

  // Handle filter changes with reset logic
  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    setSelectedSchoolId("");
    setSelectedBatchId("");
    setSelectedDivisionId("");
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setSelectedBatchId("");
    setSelectedDivisionId("");
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSelectedDivisionId("");
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivisionId(divisionId);
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId("");
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedExamType("");
    setSelectedExamId("");
    setExamOptions([]);
    setFiltersComplete(false);
    setFilteredExams([]);
  };

  const handleExamTypeChange = (type: string) => {
    if (examTypeOptions.includes(type as ExamType)) {
      setSelectedExamType(type as ExamType);
    } else {
      setSelectedExamType("");
    }
    setSelectedExamId("");
    setFiltersComplete(false);
    setFilteredExams([]);
    // Note: examOptions will be updated by the useEffect when both subject and type are selected
  };

  const handleExamIdChange = (examId: string) => {
    setSelectedExamId(examId);
    const isComplete =
      selectedCenterId &&
      selectedSchoolId &&
      selectedBatchId &&
      selectedDivisionId &&
      selectedSemesterId &&
      selectedSubjectId &&
      selectedExamType &&
      examId;

    setFiltersComplete(!!isComplete);

    if (isComplete) {
      // Filter exams based on selected criteria
      // For demo purposes, using the initial exams - in production, this would filter based on API data
      const filtered = exams.filter(
        (exam) => exam.examType === selectedExamType
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams([]);
    }
  };

  const handleUpdateExam = useCallback(
    (updatedItem: any) => {
      const examItem = updatedItem as TableExam;
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examItem.id ? { ...exam, ...examItem } : exam
        )
      );

      if (filtersComplete) {
        setFilteredExams((prev) =>
          prev.map((exam) =>
            exam.id === examItem.id ? { ...exam, ...examItem } : exam
          )
        );
      }
    },
    [filtersComplete]
  );

  const handleDeleteExam = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setExams((prev) => prev.filter((exam) => exam.id !== deleteId));
    setFilteredExams((prev) => prev.filter((exam) => exam.id !== deleteId));
  }, []);

  const handleAddExam = useCallback(
    async (
      newExamData: Omit<
        TableExam,
        | "id"
        | "examNumber"
        | "center"
        | "school"
        | "batch"
        | "division"
        | "semester"
      >
    ) => {
      const selectedCenter = centers.find(c => c.id === selectedCenterId);
      const selectedSchool = schools.find(s => s.id === selectedSchoolId);
      const selectedBatch = batches.find(b => b.id === selectedBatchId);
      const selectedDivision = divisions.find(d => d.id === selectedDivisionId);
      const selectedSemester = semesters.find(s => s.id === selectedSemesterId);

      const examNumber = selectedExamType
        ? `${selectedExamType.charAt(0).toUpperCase()}${examOptions.length + 1}`
        : "UNK";

      const newExam: TableExam = {
        id: Date.now().toString(),
        ...newExamData,
        examNumber,
        center: selectedCenter?.name || "",
        school: selectedSchool?.name || "",
        batch: selectedBatch?.name || "",
        division: selectedDivision?.code || "",
        semester: selectedSemester?.number || 1,
      };

      setExams((prev) => [...prev, newExam]);
      setFilteredExams((prev) => [...prev, newExam]);
      setIsAddExamModalOpen(false);
    },
    [
      selectedCenterId,
      selectedSchoolId,
      selectedBatchId,
      selectedDivisionId,
      selectedSemesterId,
      selectedExamType,
      centers,
      schools,
      batches,
      divisions,
      semesters,
      examOptions,
    ]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete && selectedExamType) {
      setIsAddExamModalOpen(true);
    }
  }, [filtersComplete, selectedExamType]);

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

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Center
              </label>
              <div className="relative">
                <select
                  value={selectedCenterId}
                  onChange={(e) => handleCenterChange(e.target.value)}
                  disabled={loadingState.centersLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingState.centersLoading ? "Loading..." : "Select Center"}
                  </option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={selectedSchoolId}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  disabled={!selectedCenterId || loadingState.schoolsLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.schoolsLoading ? "Loading..." : "Select School"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedCenterId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <div className="relative">
                <select
                  value={selectedBatchId}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  disabled={!selectedSchoolId || loadingState.batchesLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.batchesLoading ? "Loading..." : "Select Batch"}
                  </option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSchoolId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={selectedDivisionId}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  disabled={!selectedBatchId || loadingState.divisionsLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.divisionsLoading ? "Loading..." : "Select Division"}
                  </option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.code}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedBatchId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  value={selectedSemesterId}
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  disabled={!selectedDivisionId || loadingState.semestersLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.semestersLoading ? "Loading..." : "Sem"}
                  </option>
                  {semesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      S{sem.number}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedDivisionId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!selectedSemesterId || loadingState.subjectsLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.subjectsLoading ? "Loading..." : "Subject"}
                  </option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} {sub.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSemesterId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={selectedExamType}
                  onChange={(e) => handleExamTypeChange(e.target.value)}
                  disabled={!selectedSubjectId} // Fixed: Changed from !selectedSubject to !selectedSubjectId
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Type</option>
                  {examTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSubjectId ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam
              </label>
              <div className="relative">
                <select
                  value={selectedExamId}
                  onChange={(e) => handleExamIdChange(e.target.value)}
                  disabled={!selectedExamType || loadingState.examsLoading}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">
                    {loadingState.examsLoading ? "Loading..." : "Exam"}
                  </option>
                  {examOptions.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedExamType ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
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
                examType: [...examTypeOptions],
                subject: subjects.map(s => `${s.code} ${s.name}`),
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
          </>
        )}

        {filtersComplete && selectedExamType && (
          <AddExamModal
            isOpen={isAddExamModalOpen}
            onClose={handleCloseAddModal}
            onExamCreated={handleAddExam}
            selectedCenter={centers.find(c => c.id === selectedCenterId)?.name || ""}
            selectedSchool={schools.find(s => s.id === selectedSchoolId)?.name || ""}
            selectedBatch={batches.find(b => b.id === selectedBatchId)?.name || ""}
            selectedDivision={divisions.find(d => d.id === selectedDivisionId)?.code || ""}
            selectedSemester={semesters.find(s => s.id === selectedSemesterId)?.number.toString() || ""}
            selectedSubject={subjects.find(s => s.id === selectedSubjectId)?.name || ""}
            selectedExamType={selectedExamType}
            selectedExamNumber={examOptions.length.toString()}
          />
        )}
      </div>
    </div>
  );
}
