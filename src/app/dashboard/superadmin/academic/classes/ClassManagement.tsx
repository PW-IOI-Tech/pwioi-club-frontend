"use client";

import React, { useState, useMemo } from "react";
import { Plus, ChevronDown, X } from "lucide-react";

interface ClassSchedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
  lecture_number: string;
}

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

const LOCATIONS = ["Bangalore", "Noida", "Pune", "Lucknow"] as const;
const SCHOOLS = ["SOT", "SOM", "SOH"] as const;
const DIVISIONS = ["23", "24", "25"] as const;
const SEMESTERS = ["1", "2", "3", "4", "5", "6"] as const;

const SUBJECTS: Record<string, { id: string; name: string }[]> = {
  SOT: [
    { id: "s1", name: "Mathematics I" },
    { id: "s2", name: "Programming Fundamentals" },
  ],
  SOM: [
    { id: "s4", name: "Business Communication" },
    { id: "s5", name: "Principles of Management" },
  ],
  SOH: [
    { id: "s6", name: "Anatomy & Physiology" },
    { id: "s7", name: "Biochemistry" },
  ],
};

const ROOMS = [
  { id: "r1", name: "R-101", center: "Bangalore" },
  { id: "r2", name: "R-205", center: "Bangalore" },
  { id: "r3", name: "Lab-1", center: "Pune" },
  { id: "r4", name: "Auditorium", center: "Noida" },
  { id: "r5", name: "Seminar Hall", center: "Lucknow" },
  { id: "r6", name: "Smart Class B2", center: "Bangalore" },
];

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

export default function ClassManagement() {
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
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

  const weeks = useMemo(() => getUpcomingWeeks(), []);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const availableBatches =
    selectedSchool && selectedDivision
      ? ["B1", "B2"].map((b) => `${selectedSchool}${selectedDivision}${b}`)
      : [];

  const availableSubjects = selectedSchool ? SUBJECTS[selectedSchool] : [];
  const availableRooms = selectedCenter
    ? ROOMS.filter((r) => r.center === selectedCenter)
    : [];

  const selectedSubjectObj =
    availableSubjects.find((s) => s.id === selectedSubject) || null;
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

  const now = new Date();
  const minTime = now.toISOString().slice(0, 16).split("T")[1].slice(0, 5); // HH:MM
  const isToday = (day: string) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return day === today;
  };

  const hasTimeConflict = (day: string, start: string, end: string) => {
    return savedClasses.some((cls) => {
      if (cls.day !== day) return false;
      return !(end <= cls.startTime || start >= cls.endTime);
    });
  };

  const handleSubmit = () => {
    if (!selectedSubjectObj || !selectedRoomObj || !currentDay) return;

    const start = formData.startTime;
    const end = formData.endTime;

    if (isToday(currentDay) && start < minTime) {
      alert("Cannot schedule class in the past.");
      return;
    }

    if (hasTimeConflict(currentDay, start, end)) {
      alert("Time conflict: Another class is already scheduled in this slot.");
      return;
    }

    const newClass: SavedClass = {
      id: Date.now().toString(),
      subjectId: selectedSubjectObj.id,
      roomId: selectedRoomObj.id,
      day: currentDay,
      startTime: start,
      endTime: end,
      lectureNumber: formData.lectureNumber,
      subjectName: selectedSubjectObj.name,
      roomName: selectedRoomObj.name,
    };

    setSavedClasses((prev) => [...prev, newClass]);
    setIsModalOpen(false);
    setFormData({ startTime: "09:00", endTime: "10:30", lectureNumber: "1" });
  };

  const generatePayload = () => {
    const week = weeks.find((w) => w.id === selectedWeek);
    if (!week || !selectedSubjectObj || !selectedRoomObj) return null;

    const scheduleItems: ClassSchedule[] = days
      .map((day) => {
        const classesForDay = savedClasses.filter((c) => c.day === day);
        return classesForDay.map((c) => ({
          day_of_week: c.day,
          start_time: c.startTime,
          end_time: c.endTime,
          lecture_number: c.lectureNumber,
        }));
      })
      .flat();

    return {
      subject_id: selectedSubjectObj.id,
      room_id: selectedRoomObj.id,
      start_date: week.start.toISOString().split("T")[0],
      end_date: week.end.toISOString().split("T")[0],
      schedule_items: scheduleItems,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Class Management</h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-4 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <h3 className="text-white text-sm font-semibold mb-3 whitespace-nowrap">
            Schedule Class
          </h3>
          <div className="flex space-x-3 flex-wrap space-y-2">
            {[
              {
                label: "Center",
                value: selectedCenter,
                options: LOCATIONS,
                setter: setSelectedCenter,
                disabled: false,
              },
              {
                label: "School",
                value: selectedSchool,
                options: SCHOOLS,
                setter: setSelectedSchool,
                disabled: !selectedCenter,
              },
              {
                label: "Division",
                value: selectedDivision,
                options: DIVISIONS,
                setter: setSelectedDivision,
                disabled: !selectedSchool,
              },
              {
                label: "Batch",
                value: selectedBatch,
                options: availableBatches,
                setter: setSelectedBatch,
                disabled: !selectedDivision,
              },
              {
                label: "Semester",
                value: selectedSemester,
                options: SEMESTERS,
                setter: setSelectedSemester,
                disabled: !selectedBatch,
              },
              {
                label: "Subject",
                value: selectedSubject,
                options: availableSubjects.map((s) => s.name),
                setter: (val: string) => {
                  const subj = availableSubjects.find((s) => s.name === val);
                  setSelectedSubject(subj?.id || "");
                },
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
                    {filter.options.map((opt: any) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                            className="flex-shrink-0 bg-blue-500 text-white px-3 py-2 rounded-sm text-xs min-w-max shadow-sm"
                          >
                            <div className="font-medium">{cls.subjectName}</div>
                            <div className="text-indigo-100">
                              {cls.startTime}–{cls.endTime} | L
                              {cls.lectureNumber}
                            </div>
                            <div className="text-indigo-200 text-xs">
                              {cls.roomName}
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
                  Add Class - {currentDay}
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
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 cursor-pointer font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
