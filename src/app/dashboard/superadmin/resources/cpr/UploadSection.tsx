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

const centers = ["Bangalore", "Noida", "Lucknow", "Pune"];

const schoolsByCenter: Record<string, string[]> = {
  Bangalore: ["SOT", "SOH", "SOM"],
  Noida: ["SOT", "SOH"],
  Lucknow: ["SOH", "SOM"],
  Pune: ["SOT", "SOM"],
};

const subjects = [
  "Programming Fundamentals",
  "Data Structures",
  "Algorithms",
  "Web Development",
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Artificial Intelligence",
  "Machine Learning",
];

export default function CPRUploadSection() {
  const [center, setCenter] = useState("");
  const [school, setSchool] = useState("");
  const [division, setDivision] = useState("");
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);

  const [showCPRTable, setShowCPRTable] = useState(false);
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

  const getBatchOptions = () => {
    if (!school || !division) return [];
    return [`${school}${division}B1`, `${school}${division}B2`];
  };

  const getSemesterOptions = () => Array.from({ length: 8 }, (_, i) => i + 1);

  const loadCPRsForDivision = () => {
    if (!center || !school || !division || !semester) return;

    const selectedSem = Number(semester);
    const mockCPRs = [];

    const numSubjects = Math.min(3, subjects.length);
    const shuffled = [...subjects].sort(() => 0.5 - Math.random());
    const selectedSubjects = shuffled.slice(0, numSubjects);

    for (const subj of selectedSubjects) {
      mockCPRs.push({
        id: `${division}-${selectedSem}-${subj.slice(0, 3)}-${Math.random()
          .toString(36)
          .substr(2, 4)}`,
        teacher: ["Prof. A.", "Dr. B.", "Ms. C.", "Mr. D."][
          Math.floor(Math.random() * 4)
        ],
        semester: selectedSem,
        subject: subj,
        uploadedOn: ["2024-05-10", "2024-04-22", "2024-03-15"][
          Math.floor(Math.random() * 3)
        ],
        status: ["Approved", "Pending", "Rejected"][
          Math.floor(Math.random() * 3)
        ] as any,
        file: `${subj.replace(/\s+/g, "_")}_CPR_Sem${selectedSem}.xlsx`,
      });
    }

    setCprList(mockCPRs);
    setShowCPRTable(true);
  };

  useEffect(() => {
    setSchool("");
    setDivision("");
    setBatch("");
    setSemester("");
    setSubject("");
    setShowCPRTable(false);
  }, [center]);

  useEffect(() => {
    setDivision("");
    setBatch("");
    setSemester("");
    setSubject("");
    setShowCPRTable(false);
  }, [school]);

  useEffect(() => {
    setBatch("");
    setSemester("");
    setSubject("");
    setShowCPRTable(false);
  }, [division]);

  useEffect(() => {
    setSubject("");
    setShowCPRTable(false);
  }, [batch]);

  const canShowViewButton = semester;
  const canUpload =
    center &&
    school &&
    division &&
    batch &&
    semester &&
    subject &&
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

  const uploadFile = () => {
    if (!canUpload) return;

    setUploadStatus("uploading");
    setErrorMessage("");
    setSuccessMessage("");

    setTimeout(() => {
      setSuccessMessage(`CPR for ${subject} uploaded successfully!`);
      setUploadStatus("success");

      const newCPR = {
        id: Date.now().toString(),
        teacher: "You (Admin)",
        semester: Number(semester),
        subject,
        uploadedOn: new Date().toISOString().split("T")[0],
        status: "Pending" as const,
        file: uploadedFile?.name || "uploaded_cpr.xlsx",
      };
      setCprList((prev) => [newCPR, ...prev]);
    }, 1500);
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
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Center
              </label>
              <div className="relative">
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Center</option>
                  {centers.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                School
              </label>
              <div className="relative">
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  disabled={!center}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select School</option>
                  {schoolsByCenter[center]?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !center ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  disabled={!school}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Division</option>
                  {["23", "24", "25"].map((d) => (
                    <option key={d} value={d}>
                      {d}
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

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Batch
              </label>
              <div className="relative">
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  disabled={!division || !school}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Batch</option>
                  {getBatchOptions().map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !division || !school ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="relative">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={!batch}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {getSemesterOptions().map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
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

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!semester}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !semester ? "text-gray-300" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {canShowViewButton && (
            <div className="mb-6">
              <button
                onClick={loadCPRsForDivision}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors font-medium cursor-pointer group"
              >
                <ClipboardList size={16} className="group-hover:scale-110" />
                View CPR Table
              </button>
            </div>
          )}
        </div>

        {showCPRTable && (
          <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              CPR Records - Semester {semester}
            </h3>

            <div className="border border-gray-300 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Teacher</th>
                    <th className="px-4 py-2 text-left">Uploaded On</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {cprList.length > 0 ? (
                    cprList.map((cpr) => (
                      <tr
                        key={cpr.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{cpr.subject}</td>
                        <td className="px-4 py-2">{cpr.teacher}</td>
                        <td className="px-4 py-2">{cpr.uploadedOn}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cpr.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : cpr.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cpr.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <a
                            href="#"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.preventDefault()}
                          >
                            {cpr.file}
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No CPRs found for Semester {semester}.
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
                    center &&
                    school &&
                    division &&
                    batch &&
                    semester &&
                    subject
                  )
                ? "border-gray-200 bg-gray-100 opacity-70"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!(center && school && division && batch && semester && subject) ? (
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
