"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Briefcase, Plus } from "lucide-react";
import Table from "../../Table";
import AddJobModal from "./AddJobModal";
import axios from "axios";

interface TableJob {
  id: string;
  jobTitle: string;
  location: string;
  jdLink: string;
  workMode: "online" | "onsite" | "hybrid";
  jobType: "internship" | "full-time";
  companyName: string;
  vacancy: number;
  eligibility: string;
  desc: string;
  closingDate: string;
}

const transformJobPayload = (job: Omit<TableJob, "id">) => ({
  title: job.jobTitle,
  location: job.location,
  jd_link: job.jdLink,
  work_mode:
    job.workMode.toUpperCase() === "ONLINE"
      ? "REMOTE"
      : job.workMode.toUpperCase(),
  type: job.jobType.toUpperCase().replace("-", "_"),
  company_name: job.companyName,
  vacancy_count: job.vacancy,
  eligibility: job.eligibility,
  description: job.desc,
  closing_date: new Date(job.closingDate).toISOString(),
});

const transformJobResponse = (job: any): TableJob => ({
  id: job.id,
  jobTitle: job.title,
  location: job.location,
  jdLink: job.jd_link,
  workMode:
    job.work_mode === "REMOTE"
      ? "online"
      : job.work_mode?.toLowerCase() || "onsite",
  jobType:
    job.type?.toLowerCase().replace("_", "-") || "full-time",
  companyName: job.company_name,
  vacancy: job.vacancy,
  eligibility: job.eligibility,
  desc: job.description,
  closingDate: job.closing_date
    ? new Date(job.closing_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "",
});


export default function JobManagement() {
  const [jobs, setJobs] = useState<TableJob[]>([]);
  const [error, setError] = useState("");
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);


  const statistics = useMemo(
    () => ({
      totalJobs: jobs.length,
    }),
    [jobs]
  );

// Fetch jobs
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/All`,
        { withCredentials: true }
      );
      setJobs(res.data.data.map(transformJobResponse));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    }
  };

  fetchJobs();
}, []);

// Add job
const handleAddJob = useCallback(async (newJobData: Omit<TableJob, "id">) => {
  try {
    const payload = transformJobPayload(newJobData);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job`,
      payload,
      { withCredentials: true }
    );

    setJobs((prev) => [...prev, transformJobResponse(res.data.data)]);
    setIsAddJobModalOpen(false);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to add job");
  }
}, []);

// Update job
const handleUpdateJob = useCallback(async (updatedItem:any) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/${updatedItem.id}`,
      transformJobPayload(updatedItem),
      { withCredentials: true }
    );

    setJobs((prev) =>
      prev.map((job) =>
        job.id === updatedItem.id ? transformJobResponse(res.data.data) : job
      )
    );
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to update job");
  }
}, []);


  const handleDeleteJob = useCallback(async (id: string | number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/${id}`,
        { withCredentials: true }
      );

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete job");
    }
  }, []);

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
