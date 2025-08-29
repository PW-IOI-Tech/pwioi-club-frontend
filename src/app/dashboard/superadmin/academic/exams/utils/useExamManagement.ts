"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

const examTypeOptions = ["Fortnightly", "Internal", "Interview"] as const;
type ExamType = (typeof examTypeOptions)[number];

// Map frontend exam types to backend exam types
const examTypeMapping: Record<ExamType, string> = {
  "Fortnightly": "FORTNIGHTLY",
  "Internal": "INTERNAL_ASSESSMENT", 
  "Interview": "INTERVIEW"
};

interface TableExam {
  id: string;
  examName: string;
  weightage: number;
  maxMarks: number;
  passingMarks: number;
  examType: ExamType;
  examNumber: string;
  subject: string;
  date: string;
  center: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
}

// API response types
interface ApiExam {
  id: string;
  name: string;
  exam_type: string;
  exam_date?: string;
  weightage?: number;
  max_marks?: number;
  passing_marks?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    exams: ApiExam[];
    count: number;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    exam_type: string;
  };
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
}

interface SubjectResponse {
  success: boolean;
  semester: {
    id: string;
    number: number;
    division: {
      code: string;
    };
  };
  count: number;
  data: Subject[];
}

export const useExamManagement = () => {
  const [exams, setExams] = useState<TableExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<TableExam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  // Filter states
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<ExamType | "">("");
  const [selectedExamNumber, setSelectedExamNumber] = useState<string>("");
  const [filtersComplete, setFiltersComplete] = useState(false);

  // Fetch subjects when semester is selected
  const fetchSubjects = useCallback(async (semesterId: string) => {
    if (!semesterId) return;

    console.log('Fetching subjects for semester:', semesterId);
    setLoading(true);

    try {
      const response = await fetch(`/api/subjects/semesters/${semesterId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: SubjectResponse = await response.json();
      console.log('Subjects API response:', apiResponse);

      if (!apiResponse.success) {
        throw new Error('Failed to fetch subjects');
      }

      setSubjects(apiResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subjects';
      setError(errorMessage);
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exams when subject and exam type are selected
  const fetchExams = useCallback(async (subjectId: string, examType: ExamType) => {
    if (!subjectId || !examType) return;

    console.log('Fetching exams for subject:', subjectId, 'exam type:', examType);
    setLoading(true);

    try {
      const backendExamType = examTypeMapping[examType];
      console.log('Backend exam type:', backendExamType);

      const response = await fetch(`/api/exams/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam_type: backendExamType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      console.log('Exams API response:', apiResponse);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to fetch exams');
      }

      // Transform API data to match table structure
      const transformedExams: TableExam[] = apiResponse.data.exams.map((apiExam, index) => ({
        id: apiExam.id,
        examName: apiExam.name,
        weightage: apiExam.weightage || 0,
        maxMarks: apiExam.max_marks || 0,
        passingMarks: apiExam.passing_marks || 0,
        examType: examType,
        examNumber: `${examType.charAt(0).toUpperCase()}${index + 1}`, // Generate exam number
        subject: `${apiResponse.data.subject.code} ${apiResponse.data.subject.name}`,
        date: apiExam.exam_date || '',
        center: selectedCenter,
        school: selectedSchool,
        batch: selectedBatch,
        division: selectedDivision,
        semester: parseInt(selectedSemester),
      }));

      console.log('Transformed exams:', transformedExams);
      setExams(transformedExams);
      setFilteredExams(transformedExams);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exams';
      setError(errorMessage);
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCenter, selectedSchool, selectedBatch, selectedDivision, selectedSemester]);

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

  // Handle filter changes
  const handleCenterChange = (center: string) => {
    console.log('Center changed:', center);
    setSelectedCenter(center);
    resetDependentFilters(['school', 'batch', 'division', 'semester', 'subject', 'examType', 'examNumber']);
  };

  const handleSchoolChange = (school: string) => {
    console.log('School changed:', school);
    setSelectedSchool(school);
    resetDependentFilters(['batch', 'division', 'semester', 'subject', 'examType', 'examNumber']);
  };

  const handleBatchChange = (batch: string) => {
    console.log('Batch changed:', batch);
    setSelectedBatch(batch);
    resetDependentFilters(['division', 'semester', 'subject', 'examType', 'examNumber']);
  };

  const handleDivisionChange = (division: string) => {
    console.log('Division changed:', division);
    setSelectedDivision(division);
    resetDependentFilters(['semester', 'subject', 'examType', 'examNumber']);
  };

  const handleSemesterChange = (semester: string) => {
    console.log('Semester changed:', semester);
    setSelectedSemester(semester);
    resetDependentFilters(['subject', 'examType', 'examNumber']);
    
    if (semester) {
      fetchSubjects(semester);
    }
  };

  const handleSubjectChange = (subject: string) => {
    console.log('Subject changed:', subject);
    setSelectedSubject(subject);
    resetDependentFilters(['examType', 'examNumber']);
  };

  const handleExamTypeChange = (type: string) => {
    console.log('Exam type changed:', type);
    if (examTypeOptions.includes(type as ExamType)) {
      setSelectedExamType(type as ExamType);
      setSelectedExamNumber("");
      setFiltersComplete(false);
      setFilteredExams([]);
      
      // Fetch exams for the selected subject and exam type
      if (selectedSubject && type) {
        const subjectId = subjects.find(s => `${s.code} ${s.name}` === selectedSubject)?.id;
        if (subjectId) {
          fetchExams(subjectId, type as ExamType);
        }
      }
    } else {
      setSelectedExamType("");
      setSelectedExamNumber("");
      setFiltersComplete(false);
      setFilteredExams([]);
    }
  };

  const handleExamNumberChange = (num: string) => {
    console.log('Exam number changed:', num);
    setSelectedExamNumber(num);
    
    const isComplete =
      selectedCenter &&
      selectedSchool &&
      selectedBatch &&
      selectedDivision &&
      selectedSemester &&
      selectedSubject &&
      selectedExamType &&
      num;

    setFiltersComplete(!!isComplete);

    if (isComplete) {
      // Filter exams by exam number if needed
      const examNumber = `${selectedExamType.charAt(0).toUpperCase()}${num}`;
      const filtered = exams.filter(exam => exam.examNumber === examNumber);
      setFilteredExams(filtered);
    } else {
      setFilteredExams([]);
    }
  };

  const resetDependentFilters = (filtersToReset: string[]) => {
    if (filtersToReset.includes('school')) setSelectedSchool("");
    if (filtersToReset.includes('batch')) setSelectedBatch("");
    if (filtersToReset.includes('division')) setSelectedDivision("");
    if (filtersToReset.includes('semester')) {
      setSelectedSemester("");
      setSubjects([]);
    }
    if (filtersToReset.includes('subject')) setSelectedSubject("");
    if (filtersToReset.includes('examType')) setSelectedExamType("");
    if (filtersToReset.includes('examNumber')) setSelectedExamNumber("");
    
    setFiltersComplete(false);
    setFilteredExams([]);
    setExams([]);
  };

  // CRUD operations
  const handleUpdateExam = useCallback(
    async (updatedItem: any) => {
      const examItem = updatedItem as TableExam;
      
      try {
        setLoading(true);
        
        // You'll need to implement the update exam API endpoint
        const response = await fetch(`/api/exams/${examItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: examItem.examName,
            weightage: examItem.weightage,
            max_marks: examItem.maxMarks,
            passing_marks: examItem.passingMarks,
            exam_date: examItem.date,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update exam: ${response.status}`);
        }

        // Update local state
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
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update exam';
        setError(errorMessage);
        console.error('Error updating exam:', err);
      } finally {
        setLoading(false);
      }
    },
    [filtersComplete]
  );

  const handleDeleteExam = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/exams/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete exam: ${response.status}`);
      }

      // Update local state
      setExams((prev) => prev.filter((exam) => exam.id !== deleteId));
      setFilteredExams((prev) => prev.filter((exam) => exam.id !== deleteId));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete exam';
      setError(errorMessage);
      console.error('Error deleting exam:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddExam = useCallback(
    async (newExamData: Omit<TableExam, "id" | "examNumber" | "center" | "school" | "batch" | "division" | "semester">) => {
      try {
        setLoading(true);
        
        const subjectId = subjects.find(s => `${s.code} ${s.name}` === selectedSubject)?.id;
        if (!subjectId) {
          throw new Error('Subject not found');
        }

        const response = await fetch('/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newExamData.examName,
            subject_id: subjectId,
            exam_type: examTypeMapping[selectedExamType as ExamType],
            weightage: newExamData.weightage,
            max_marks: newExamData.maxMarks,
            passing_marks: newExamData.passingMarks,
            exam_date: newExamData.date,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create exam: ${response.status}`);
        }

        // Refresh exams list
        if (selectedSubject && selectedExamType) {
          await fetchExams(subjectId, selectedExamType as ExamType);
        }
        
        setIsAddExamModalOpen(false);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create exam';
        setError(errorMessage);
        console.error('Error creating exam:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedSubject, selectedExamType, subjects, fetchExams]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete && selectedExamType) {
      setIsAddExamModalOpen(true);
    }
  }, [filtersComplete, selectedExamType]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddExamModalOpen(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    // State
    exams,
    filteredExams,
    subjects,
    loading,
    error,
    isAddExamModalOpen,
    filtersComplete,
    statistics,

    // Filter states
    selectedCenter,
    selectedSchool,
    selectedBatch,
    selectedDivision,
    selectedSemester,
    selectedSubject,
    selectedExamType,
    selectedExamNumber,

    // Filter handlers
    handleCenterChange,
    handleSchoolChange,
    handleBatchChange,
    handleDivisionChange,
    handleSemesterChange,
    handleSubjectChange,
    handleExamTypeChange,
    handleExamNumberChange,

    // CRUD handlers
    handleUpdateExam,
    handleDeleteExam,
    handleAddExam,
    handleOpenAddModal,
    handleCloseAddModal,

    // Utility
    clearError,
  };
};