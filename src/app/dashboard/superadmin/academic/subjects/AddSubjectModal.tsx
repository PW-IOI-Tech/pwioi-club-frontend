import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectCreated: (subjectData: {
    subjectName: string;
    credits: string;
    subjectCode: string;
    teacher: string;
  }) => void;
  selectedSchool: string;
  selectedBatch: string;
  selectedDivision: string;
  selectedSemester: string;
  selectedCenter: string;
}

interface FormData {
  subjectName: string;
  credits: string;
  subjectCode: string;
  teacherCenter: string;
  teacherSchool: string;
  teacher: string;
}

const teachersData: Record<
  string,
  Record<string, Array<{ value: string; label: string }>>
> = {
  bangalore: {
    SOT: [
      { value: "dr-john-smith", label: "Dr. John Smith" },
      { value: "prof-alice-brown", label: "Prof. Alice Brown" },
      { value: "mr-david-wilson", label: "Mr. David Wilson" },
    ],
    SOM: [
      { value: "prof-sarah-johnson", label: "Prof. Sarah Johnson" },
      { value: "dr-michael-davis", label: "Dr. Michael Davis" },
      { value: "ms-lisa-anderson", label: "Ms. Lisa Anderson" },
    ],
    SOD: [
      { value: "ms-emily-davis", label: "Ms. Emily Davis" },
      { value: "prof-robert-taylor", label: "Prof. Robert Taylor" },
    ],
  },
  lucknow: {
    SOT: [
      { value: "dr-rajesh-kumar", label: "Dr. Rajesh Kumar" },
      { value: "prof-priya-sharma", label: "Prof. Priya Sharma" },
    ],
    SOM: [
      { value: "dr-amit-singh", label: "Dr. Amit Singh" },
      { value: "prof-neha-gupta", label: "Prof. Neha Gupta" },
    ],
    SOD: [{ value: "ms-kavya-patel", label: "Ms. Kavya Patel" }],
  },
  pune: {
    SOT: [
      { value: "dr-suresh-reddy", label: "Dr. Suresh Reddy" },
      { value: "prof-anita-joshi", label: "Prof. Anita Joshi" },
    ],
    SOM: [{ value: "dr-vikram-shah", label: "Dr. Vikram Shah" }],
    SOD: [
      { value: "ms-pooja-mehta", label: "Ms. Pooja Mehta" },
      { value: "prof-ravi-nair", label: "Prof. Ravi Nair" },
    ],
  },
  noida: {
    SOT: [{ value: "dr-ashok-verma", label: "Dr. Ashok Verma" }],
    SOM: [
      { value: "prof-deepa-agarwal", label: "Prof. Deepa Agarwal" },
      { value: "dr-rohit-malhotra", label: "Dr. Rohit Malhotra" },
    ],
    SOD: [{ value: "ms-sneha-kapoor", label: "Ms. Sneha Kapoor" }],
  },
};

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubjectCreated,
  selectedSchool,
  selectedBatch,
  selectedDivision,
  selectedSemester,
  selectedCenter,
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

  const normalizedCenter = selectedCenter.toLowerCase();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        subjectName: "",
        credits: "",
        subjectCode: "",
        teacherCenter: normalizedCenter,
        teacherSchool: selectedSchool,
        teacher: "",
      });
      setFormErrors({});
    }
  }, [isOpen, normalizedCenter, selectedSchool]);

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

  const getTeacherName = (teacherValue: string): string => {
    const teachers =
      teachersData[formData.teacherCenter]?.[formData.teacherSchool] || [];
    const teacher = teachers.find((t) => t.value === teacherValue);
    return teacher ? teacher.label : "";
  };

  const getAvailableTeachers = () => {
    return teachersData[formData.teacherCenter]?.[formData.teacherSchool] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Add New Subject
        </h3>

        {/* Context Info */}
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-sm">
          <p className="text-sm">
            <strong>Adding subject for:</strong> {selectedCenter} →{" "}
            {selectedSchool}
            {selectedBatch}
            {selectedDivision} - Semester {selectedSemester}
          </p>
        </div>

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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subjectName: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, credits: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subjectCode: e.target.value,
                  }))
                }
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
                Teacher Center
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

            {/* Teacher School (Auto-filled, non-editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher School
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={
                    {
                      SOT: "School of Technology",
                      SOM: "School of Management",
                      SOD: "School of Design",
                    }[selectedSchool] || selectedSchool
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed text-gray-700"
                />
              </div>
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
                  disabled={isSubmitting || getAvailableTeachers().length === 0}
                >
                  <option value="">Select Teacher</option>
                  {getAvailableTeachers().map((teacher) => (
                    <option key={teacher.value} value={teacher.value}>
                      {teacher.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    getAvailableTeachers().length === 0
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
              <p className="mt-1 text-xs text-gray-500">
                Teachers from {selectedCenter} - {selectedSchool}
              </p>
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
