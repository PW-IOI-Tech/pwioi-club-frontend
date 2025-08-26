"use client";
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
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import SchemaHelpModal from "./SchemaHelpModal";
import axios from "axios";

export default function CPRUploadSection() {
  const [centers, setCenters] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
const [cprData, setCprData] = useState<any | null>(null);
const [loadingCpr, setLoadingCpr] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [showCPRTable, setShowCPRTable] = useState(false);
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);

    const [cprList, setCprList] = useState<
    Array<{
      id: string;
      teacher: string;
      semester: number;
      subject: string;
      uploadedOn: string;
      status: "Approved" | "Pending" | "Rejected";
      file: string;
    }>
  >([]);


  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Fetch Centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCenters(
            res.data.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              location: c.location,
              code: c.code,
            }))
          );
        }
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to fetch centers");
      }
    };
    fetchCenters();
  }, []);

  // ✅ Fetch Schools when Center selected
  useEffect(() => {
    if (!selectedCenter) return;
    const fetchSchools = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/schools/${selectedCenter}`,
          { withCredentials: true }
        );
        setSchools(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch schools");
      }
    };
    fetchSchools();
  }, [selectedCenter]);

  // ✅ Fetch Batches when School selected
  useEffect(() => {
    if (!selectedSchool) return;
    const fetchBatches = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedSchool}`,
          { withCredentials: true }
        );
        setBatches(res.data?.data || []);
      } catch {
        console.error("Failed to fetch batches");
      }
    };
    fetchBatches();
  }, [selectedSchool]);

  // ✅ Fetch Divisions when Batch selected
  useEffect(() => {
    if (!selectedBatch) return;
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/division/by-batch/${selectedBatch}`,
          { withCredentials: true }
        );
        setDivisions(res.data?.data || []);
      } catch {
        console.error("Failed to fetch divisions");
      }
    };
    fetchDivisions();
  }, [selectedBatch]);

  // ✅ Fetch Semesters when Division selected
  useEffect(() => {
    if (!selectedDivision) return;
    const fetchSemesters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester/all/${selectedDivision}`,
          { withCredentials: true }
        );
        setSemesters(res.data?.data || []);
      } catch {
        console.error("Failed to fetch semesters");
      }
    };
    fetchSemesters();
  }, [selectedDivision]);

  // ✅ Fetch Subjects when Semester selected
  useEffect(() => {
    if (!selectedSemester) return;
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subjects/semesters/${selectedSemester}`,
          { withCredentials: true }
        );
        setSubjects(res.data?.data || []);
      } catch {
        console.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, [selectedSemester]);

  const fetchCPR = async () => {
  if (!selectedSubject) return;
  setLoadingCpr(true);
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/subject/${selectedSubject}`,
      { withCredentials: true }
    );
    if (res.data.success) {
      setCprData(res.data.data);
    }
  } catch (err: any) {
    console.error(err.response?.data?.message || "Failed to fetch CPR");
  } finally {
    setLoadingCpr(false);
  }
};


const canShowViewButton = selectedCenter &&
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester &&
    selectedSubject

  const canUpload =
  selectedCenter &&
    selectedSchool &&
    selectedBatch &&
    selectedDivision &&
    selectedSemester &&
    selectedSubject &&
    uploadedFile;

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
    if (!files || !files[0]) return;

    const file = files[0];

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isValidType =
      validTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".xls") ||
      file.name.toLowerCase().endsWith(".xlsx");

    if (!isValidType) {
      setUploadStatus("error");
      setErrorMessage("Please upload only XLS or XLSX files.");
      setUploadedFile(null);
      return;
    }

    const fileSizeLimit = 10 * 1024 * 1024;
    if (file.size > fileSizeLimit) {
      setUploadStatus("error");
      setErrorMessage("File size exceeds 10MB limit.");
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

const uploadFile = async () => {
  if (!canUpload) return;

  setUploadStatus("uploading");
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const formData = new FormData();
    formData.append("file", uploadedFile!);
    formData.append("subject_id", selectedSubject); // ✅ send subject_id to backend

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cpr/upload`,
      formData,
      {
        withCredentials: true, // so JWT cookie goes along
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.success) {
      setSuccessMessage(res.data.message || "Upload successful!");
      setUploadStatus("success");

      const newCPR = {
        id: Date.now().toString(),
        teacher: "You (Admin)",
        semester: Number(selectedSemester),
        subject: subjects.find((s) => s.id === selectedSubject)?.name || selectedSubject,
        uploadedOn: new Date().toISOString().split("T")[0],
        status: "Pending" as const,
        file: uploadedFile?.name || "uploaded_cpr.xlsx",
      };
      setCprList((prev) => [newCPR, ...prev]);
    } else {
      throw new Error(res.data.message || "Upload failed.");
    }
  } catch (err: any) {
    setUploadStatus("error");
    setErrorMessage(err.response?.data?.message || err.message || "Upload failed.");
  }
};


  const resetUpload = () => {
    setUploadStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/spreadsheets/d/191Wi1JZmc46qws23oamUCcXHUE27yPCNtvDviDyATwE/export?format=xlsx";
    link.download = "sample_cpr_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (uploadStatus === "success") {
      const timer = setTimeout(resetUpload, 1500);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-4 mb-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white">Upload CPR</h1>
                <p className="text-md text-gray-200">
                  Upload and manage Content Progress Reports
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
            Select CPR Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 text-sm">
            {/* Center */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Center
              </label>
              <div className="relative">
                <select
                  value={selectedCenter}
                  onChange={(e) => {
                    setSelectedCenter(e.target.value);
                    setSelectedSchool("");
                    setSelectedBatch("");
                    setSelectedDivision("");
                    setSelectedSemester("");
                    setSelectedSubject("");
                  }}
                  className="w-full px-3 py-2 pr-10 border rounded-sm"
                >
                  <option value="">Select Center</option>
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.location || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <select
                value={selectedSchool}
                disabled={!selectedCenter}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setSelectedBatch("");
                  setSelectedDivision("");
                  setSelectedSemester("");
                  setSelectedSubject("");
                }}
                className="w-full px-3 py-2 border rounded-sm"
              >
                <option value="">Select School</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <select
                value={selectedBatch}
                disabled={!selectedSchool}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedDivision("");
                  setSelectedSemester("");
                  setSelectedSubject("");
                }}
                className="w-full px-3 py-2 border rounded-sm"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Division
              </label>
              <select
                value={selectedDivision}
                disabled={!selectedBatch}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedSemester("");
                  setSelectedSubject("");
                }}
                className="w-full px-3 py-2 border rounded-sm"
              >
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                disabled={!selectedDivision}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedSubject("");
                }}
                className="w-full px-3 py-2 border rounded-sm"
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                disabled={!selectedSemester}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {canShowViewButton && (
  <button
    onClick={() => {
      setShowCPRTable(true);
      fetchCPR();
    }}
    className="px-6 py-2 bg-slate-900 text-white rounded-sm flex items-center gap-2"
  >
    <ClipboardList size={16} /> View CPR Table
  </button>
)}

        </div>

        {showCPRTable && (
          <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              CPR Records 
            </h3>

           <div className="border border-gray-300 rounded-sm overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left">Subject</th>
        <th className="px-4 py-2 text-left">Code</th>
        <th className="px-4 py-2 text-left">Modules</th>
        <th className="px-4 py-2 text-left">Topics</th>
        <th className="px-4 py-2 text-left">Subtopics</th>
        <th className="px-4 py-2 text-left">Completion %</th>
      </tr>
    </thead>
    <tbody>
      {cprData ? (
        <tr className="border-t border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-2">{cprData.subject?.name}</td>
          <td className="px-4 py-2">{cprData.subject?.code}</td>
          <td className="px-4 py-2">{cprData.summary?.total_modules}</td>
          <td className="px-4 py-2">{cprData.summary?.total_topics}</td>
          <td className="px-4 py-2">{cprData.summary?.total_sub_topics}</td>
          <td className="px-4 py-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                cprData.summary?.completion_percentage === 100
                  ? "bg-green-100 text-green-800"
                  : cprData.summary?.completion_percentage > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {cprData.summary?.completion_percentage}%
            </span>
          </td>
        </tr>
      ) : (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-6 text-center text-gray-500"
          >
            No CPR found for selected subject.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

            <p className="text-sm text-gray-600 mt-2">
              Showing {cprList.length} record(s) • Data is mock for demo
            </p>
          </div>
        )}

        <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload CPR File
          </h3>
          <div
            className={`relative border-2 border-dashed rounded-md p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 mb-6 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : uploadStatus === "error"
                ? "border-red-300 bg-red-50"
                : uploadStatus === "success"
                ? "border-green-300 bg-green-50"
                : !(
                    selectedCenter &&
                    selectedSchool &&
                    selectedDivision &&
                    selectedBatch &&
                    selectedSemester &&
                    selectedSubject
                  )
                ? "border-gray-200 bg-gray-100 opacity-70"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!(selectedCenter && selectedSchool && selectedDivision && selectedBatch && selectedSemester && selectedSubject) ? (
              <div className="space-y-4">
                <AlertCircle className="text-gray-400 mx-auto" size={40} />
                <p className="text-gray-500">
                  Select all fields to enable upload.
                </p>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploadStatus === "success" ? (
                  <div className="space-y-4">
                    <CheckCircle className="text-green-500 mx-auto" size={40} />
                    <h3 className="text-lg font-semibold text-green-700">
                      Upload Successful!
                    </h3>
                    <p className="text-gray-600">{successMessage}</p>
                  </div>
                ) : uploadStatus === "uploading" ? (
                  <div className="space-y-4">
                    <Loader2
                      className="text-[#1B3A6A] animate-spin mx-auto"
                      size={40}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Uploading CPR...
                    </h3>
                    <p className="text-gray-600">Please wait</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="text-green-500 mx-auto" size={40} />
                    <h3 className="text-lg font-semibold text-gray-800">
                      File Ready
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <FileSpreadsheet size={20} />
                      <span className="break-all">{uploadedFile.name}</span>
                      <span>
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={removeFile}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-[#1B3A6A] border border-[#1B3A6A] rounded-sm hover:bg-red-200 transition-colorsz z-50 cursor-pointer"
                      >
                        <X size={16} /> Remove
                      </button>
                      <button
                        onClick={uploadFile}
                        className="px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors font-medium z-50 cursor-pointer"
                      >
                        Upload CPR
                      </button>
                    </div>
                  </div>
                ) : uploadStatus === "error" ? (
                  <div className="space-y-4">
                    <AlertCircle className="text-red-500 mx-auto" size={40} />
                    <h3 className="text-lg font-semibold text-red-700">
                      Upload Failed
                    </h3>
                    <p className="text-red-600 break-words">{errorMessage}</p>
                    <button
                      onClick={resetUpload}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors z-50 cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 flex flex-col items-center">
                    <Upload
                      className={dragActive ? "text-blue-500" : "text-gray-400"}
                      size={40}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {dragActive ? "Drop your file here" : "Upload CPR File"}
                    </h3>
                    <p className="text-gray-600">
                      Drag and drop or{" "}
                      <span className="text-blue-600 font-medium">browse</span>{" "}
                      to upload
                    </p>
                    <div className="text-xs text-gray-500">
                      .xls, .xlsx • Max 10MB
                    </div>
                  </div>
                )}
              </>
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
                Only Excel files are accepted
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
                Get the correct CPR format
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
                Tap Schema Help for formatting guidelines
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSchemaHelp && (
        <SchemaHelpModal
          isOpen={showSchemaHelp}
          onClose={() => setShowSchemaHelp(false)}
        />
      )}
    </div>
  );
}
