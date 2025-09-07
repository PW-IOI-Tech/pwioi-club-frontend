"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import Table from "../../Table";
import axios from "axios";

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

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  total_sub_topics: number;
  completed_sub_topics: number;
  in_progress_sub_topics: number;
  pending_sub_topics: number;
  completion_lag: number;
}

export default function CPRDashboard() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [statistics, setStatistics] = useState({
    totalSubjects: 0,
    totalSubTopics: 0,
    completedSubTopics: 0,
    inProgressSubTopics: 0,
    pendingSubTopics: 0,
    avgCompletionLag: 0,
  });

  const bothFiltersSelected = selectedLocation && selectedSchool;

  useEffect(() => {
    const getCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );

        const fetchedCenters: Center[] = res.data.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          code: c.code,
        }));

        setCenters(fetchedCenters);
      } catch (err) {
        console.error("Error fetching centers:", err);
      }
    };

    getCenters();
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;

    const getSchools = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedLocation}`,
          { withCredentials: true }
        );

        setSchools(res.data.data);
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    };

    getSchools();
  }, [selectedLocation]);

  useEffect(() => {
    if (!bothFiltersSelected) return;

    const getCprData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/summary/school`,
          {
            params: { centerId: selectedLocation, schoolId: selectedSchool },
            withCredentials: true,
          }
        );

        const formattedSubjects: Subject[] = res.data.data.map((item: any) => ({
          id: item.subject.id,
          subject_name: item.subject.name,
          subject_code: item.subject.code,
          teacher_name:
            item.teacher_name || item.subject.teacher?.name || "N/A",
          total_sub_topics: item.total_sub_topics,
          completed_sub_topics: item.completed_sub_topics,
          in_progress_sub_topics: item.in_progress_sub_topics,
          pending_sub_topics: item.pending_sub_topics,
          completion_lag: item.completion_lag,
        }));

        setSubjects(formattedSubjects);
      } catch (err) {
        console.error("Error fetching CPR data:", err);
      }
    };

    getCprData();
  }, [bothFiltersSelected, selectedLocation, selectedSchool]);

  useEffect(() => {
    if (subjects.length === 0) {
      setStatistics({
        totalSubjects: 0,
        totalSubTopics: 0,
        completedSubTopics: 0,
        inProgressSubTopics: 0,
        pendingSubTopics: 0,
        avgCompletionLag: 0,
      });
      return;
    }

    const totalSubTopics = subjects.reduce(
      (sum, s) => sum + s.total_sub_topics,
      0
    );
    const completedSubTopics = subjects.reduce(
      (sum, s) => sum + s.completed_sub_topics,
      0
    );
    const inProgressSubTopics = subjects.reduce(
      (sum, s) => sum + s.in_progress_sub_topics,
      0
    );
    const pendingSubTopics = subjects.reduce(
      (sum, s) => sum + s.pending_sub_topics,
      0
    );
    const avgCompletionLag =
      subjects.reduce((sum, s) => sum + s.completion_lag, 0) / subjects.length;

    setStatistics({
      totalSubjects: subjects.length,
      totalSubTopics,
      completedSubTopics,
      inProgressSubTopics,
      pendingSubTopics,
      avgCompletionLag: parseFloat(avgCompletionLag.toFixed(2)),
    });
  }, [subjects]);

  const handleDeleteSubject = async (id: string | number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/subject/${id}`,
        { withCredentials: true }
      );

      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">CPR Management</h2>

        <div className="bg-[#12294c] p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-white text-sm font-semibold mb-4">
            Filter Subjects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="center"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                Center Location
              </label>
              <div className="relative">
                <select
                  id="center"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
                >
                  <option value="">Select Center</option>
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="school"
                className="block text-xs font-medium text-gray-100 mb-2"
              >
                School
              </label>
              <div className="relative">
                <select
                  id="school"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 pointer-events-none -translate-y-1/2" />
              </div>
            </div>
          </div>

          {!bothFiltersSelected && (
            <p className="text-gray-200 text-sm mt-4">
              Please select both a center and a school to view subject data.
            </p>
          )}
        </div>

        {bothFiltersSelected && subjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Subjects */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
              <Calendar className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Subjects</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalSubjects}
              </p>
            </div>

            {/* Completed Sub-Topics */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400 p-6 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="text-lg text-slate-900 mb-1">Completed</h4>
              <p className="text-5xl font-bold text-green-600">
                {statistics.completedSubTopics}
              </p>
            </div>

            {/* In Progress */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400 p-6 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-lg text-slate-900 mb-1">In Progress</h4>
              <p className="text-5xl font-bold text-blue-600">
                {statistics.inProgressSubTopics}
              </p>
            </div>

            {/* Avg Completion Lag */}
            <div className="bg-gradient-to-br from-white to-red-50 rounded-sm border border-gray-400 p-6 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <h4 className="text-lg text-slate-900 mb-1">
                Avg Lag (Lectures)
              </h4>
              <p
                className={`text-5xl font-bold ${
                  statistics.avgCompletionLag > 0
                    ? "text-red-600"
                    : statistics.avgCompletionLag < 0
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {statistics.avgCompletionLag > 0
                  ? `+${statistics.avgCompletionLag}`
                  : statistics.avgCompletionLag}
              </p>
            </div>
          </div>
        )}

        {bothFiltersSelected && (
          <Table
            data={subjects}
            title="Subjects Overview"
            filterField="subject_name"
            hiddenColumns={["id"]}
            badgeFields={[]}
            selectFields={{
              teacher_name: Array.from(
                new Set(subjects.map((s) => s.teacher_name))
              ),
            }}
            nonEditableFields={["id"]}
            onDelete={handleDeleteSubject}
            customRenderers={{
              completion_lag: (item: any) => (
                <span
                  className={
                    item.completion_lag > 0
                      ? "text-red-600 font-semibold"
                      : item.completion_lag < 0
                      ? "text-green-600 font-semibold"
                      : "text-gray-600"
                  }
                >
                  {item.completion_lag > 0
                    ? `+${item.completion_lag}`
                    : item.completion_lag}
                </span>
              ),
            }}
          />
        )}

        {bothFiltersSelected && subjects.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
            <p className="text-gray-500">
              No subjects found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
