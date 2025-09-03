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
  summary: {
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
  const [school, setSchool] = useState("");
  const [batch, setBatch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [examNumber, setExamNumber] = useState("");

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

  const getTeachingDetails = async () => {
    try {
      const response = await axios.get<TeachingDetailsResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/teaching-details`,
        { withCredentials: true }
      );
      setTeachingDetails(response.data);
    } catch (error) {
      console.error("Error fetching teaching details:", error);
    }
  };

  useEffect(() => {
    getTeachingDetails();
  }, []);

  const canGetStudents = school && batch && division && semester && subject;

  useEffect(() => {
    setBatch("");
    setDivision("");
    setSemester("");
    setSubject("");
    setShowStudents(false);
  }, [school]);

  useEffect(() => {
    setDivision("");
    setSemester("");
    setSubject("");
    setShowStudents(false);
  }, [batch]);

  useEffect(() => {
    setSemester("");
    setSubject("");
    setShowStudents(false);
  }, [division]);

  useEffect(() => {
    setSubject("");
    setShowStudents(false);
  }, [semester]);

  useEffect(() => {
    setShowStudents(false);
  }, [subject]);

  const handleGetStudents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/${subject}/students`,
        {
          withCredentials: true,
        }
      );
      setStudents(response?.data?.data);
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
      console.log(examNumber);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exams/${examNumber}/upload`,
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

  const schoolOptions =
    teachingDetails?.schools.map((s) => ({
      value: s.id,
      label: s.name,
    })) || [];

  const getBatchOptions = (schoolId: string) => {
    const school = teachingDetails?.schools.find((s) => s.id === schoolId);
    return (
      school?.batches.map((b) => ({
        value: b.id,
        label: b.name,
      })) || []
    );
  };

  const getDivisionOptions = (schoolId: string, batchId: string) => {
    const batch = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId);

    return (
      batch?.divisions.map((d) => ({
        value: d.id,
        label: d.code,
      })) || []
    );
  };

  const getSemesterOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string
  ) => {
    const division = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId)
      ?.divisions.find((d) => d.id === divisionId);

    return (
      division?.semesters.map((sem) => ({
        value: sem.id,
        label: `Semester ${sem.number}`,
      })) || []
    );
  };

  const getSubjectOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string
  ) => {
    const semester = teachingDetails?.schools
      .find((s) => s.id === schoolId)
      ?.batches.find((b) => b.id === batchId)
      ?.divisions.find((d) => d.id === divisionId)
      ?.semesters.find((sem) => sem.id === semesterId);

    return (
      semester?.subjects.map((subj) => ({
        value: subj.id,
        label: subj.name,
      })) || []
    );
  };

  const getExamTypeOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string,
    subjectId: string
  ) => {
    const subject = teachingDetails?.schools
      ?.find((s) => s.id === schoolId)
      ?.batches?.find((b) => b.id === batchId)
      ?.divisions?.find((d) => d.id === divisionId)
      ?.semesters?.find((sem) => sem.id === semesterId)
      ?.subjects?.find((sub) => sub.id === subjectId);

    return (
      subject?.exam_types?.map((et: any) => ({
        value: et.exam_type,
        label: et.exam_type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: any) => c.toUpperCase()),
      })) ?? []
    );
  };

  const getExamNumberOptions = (
    schoolId: string,
    batchId: string,
    divisionId: string,
    semesterId: string,
    subjectId: string,
    examType: string
  ) => {
    const examTypeObj = teachingDetails?.schools
      ?.find((s) => s.id === schoolId)
      ?.batches?.find((b) => b.id === batchId)
      ?.divisions?.find((d) => d.id === divisionId)
      ?.semesters?.find((sem) => sem.id === semesterId)
      ?.subjects?.find((sub) => sub.id === subjectId)
      ?.exam_types?.find((et: any) => et.exam_type === examType);

    return (
      examTypeObj?.exams?.map((exam: any) => ({
        value: exam.id,
        label: exam.name,
      })) || []
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-4 mb-6 py-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4 text-sm">
            {/* School */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
                  }}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select School</option>
                  {schoolOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
                  value={batch}
                  onChange={(e) => {
                    setBatch(e.target.value);
                  }}
                  disabled={!school}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Batch</option>
                  {getBatchOptions(school).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !school ? "text-gray-300" : "text-gray-400"
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
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                  }}
                  disabled={!batch}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Division</option>
                  {getDivisionOptions(school, batch).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !batch ? "text-gray-300" : "text-gray-400"
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
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                  }}
                  disabled={!division}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {getSemesterOptions(school, batch, division).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !division ? "text-gray-300" : "text-gray-400"
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
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                  }}
                  disabled={!semester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Subject</option>
                  {getSubjectOptions(school, batch, division, semester).map(
                    (option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !semester ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={examType}
                  onChange={(e) => {
                    setExamType(e.target.value);
                  }}
                  disabled={!subject}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Exam Type</option>
                  {getExamTypeOptions(
                    school,
                    batch,
                    division,
                    semester,
                    subject
                  ).map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !subject ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Exam Number */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Exam Number
              </label>
              <div className="relative">
                <select
                  value={examNumber}
                  onChange={(e) => setExamNumber(e.target.value)}
                  disabled={!examType}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Exam Number</option>
                  {getExamNumberOptions(
                    school,
                    batch,
                    division,
                    semester,
                    subject,
                    examType
                  ).map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !examType ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleGetStudents}
              disabled={!canGetStudents}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-sm transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer group"
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
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-3">
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
