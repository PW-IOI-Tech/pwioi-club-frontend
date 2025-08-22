import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPolicyCreated: (policyData: {
    policyName: string;
    pdfUrl: string;
    effectiveDate: string;
    isActive: string;
    version: string;
    centerLocation: string;
  }) => void;
}

interface FormData {
  policyName: string;
  pdfUrl: string;
  effectiveDate: string;
  isActive: string;
  version: string;
  centerLocation: string;
}

const centerLocations = [
  { value: "bangalore", label: "Bangalore" },
  { value: "lucknow", label: "Lucknow" },
  { value: "pune", label: "Pune" },
  { value: "noida", label: "Noida" },
];

const activeStatus = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const versions = [
  { value: "1.0", label: "1.0" },
  { value: "1.1", label: "1.1" },
  { value: "1.2", label: "1.2" },
  { value: "1.5", label: "1.5" },
  { value: "2.0", label: "2.0" },
  { value: "2.1", label: "2.1" },
  { value: "2.2", label: "2.2" },
  { value: "3.0", label: "3.0" },
];

const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  isOpen,
  onClose,
  onPolicyCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    policyName: "",
    pdfUrl: "",
    effectiveDate: "",
    isActive: "true",
    version: "",
    centerLocation: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        policyName: "",
        pdfUrl: "",
        effectiveDate: "",
        isActive: "true",
        version: "",
        centerLocation: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing/selecting
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

    if (!formData.policyName.trim()) {
      errors.policyName = "Policy name is required";
    } else if (formData.policyName.length < 3) {
      errors.policyName = "Policy name must be at least 3 characters";
    }

    if (!formData.pdfUrl.trim()) {
      errors.pdfUrl = "PDF URL is required";
    } else if (!/^https?:\/\/.+\.(pdf)$/i.test(formData.pdfUrl)) {
      errors.pdfUrl = "Please enter a valid PDF URL (must end with .pdf)";
    }

    if (!formData.effectiveDate.trim()) {
      errors.effectiveDate = "Effective date is required";
    } else {
      const selectedDate = new Date(formData.effectiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.effectiveDate = "Effective date cannot be in the past";
      }
    }

    if (!formData.version.trim()) {
      errors.version = "Version is required";
    }

    if (!formData.centerLocation.trim()) {
      errors.centerLocation = "Center location is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Call the parent component's callback to add the policy
    onPolicyCreated(formData);

    // Reset form
    setFormData({
      policyName: "",
      pdfUrl: "",
      effectiveDate: "",
      isActive: "true",
      version: "",
      centerLocation: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        policyName: "",
        pdfUrl: "",
        effectiveDate: "",
        isActive: "true",
        version: "",
        centerLocation: "",
      });
      setFormErrors({});
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Policy</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Name *
              </label>
              <input
                type="text"
                name="policyName"
                value={formData.policyName}
                onChange={handleInputChange}
                placeholder="e.g., Code of Conduct Policy"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.policyName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.policyName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.policyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF URL *
              </label>
              <input
                type="url"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleInputChange}
                placeholder="e.g., https://example.com/policy.pdf"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.pdfUrl ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.pdfUrl && (
                <p className="mt-1 text-sm text-red-600">{formErrors.pdfUrl}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be a valid URL ending with .pdf
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date *
              </label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                min={getTodaysDate()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.effectiveDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.effectiveDate && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.effectiveDate}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Date when the policy becomes effective
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <div className="relative">
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.isActive ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  {activeStatus.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.isActive && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.isActive}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version *
              </label>
              <div className="relative">
                <select
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.version ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Version</option>
                  {versions.map((version) => (
                    <option key={version.value} value={version.value}>
                      {version.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.version && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.version}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Location *
              </label>
              <div className="relative">
                <select
                  name="centerLocation"
                  value={formData.centerLocation}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.centerLocation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Center Location</option>
                  {centerLocations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.centerLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.centerLocation}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select the center where this policy applies
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
                "Create Policy"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPolicyModal;
