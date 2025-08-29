"use client";

import React from "react";
import Table from "../../Table";
import AddSubjectModal from "./AddSubjectModal";
import { ErrorDisplay } from "./utils/ErrorDisplay";
import { SubjectFiltersSection } from "./utils/SubjectFiltersScection";
import { SubjectStatisticsCards } from "./utils/SubjectStatisticsCards";
import { useSubjectManagement } from "./utils/useSubjectManagement";

export default function SubjectManagement() {
  const {
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
  } = useSubjectManagement();

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Subject Management
        </h2>

        <SubjectFiltersSection
          onFiltersChange={handleFiltersChange}
          onFilterStateChange={handleFilterStateChange}
        />

        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={handleRetry}
          />
        )}

        {loading && (
          <div className="text-center py-4">Loading subjects...</div>
        )}

        {filtersComplete && !loading && !error && (
          <>
            <SubjectStatisticsCards
              totalSubjects={statistics.totalSubjects}
              totalCredits={statistics.totalCredits}
              onAddSubject={handleOpenAddModal}
            />
            {console.log("Filtered Subjects:", filteredSubjects)}
            <Table
              data={filteredSubjects}
              title="Subjects Overview"
              filterField="teacher"
              badgeFields={["subjectCode", "credits"]}
              selectFields={{}}
              nonEditableFields={[
                "id",
                "school",
                "batch", 
                "division",
                "semester",
                "center",
              ]}
              onDelete={handleDeleteSubject}
              onEdit={handleUpdateSubject}
              hiddenColumns={["id", "school", "batch", "division", "semester"]}
            />
          </>
        )}

        <AddSubjectModal
          isOpen={isAddSubjectModalOpen}
          onClose={handleCloseAddModal}
          onSubjectCreated={handleAddSubject}
          selectedSchool=""
          selectedBatch=""
          selectedDivision=""
          selectedSemester={currentFilterState.selectedSemesterId}
          selectedCenter={currentFilterState.selectedCenterName || "" }
          selectedCenterId={currentFilterState.selectedCenterId}
        />
      </div>
    </div>
  );
}