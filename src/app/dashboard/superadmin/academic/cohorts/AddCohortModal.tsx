import React, { useState } from "react";
import {
  ChevronDown,
  Upload,
  FileSpreadsheet,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface AddCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCohortCreated: (cohortData: {
    cohortName: string;
    startDate: string;
    endDate: string;
    school: string;
  }) => void;
  center: string;
}

// Teacher options (mock data)
const teachersData: Record<
  string,
  Record<string, Array<{ value: string; label: string }>>
> = {
  bangalore: {
    SOT: [
      { value: "dr-john-smith", label: "Dr. John Smith" },
      { value: "prof-alice-brown", label: "Prof. Alice Brown" },
    ],
    SOM: [
      { value: "prof-sarah-johnson", label: "Prof. Sarah Johnson" },
      { value: "dr-michael-davis", label: "Dr. Michael Davis" },
    ],
    SOH: [
      { value: "ms-emily-davis", label: "Ms. Emily Davis" },
      { value: "prof-robert-taylor", label: "Prof. Robert Taylor" },
    ],
  },
  lucknow: {
    SOT: [{ value: "dr-rajesh-kumar", label: "Dr. Rajesh Kumar" }],
    SOM: [{ value: "dr-amit-singh", label: "Dr. Amit Singh" }],
    SOH: [{ value: "ms-kavya-patel", label: "Ms. Kavya Patel" }],
  },
  pune: {
    SOT: [{ value: "dr-suresh-reddy", label: "Dr. Suresh Reddy" }],
    SOM: [{ value: "dr-vikram-shah", label: "Dr. Vikram Shah" }],
    SOH: [{ value: "ms-pooja-mehta", label: "Ms. Pooja Mehta" }],
  },
  noida: {
    SOT: [{ value: "dr-ashok-verma", label: "Dr. Ashok Verma" }],
    SOM: [{ value: "prof-deepa-agarwal", label: "Prof. Deepa Agarwal" }],
    SOH: [{ value: "ms-sneha-kapoor", label: "Ms. Sneha Kapoor" }],
  },
};

const schoolOptions = [
  { value: "SOT", label: "School of Technology" },
  { value: "SOM", label: "School of Management" },
  { value: "SOH", label: "School of Healthcare" },
];

const AddCohortModal: React.FC<AddCohortModalProps> = ({
  isOpen,
  onClose,
  onCohortCreated,
  center,
}) => {
  const [formData, setFormData] = useState({
    cohortName: "",
    startDate: "",
    endDate: "",
    school: "",
    selectedTeachers: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        cohortName: "",
        startDate: "",
        endDate: "",
        school: "",
        selectedTeachers: [],
      });
      setFormErrors({});
      setUploadedFile(null);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const getAvailableTeachers = () => {
    if (!center || !formData.school) return [];
    return teachersData[center]?.[formData.school] || [];
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "school") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        selectedTeachers: [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTeacherToggle = (teacherId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev.selectedTeachers.filter((id) => id !== teacherId)
        : [...prev.selectedTeachers, teacherId],
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.cohortName.trim()) {
      errors.cohortName = "Cohort name is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    } else if (new Date(formData.startDate) < new Date()) {
      errors.startDate = "Start date cannot be in the past";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "End date must be after start date";
    }

    if (!formData.school) {
      errors.school = "School is required";
    }

    if (formData.selectedTeachers.length === 0) {
      errors.selectedTeachers = "At least one teacher must be selected";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setErrorMessage("Please upload only XLS or XLSX files");
      setUploadStatus("error");
      setUploadedFile(null);
      return;
    }

    const fileSizeLimit = 10 * 1024 * 1024; // 10MB
    if (file.size > fileSizeLimit) {
      setErrorMessage("File size exceeds 10MB limit");
      setUploadStatus("error");
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate upload if file exists
    if (
      uploadedFile &&
      uploadStatus !== "success" &&
      uploadStatus !== "uploading"
    ) {
      setUploadStatus("uploading");
      setTimeout(() => {
        setUploadStatus("success");
        // Proceed to create cohort after upload
        setTimeout(() => {
          onCohortCreated({
            cohortName: formData.cohortName,
            startDate: formData.startDate,
            endDate: formData.endDate,
            school: formData.school,
          });
          onClose();
        }, 600);
      }, 1500);
      return;
    }

    // If no file, just create cohort
    if (!uploadedFile) {
      onCohortCreated({
        cohortName: formData.cohortName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        school: formData.school,
      });
      onClose();
    }
  };

  const handleClose = () => {
    if (uploadStatus === "uploading") return;
    setFormData({
      cohortName: "",
      startDate: "",
      endDate: "",
      school: "",
      selectedTeachers: [],
    });
    setUploadedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-3xl w-full border border-gray-400 max-h-[90vh] overflow-y-scroll">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Cohort</h3>

        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-sm">
          <p className="text-sm">
            <strong>Creating cohort for center:</strong> {center}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Cohort Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cohort Name *
              </label>
              <input
                type="text"
                name="cohortName"
                value={formData.cohortName}
                onChange={handleInputChange}
                placeholder="e.g., Web Dev Batch 2025"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.cohortName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.cohortName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.cohortName}
                </p>
              )}
            </div>

            {/* School */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <div className="relative">
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.school ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select School</option>
                  {schoolOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.school && (
                <p className="mt-1 text-sm text-red-600">{formErrors.school}</p>
              )}
            </div>

            {/* Teachers */}
            {formData.school && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teachers *
                </label>
                <div className="border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto">
                  {getAvailableTeachers().length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No teachers available
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {getAvailableTeachers().map((teacher) => (
                        <label
                          key={teacher.value}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedTeachers.includes(
                              teacher.value
                            )}
                            onChange={() => handleTeacherToggle(teacher.value)}
                            className="rounded text-[#1B3A6A] focus:ring-[#1B3A6A]"
                          />
                          <span className="text-sm">{teacher.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.selectedTeachers && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.selectedTeachers}
                  </p>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Custom Upload Section */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Upload Student List (XLSX)
              </h4>

              <div
                className={`relative border-2 border-dashed rounded-md p-6 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : uploadStatus === "error"
                    ? "border-red-300 bg-red-50"
                    : uploadStatus === "success"
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {/* === STATE: Idle (no file, not uploading) === */}
                {uploadStatus === "idle" && !uploadedFile && (
                  <>
                    <label
                      htmlFor="file-upload-input"
                      className="flex flex-col items-center justify-center cursor-pointer space-y-2 z-10"
                    >
                      <Upload className="text-gray-400" size={32} />
                      <p className="font-medium text-gray-800">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        XLS or XLSX only • Max 10MB
                      </p>
                    </label>
                    <input
                      id="file-upload-input"
                      ref={fileInputRef}
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </>
                )}

                {/* === STATE: File Selected (Preview) === */}
                {uploadedFile && uploadStatus === "idle" && (
                  <div className="space-y-3">
                    <FileSpreadsheet
                      className="text-blue-500 mx-auto"
                      size={32}
                    />
                    <p className="font-medium text-gray-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {/* ✅ Now clickable because file input is NOT rendered here */}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-sm mx-auto"
                    >
                      <X size={16} /> Remove File
                    </button>
                  </div>
                )}

                {/* === STATE: Uploading === */}
                {uploadStatus === "uploading" && (
                  <div className="space-y-2">
                    <Loader2
                      className="text-[#1B3A6A] animate-spin mx-auto"
                      size={32}
                    />
                    <p className="text-gray-800 font-medium">Uploading...</p>
                  </div>
                )}

                {/* === STATE: Success === */}
                {uploadStatus === "success" && (
                  <div className="space-y-2">
                    <CheckCircle className="text-green-500 mx-auto" size={32} />
                    <p className="text-green-700 font-medium">
                      Upload Successful!
                    </p>
                    <p className="text-sm text-gray-600">
                      {uploadedFile?.name}
                    </p>
                    {/* ✅ Clickable because no file input overlay */}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-sm mx-auto"
                    >
                      <X size={16} /> Remove
                    </button>
                  </div>
                )}

                {/* === STATE: Error === */}
                {uploadStatus === "error" && (
                  <div className="space-y-2">
                    <AlertCircle className="text-red-500 mx-auto" size={32} />
                    <p className="text-red-700 font-medium">Upload Failed</p>
                    <p className="text-sm text-red-600">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadStatus("idle");
                        setErrorMessage("");
                      }}
                      className="text-sm text-red-600 underline hover:text-red-800"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ✅ Only render file input when needed: in idle state with no file */}
                {uploadStatus === "idle" && !uploadedFile && (
                  <input
                    id="file-upload-input"
                    ref={fileInputRef}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </div>

              {/* Optional: Hint */}
              <p className="text-xs text-gray-500 mt-2">
                You can drag & drop or click to select a file.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploadStatus === "uploading"}
              className="px-4 py-2 border border-gray-300 rounded-sm text-slate-900 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadStatus === "uploading"}
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50 cursor-pointer"
            >
              {uploadStatus === "uploading" ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : uploadStatus === "success" ? (
                "Cohort Created!"
              ) : (
                "Create Cohort"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCohortModal;
