"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { TableSubject, FilterState} from "./types";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define API response types based on your backend structure
interface ApiSubject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester_id: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    classes: number;
    exams: number;
  };
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  semester: {
    id: string;
    number: number;
    division: {
      code: string;
    } | null;
  };
  count: number;
  data: ApiSubject[];
}

// Transform API data to match your table structure
const transformApiSubjectToTableSubject = (
  apiSubject: ApiSubject,
  semesterInfo: ApiResponse['semester'],
  centerName : string = ""
): TableSubject => ({
  id: apiSubject.id,
  subjectName: apiSubject.name,
  credits: apiSubject.credits.toString(),
  subjectCode: apiSubject.code,
  teacher: apiSubject.teacher.name,
  school: "", // You'll need to add this to your API if required
  batch: "", // You'll need to add this to your API if required
  division: semesterInfo.division ? semesterInfo.division.code : "",
  semester: semesterInfo.number,
  center: centerName,
});

export const useSubjectManagement = () => {
  const [subjects, setSubjects] = useState<TableSubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<TableSubject[]>([]);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [filtersComplete, setFiltersComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSemesterId, setCurrentSemesterId] = useState<string>("");
  const [currentFilterState, setCurrentFilterState] = useState<FilterState>({
    selectedCenterId: "",
    selectedSchoolId: "",
    selectedBatchId: "",
    selectedDivisionId: "",
    selectedSemesterId: "",
  });

  // Fetch subjects from API
  const fetchSubjects = useCallback(async (semesterId: string) => {
    if (!semesterId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/subjects/semesters/${semesterId}`, {
        withCredentials: true,
      });
      
      const apiResponse: ApiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error('Failed to fetch subjects');
      }

      // Transform API data to match your table structure
      const transformedSubjects = apiResponse.data.map(apiSubject =>
        transformApiSubjectToTableSubject(apiSubject, apiResponse.semester, currentFilterState.selectedCenterName || "")
      );

      setSubjects(transformedSubjects);
      setFilteredSubjects(transformedSubjects);
      
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message || 'Failed to fetch subjects'
        : err instanceof Error 
        ? err.message 
        : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilterState.selectedCenterName]);

  // Update subjects when semester changes
  useEffect(() => {
    if (currentFilterState.selectedSemesterId && currentFilterState.selectedSemesterId !== currentSemesterId) {
      setCurrentSemesterId(currentFilterState.selectedSemesterId);
      fetchSubjects(currentFilterState.selectedSemesterId);
    }
  }, [currentFilterState.selectedSemesterId, currentFilterState.selectedCenterName, currentSemesterId, fetchSubjects]);

  const statistics = useMemo(
    () => ({
      totalSubjects: filteredSubjects.length,
      totalCredits: filteredSubjects.reduce(
        (sum, subject) => sum + parseInt(subject.credits || "0"),
        0
      ),
    }),
    [filteredSubjects]
  );

  const handleFiltersChange = useCallback((isComplete: boolean) => {
    setFiltersComplete(isComplete);
    if (!isComplete) {
      setFilteredSubjects([]);
      setSubjects([]);
    }
  }, []);

  const handleFilterStateChange = useCallback((filterState: FilterState) => {
    setCurrentFilterState(filterState);
  }, []);

  // API call to update subject
  const handleUpdateSubject = useCallback(
    async (updatedItem: any) => {
      const subjectItem = updatedItem as TableSubject;
      
      try {
        setLoading(true);
        
        // Prepare data for API (transform back to API format)
        const updateData = {
          name: subjectItem.subjectName,
          code: subjectItem.subjectCode,
          credits: parseInt(subjectItem.credits),
          // Add other fields as needed
        };

        await axios.put(`${BACKEND_URL}/api/subjects/${subjectItem.id}`, updateData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Update local state
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === subjectItem.id ? { ...subject, ...subjectItem } : subject
          )
        );

        if (filtersComplete) {
          setFilteredSubjects((prev) =>
            prev.map((subject) =>
              subject.id === subjectItem.id ? { ...subject, ...subjectItem } : subject
            )
          );
        }
        
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message || 'Failed to update subject'
          : err instanceof Error 
          ? err.message 
          : 'Failed to update subject';
        setError(errorMessage);
        console.error('Error updating subject:', err);
      } finally {
        setLoading(false);
      }
    },
    [filtersComplete]
  );

  // API call to delete subject
  const handleDeleteSubject = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    
    try {
      setLoading(true);

      await axios.delete(`${BACKEND_URL}/api/subjects/${deleteId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update local state
      setSubjects((prev) => prev.filter((subject) => subject.id !== deleteId));
      setFilteredSubjects((prev) => prev.filter((subject) => subject.id !== deleteId));
      
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message || 'Failed to delete subject'
        : err instanceof Error 
        ? err.message 
        : 'Failed to delete subject';
      setError(errorMessage);
      console.error('Error deleting subject:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // API call to add subject
  const handleAddSubject = useCallback(
    async (newSubjectData: {
      subjectName: string;
      credits: string;
      subjectCode: string;
      teacher: string;
      teacherId?: string;
    }) => {
      try {
        setLoading(true);
        
        // Prepare data for API
        const createData = {
          name: newSubjectData.subjectName,
          code: newSubjectData.subjectCode,
          credits: parseInt(newSubjectData.credits),
          semester_id: currentFilterState.selectedSemesterId,
          teacher_id: newSubjectData.teacherId,
          // You'll need to handle teacher assignment based on your API structure
        };

        await axios.post(`${BACKEND_URL}/api/subjects`, createData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Refresh the subjects list to get the latest data
        if (currentFilterState.selectedSemesterId) {
          await fetchSubjects(currentFilterState.selectedSemesterId);
        }
        
        setIsAddSubjectModalOpen(false);
        
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message || 'Failed to create subject'
          : err instanceof Error 
          ? err.message 
          : 'Failed to create subject';
        setError(errorMessage);
        console.error('Error creating subject:', err);
      } finally {
        setLoading(false);
      }
    },
    [currentFilterState.selectedSemesterId, fetchSubjects]
  );

  const handleOpenAddModal = useCallback(() => {
    if (filtersComplete) {
      setIsAddSubjectModalOpen(true);
    }
  }, [filtersComplete]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddSubjectModalOpen(false);
  }, []);

  // Retry function for error handling
  const handleRetry = useCallback(() => {
    if (currentFilterState.selectedSemesterId) {
      fetchSubjects(currentFilterState.selectedSemesterId);
    }
  }, [currentFilterState.selectedSemesterId, fetchSubjects]);

  return {
    subjects,
    filteredSubjects,
    statistics,
    isAddSubjectModalOpen,
    filtersComplete,
    currentFilterState,
    loading,
    error,
    
    handleFiltersChange,
    handleFilterStateChange,
    handleUpdateSubject,
    handleDeleteSubject,
    handleAddSubject,
    handleOpenAddModal,
    handleCloseAddModal,
    handleRetry,
    setFilteredSubjects,
  };
};
