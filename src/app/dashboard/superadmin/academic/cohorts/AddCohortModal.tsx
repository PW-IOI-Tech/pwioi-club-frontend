import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  Upload,
  FileSpreadsheet,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface School {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pwId?: string;
  gender?: string;
  role?: string;
  designation?: string;
  linkedin?: string;
  github_link?: string;
  personal_mail?: string;
  createdAt: string;
}

interface AddCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCohortCreated: (
    cohortData: {
      cohortName: string;
      startDate: string;
      endDate: string;
      school: string;
    },
    selectedTeachers: string[],
    uploadedFile: File | null
  ) => void;
  prefillLocation?: string;
  centerId?: string;
  isCreating?: boolean;
}

interface FormData {
  cohortName: string;
  startDate: string;
  endDate: string;
  school: string;
  selectedTeachers: string[];
}

const teachersData: Record<
  string,
  Record<string, Array<{ value: string; label: string }>>
> = {
  // This is now replaced by dynamic API calls, keeping for reference
  // Remove this object if not needed elsewhere
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AddCohortModal: React.FC<AddCohortModalProps> = ({
  isOpen,
  onClose,
  onCohortCreated,
  prefillLocation,
  centerId,
  isCreating = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    cohortName: "",
    startDate: "",
    endDate: "",
    school: "",
    selectedTeachers: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const fetchSchools = async () => {
      if (!centerId) return;

      setLoadingSchools(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/schools/${centerId}`, {
          withCredentials: true,
        });

        const fetchedSchools: School[] = res.data.data.map((school: any) => ({
          id: school.id,
          name: school.name,
        }));

        setSchools(fetchedSchools);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };

    if (isOpen && centerId) {
      fetchSchools();
    }
  }, [isOpen, centerId]);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!formData.school) {
        setTeachers([]);
        return;
      }

      setLoadingTeachers(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/teachers/school/${formData.school}`,
          {
            withCredentials: true,
          }
        );

        const fetchedTeachers: Teacher[] = res.data.data.map(
          (teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            pwId: teacher.pwId,
            gender: teacher.gender,
            role: teacher.role,
            designation: teacher.designation,
            linkedin: teacher.linkedin,
            github_link: teacher.github_link,
            personal_mail: teacher.personal_mail,
            createdAt: teacher.createdAt,
          })
        );

        setTeachers(fetchedTeachers);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [formData.school]);

  useEffect(() => {
    if (isOpen) {
      if (prefillLocation) {
        setFormData((prev) => ({
          ...prev,
          school: "",
          selectedTeachers: [],
        }));
      } else {
        setFormData({
          cohortName: "",
          startDate: "",
          endDate: "",
          school: "",
          selectedTeachers: [],
        });
      }
      setFormErrors({});
      setUploadedFile(null);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen, prefillLocation]);

  const getAvailableTeachers = () => {
    return teachers;
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
      // Clear teachers when school changes
      setTeachers([]);
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

    if (!uploadedFile) {
      errors.uploadedFile = "Student Excel file is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) {
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

    // Call the parent handler with all required data
    onCohortCreated(
      {
        cohortName: formData.cohortName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        school: formData.school,
      },
      formData.selectedTeachers,
      uploadedFile
    );
  };

  const handleClose = () => {
    if (isCreating) return; // Prevent closing while creating cohort
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
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm p-6 max-w-3xl w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Cohort</h3>

        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-sm text-sm">
          <strong>Center:</strong> {prefillLocation}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
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
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.cohortName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.cohortName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.cohortName}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <div className="relative">
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  disabled={loadingSchools}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    formErrors.school ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {loadingSchools ? "Loading schools..." : "Select School"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
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

            {formData.school && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teachers *
                </label>
                <div className="border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto">
                  {loadingTeachers ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      <span className="text-sm text-gray-500">
                        Loading teachers...
                      </span>
                    </div>
                  ) : getAvailableTeachers().length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No teachers available for this school
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {getAvailableTeachers().map((teacher) => (
                        <label
                          key={teacher.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedTeachers.includes(
                              teacher.id
                            )}
                            onChange={() => handleTeacherToggle(teacher.id)}
                            className="rounded text-[#1B3A6A] focus:ring-[#1B3A6A]"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {teacher.name}
                            </span>
                            {teacher.designation && (
                              <span className="text-xs text-gray-500">
                                {teacher.designation}
                              </span>
                            )}
                          </div>
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
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
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
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
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

            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Upload Student List (XLSX) *
              </h4>

              <div
                className={`relative border-2 border-dashed rounded-md p-6 text-center transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : uploadStatus === "error" || formErrors.uploadedFile
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
                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-sm mx-auto cursor-pointer"
                    >
                      <X size={16} /> Remove File
                    </button>
                  </div>
                )}

                {uploadStatus === "uploading" && (
                  <div className="space-y-2">
                    <Loader2
                      className="text-[#1B3A6A] animate-spin mx-auto"
                      size={32}
                    />
                    <p className="text-gray-800 font-medium">Uploading...</p>
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="space-y-2">
                    <CheckCircle className="text-green-500 mx-auto" size={32} />
                    <p className="text-green-700 font-medium">
                      Upload Successful!
                    </p>
                    <p className="text-sm text-gray-600">
                      {uploadedFile?.name}
                    </p>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 text-sm mx-auto cursor-pointer"
                    >
                      <X size={16} /> Remove
                    </button>
                  </div>
                )}

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
                      className="text-sm text-red-600 underline hover:text-red-800 cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                )}

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

              <p className="text-xs text-gray-500 mt-2">
                You can drag & drop or click to select a file. This file is
                required to create the cohort.
              </p>
              {formErrors.uploadedFile && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.uploadedFile}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="px-4 py-2 border border-gray-300 rounded-sm text-slate-900 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating Cohort...
                </>
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
