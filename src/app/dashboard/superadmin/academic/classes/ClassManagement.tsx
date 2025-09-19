"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Edit2, Plus, X } from "lucide-react";
import axios from "axios";

interface SavedClass {
  id: string;
  subjectId: string;
  roomId: string;
  day: string;
  startTime: string;
  endTime: string;
  lectureNumber: string;
  subjectName: string;
  roomName: string;
}

function getUpcomingWeeks() {
  const weeks = [];
  const today = new Date();

  const currentDayOfWeek = today.getDay();
  const daysToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  for (let i = 0; i < 4; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysToMonday + i * 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    endDate.setHours(23, 59, 59, 999);

    weeks.push({
      id: i + 1,
      start: startDate,
      end: endDate,
      label: `${startDate.getDate()}/${
        startDate.getMonth() + 1
      } - ${endDate.getDate()}/${endDate.getMonth() + 1}`,
    });
  }
  return weeks;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function isToday(day: string) {
  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[today.getDay()] === day;
}

function getCurrentTimeString() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

export default function ClassManagement() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState<string>("");

  const [formData, setFormData] = useState({
    startTime: "09:00",
    endTime: "10:30",
    lectureNumber: "1",
  });

  const [savedClasses, setSavedClasses] = useState<SavedClass[]>([]);
  const [editingClass, setEditingClass] = useState<SavedClass | null>(null);

  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const weeks = useMemo(() => getUpcomingWeeks(), []);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const allDaysForGetDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const availableRooms = selectedCenter ? rooms : [];

  const selectedSubjectObj =
    subjects.find((s) => s.id === selectedSubject) || null;
  const selectedRoomObj =
    availableRooms.find((r) => r.id === selectedRoom) || null;

  const allFiltersSelected =
    selectedCenter &&
    selectedSchool &&
    selectedDivision &&
    selectedBatch &&
    selectedSemester &&
    selectedSubject &&
    selectedRoom;

  const minTime = getCurrentTimeString();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setCenters(res.data.data);
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (!selectedCenter) {
      setSchools([]);
      setSelectedSchool("");
      return;
    }
    setLoadingSchools(true);
    setSchools([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
        { withCredentials: true }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"))
      .finally(() => setLoadingSchools(false));
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) {
      setBatches([]);
      setSelectedBatch("");
      return;
    }
    setLoadingBatches(true);
    setBatches([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
        { withCredentials: true }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"))
      .finally(() => setLoadingBatches(false));
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) {
      setDivisions([]);
      setSelectedDivision("");
      return;
    }
    setLoadingDivisions(true);
    setDivisions([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
        { withCredentials: true }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"))
      .finally(() => setLoadingDivisions(false));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) {
      setSemesters([]);
      setSelectedSemester("");
      return;
    }
    setLoadingSemesters(true);
    setSemesters([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
        { withCredentials: true }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"))
      .finally(() => setLoadingSemesters(false));
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      setSelectedSubject("");
      return;
    }
    setLoadingSubjects(true);
    setSubjects([]);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${selectedSemester}`,
        { withCredentials: true }
      )
      .then((res) => setSubjects(res.data?.data || []))
      .catch(() => console.error("Failed to fetch subjects"))
      .finally(() => setLoadingSubjects(false));
  }, [selectedSemester]);

  useEffect(() => {
    if (!selectedCenter) {
      setRooms([]);
      setSelectedRoom("");
      return;
    }

    const fetchRooms = async () => {
      setLoadingRooms(true);
      setRooms([]);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
          {
            params: { center_id: selectedCenter },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setRooms(res.data.data);
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch rooms");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [selectedCenter]);

  const fetchClasses = async () => {
    if (!allFiltersSelected || !selectedWeek) return;

    setLoadingClasses(true);
    setSavedClasses([]);
    try {
      const weekObj = weeks.find((w) => w.id === selectedWeek);
      if (!weekObj) return;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class`,
        {
          params: {
            centerId: selectedCenter,
            schoolId: selectedSchool,
            batchId: selectedBatch,
            divisionId: selectedDivision,
            semesterId: selectedSemester,
            start_date: formatLocalDate(weekObj.start),
            end_date: formatLocalDate(weekObj.end),
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const mapped = res.data.data.map((cls: any) => {
          const start = new Date(cls.start_date);
          const end = new Date(cls.end_date);

          return {
            id: cls.id,
            lectureNumber: cls.lecture_number,
            day: allDaysForGetDay[start.getDay()],
            startTime: start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            endTime: end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            subjectId: cls.subject_id,
            subjectName: cls.subject?.name ?? "",
            roomId: cls.room_id,
            roomName: cls.room?.name ?? "",
          } as SavedClass;
        });
        setSavedClasses(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [
    allFiltersSelected,
    selectedWeek,
    weeks,
    selectedCenter,
    selectedSchool,
    selectedBatch,
    selectedDivision,
    selectedSemester,
  ]);

  const handleSubmit = async () => {
    try {
      const weekObj = weeks.find((w) => w.id === selectedWeek);
      if (!weekObj || !selectedSubjectObj || !selectedRoomObj) return;

      const startDate = new Date(weekObj.start);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(weekObj.end);
      endDate.setUTCHours(23, 59, 59, 999);

      const payload = {
        subject_id: selectedSubjectObj.id,
        room_id: selectedRoomObj.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        schedule_items: [
          {
            day_of_week: currentDay,
            start_time: formData.startTime,
            end_time: formData.endTime,
            lecture_number: Number(formData.lectureNumber),
          },
        ],
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class/schedule`,
        payload,
        { withCredentials: true }
      );

      fetchClasses();
    } catch (err) {
      console.error("❌ API Error creating class:", err);
    }
  };

  const handleDelete = async (classId: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class/${classId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setSavedClasses((prev) => prev.filter((c) => c.id !== classId));
      }
    } catch (err) {
      console.error("Failed to delete class", err);
    }
  };

  const handleUpdate = async (
    classId: string,
    updatedData: Partial<SavedClass>
  ) => {
    try {
      if (
        !updatedData.startTime ||
        !updatedData.endTime ||
        !updatedData.lectureNumber
      )
        return;

      const payload = {
        start_time: updatedData.startTime,
        end_time: updatedData.endTime,
        lecture_number: updatedData.lectureNumber,
      };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class/${classId}`,
        payload,
        { withCredentials: true }
      );

      fetchClasses();
    } catch (err) {
      console.error("Failed to update class", err);
    }
  };

  const showShimmer =
    !allFiltersSelected || selectedWeek === null || loadingClasses;

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Class Management
        </h2>

        <div className="bg-[#12294c] p-4 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <h3 className="text-white text-sm font-semibold mb-3 whitespace-nowrap">
            Schedule Class
          </h3>
          <div className="flex space-x-3 flex-wrap space-y-2">
            {[
              {
                label: "Center",
                value: selectedCenter,
                options: centers,
                setter: setSelectedCenter,
                disabled: false,
                loading: false,
              },
              {
                label: "School",
                value: selectedSchool,
                options: schools,
                setter: setSelectedSchool,
                disabled: !selectedCenter,
                loading: loadingSchools,
              },
              {
                label: "Batch",
                value: selectedBatch,
                options: batches,
                setter: setSelectedBatch,
                disabled: !selectedSchool,
                loading: loadingBatches,
              },
              {
                label: "Division",
                value: selectedDivision,
                options: divisions,
                setter: setSelectedDivision,
                disabled: !selectedBatch,
                loading: loadingDivisions,
              },
              {
                label: "Semester",
                value: selectedSemester,
                options: semesters,
                setter: setSelectedSemester,
                disabled: !selectedDivision,
                loading: loadingSemesters,
              },
              {
                label: "Subject",
                value: selectedSubject,
                options: subjects,
                setter: setSelectedSubject,
                disabled: !selectedSemester,
                loading: loadingSubjects,
              },
              {
                label: "Room",
                value: selectedRoom,
                options: availableRooms,
                setter: setSelectedRoom,
                disabled: !selectedSubject || !selectedCenter,
                loading: loadingRooms,
              },
            ].map((filter, idx) => (
              <div key={idx} className="relative min-w-36">
                <label className="block text-xs font-medium text-gray-100 mb-1">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    disabled={filter.disabled || filter.loading}
                    className={`
                   w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none
                   ${
                     filter.disabled || filter.loading
                       ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                       : "bg-white text-gray-900 cursor-pointer"
                   }
                 `}
                  >
                    <option value="">
                      {filter.loading ? "Loading..." : `Select ${filter.label}`}
                    </option>
                    {!filter.loading &&
                      filter.options.map((opt: any) => {
                        const value = opt.id || opt;
                        const label =
                          typeof opt === "string"
                            ? opt
                            : opt.name ||
                              opt.division ||
                              opt.number ||
                              opt.code ||
                              opt.id ||
                              "Unknown";

                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 w-4 h-4 text-gray-400 pointer-events-none -translate-y-1/2" />
                </div>
              </div>
            ))}
          </div>

          {!allFiltersSelected && (
            <p className="text-gray-200 text-xs mt-3">
              Complete all filters to proceed.
            </p>
          )}
        </div>

        {allFiltersSelected && (
          <div>
            <h3 className="text-lg font-medium text-slate-800 my-3">
              Select Week
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeek(week.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selectedWeek === week.id
                      ? "bg-slate-900 text-white shadow"
                      : "bg-white text-slate-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Week {week.id}: {week.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showShimmer ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-slate-800">
                Schedule for Week {selectedWeek}
              </h3>
            </div>

            <div className="divide-y">
              {days.map((day) => {
                const classesForDay = savedClasses.filter((c) => c.day === day);

                return (
                  <div key={day} className="p-4 hover:bg-gray-25 transition">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-700">{day}</h4>
                      <button
                        onClick={() => {
                          setCurrentDay(day);
                          setFormData({
                            startTime: "09:00",
                            endTime: "10:30",
                            lectureNumber: "1",
                          });
                          setEditingClass(null);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-slate-900 hover:underline text-sm font-medium cursor-pointer duration-200 ease-in-out"
                      >
                        <Plus size={16} />
                        Add Class
                      </button>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto pb-1">
                      {classesForDay.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          No classes scheduled
                        </p>
                      ) : (
                        classesForDay.map((cls) => (
                          <div
                            key={cls.id}
                            className="flex-shrink-0 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-3 text-xs w-48 relative"
                          >
                            <div className="font-semibold text-slate-800 mb-1 truncate">
                              {cls.subjectName}
                            </div>

                            <div className="text-slate-600 space-y-1">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {cls.startTime} – {cls.endTime}
                                </span>
                                <span className="bg-slate-100 text-slate-700 px-1.5 rounded">
                                  L{cls.lectureNumber}
                                </span>
                              </div>
                              <div className="text-slate-500">
                                {cls.roomName}
                              </div>
                            </div>

                            <div className="flex gap-1.5 mt-2 pt-2 border-t border-gray-100">
                              <button
                                onClick={() => {
                                  setCurrentDay(cls.day);
                                  setFormData({
                                    startTime: cls.startTime,
                                    endTime: cls.endTime,
                                    lectureNumber: cls.lectureNumber,
                                  });
                                  setIsModalOpen(true);
                                  setEditingClass(cls);
                                }}
                                className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 text-xs p-1.5 rounded transition-colors duration-150"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(cls.id)}
                                className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 text-xs p-1.5 rounded transition-colors duration-150"
                              >
                                <X size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingClass ? "Edit Class" : `Add Class - ${currentDay}`}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    min={isToday(currentDay) ? minTime : undefined}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    min={formData.startTime}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lecture Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.lectureNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lectureNumber: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingClass) {
                      handleUpdate(editingClass.id, {
                        startTime: formData.startTime,
                        endTime: formData.endTime,
                        lectureNumber: formData.lectureNumber,
                      } as SavedClass);
                      setEditingClass(null);
                    } else {
                      handleSubmit();
                    }
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 cursor-pointer font-medium"
                >
                  {editingClass ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
