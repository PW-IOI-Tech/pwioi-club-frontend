"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ChevronDown, Save, Loader2, Eye, EyeOff } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface SubTopic {
  id: string;
  name: string;
  order: number;
  lecture_number: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Topic {
  id: string;
  name: string;
  order: number;
  module_id: string;
  subTopics: SubTopic[];
}

interface Module {
  id: string;
  name: string;
  order: number;
  subject_id: string;
  topics: Topic[];
}

interface BackendResponse {
  success: boolean;
  data: {
    subject: {
      id: string;
      name: string;
      code: string;
    };
    summary: {
      total_modules: number;
      total_topics: number;
      total_sub_topics: number;
      total_lectures: number;
      completed_sub_topics: number;
      in_progress_sub_topics: number;
      pending_sub_topics: number;
      completion_percentage: number;
      teacher_name: string;
      expected_completion_lecture: number;
      actual_completion_lecture: number;
      completion_lag: number;
    };
    modules: Module[];
  };
}

type NiceStatus = "Pending" | "In Progress" | "Completed";

interface CPRRow {
  id: string;
  module: string;
  topic: string;
  subTopic: string;
  lectureCount: number;
  status: NiceStatus;
  startDate: string;
  actualStartDate: string | null;
  completionDate: string;
  actualCompletionDate: string | null;
  lectureId: string;

  moduleRowSpan: number;
  topicRowSpan: number;
  showModuleCell: boolean;
  showTopicCell: boolean;
}

function mapStatusFromApi(status: SubTopic["status"]): NiceStatus {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    default:
      return "Pending";
  }
}
function mapStatusToApi(status: NiceStatus): SubTopic["status"] {
  switch (status) {
    case "Completed":
      return "COMPLETED";
    case "In Progress":
      return "IN_PROGRESS";
    default:
      return "PENDING";
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : d.toISOString().split("T")[0];
}

function flattenDataWithRowSpans(modules: Module[]): CPRRow[] {
  const result: CPRRow[] = [];
  modules.forEach((mod) => {
    const totalSubTopicsInModule = mod.topics.reduce(
      (sum, topic) => sum + topic.subTopics.length,
      0
    );
    let moduleFirstRow = true;

    mod.topics.forEach((topic) => {
      const subTopicsCount = topic.subTopics.length;
      let topicFirstRow = true;

      topic.subTopics.forEach((sub) => {
        result.push({
          id: sub.id,
          module: mod.name,
          topic: topic.name,
          subTopic: sub.name,
          lectureCount: sub.lecture_number,
          status: mapStatusFromApi(sub.status),
          startDate: formatDate(sub.planned_start_date),
          actualStartDate: sub.actual_start_date,
          completionDate: formatDate(sub.planned_end_date),
          actualCompletionDate: sub.actual_end_date,
          lectureId: sub.id,

          moduleRowSpan: totalSubTopicsInModule,
          topicRowSpan: subTopicsCount,
          showModuleCell: moduleFirstRow,
          showTopicCell: topicFirstRow,
        });

        moduleFirstRow = false;
        topicFirstRow = false;
      });
    });
  });
  return result;
}

export default function CPRManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [cprData, setCprData] = useState<CPRRow[]>([]);
  const [originalCprData, setOriginalCprData] = useState<CPRRow[]>([]);
  const [cprLoading, setCprLoading] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [dateDetailRows, setDateDetailRows] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/subjects`,
          { withCredentials: true }
        );
        if (res.data?.success) {
          setSubjects(res.data.data as Subject[]);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // fetch CPR data for subject
  useEffect(() => {
    const fetchCPR = async () => {
      if (!selectedSubject) {
        setCprData([]);
        setOriginalCprData([]);
        return;
      }
      try {
        setCprLoading(true);
        const res = await axios.get<BackendResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/subject/${selectedSubject}`,
          { withCredentials: true }
        );
        const modules = res.data?.data?.modules ?? [];
        const flattened = flattenDataWithRowSpans(modules);
        setCprData(flattened);
        setOriginalCprData(flattened);
        setHasChanges(false);
        setExpandedRows(new Set());
        setDateDetailRows(new Set());
      } catch (err) {
        console.error("Error fetching CPR:", err);
        setCprData([]);
        setOriginalCprData([]);
      } finally {
        setCprLoading(false);
      }
    };
    fetchCPR();
  }, [selectedSubject]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const isRowDelayed = (row: CPRRow): boolean => {
    if (row.status === "Completed") return false;
    const now = new Date();
    const plannedCompletion = new Date(row.completionDate);
    return now > plannedCompletion;
  };

  const handleStatusChange = (id: string, newStatus: NiceStatus) => {
    const nowISO = new Date().toISOString();

    setCprData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const prevStatus = row.status;
        const updated: CPRRow = { ...row, status: newStatus };

        if (prevStatus === "Pending" && newStatus === "In Progress") {
          if (!updated.actualStartDate) updated.actualStartDate = nowISO;
        }
        if (prevStatus !== "Completed" && newStatus === "Completed") {
          if (!updated.actualStartDate) updated.actualStartDate = nowISO;
          updated.actualCompletionDate = nowISO;
        }
        if (newStatus === "Pending") {
          updated.actualStartDate = null;
          updated.actualCompletionDate = null;
        }

        return updated;
      })
    );

    setHasChanges(true);
  };

  const changedRows = useMemo(() => {
    const originalMap = new Map(originalCprData.map((r) => [r.id, r]));
    const diffs = cprData.filter((row) => {
      const orig = originalMap.get(row.id);
      if (!orig) return true;
      return (
        row.status !== orig.status ||
        row.actualStartDate !== orig.actualStartDate ||
        row.actualCompletionDate !== orig.actualCompletionDate
      );
    });
    return diffs;
  }, [cprData, originalCprData]);

  type UpdateItem = {
    id: string;
    status: SubTopic["status"];
    actual_start_date: string | null;
    actual_end_date: string | null;
  };

const saveChanges = async () => {
  try {
    if (!selectedSubject || changedRows.length === 0) return;
    setIsSaving(true);

    for (const row of changedRows) {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/sub-topics/${row.id}/status`,
        {
          status: mapStatusToApi(row.status),
          actual_start_date: row.actualStartDate,
          actual_end_date: row.actualCompletionDate,
        },
        { withCredentials: true }
      );
    }

    setOriginalCprData([...cprData]);
    setHasChanges(false);
    alert("CPR changes saved successfully!");
  } catch (err) {
    console.error("Error saving CPR changes:", err);
    alert("Failed to save changes. Please try again.");
  } finally {
    setIsSaving(false);
  }
};


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleDateDetails = (id: string) => {
    setDateDetailRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const ShimmerRow = () => (
    <div className="flex flex-col p-3 border-b border-gray-200 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            CPR Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Track and manage course progress for your subjects.
          </p>
        </div>

        {/* Subject Dropdown */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-100 mb-2"
          >
            Subject
          </label>
          <div className="relative">
            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              disabled={subjectsLoading}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm disabled:opacity-60"
            >
              <option value="">{subjectsLoading ? "Loading..." : "Select a Subject to Proceed"}</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {!selectedSubject ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
            <div className="space-y-4 md:hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <ShimmerRow key={i} />
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    {["Module", "Topic", "Sub Topic", "Lectures", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-3 py-3 border-b">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Course Progress Report
              </h3>
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-blue-50 rounded transition-colors"
              >
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
                {isExpanded ? "Collapse All" : "Expand All"}
              </button>
            </div>

            {/* Loading state for CPR */}
            {cprLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ShimmerRow key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="space-y-4 md:hidden">
                  {cprData.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">
                      No data available for selected subject.
                    </p>
                  ) : (
                    cprData.map((row) => {
                      const isDelayed = isRowDelayed(row);
                      const isExpandedRow = expandedRows.has(row.id);
                      const isDateExpanded = dateDetailRows.has(row.id);
                      return (
                        <div
                          key={row.id}
                          className={`border rounded-lg overflow-hidden ${
                            isDelayed ? "border-red-200 bg-red-50" : "border-gray-200"
                          }`}
                        >
                          {/* Main Row */}
                          <div
                            className="p-4 border-b bg-gray-50"
                            onClick={() => toggleRow(row.id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-800 text-sm">
                                Lecture {row.lectureCount}
                              </h3>
                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={row.status === "Completed"}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      const newStatus: NiceStatus = e.target.checked
                                        ? "Completed"
                                        : "Pending";
                                      handleStatusChange(row.id, newStatus);
                                    }}
                                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                  />
                                </label>
                                <ChevronDown
                                  size={16}
                                  className={`transform transition-transform ${
                                    isExpandedRow ? "rotate-180" : ""
                                  } text-gray-500`}
                                />
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium truncate">
                              {row.subTopic}
                            </p>
                          </div>

                          {/* Expanded Content */}
                          {isExpandedRow && (
                            <div className="p-4 space-y-3 text-sm">
                              {row.showModuleCell && (
                                <div>
                                  <strong className="text-gray-700">Module:</strong>{" "}
                                  <span className="text-blue-900 font-medium">
                                    {row.module}
                                  </span>
                                </div>
                              )}
                              {row.showTopicCell && (
                                <div>
                                  <strong className="text-gray-700">Topic:</strong>{" "}
                                  <span className="text-green-800 font-medium">
                                    {row.topic}
                                  </span>
                                </div>
                              )}

                              {/* Status Buttons */}
                              <div>
                                <strong className="text-gray-700">Status:</strong>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {(["Pending", "In Progress", "Completed"] as const).map(
                                    (status) => (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusChange(row.id, status)}
                                        className={`px-3 py-1 text-xs rounded border min-w-[80px] ${
                                          row.status === status
                                            ? "bg-blue-100 border-blue-300 text-blue-800 font-medium"
                                            : "bg-white border-gray-300 hover:bg-gray-50"
                                        }`}
                                      >
                                        {status}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Toggle Date Details */}
                              <button
                                onClick={() => toggleDateDetails(row.id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                              >
                                {isDateExpanded ? (
                                  <>
                                    <EyeOff size={14} /> Hide Dates
                                  </>
                                ) : (
                                  <>
                                    <Eye size={14} /> Show Dates
                                  </>
                                )}
                              </button>

                              {/* Date Details */}
                              {isDateExpanded && (
                                <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
                                  <div>
                                    <strong>Planned Start:</strong> {row.startDate}
                                  </div>
                                  <div>
                                    <strong>Actual Start:</strong>{" "}
                                    {row.actualStartDate
                                      ? new Date(row.actualStartDate).toLocaleString(
                                          "en-IN",
                                          { dateStyle: "short", timeStyle: "short" }
                                        )
                                      : "-"}
                                  </div>
                                  <div>
                                    <strong>Planned End:</strong> {row.completionDate}
                                  </div>
                                  <div>
                                    <strong>Actual End:</strong>{" "}
                                    {row.actualCompletionDate
                                      ? new Date(row.actualCompletionDate).toLocaleString(
                                          "en-IN",
                                          { dateStyle: "short", timeStyle: "short" }
                                        )
                                      : "-"}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b w-48">
                          Module
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b w-52">
                          Topic
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">
                          Sub Topic
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b w-24">
                          Lectures
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b w-32">
                          {isExpanded ? "Status (Full)" : "Completed"}
                        </th>
                        {isExpanded && (
                          <>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">
                              Planned Start
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">
                              Actual Start
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">
                              Planned End
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b">
                              Actual End
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cprData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={isExpanded ? 9 : 5}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No data available for selected subject.
                          </td>
                        </tr>
                      ) : (
                        cprData.map((row) => {
                          const isDelayed = isRowDelayed(row);
                          return (
                            <tr
                              key={row.id}
                              className={`${isDelayed ? "bg-red-50" : "hover:bg-gray-50"} transition-colors`}
                            >
                              {row.showModuleCell && (
                                <td
                                  rowSpan={row.moduleRowSpan}
                                  className="px-3 py-3 border-b text-sm font-medium text-blue-900 bg-blue-50 align-top"
                                >
                                  {row.module}
                                </td>
                              )}
                              {row.showTopicCell && (
                                <td
                                  rowSpan={row.topicRowSpan}
                                  className="px-3 py-3 border-b text-sm font-medium text-green-800 bg-green-50 align-top"
                                >
                                  {row.topic}
                                </td>
                              )}
                              <td className="px-4 py-3 border-b text-sm text-gray-800 truncate max-w-xs">
                                {row.subTopic}
                              </td>
                              <td className="px-3 py-3 border-b text-sm text-center text-gray-600">
                                {row.lectureCount}
                              </td>

                              {!isExpanded ? (
                                <td className="px-4 py-3 border-b text-center">
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={row.status === "Completed"}
                                      onChange={() => {
                                        const newStatus: NiceStatus =
                                          row.status === "Completed" ? "Pending" : "Completed";
                                        handleStatusChange(row.id, newStatus);
                                      }}
                                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                    />
                                  </label>
                                </td>
                              ) : (
                                <td className="px-4 py-3 border-b">
                                  <select
                                    value={row.status}
                                    onChange={(e) =>
                                      handleStatusChange(row.id, e.target.value as NiceStatus)
                                    }
                                    className={`w-full px-2 py-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 ${
                                      isDelayed
                                        ? "border-red-500 bg-red-50 text-red-900"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                              )}

                              {isExpanded && (
                                <>
                                  <td className="px-4 py-3 border-b text-xs text-gray-600">
                                    {row.startDate}
                                  </td>
                                  <td className="px-4 py-3 border-b text-xs">
                                    {row.actualStartDate
                                      ? new Date(row.actualStartDate).toLocaleDateString("en-IN")
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 border-b text-xs text-gray-600">
                                    {row.completionDate}
                                  </td>
                                  <td className="px-4 py-3 border-b text-xs">
                                    {row.actualCompletionDate
                                      ? new Date(row.actualCompletionDate).toLocaleDateString("en-IN")
                                      : "-"}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {hasChanges && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 text-sm sm:text-base"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
