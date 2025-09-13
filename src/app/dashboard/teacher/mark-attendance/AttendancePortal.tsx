"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  ArrowUpDown,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Save,
  Edit,
  Check,
  X,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

const mockClassData: Record<string, ClassOption[]> = {
  "2025-09-08": [
    {
      id: "class-uuid-1",
      displayName: "Mathematics - Lec 5 - 101SOTBatch2025A",
    },
    { id: "class-uuid-2", displayName: "Physics - Lec 3 - 101SOTBatch2025B" },
    { id: "class-uuid-3", displayName: "Chemistry - Lab 2 - 101SOTBatch2025A" },
  ],
  "2025-09-09": [
    {
      id: "class-uuid-1",
      displayName: "Mathematics - Lec 6 - 101SOTBatch2025A",
    },
    {
      id: "class-uuid-4",
      displayName: "Computer Science - Lec 1 - 101SOTBatch2025B",
    },
  ],
  "2025-09-10": [
    { id: "class-uuid-2", displayName: "Physics - Lec 4 - 101SOTBatch2025B" },
    { id: "class-uuid-3", displayName: "Chemistry - Lab 3 - 101SOTBatch2025A" },
  ],
  "2025-09-11": [
    {
      id: "class-uuid-1",
      displayName: "Mathematics - Lec 7 - 101SOTBatch2025A",
    },
    {
      id: "class-uuid-4",
      displayName: "Computer Science - Lec 2 - 101SOTBatch2025B",
    },
  ],
  "2025-09-12": [
    { id: "class-uuid-2", displayName: "Physics - Lec 5 - 101SOTBatch2025B" },
    { id: "class-uuid-3", displayName: "Chemistry - Lab 4 - 101SOTBatch2025A" },
  ],
};

const mockStudentData: Record<string, BaseStudentAttendance[]> = {
  "2025-09-08": [
    {
      student_id: "student-uuid-1",
      name: "John Doe",
      enrollment_id: "2025SOT001",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-2",
      name: "Jane Smith",
      enrollment_id: "2025SOT002",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "ABSENT"],
    },
    {
      student_id: "student-uuid-3",
      name: "Robert Johnson",
      enrollment_id: "2025SOT003",
      lastThreeDaysStatus: ["ABSENT", "PRESENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-4",
      name: "Emily Davis",
      enrollment_id: "2025SOT004",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-5",
      name: "Michael Wilson",
      enrollment_id: "2025SOT005",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "PRESENT"],
    },
  ],
  "2025-09-09": [
    {
      student_id: "student-uuid-1",
      name: "John Doe",
      enrollment_id: "2025SOT001",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-2",
      name: "Jane Smith",
      enrollment_id: "2025SOT002",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "ABSENT"],
    },
    {
      student_id: "student-uuid-3",
      name: "Robert Johnson",
      enrollment_id: "2025SOT003",
      lastThreeDaysStatus: ["ABSENT", "PRESENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-4",
      name: "Emily Davis",
      enrollment_id: "2025SOT004",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-5",
      name: "Michael Wilson",
      enrollment_id: "2025SOT005",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "PRESENT"],
    },
  ],
  "2025-09-10": [
    {
      student_id: "student-uuid-1",
      name: "John Doe",
      enrollment_id: "2025SOT001",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-2",
      name: "Jane Smith",
      enrollment_id: "2025SOT002",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "ABSENT"],
    },
    {
      student_id: "student-uuid-3",
      name: "Robert Johnson",
      enrollment_id: "2025SOT003",
      lastThreeDaysStatus: ["ABSENT", "PRESENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-4",
      name: "Emily Davis",
      enrollment_id: "2025SOT004",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-5",
      name: "Michael Wilson",
      enrollment_id: "2025SOT005",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "PRESENT"],
    },
  ],
  "2025-09-11": [
    {
      student_id: "student-uuid-1",
      name: "John Doe",
      enrollment_id: "2025SOT001",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-2",
      name: "Jane Smith",
      enrollment_id: "2025SOT002",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "ABSENT"],
    },
    {
      student_id: "student-uuid-3",
      name: "Robert Johnson",
      enrollment_id: "2025SOT003",
      lastThreeDaysStatus: ["ABSENT", "PRESENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-4",
      name: "Emily Davis",
      enrollment_id: "2025SOT004",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-5",
      name: "Michael Wilson",
      enrollment_id: "2025SOT005",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "PRESENT"],
    },
  ],
  "2025-09-12": [
    {
      student_id: "student-uuid-1",
      name: "John Doe",
      enrollment_id: "2025SOT001",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-2",
      name: "Jane Smith",
      enrollment_id: "2025SOT002",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "ABSENT"],
    },
    {
      student_id: "student-uuid-3",
      name: "Robert Johnson",
      enrollment_id: "2025SOT003",
      lastThreeDaysStatus: ["ABSENT", "PRESENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-4",
      name: "Emily Davis",
      enrollment_id: "2025SOT004",
      lastThreeDaysStatus: ["PRESENT", "ABSENT", "PRESENT"],
    },
    {
      student_id: "student-uuid-5",
      name: "Michael Wilson",
      enrollment_id: "2025SOT005",
      lastThreeDaysStatus: ["PRESENT", "PRESENT", "PRESENT"],
    },
  ],
};

interface ClassOption {
  id: string;
  displayName: string;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "";

interface BaseStudentAttendance {
  student_id: string;
  name: string;
  enrollment_id: string;
  lastThreeDaysStatus: ("PRESENT" | "ABSENT")[];
}

interface StudentAttendance extends BaseStudentAttendance {
  statuses: Record<string, AttendanceStatus>;
}

interface AttendanceData {
  success: boolean;
  data: StudentAttendance[];
}

const getCurrentWeekDates = (): { date: string; day: string }[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + 1);
  const weekDates: { date: string; day: string }[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    weekDates.push({
      date: dateString,
      day: dayNames[i],
    });
  }
  return weekDates;
};

const AttendancePortal: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [originalData, setOriginalData] = useState<StudentAttendance[] | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<string>("enrollment_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  const weekDates = getCurrentWeekDates();

  const getClassOptionsForDate = (date: string): ClassOption[] => {
    return mockClassData[date] || [];
  };

  const getAttendanceDataForDateAndClasses = (
    date: string,
    classIds: string[]
  ): StudentAttendance[] => {
    if (!mockStudentData[date]) return [];

    return mockStudentData[date].map((student) => ({
      ...student,
      statuses: classIds.reduce((acc, classId) => {
        acc[classId] = "";
        return acc;
      }, {} as Record<string, AttendanceStatus>),
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedClasses([]);
    setAttendanceData(null);
    setError(null);
    setSearchTerm("");
    setSortField("enrollment_id");
    setSortDirection("asc");
    setIsEditing(false);
  };

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
    setIsEditing(false);
  };

  useEffect(() => {
    if (selectedDate && selectedClasses.length > 0) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          const data = getAttendanceDataForDateAndClasses(
            selectedDate,
            selectedClasses
          );
          setAttendanceData({ success: true, data });
          setOriginalData([...data]);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to load attendance data");
          setIsLoading(false);
        }
      }, 800);
    } else {
      setAttendanceData(null);
      setOriginalData(null);
    }
  }, [selectedDate, selectedClasses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedAndFilteredData = () => {
    if (!attendanceData?.data) return [];
    let filtered = attendanceData.data.filter(
      (student) =>
        student.enrollment_id.toLowerCase().includes(searchTerm) ||
        student.name.toLowerCase().includes(searchTerm)
    );
    return [...filtered].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortField === "enrollment_id") {
        aVal = a.enrollment_id;
        bVal = b.enrollment_id;
      } else if (sortField === "name") {
        aVal = a.name;
        bVal = b.name;
      } else {
        aVal = "";
        bVal = "";
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const updateStudentStatus = (
    studentId: string,
    classId: string,
    status: AttendanceStatus
  ) => {
    if (!attendanceData) return;
    const updatedData = attendanceData.data.map((student) => {
      if (student.student_id === studentId) {
        return {
          ...student,
          statuses: {
            ...student.statuses,
            [classId]: status,
          },
        };
      }
      return student;
    });
    setAttendanceData({ ...attendanceData, data: updatedData });
  };

  const handleBulkAction = (action: "present" | "absent" | "late") => {
    if (!attendanceData || !selectedClasses.length) return;
    const statusMap: Record<string, AttendanceStatus> = {
      present: "PRESENT",
      absent: "ABSENT",
      late: "LATE",
    };
    const updatedData = attendanceData.data.map((student) => ({
      ...student,
      statuses: {
        ...student.statuses,
        ...selectedClasses.reduce((acc, classId) => {
          acc[classId] = statusMap[action];
          return acc;
        }, {} as Record<string, AttendanceStatus>),
      },
    }));
    setAttendanceData({ ...attendanceData, data: updatedData });
    setShowBulkActions(false);
  };

  const hasChanges = () => {
    if (!attendanceData || !originalData) return false;
    return attendanceData.data.some((student) => {
      const originalStudent = originalData.find(
        (os) => os.student_id === student.student_id
      );
      if (!originalStudent) return false;
      return Object.keys(student.statuses).some(
        (classId) =>
          student.statuses[classId] !==
          (originalStudent.statuses[classId] || "")
      );
    });
  };

  const saveChanges = () => {
    if (!attendanceData || !originalData) return;

    if (!hasChanges()) {
      alert("No changes to save!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setOriginalData([...attendanceData.data]);
      alert("Attendance saved successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const resetChanges = () => {
    if (originalData && attendanceData) {
      setAttendanceData({ ...attendanceData, data: [...originalData] });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && !attendanceData) {
      alert("Please select a date and class first.");
      return;
    }
  };

  const getClassDisplayNames = () => {
    if (!selectedClasses.length) return [];
    const classMap: Record<string, string> = {};
    weekDates.forEach((date) => {
      if (mockClassData[date.date]) {
        mockClassData[date.date].forEach((cls) => {
          classMap[cls.id] = cls.displayName;
        });
      }
    });
    return selectedClasses.map((classId) => classMap[classId] || classId);
  };

  const renderLastThreeDaysStatus = (
    lastThreeDaysStatus: ("PRESENT" | "ABSENT")[]
  ) => {
    return (
      <div className="flex gap-1 justify-center">
        {lastThreeDaysStatus.slice(-3).map((status, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              status === "PRESENT" ? "bg-green-500" : "bg-red-500"
            }`}
            title={status}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: AttendanceStatus) => {
    if (status === "PRESENT")
      return "bg-green-100 text-green-800 border-green-300";
    if (status === "ABSENT") return "bg-red-100 text-red-800 border-red-300";
    if (status === "LATE")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#12294c] rounded-sm shadow-lg border border-gray-400 mb-6 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Attendance Portal
          </h1>
          <p className="text-blue-100">
            Mark and manage student attendance for your classes
          </p>
        </div>

        {/* Date and Class Selection */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Date and Class
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#12294c] focus:border-transparent appearance-none bg-white cursor-pointer text-sm"
                  disabled={isLoading}
                >
                  <option value="">Select a date</option>
                  {weekDates.map(({ date, day }) => (
                    <option key={date} value={date}>
                      {day},{" "}
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected:{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Class Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Select Class(es)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {selectedDate ? (
                  getClassOptionsForDate(selectedDate).length > 0 ? (
                    getClassOptionsForDate(selectedDate).map((classOption) => (
                      <div key={classOption.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={classOption.id}
                          checked={selectedClasses.includes(classOption.id)}
                          onChange={() => handleClassToggle(classOption.id)}
                          className="h-4 w-4 text-[#12294c] border-gray-300 rounded focus:ring-[#12294c] cursor-pointer"
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={classOption.id}
                          className="ml-2 block text-sm text-gray-700 cursor-pointer"
                        >
                          {classOption.displayName}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No classes found for this date
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Select a date to see classes
                  </p>
                )}
              </div>
              {selectedClasses.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-sm border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    {selectedClasses.length} class
                    {selectedClasses.length !== 1 ? "es" : ""} selected:
                  </p>
                  <ul className="mt-1 text-sm text-blue-700">
                    {getClassOptionsForDate(selectedDate)
                      .filter((cls) => selectedClasses.includes(cls.id))
                      .map((cls) => (
                        <li key={cls.id}>{cls.displayName}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Action Buttons */}
        {selectedDate && selectedClasses.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Edit Mode and Save/Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleEditMode}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isEditing
                    ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                    : "bg-[#12294c] text-white hover:bg-[#0f1e38] border border-[#12294c]"
                }`}
                disabled={isLoading}
              >
                {isEditing ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Edit className="w-4 h-4" />
                )}
                {isEditing ? "Exit Edit" : "Edit"}
              </button>

              {/* Save and Reset buttons - only show in edit mode */}
              {isEditing && (
                <>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    disabled={isLoading || !hasChanges()}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={resetChanges}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    disabled={isLoading || !hasChanges()}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </>
              )}
            </div>

            {/* Search and Bulk Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#12294c] focus:border-transparent text-sm cursor-text"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  disabled={isLoading || !isEditing}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  Bulk
                </button>
                {showBulkActions && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-10 min-w-48">
                    <div className="py-1">
                      <button
                        onClick={() => handleBulkAction("present")}
                        className="flex items-center w-full px-3 py-2 text-left text-green-700 hover:bg-green-50 cursor-pointer text-sm rounded"
                        disabled={isLoading}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Mark All Present
                      </button>
                      <button
                        onClick={() => handleBulkAction("absent")}
                        className="flex items-center w-full px-3 py-2 text-left text-red-700 hover:bg-red-50 cursor-pointer text-sm rounded"
                        disabled={isLoading}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Mark All Absent
                      </button>
                      <button
                        onClick={() => handleBulkAction("late")}
                        className="flex items-center w-full px-3 py-2 text-left text-yellow-700 hover:bg-yellow-50 cursor-pointer text-sm rounded"
                        disabled={isLoading}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Mark All Late
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-sm shadow-lg border border-gray-400 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12294c] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !selectedDate && !error && (
          <div className="text-center py-12 bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#12294c]" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Select a Date
            </h3>
            <p className="text-gray-500">
              Choose a date from the current week to view and mark attendance.
            </p>
          </div>
        )}

        {!isLoading &&
          selectedDate &&
          selectedClasses.length === 0 &&
          !error && (
            <div className="text-center py-12 bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#12294c]" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select at Least One Class
              </h3>
              <p className="text-gray-500">
                Choose one or more classes to mark attendance for.
              </p>
            </div>
          )}

        {/* Attendance Table */}
        {!isLoading &&
          selectedDate &&
          selectedClasses.length > 0 &&
          attendanceData && (
            <div className="bg-white rounded-sm shadow-lg border border-gray-400 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attendance for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedClasses.length} class
                  {selectedClasses.length !== 1 ? "es" : ""}:{" "}
                  {getClassDisplayNames().join(", ")}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">
                        <button
                          onClick={() => handleSort("enrollment_id")}
                          className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                        >
                          Enrollment ID <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-6 font-medium text-gray-700">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                        >
                          Name <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      {/* Class Status Columns */}
                      {selectedClasses.map((classId) => (
                        <th
                          key={classId}
                          className="text-center py-3 px-6 font-medium text-gray-700"
                        >
                          {getClassOptionsForDate(selectedDate).find(
                            (cls) => cls.id === classId
                          )?.displayName || classId}
                        </th>
                      ))}
                      {/* Last Three Days Status */}
                      <th className="text-center py-3 px-6 font-medium text-gray-700">
                        Last 3 Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedAndFilteredData().map((student) => (
                      <tr
                        key={student.student_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-6 font-medium text-gray-900">
                          {student.enrollment_id}
                        </td>
                        <td className="py-3 px-6 text-gray-600">
                          {student.name}
                        </td>
                        {/* Class Status Columns */}
                        {selectedClasses.map((classId) => (
                          <td
                            key={`${student.student_id}-${classId}`}
                            className="py-3 px-6 text-center"
                          >
                            {isEditing ? (
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    const currentStatus =
                                      student.statuses[classId] || "";
                                    let nextStatus: AttendanceStatus;
                                    if (currentStatus === "") {
                                      nextStatus = "PRESENT";
                                    } else if (currentStatus === "PRESENT") {
                                      nextStatus = "ABSENT";
                                    } else if (currentStatus === "ABSENT") {
                                      nextStatus = "LATE";
                                    } else {
                                      nextStatus = "";
                                    }
                                    updateStudentStatus(
                                      student.student_id,
                                      classId,
                                      nextStatus
                                    );
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-colors border-2 cursor-pointer ${
                                    student.statuses[classId] === "PRESENT"
                                      ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                                      : student.statuses[classId] === "ABSENT"
                                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                                      : student.statuses[classId] === "LATE"
                                      ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                                      : "bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200"
                                  }`}
                                >
                                  {student.statuses[classId] === "PRESENT" ? (
                                    <Check className="w-4 h-4" />
                                  ) : student.statuses[classId] === "ABSENT" ? (
                                    <X className="w-4 h-4" />
                                  ) : student.statuses[classId] === "LATE" ? (
                                    <Clock className="w-4 h-4" />
                                  ) : (
                                    ""
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  student.statuses[classId] || ""
                                )}`}
                              >
                                {student.statuses[classId] || ""}
                              </span>
                            )}
                          </td>
                        ))}
                        {/* Last Three Days Status */}
                        <td className="py-3 px-6 text-center">
                          {renderLastThreeDaysStatus(
                            student.lastThreeDaysStatus
                          )}
                        </td>
                      </tr>
                    ))}
                    {getSortedAndFilteredData().length === 0 && (
                      <tr>
                        <td
                          colSpan={selectedClasses.length + 3}
                          className="py-8 text-center text-gray-500"
                        >
                          No students found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Attendance Portal v1.0 • Select a date and class to begin marking
            attendance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendancePortal;
