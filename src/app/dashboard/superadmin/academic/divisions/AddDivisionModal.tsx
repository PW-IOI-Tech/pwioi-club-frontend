import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDivisionCreated: (divisionData: {
    division: string;
    startDate: string;
    endDate: string;
  }) => void;
  selectedCenter: string;
  selectedSchool: string;
  selectedBatch: string;
}

const divisionOptions = ["B1", "B2", "B3", "B4"];

const AddDivisionModal: React.FC<AddDivisionModalProps> = ({
  isOpen,
  onClose,
  onDivisionCreated,
  selectedCenter,
  selectedSchool,
  selectedBatch,
}) => {
  const [formData, setFormData] = useState({
    division: "",
    startDate: "",
    endDate: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ division: "", startDate: "", endDate: "" });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.division) {
      errors.division = "Division is required";
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onDivisionCreated(formData);
      setIsSubmitting(false);
    }, 600);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ division: "", startDate: "", endDate: "" });
      setFormErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add Division</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division *
              </label>
              <div className="relative">
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.division ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Division</option>
                  {divisionOptions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.division && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.division}
                </p>
              )}
            </div>

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

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-sm text-slate-900 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center"
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
                "Create Division"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDivisionModal;
