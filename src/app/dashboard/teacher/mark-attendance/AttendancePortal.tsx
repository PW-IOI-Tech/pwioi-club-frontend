"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  UserCheck,
  UserX,
  AlertCircle,
  Save,
  Edit,
  X,
  RefreshCw,
  MoreHorizontal,
  ArrowUpDown,
  Check,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClassOption {
  id: string;
  displayName: string;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "";

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

const getLastThreeWeekdays = (): { date: string; day: string }[] => {
  const today = new Date();
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDate = new Date(today);
  let count = 0;

  // Go back day by day until we find 3 weekdays
  while (count < 3) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Only include weekdays (Monday = 1, Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateString = currentDate.toISOString().split("T")[0];
      days.unshift({
        date: dateString,
        day: dayNames[dayOfWeek],
      });
      count++;
    }

    // Move to the previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return days;
};

const handleApiError = (err: any, fallbackMessage: string) => {
  const message =
    err?.response?.data?.message || err?.message || fallbackMessage;
  toast.error(message);
};

const AttendancePortal: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [originalData, setOriginalData] = useState<StudentAttendance[] | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"enrollment_id" | "name">(
    "enrollment_id"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const lastThreeWeekdays = getLastThreeWeekdays();

  // Set today as default selected date if it's a weekday and enable editing by default
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

      // Only set today as default if it's a weekday
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const todayString = today.toISOString().split("T")[0];
        setSelectedDate(todayString);
        setIsEditing(true); // Enable editing by default for today
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) {
      setClassOptions([]);
      return;
    }
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/attendance/classes`,
          {
            params: { date: selectedDate },
            withCredentials: true,
          }
        );
        setClassOptions(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load classes");
        setClassOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || selectedClasses.length === 0) {
      setAttendanceData(null);
      setOriginalData(null);
      return;
    }
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/attendance/students`,
          {
            params: { classIds: selectedClasses.join(",") },
            withCredentials: true,
          }
        );
        setAttendanceData(res.data);
        setOriginalData([...res.data.data]);
      } catch (err) {
        toast.error("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedDate, selectedClasses]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedClasses([]);
    setAttendanceData(null);
    setError(null);
    setSearchTerm("");
    setSortField("enrollment_id");
    setSortDirection("asc");

    // Enable editing by default only if the selected date is today
    const today = new Date().toISOString().split("T")[0];
    setIsEditing(date === today);
  };

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
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

  const saveChanges = async () => {
    if (!attendanceData || !hasChanges()) {
      toast.info("No changes to save!");
      return;
    }
    try {
      setIsLoading(true);
      const payload = attendanceData.data.flatMap((student) =>
        Object.entries(student.statuses).map(([class_id, status]) => ({
          student_id: student.student_id,
          class_id,
          status: status, // Removed LATE conversion
        }))
      );

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/attendance`,
        payload,
        { withCredentials: true }
      );
      setOriginalData([...attendanceData.data]);
      setIsEditing(false); // Exit edit mode after successful save
      toast.success("Attendance saved successfully!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save attendance"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetChanges = () => {
    if (originalData && attendanceData) {
      setAttendanceData({ ...attendanceData, data: [...originalData] });
    }
  };

  const toggleEditMode = () => {
    if (!attendanceData) {
      toast.warning("Please select a date and class first.");
      return;
    }
    setIsEditing(!isEditing);
  };

  const getClassDisplayNames = () => {
    return selectedClasses
      .map((classId) => {
        const cls = classOptions.find((c) => c.id === classId);
        return cls ? cls.displayName : classId;
      })
      .filter(Boolean);
  };

  const renderLastThreeDaysStatus = (
    lastThreeDaysStatus?: ("PRESENT" | "ABSENT")[]
  ) => {
    if (
      !Array.isArray(lastThreeDaysStatus) ||
      lastThreeDaysStatus.length === 0
    ) {
      return (
        <div className="flex gap-1 justify-center text-gray-400 text-xs">
          N/A
        </div>
      );
    }

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
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: "enrollment_id" | "name") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedAndFilteredData = () => {
    if (!attendanceData) return [];
    let data = [...attendanceData.data];
    if (searchTerm.trim()) {
      data = data.filter(
        (s) =>
          s.enrollment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    data.sort((a, b) => {
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  };

  const updateStudentStatus = (
    studentId: string,
    classId: string,
    newStatus: AttendanceStatus
  ) => {
    if (!attendanceData) return;

    const today = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === today;
    const multipleClassesSelected = selectedClasses.length > 1;

    setAttendanceData({
      ...attendanceData,
      data: attendanceData.data.map((student) =>
        student.student_id === studentId
          ? {
              ...student,
              statuses:
                isToday && multipleClassesSelected
                  ? // If it's today and multiple classes are selected, update all selected classes
                    selectedClasses.reduce(
                      (acc, cId) => ({ ...acc, [cId]: newStatus }),
                      student.statuses
                    )
                  : // Otherwise, update only the specific class
                    { ...student.statuses, [classId]: newStatus },
            }
          : student
      ),
    });
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    if (!attendanceData) return;
    setAttendanceData({
      ...attendanceData,
      data: attendanceData.data.map((student) => ({
        ...student,
        statuses: selectedClasses.reduce(
          (acc, classId) => ({ ...acc, [classId]: status }),
          student.statuses
        ),
      })),
    });
    setShowBulkActions(false);
  };

  return (
    <div className="min-h-screen p-4">
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
                  {lastThreeWeekdays.map(({ date, day }) => (
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
            </div>

            {/* Class Selection */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Select Class(es)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {selectedDate ? (
                  classOptions.length > 0 ? (
                    classOptions.map((classOption) => (
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
                    <p className="text-sm text-gray-500">
                      No classes found for this date
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a date to see classes
                  </p>
                )}
              </div>
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
                        onClick={() => handleBulkAction("PRESENT")}
                        className="flex items-center w-full px-3 py-2 text-left text-green-700 hover:bg-green-50 cursor-pointer text-sm rounded"
                        disabled={isLoading}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Mark All Present
                      </button>
                      <button
                        onClick={() => handleBulkAction("ABSENT")}
                        className="flex items-center w-full px-3 py-2 text-left text-red-700 hover:bg-red-50 cursor-pointer text-sm rounded"
                        disabled={isLoading}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Mark All Absent
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
              Choose a date from the last 3 weekdays to view and mark
              attendance.
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
                          {classOptions.find((cls) => cls.id === classId)
                            ?.displayName || classId}
                        </th>
                      ))}
                      {/* Last Three Days Status */}
                      <th className="text-center py-3 px-6 font-medium text-gray-700">
                        Last 3 Weekdays
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
                                      student.statuses[classId] || "ABSENT";
                                    const nextStatus =
                                      currentStatus === "PRESENT"
                                        ? "ABSENT"
                                        : "PRESENT";
                                    updateStudentStatus(
                                      student.student_id,
                                      classId,
                                      nextStatus
                                    );
                                  }}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                                    student.statuses[classId] === "PRESENT"
                                      ? "bg-green-500 border-green-500 hover:bg-green-600"
                                      : "bg-red-500 border-red-500 hover:bg-red-600"
                                  }`}
                                >
                                  {student.statuses[classId] === "PRESENT" && (
                                    <Check className="w-4 h-4 text-white" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  student.statuses[classId] || "ABSENT"
                                )}`}
                              >
                                {student.statuses[classId] || "ABSENT"}
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
