"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Center, School, Batch, Division, Semester, FilterState, LoadingState } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useSubjectData = () => {
  // Data state
  const [centers, setCenters] = useState<Center[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  // Loading states
  const [loadingState, setLoadingState] = useState<LoadingState>({
    centersLoading: true,
    schoolsLoading: false,
    batchesLoading: false,
    divisionsLoading: false,
    semestersLoading: false,
  });

  const [error, setError] = useState("");

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    selectedCenterId: "",
    selectedSchoolId: "",
    selectedBatchId: "",
    selectedDivisionId: "",
    selectedSemesterId: "",
  });

  // Fetch centers from backend
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
  }, []);

  // Fetch schools when center is selected
  useEffect(() => {
    const fetchSchools = async () => {
      if (!filterState.selectedCenterId) return;

      setLoadingState(prev => ({ ...prev, schoolsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/schools/${filterState.selectedCenterId}`, {
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

    if (filterState.selectedCenterId) {
      fetchSchools();
    } else {
      setSchools([]);
    }
  }, [filterState.selectedCenterId]);

  // Fetch batches when school is selected
  useEffect(() => {
    const fetchBatches = async () => {
      if (!filterState.selectedSchoolId) return;

      setLoadingState(prev => ({ ...prev, batchesLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/batches/${filterState.selectedSchoolId}`, {
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

    if (filterState.selectedSchoolId) {
      fetchBatches();
    } else {
      setBatches([]);
    }
  }, [filterState.selectedSchoolId]);

  // Fetch divisions when batch is selected
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!filterState.selectedBatchId) return;

      setLoadingState(prev => ({ ...prev, divisionsLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/division/by-batch/${filterState.selectedBatchId}`, {
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

    if (filterState.selectedBatchId) {
      fetchDivisions();
    } else {
      setDivisions([]);
    }
  }, [filterState.selectedBatchId]);

  // Fetch semesters when division is selected
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!filterState.selectedDivisionId) return;

      setLoadingState(prev => ({ ...prev, semestersLoading: true }));
      try {
        const res = await axios.get(`${BACKEND_URL}/api/semester/all/${filterState.selectedDivisionId}`, {
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

    if (filterState.selectedDivisionId) {
      fetchSemesters();
    } else {
      setSemesters([]);
    }
  }, [filterState.selectedDivisionId]);

  const updateFilter = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };
  const updateFilterWithCenterName = (centerId: string) => {
  const selectedCenter = centers.find(center => center.id === centerId);
  setFilterState(prev => ({ 
    ...prev, 
    selectedCenterId: centerId,
    selectedCenterName: selectedCenter?.name || "" // Store center name
  }));
  
  if (centerId !== filterState.selectedCenterId) {
    resetFiltersFrom('center');
  }
};



  const resetFiltersFrom = (level: 'center' | 'school' | 'batch' | 'division') => {
    const resetMap = {
      center: {
        selectedSchoolId: "",
        selectedBatchId: "",
        selectedDivisionId: "",
        selectedSemesterId: "",
      },
      school: {
        selectedBatchId: "",
        selectedDivisionId: "",
        selectedSemesterId: "",
      },
      batch: {
        selectedDivisionId: "",
        selectedSemesterId: "",
      },
      division: {
        selectedSemesterId: "",
      },
    };

    setFilterState(prev => ({ ...prev, ...resetMap[level] }));
  };

  const isFiltersComplete = Boolean(
    filterState.selectedCenterId &&
    filterState.selectedSchoolId &&
    filterState.selectedBatchId &&
    filterState.selectedDivisionId &&
    filterState.selectedSemesterId
  );

  return {
    // Data
    centers,
    schools,
    batches,
    divisions,
    semesters,
    
    // State
    filterState,
    loadingState,
    error,
    isFiltersComplete,
    
    // Actions
    updateFilter,
    updateFilterWithCenterName,
    resetFiltersFrom,
    setError,
  };
};
