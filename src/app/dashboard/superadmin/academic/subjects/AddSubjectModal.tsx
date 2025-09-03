import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectCreated: (subjectData: {
    subjectName: string;
    credits: string;
    subjectCode: string;
    teacher: string;
    teacherId?: string;
  }) => void;
  selectedSchool: string;
  selectedBatch: string;
  selectedDivision: string;
  selectedSemester: string;
  selectedCenter: string;
  selectedCenterId: string;
}

interface FormData {
  subjectName: string;
  credits: string;
  subjectCode: string;
  teacherCenter: string;
  teacherSchool: string;
  teacher: string;
}

interface School {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  pwId: string;
  gender: string;
  role: string;
  designation: string;
  linkedin: string;
  github_link: string;
  personal_mail: string;
  createdAt: string;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubjectCreated,
  selectedSchool,
  selectedBatch,
  selectedDivision,
  selectedSemester,
  selectedCenter,
  selectedCenterId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    subjectName: "",
    credits: "",
    subjectCode: "",
    teacherCenter: "",
    teacherSchool: "",
    teacher: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const normalizedCenter = selectedCenter.toLowerCase();

  // Fetch schools data

  const fetchSchools = async (centerId: string) => {
    try {
      setLoadingSchools(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/schools/${centerId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setSchools(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
    } finally {
      setLoadingSchools(false);
    }
  };

  // Fetch teachers data
  const fetchTeachers = async (schoolId: string) => {
    try {
      setLoadingTeachers(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/teachers/school/${schoolId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log(
        "AddSubjectModal opened with center:",
        selectedCenter,
        "and school:",
        selectedSchool
      );
      setFormData({
        subjectName: "",
        credits: "",
        subjectCode: "",
        teacherCenter: normalizedCenter,
        teacherSchool: selectedSchool,
        teacher: "",
      });
      setFormErrors({});

      // Fetch schools when modal opens
      if (selectedCenter) {
        console.log("Fetching schools for center:", selectedCenter);
        fetchSchools(selectedCenterId);
      }
    }
  }, [isOpen, normalizedCenter, selectedSchool, selectedCenterId]);

  // Fetch teachers when school changes
  useEffect(() => {
    if (formData.teacherSchool && formData.teacherSchool !== selectedSchool) {
      fetchTeachers(formData.teacherSchool);
      // Reset teacher selection when school changes
      setFormData((prev) => ({ ...prev, teacher: "" }));
    } else if (selectedSchool) {
      // Fetch teachers for the initially selected school
      const currentSchool = schools.find(
        (school) => school.name === selectedSchool
      );
      if (currentSchool) {
        fetchTeachers(currentSchool.id);
      }
    }
  }, [formData.teacherSchool, schools, selectedSchool]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "teacher") {
      setFormData((prev) => ({ ...prev, teacher: value }));
      if (formErrors.teacher) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.teacher;
          return newErrors;
        });
      }
    } else if (name === "teacherSchool") {
      setFormData((prev) => ({ ...prev, teacherSchool: value, teacher: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for the field being updated
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.subjectName.trim()) {
      errors.subjectName = "Subject name is required";
    } else if (formData.subjectName.length < 2) {
      errors.subjectName = "Subject name must be at least 2 characters";
    }

    if (!formData.credits.trim()) {
      errors.credits = "Credits is required";
    } else if (!/^\d+$/.test(formData.credits)) {
      errors.credits = "Credits must be a positive number";
    } else if (
      parseInt(formData.credits) < 1 ||
      parseInt(formData.credits) > 10
    ) {
      errors.credits = "Credits must be between 1 and 10";
    }

    if (!formData.subjectCode.trim()) {
      errors.subjectCode = "Subject code is required";
    } else if (formData.subjectCode.length < 3) {
      errors.subjectCode = "Subject code must be at least 3 characters";
    }

    if (!formData.teacher) {
      errors.teacher = "Please select a teacher";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const teacherName = getTeacherName(formData.teacher);

    onSubjectCreated({
      subjectName: formData.subjectName,
      credits: formData.credits,
      subjectCode: formData.subjectCode,
      teacher: teacherName,
      teacherId: formData.teacher,
    });

    setFormData({
      subjectName: "",
      credits: "",
      subjectCode: "",
      teacherCenter: normalizedCenter,
      teacherSchool: selectedSchool,
      teacher: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "";
  };

  const getSchoolDisplayName = (schoolName: string): string => {
    const schoolMap: Record<string, string> = {
      SOT: "School of Technology",
      SOM: "School of Management",
      SOD: "School of Design",
    };
    return schoolMap[schoolName] || schoolName;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Add New Subject
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleInputChange}
                placeholder="e.g., Data Structures and Algorithms"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.subjectName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.subjectName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.subjectName}
                </p>
              )}
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits *
              </label>
              <input
                type="text"
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                placeholder="e.g., 4"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.credits ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.credits && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.credits}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter a number between 1 and 10
              </p>
            </div>

            {/* Subject Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleInputChange}
                placeholder="e.g., CS201"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.subjectCode ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.subjectCode && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.subjectCode}
                </p>
              )}
            </div>

            {/* Teacher Center (Auto-filled, non-editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedCenter}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed text-gray-700"
                />
              </div>
            </div>

            {/* Teacher School Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher School *
              </label>
              <div className="relative">
                <select
                  name="teacherSchool"
                  value={formData.teacherSchool}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer"
                  disabled={isSubmitting || loadingSchools}
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {getSchoolDisplayName(school.name)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
                  size={18}
                />
              </div>
              {loadingSchools && (
                <p className="mt-1 text-xs text-blue-600">Loading schools...</p>
              )}
            </div>

            {/* Teacher Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>
              <div className="relative">
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className={`w-full pl-3 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.teacher ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={
                    isSubmitting || loadingTeachers || !formData.teacherSchool
                  }
                >
                  <option value="">
                    {loadingTeachers ? "Loading teachers..." : "Select Teacher"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}{" "}
                      {teacher.designation && `- ${teacher.designation}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    !formData.teacherSchool || loadingTeachers
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                  size={18}
                />
              </div>
              {formErrors.teacher && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.teacher}
                </p>
              )}
              {!formData.teacherSchool && (
                <p className="mt-1 text-xs text-gray-500">
                  Please select a school first
                </p>
              )}
              {formData.teacherSchool && !loadingTeachers && (
                <p className="mt-1 text-xs text-gray-500">
                  Teachers from selected school
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-sm text-slate-900 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50 cursor-pointer duration-200 ease-in-out transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Subject"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
