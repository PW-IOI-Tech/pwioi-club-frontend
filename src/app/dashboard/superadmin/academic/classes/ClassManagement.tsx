"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
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
  for (let i = 0; i < 4; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + i * 7 - today.getDay()); // Monday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // Friday

    weeks.push({
      id: i + 1,
      start: new Date(startDate),
      end: new Date(endDate),
      label: `${startDate.getDate()}-${endDate.getDate()}/${
        endDate.getMonth() + 1
      }`,
    });
  }
  return weeks;
}

// 👉 helper: is the given "day name" today?
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

// 👉 helper: get current time string "HH:mm"
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
  const weeks = useMemo(() => getUpcomingWeeks(), []);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
    if (!selectedCenter) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setSchools(res.data?.data || []))
      .catch(() => console.error("Failed to fetch schools"));
  }, [selectedCenter]);

  useEffect(() => {
    if (!selectedSchool) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setBatches(res.data?.data || []))
      .catch(() => console.error("Failed to fetch batches"));
  }, [selectedSchool]);

  useEffect(() => {
    if (!selectedBatch) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setDivisions(res.data?.data || []))
      .catch(() => console.error("Failed to fetch divisions"));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedDivision) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setSemesters(res.data?.data || []))
      .catch(() => console.error("Failed to fetch semesters"));
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedSemester) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${selectedSemester}`,
        { withCredentials: true }
      )
      .then((res) => setSubjects(res.data?.data || []))
      .catch(() => console.error("Failed to fetch subjects"));
  }, [selectedSemester]);

  useEffect(() => {
    if (!selectedCenter) return;

    const fetchRooms = async () => {
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
      }
    };

    fetchRooms();
  }, [selectedCenter]);

  useEffect(() => {
    if (!allFiltersSelected || !selectedWeek) return;

    const fetchClasses = async () => {
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
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const mapped = res.data.data
            .map((cls: any) => {
              const start = new Date(cls.start_date);
              const end = new Date(cls.end_date);

              const days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];

              return {
                id: cls.id,
                subjectId: cls.subject_id,
                roomId: cls.room_id,
                day: days[start.getDay()],
                startTime: start.toTimeString().slice(0, 5),
                endTime: end.toTimeString().slice(0, 5),
                lectureNumber: cls.lecture_number,
                subjectName: cls.subject?.name || "",
                roomName: cls.room?.name || "",
                startDate: start,
                endDate: end,
              } as SavedClass & { startDate: Date; endDate: Date };
            })
            // 👉 only keep classes inside this week range
            .filter(
              (cls: any) =>
                cls.startDate >= weekObj.start && cls.startDate <= weekObj.end
            );

          setSavedClasses(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };

    fetchClasses();
  }, [allFiltersSelected, selectedWeek]);

  const handleSubmit = async () => {
    try {
      const weekObj = weeks.find((w) => w.id === selectedWeek);
      if (!weekObj) return;

      const payload = {
        subject_id: selectedSubjectObj.id,
        room_id: selectedRoomObj.id,
        start_date: weekObj.start.toISOString(),
        end_date: weekObj.end.toISOString(),
        schedule_items: [
          {
            day_of_week: currentDay,
            start_time: formData.startTime,
            end_time: formData.endTime,
            lecture_number: Number(formData.lectureNumber),
          },
        ],
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class/schedule`,
        payload,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("❌ API Error:", err);
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
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/class/${classId}`,
        updatedData,
        { withCredentials: true }
      );
      if (res.data.success) {
        setSavedClasses((prev) =>
          prev.map((c) => (c.id === classId ? res.data.data : c))
        );
      }
    } catch (err) {
      console.error("Failed to update class", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Class Management</h2>

      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
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
            },
            {
              label: "School",
              value: selectedSchool,
              options: schools,
              setter: setSelectedSchool,
              disabled: !selectedCenter,
            },

            {
              label: "Batch",
              value: selectedBatch,
              options: batches,
              setter: setSelectedBatch,
              disabled: !selectedSchool,
            },
            {
              label: "Division",
              value: selectedDivision,
              options: divisions,
              setter: setSelectedDivision,
              disabled: !selectedBatch,
            },
            {
              label: "Semester",
              value: selectedSemester,
              options: semesters,
              setter: setSelectedSemester,
              disabled: !selectedDivision,
            },
            {
              label: "Subject",
              value: selectedSubject,
              options: subjects,
              setter: setSelectedSubject,
              disabled: !selectedSemester,
            },
            {
              label: "Room",
              value: selectedRoomObj?.name || "",
              options: availableRooms.map((r) => r.name),
              setter: (name: string) => {
                const room = availableRooms.find((r) => r.name === name);
                setSelectedRoom(room?.id || "");
              },
              disabled: !selectedSubject || !selectedCenter,
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
                  disabled={filter.disabled}
                  className={`w-full p-2 pr-8 border border-gray-300 rounded text-xs appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">{`Select ${filter.label}`}</option>
                  {filter.options.map((opt: any) => {
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
          <h3 className="text-lg font-medium text-slate-800 mb-3">
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

      {!allFiltersSelected || selectedWeek === null ? (
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
                          className="flex-shrink-0 bg-blue-500 text-white px-3 py-2 rounded-sm text-xs min-w-max shadow-sm relative"
                        >
                          <div className="font-medium">{cls.subjectName}</div>
                          <div className="text-indigo-100">
                            {cls.startTime}–{cls.endTime} | L{cls.lectureNumber}
                          </div>
                          <div className="text-indigo-200 text-xs">
                            {cls.roomName}
                          </div>

                          <div className="absolute top-1 right-1 flex space-x-1">
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
                              className="bg-white/20 hover:bg-white/30 text-xs px-2 py-0.5 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="bg-red-500 hover:bg-red-600 text-xs px-2 py-0.5 rounded"
                            >
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
                    });
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
  );
}
