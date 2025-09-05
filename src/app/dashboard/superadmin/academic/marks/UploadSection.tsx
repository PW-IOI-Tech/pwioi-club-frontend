"use client";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Download,
  X,
  Loader2,
  Copy,
  Users,
  ChevronDown,
} from "lucide-react";
import SchemaHelpModal from "./SchemaHelpModal";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TeachingDetailsResponse {
  success: boolean;
  teacher: {
    id: string;
    name: string;
    email: string;
    designation: string;
  };
  centers: {
    id: string;
    name: string;
    schools: {
      id: string;
      name: string;
      batches: {
        id: string;
        name: string;
        divisions: {
          id: string;
          code: string;
          total_students: number;
          semesters: {
            id: string;
            number: number;
            start_date: string;
            end_date: string;
            is_current: boolean;
            subjects: {
              id: string;
              name: string;
              code: string;
              credits: number;
              exam_types: any;
              total_exam_types: number;
              total_exams: number;
            }[];
            total_subjects: number;
          }[];
          total_semesters: number;
        }[];
        total_divisions: number;
      }[];
      total_batches: number;
    }[];
    total_schools: number;
  }[];
  summary: {
    total_centers: number;
    total_schools: number;
    total_batches: number;
    total_divisions: number;
    total_semesters: number;
    total_subjects: number;
    total_exams: number;
    exam_type_breakdown: Record<string, number>;
  };
}

interface UploadSectionProps {
  onSuccess?: () => void;
  uploadUrl?: string;
}

interface Student {
  enrollment_id: string;
  name: string;
}

export default function UploadSection({}: UploadSectionProps) {
  const [teachingDetails, setTeachingDetails] =
    useState<TeachingDetailsResponse | null>(null);
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [examType, setExamType] = useState<any[]>([]);
  const [examName, setExamName] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [showStudents, setShowStudents] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error" | "404error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedSubject) return;

    setLoadingExams(true);

    const fetchExams = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/subject/${selectedSubject}`,
          { withCredentials: true }
        );

        const exams = res.data?.data?.exams || [];

        // Distinct exam types
        const types = Array.from(
          new Set(exams.map((e: any) => e.exam_type))
        ).map((t) => ({
          value: t,
          label: t,
        }));

        // All exam names with ids
        const names = exams.map((e: any) => ({
          value: e.id,
          label: e.name,
          type: e.exam_type,
        }));

        setExamType(types);
        setExamName(names);
      } catch (error) {
        console.error("Failed to fetch exams", error);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [selectedSubject]);

  const canGetStudents =
    selectedCenter &&
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester &&
    selectedSubject;

  const handleGetStudents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/${selectedSubject}/students`,
        {
          withCredentials: true,
        }
      );
      setStudents(response?.data?.data || []);
      setShowStudents(true);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const copyStudentsToClipboard = () => {
    const rows = students
      .map((student) => `${student.enrollment_id}\t${student.name}\t\t\t`)
      .join("\n");

    navigator.clipboard.writeText(rows).then(() => {
      alert("Student list copied to clipboard! You can paste it into Excel.");
    });
  };

  useEffect(() => {
    if (uploadStatus === "success") {
      const timer = setTimeout(() => {
        resetToInitialState();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const resetToInitialState = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const isValidType = validTypes.some(
        (type) =>
          file.type === type ||
          file.name.toLowerCase().endsWith(".xls") ||
          file.name.toLowerCase().endsWith(".xlsx")
      );

      if (!isValidType) {
        setUploadStatus("error");
        setErrorMessage("Please upload only XLS or XLSX files");
        setUploadedFile(null);
        return;
      }

      const fileSizeLimit = 10 * 1024 * 1024; // 10MB
      if (file.size > fileSizeLimit) {
        setUploadStatus("error");
        setErrorMessage("File size exceeds 10MB limit");
        setUploadedFile(null);
        return;
      }

      setUploadedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const removeFile = () => {
    resetToInitialState();
  };

  const uploadFile = async () => {
    if (!uploadedFile) return;

    setUploadStatus("uploading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("marksFile", uploadedFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${selectedExamName}/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("File uploaded successfully!");
      setUploadStatus("success");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "File upload failed.");
      setUploadStatus("error");
    }
  };

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/spreadsheets/d/191Wi1JZmc46qws23oamUCcXHUE27yPCNtvDviDyATwE/export?format=xlsx";
    link.download = "sample_test_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#12294c] rounded-sm shadow-lg border border-gray-200 p-4 mb-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Upload Test Data
                </h1>
                <p className="text-md text-gray-200">
                  Upload and manage student exam data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSchemaHelp(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer bg-white/10 duration-200 ease-in-out shadow-md w-full sm:w-auto text-sm sm:text-base backdrop-blur-sm"
            >
              <HelpCircle size={20} />
              Schema Help
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Exam Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 mb-4 text-sm">
            {/* Center */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Center
              </label>
              <div className="relative">
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Center</option>
                  {centers.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                  }}
                  disabled={!selectedCenter}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select School</option>
                  {schools?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedCenter ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Batch */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                  }}
                  disabled={!selectedSchool}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Batch</option>
                  {batches?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSchool ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Division */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                  }}
                  disabled={!selectedBatch}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Division</option>
                  {divisions?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.code}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedBatch ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                  }}
                  disabled={!selectedDivision}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {semesters?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.number}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedDivision ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                  }}
                  disabled={!selectedSemester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Subject</option>
                  {subjects?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSemester ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Exam Type */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={selectedExamType}
                  onChange={(e) => {
                    setSelectedExamType(e.target.value);
                  }}
                  disabled={!selectedSubject}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Exam Type</option>
                  {examType?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedSubject ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam Name
              </label>
              <div className="relative">
                <select
                  value={selectedExamName}
                  onChange={(e) => setSelectedExamName(e.target.value)}
                  disabled={!selectedExamType}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Exam Name</option>
                  {examName?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !selectedExamType ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleGetStudents}
              disabled={!canGetStudents}
              className="flex items-center gap-2 px-6 py-2 bg-[#12294c] text-white rounded-sm transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer group"
            >
              <Users size={16} className="group-hover:scale-110" />
              Get Students List
            </button>
          </div>
        </div>

        {showStudents && (
          <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Students List
              </h3>
              <button
                onClick={copyStudentsToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white rounded-sm transition-transform cursor-pointer duration-200 ease-in-out group"
              >
                <Copy size={16} className="group-hover:scale-110" />
                Copy for Excel
              </button>
            </div>
            <div className="border border-gray-300 rounded-sm overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Enrollment ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Student Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student?.enrollment_id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {student?.enrollment_id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {student?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total Students: {students.length} • You can get a sample sheet
              from Schema Help at Top Right
            </p>
          </div>
        )}

        <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload Excel File
          </h3>
          <div
            className={`relative border-2 border-dashed rounded-md p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 mb-6 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : uploadStatus === "error" || uploadStatus === "404error"
                ? "border-red-300 bg-red-50"
                : uploadStatus === "success"
                ? "border-green-300 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploadStatus === "success" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Upload Successful!
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {successMessage}
                  </p>
                </div>
              </div>
            ) : uploadStatus === "uploading" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="text-[#1B3A6A] animate-spin" size={40} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Uploading Data...
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Please wait while we process your file
                </p>
              </div>
            ) : uploadedFile && uploadStatus === "idle" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    File Ready
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={20} />
                      <span className="text-sm sm:text-base break-all">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <span className="text-sm">
                      ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={removeFile}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-[#1B3A6A] border border-[#1B3A6A] rounded-sm hover:bg-red-200 transition-colors z-10 cursor-pointer"
                    >
                      <X size={16} />
                      Remove
                    </button>
                    <button
                      onClick={uploadFile}
                      className="px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors font-medium z-10 cursor-pointer"
                    >
                      Upload Data
                    </button>
                  </div>
                </div>
              </div>
            ) : uploadStatus === "error" || uploadStatus === "404error" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    {uploadStatus === "404error"
                      ? "Please Upload Data in Correct Schema"
                      : "Upload Failed"}
                  </h3>
                  <p className="text-red-600 mb-4 text-sm sm:text-base break-words">
                    {errorMessage}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={resetToInitialState}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors z-10 cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Upload
                    className={`${
                      dragActive ? "text-blue-500" : "text-gray-400"
                    }`}
                    size={40}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {dragActive ? "Drop your XLS file here" : "Upload XLS File"}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Drag and drop your XLS/XLSX file here, or{" "}
                    <span className="text-blue-600 font-medium">
                      tap to browse
                    </span>
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Supported formats: .xls, .xlsx • Max size: 10MB
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="w-12 h-12 bg-[#D4E3F5] rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="text-[#1B3A6A]" size={24} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                XLS/XLSX Only
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                We support Excel files in .xls and .xlsx formats
              </p>
            </div>

            <div
              onClick={downloadSampleFile}
              className="text-center p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 active:bg-gray-100"
            >
              <div className="w-12 h-12 bg-[#12294c] rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="text-white" size={24} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                Download Sample
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Tap here to see the excel file format
              </p>
            </div>

            <div className="text-center p-4 rounded-lg border border-gray-100 bg-gray-50 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#D4E3F5] rounded-lg flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="text-[#1B3A6A]" size={24} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                Need Help?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Tap Schema Help to see formatting guidelines
              </p>
            </div>
          </div>
        </div>
      </div>

      <SchemaHelpModal
        isOpen={showSchemaHelp}
        onClose={() => setShowSchemaHelp(false)}
      />
    </div>
  );
}
