"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Briefcase, Plus } from "lucide-react";
import Table from "../../Table";
import AddJobModal from "./AddJobModal";

interface TableJob {
  id: string;
  jobTitle: string;
  location: string;
  jdLink: string;
  workMode: "online" | "onsite" | "hybrid";
  jobType: "internship" | "full-time";
  companyName: string;
  vacancyCount: string;
  eligibility: string;
  desc: string;
  closingDate: string;
}

const initialJobs: TableJob[] = [
  {
    id: "1",
    jobTitle: "Software Developer",
    location: "Bangalore",
    jdLink: "https://example.com/job1",
    workMode: "hybrid",
    jobType: "full-time",
    companyName: "Tech Corp",
    vacancyCount: "5",
    eligibility: "B.Tech/B.E in CS/IT",
    desc: "Develop and maintain web applications using modern technologies",
    closingDate: "2025-09-15",
  },
  {
    id: "2",
    jobTitle: "Marketing Intern",
    location: "Mumbai",
    jdLink: "https://example.com/job2",
    workMode: "onsite",
    jobType: "internship",
    companyName: "Marketing Solutions",
    vacancyCount: "3",
    eligibility: "MBA students",
    desc: "Support marketing campaigns and digital marketing initiatives",
    closingDate: "2025-08-30",
  },
  {
    id: "3",
    jobTitle: "Data Analyst",
    location: "Pune",
    jdLink: "https://example.com/job3",
    workMode: "online",
    jobType: "full-time",
    companyName: "DataTech Inc",
    vacancyCount: "2",
    eligibility: "B.Tech/MCA with experience in data analysis",
    desc: "Analyze data trends and create insightful reports for business decisions",
    closingDate: "2025-09-30",
  },
];

export default function JobManagement() {
  const [jobs, setJobs] = useState<TableJob[]>(initialJobs);
  const [error, setError] = useState("");
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalJobs: jobs.length,
    }),
    [jobs]
  );

  const handleUpdateJob = useCallback((updatedItem: any) => {
    const jobItem = updatedItem as TableJob;
    setJobs((prev) =>
      prev.map((job) => (job.id === jobItem.id ? { ...job, ...jobItem } : job))
    );
  }, []);

  const handleDeleteJob = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setJobs((prev) => prev.filter((job) => job.id !== deleteId));
  }, []);

  const handleAddJob = useCallback(
    (newJobData: {
      jobTitle: string;
      location: string;
      jdLink: string;
      workMode: "online" | "onsite" | "hybrid";
      jobType: "internship" | "full-time";
      companyName: string;
      vacancyCount: string;
      eligibility: string;
      desc: string;
      closingDate: string;
    }) => {
      const newJob: TableJob = {
        id: Date.now().toString(),
        ...newJobData,
      };

      setJobs((prev) => [...prev, newJob]);
      setIsAddJobModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddJobModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddJobModalOpen(false);
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
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Job Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Briefcase className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Jobs Listed</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalJobs}
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
              <h3 className="text-lg font-semibold">Add New Job</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new job posting
              </p>
            </button>
          </div>
        </div>

        <Table
          data={jobs}
          title="Jobs Overview"
          filterField="jobType"
          badgeFields={["workMode", "jobType"]}
          selectFields={{
            workMode: ["online", "onsite", "hybrid"],
            jobType: ["internship", "full-time"],
          }}
          nonEditableFields={["id"]}
          onDelete={handleDeleteJob}
          onEdit={handleUpdateJob}
          hiddenColumns={["id"]}
        />

        <AddJobModal
          isOpen={isAddJobModalOpen}
          onClose={handleCloseAddModal}
          onJobCreated={handleAddJob}
        />
      </div>
    </div>
  );
}
