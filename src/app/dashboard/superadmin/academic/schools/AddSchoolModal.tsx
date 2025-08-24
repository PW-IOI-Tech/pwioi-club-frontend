import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchoolCreated: (schoolData: {
    location: string;
    schoolName: string;
  }) => void;
  prefillLocation?: string;
}

interface FormData {
  location: string;
  schoolName: string;
}

const locations = [
  { value: "bangalore", label: "Bangalore" },
  { value: "lucknow", label: "Lucknow" },
  { value: "pune", label: "Pune" },
  { value: "noida", label: "Noida" },
];

const schoolNames = [
  { value: "SOT", label: "SOT - School of Technology" },
  { value: "SOM", label: "SOM - School of Management" },
  { value: "SOH", label: "SOH - School of Humanities" },
];

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onSchoolCreated,
  prefillLocation,
}) => {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    schoolName: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (prefillLocation) {
        setFormData((prev) => ({
          ...prev,
          location: prefillLocation.toLowerCase(),
        }));
      } else {
        setFormData({ location: "", schoolName: "" });
      }
      setFormErrors({});
    }
  }, [isOpen, prefillLocation]);

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

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.schoolName.trim()) {
      errors.schoolName = "School name is required";
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

    onSchoolCreated(formData);

    setFormData({
      location: "",
      schoolName: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        location: "",
        schoolName: "",
      });
      setFormErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-md w-full border border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New School</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  } ${prefillLocation ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  disabled={isSubmitting || !!prefillLocation}
                >
                  <option value="">
                    {prefillLocation ? "" : "Select Location"}
                  </option>
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
                {!prefillLocation && !isSubmitting && (
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={18}
                  />
                )}
              </div>

              {formErrors.location && !prefillLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.location}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name *
              </label>
              <div className="relative">
                <select
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.schoolName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select School Name</option>
                  {schoolNames.map((school) => (
                    <option key={school.value} value={school.value}>
                      {school.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.schoolName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.schoolName}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select the school type for this location
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
                "Create School"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchoolModal;
