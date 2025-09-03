"use client";

import React from "react";
import { useSubjectData } from "./useSubjectData";
import { SubjectFilterDropdown } from "./SubjectFilterDroupdown";

interface SubjectFiltersSectionProps {
  onFiltersChange: (isComplete: boolean) => void;
  onFilterStateChange: (filterState: any) => void;
}

export const SubjectFiltersSection: React.FC<SubjectFiltersSectionProps> = ({
  onFiltersChange,
  onFilterStateChange,
}) => {
  const {
    centers,
    schools,
    batches,
    divisions,
    semesters,
    filterState,
    loadingState,
    isFiltersComplete,
    updateFilter,
    updateFilterWithCenterName,
    resetFiltersFrom,
  } = useSubjectData();

  React.useEffect(() => {
    onFiltersChange(isFiltersComplete);
    onFilterStateChange(filterState);
  }, [isFiltersComplete, filterState, onFiltersChange, onFilterStateChange]);

  const handleCenterChange = (centerId: string) => {
    updateFilter({ selectedCenterId: centerId });
    updateFilterWithCenterName(centerId);
    resetFiltersFrom('center');
  };

  const handleSchoolChange = (schoolId: string) => {
    updateFilter({ selectedSchoolId: schoolId });
    resetFiltersFrom('school');
  };

  const handleBatchChange = (batchId: string) => {
    updateFilter({ selectedBatchId: batchId });
    resetFiltersFrom('batch');
  };

  const handleDivisionChange = (divisionId: string) => {
    updateFilter({ selectedDivisionId: divisionId });
    resetFiltersFrom('division');
  };

  const handleSemesterChange = (semesterId: string) => {
    updateFilter({ selectedSemesterId: semesterId });
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-sm border border-gray-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Select Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SubjectFilterDropdown
          label="Center"
          value={filterState.selectedCenterId}
          options={centers.map(c => ({ id: c.id, label: c.name }))}
          disabled={loadingState.centersLoading}
          loading={loadingState.centersLoading}
          placeholder="Select Center"
          onChange={handleCenterChange}
        />

        <SubjectFilterDropdown
          label="School"
          value={filterState.selectedSchoolId}
          options={schools.map(s => ({ id: s.id, label: s.name }))}
          disabled={!filterState.selectedCenterId}
          loading={loadingState.schoolsLoading}
          placeholder="Select School"
          onChange={handleSchoolChange}
        />

        <SubjectFilterDropdown
          label="Batch"
          value={filterState.selectedBatchId}
          options={batches.map(b => ({ id: b.id, label: b.name }))}
          disabled={!filterState.selectedSchoolId}
          loading={loadingState.batchesLoading}
          placeholder="Select Batch"
          onChange={handleBatchChange}
        />

        <SubjectFilterDropdown
          label="Division"
          value={filterState.selectedDivisionId}
          options={divisions.map(d => ({ id: d.id, label: d.name }))}
          disabled={!filterState.selectedBatchId}
          loading={loadingState.divisionsLoading}
          placeholder="Select Division"
          onChange={handleDivisionChange}
        />

        <SubjectFilterDropdown
          label="Semester"
          value={filterState.selectedSemesterId}
          options={semesters.map(s => ({ id: s.id, label: s.name }))}
          disabled={!filterState.selectedDivisionId}
          loading={loadingState.semestersLoading}
          placeholder="Select Semester"
          onChange={handleSemesterChange}
        />
      </div>

      {!isFiltersComplete && (
        <div className="mt-4 p-3 text-slate-900 rounded-sm">
          <p className="text-sm">
            * Please select all filters to view and manage subjects.
          </p>
        </div>
      )}
    </div>
  );
};
