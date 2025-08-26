import React, { useState, useEffect } from "react";

type ExamType = "Fortnightly" | "Internal" | "Interview";

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: (examData: {
    examName: string;
    weightage: number;
    maxMarks: number;
    passingMarks: number;
    examType: ExamType;
    subject: string;
    date: string;
  }) => void;
  selectedCenter: string;
  selectedSchool: string;
  selectedBatch: string;
  selectedDivision: string;
  selectedSemester: string;
  selectedSubject: string;
  selectedExamType: ExamType;
  selectedExamNumber: string;
}

interface FormData {
  weightage: string;
  maxMarks: string;
  passingMarks: string;
  date: string;
}

const examTypeLabels: Record<ExamType, string> = {
  Fortnightly: "Fortnightly Test",
  Internal: "Internal Assessment",
  Interview: "Interview Round",
};

const AddExamModal: React.FC<AddExamModalProps> = ({
  isOpen,
  onClose,
  onExamCreated,
  selectedCenter,
  selectedSchool,
  selectedBatch,
  selectedDivision,
  selectedSemester,
  selectedSubject,
  selectedExamType,
  selectedExamNumber,
}) => {
  const [formData, setFormData] = useState<FormData>({
    weightage: "",
    maxMarks: "",
    passingMarks: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const examName =
    selectedExamType && selectedSubject
      ? `${examTypeLabels[selectedExamType]} ${selectedExamNumber.slice(
          -1
        )} - ${selectedSubject}`
      : "New Exam";

  useEffect(() => {
    if (isOpen) {
      setFormData({
        weightage: "",
        maxMarks: "",
        passingMarks: "",
        date: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const maxDate = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate()
    );

    if (!formData.weightage.trim()) {
      errors.weightage = "Weightage is required";
    } else if (!/^\d+(\.\d+)?$/.test(formData.weightage)) {
      errors.weightage = "Must be a number";
    } else {
      const w = parseFloat(formData.weightage);
      if (w <= 0 || w > 100) {
        errors.weightage = "Must be between 0.1 and 100%";
      }
    }

    if (!formData.maxMarks.trim()) {
      errors.maxMarks = "Max marks is required";
    } else if (
      !/^\d+$/.test(formData.maxMarks) ||
      parseInt(formData.maxMarks) <= 0
    ) {
      errors.maxMarks = "Must be a positive number";
    }

    if (!formData.passingMarks.trim()) {
      errors.passingMarks = "Passing marks is required";
    } else if (!/^\d+$/.test(formData.passingMarks)) {
      errors.passingMarks = "Must be a number";
    } else if (
      parseInt(formData.passingMarks) > parseInt(formData.maxMarks || "0")
    ) {
      errors.passingMarks = "Cannot exceed max marks";
    }

    if (!formData.date) {
      errors.date = "Exam date is required";
    } else {
      const examDate = new Date(formData.date);
      if (isNaN(examDate.getTime())) {
        errors.date = "Invalid date";
      } else if (examDate < minDate) {
        errors.date = "Must be at least tomorrow";
      } else if (examDate > maxDate) {
        errors.date = "Cannot be more than one year from now";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    onExamCreated({
      examName,
      weightage: parseFloat(formData.weightage),
      maxMarks: parseInt(formData.maxMarks, 10),
      passingMarks: parseInt(formData.passingMarks, 10),
      examType: selectedExamType,
      subject: selectedSubject,
      date: formData.date,
    });

    setFormData({
      weightage: "",
      maxMarks: "",
      passingMarks: "",
      date: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Exam</h3>

        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-sm text-sm">
          <p>
            <strong>Center:</strong> {selectedCenter}
          </p>
          <p>
            <strong>School:</strong> {selectedSchool} | <strong>Batch:</strong>{" "}
            {selectedBatch} | <strong>Div:</strong> {selectedDivision}
          </p>
          <p>
            <strong>Semester:</strong> {selectedSemester}
          </p>
          <p>
            <strong>Subject:</strong> {selectedSubject}
          </p>
          <p>
            <strong>Type:</strong> {examTypeLabels[selectedExamType]} |{" "}
            <strong>No:</strong> {selectedExamNumber}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Name
              </label>
              <input
                type="text"
                value={examName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-generated based on type and subject
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weightage (%) *
              </label>
              <input
                type="text"
                name="weightage"
                value={formData.weightage}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.weightage ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.weightage && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.weightage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Marks *
              </label>
              <input
                type="text"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.maxMarks ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.maxMarks && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.maxMarks}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Marks *
              </label>
              <input
                type="text"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleInputChange}
                placeholder="e.g., 8"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.passingMarks ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.passingMarks && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.passingMarks}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.date ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be between tomorrow and one year from now.
              </p>
            </div>
          </div>

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
                "Create Exam"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamModal;
