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
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Subject Management
        </h2>

        <SubjectFiltersSection
          onFiltersChange={handleFiltersChange}
          onFilterStateChange={handleFilterStateChange}
        />

        {error && <ErrorDisplay message={error} onRetry={handleRetry} />}

        {loading && <ManagementShimmer />}

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
          selectedCenter={currentFilterState.selectedCenterName || ""}
          selectedCenterId={currentFilterState.selectedCenterId}
        />
      </div>
    </div>
  );
}

export const ManagementShimmer = () => {
  return (
    <div>
      {/* Three Stat Cards Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-300 rounded-sm overflow-hidden animate-pulse"
          >
            <div className="p-6 text-center space-y-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
              <div className="h-10 bg-gray-300 rounded w-20 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Shimmer */}
      <div className="bg-white rounded-sm border border-gray-400 overflow-hidden animate-pulse">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-300 rounded-full"></div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
