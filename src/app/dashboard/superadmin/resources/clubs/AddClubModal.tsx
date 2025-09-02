import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface AddClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClubCreated: (clubData: {
    clubName: string;
    category: string;
    leaderId: string;
    description: string;
    establishedDate: string;
    centerLocation: string;
    clubOfficials: string[];
    coreMembers: string[];
  }) => void;
  prefillLocation: string;
}

const AddClubModal: React.FC<AddClubModalProps> = ({
  isOpen,
  onClose,
  onClubCreated,
  prefillLocation,
}) => {
  const [formData, setFormData] = useState({
    clubName: "",
    category: "",
    leaderId: "",
    description: "",
    establishedDate: "",
    centerLocation: prefillLocation,
    clubOfficials: [] as string[],
    coreMembers: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coreMembersInput, setCoreMembersInput] = useState("");
  const [facultyInput, setFacultyInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, centerLocation: prefillLocation }));
      setCoreMembersInput("");
      setFacultyInput("");
      setFormErrors({});
    }
  }, [isOpen, prefillLocation]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const removePill = (type: "clubOfficials" | "coreMembers", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  // Update core members from comma-separated input
  const debouncedUpdateCoreMembers = useCallback(() => {
    const inputIds = coreMembersInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    setFormData((prev) => ({
      ...prev,
      coreMembers: inputIds,
    }));
  }, [coreMembersInput]);

  // Update faculty officials from comma-separated input
  const debouncedUpdateFaculty = useCallback(() => {
    const inputIds = facultyInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    setFormData((prev) => ({
      ...prev,
      clubOfficials: inputIds,
    }));
  }, [facultyInput]);

  // Debounce effect for core members
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedUpdateCoreMembers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [coreMembersInput, debouncedUpdateCoreMembers]);

  // Debounce effect for faculty
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedUpdateFaculty();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [facultyInput, debouncedUpdateFaculty]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.clubName.trim()) {
      errors.clubName = "Club name is required";
    } else if (formData.clubName.length < 3) {
      errors.clubName = "Club name must be at least 3 characters";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (!formData.leaderId.trim()) {
      errors.leaderId = "Leader ID is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.establishedDate) {
      errors.establishedDate = "Established date is required";
    } else {
      const date = new Date(formData.establishedDate);
      const now = new Date();
      if (date > now) {
        errors.establishedDate = "Date cannot be in the future";
      }
    }

    if (formData.clubOfficials.length === 0) {
      errors.clubOfficials = "At least one faculty official is required";
    }

    if (formData.coreMembers.length === 0) {
      errors.coreMembers = "At least one core member is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    onClubCreated(formData);

    // Reset form
    setFormData({
      clubName: "",
      category: "",
      leaderId: "",
      description: "",
      establishedDate: "",
      centerLocation: prefillLocation || "",
      clubOfficials: [],
      coreMembers: [],
    });
    setCoreMembersInput("");
    setFacultyInput("");
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        clubName: "",
        category: "",
        leaderId: "",
        description: "",
        establishedDate: "",
        centerLocation: "",
        clubOfficials: [],
        coreMembers: [],
      });
      setCoreMembersInput("");
      setFacultyInput("");
      setFormErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Club</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Club Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club Name *
              </label>
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleInputChange}
                placeholder="e.g., Coding Ninjas Club"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.clubName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.clubName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.clubName}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Robotics, Dance, Debate"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.category ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.category}
                </p>
              )}
            </div>

            {/* Leader ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club Leader ID *
              </label>
              <input
                type="text"
                name="leaderId"
                value={formData.leaderId}
                onChange={handleInputChange}
                placeholder="e.g., John, Dr. Smith, or STD001"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.leaderId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.leaderId && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.leaderId}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="What does the club do? Goals, activities, etc."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] resize-vertical ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Established Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Established Date *
              </label>
              <input
                type="date"
                name="establishedDate"
                value={formData.establishedDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.establishedDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.establishedDate && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.establishedDate}
                </p>
              )}
            </div>

            {/* Faculty Officials (Free Text Input) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty Officials * ({formData.clubOfficials.length} selected)
              </label>
              <div
                className={`border rounded-md p-2 min-h-10 bg-gray-50 flex flex-wrap gap-1 mb-2 ${
                  formErrors.clubOfficials
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {formData.clubOfficials.length === 0 ? (
                  <span className="text-gray-500 text-sm italic">
                    None selected
                  </span>
                ) : (
                  formData.clubOfficials.map((id) => (
                    <Pill
                      key={id}
                      label={id}
                      onRemove={() => removePill("clubOfficials", id)}
                      color="blue"
                    />
                  ))
                )}
              </div>
              <input
                type="text"
                placeholder="e.g., Dr. Smith, Prof. Lee, or FAC001, FAC002"
                value={facultyInput}
                onChange={(e) => setFacultyInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A]"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter faculty names or IDs separated by commas
              </p>
              {formErrors.clubOfficials && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.clubOfficials}
                </p>
              )}
            </div>

            {/* Core Members (Free Text Input) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Core Members * ({formData.coreMembers.length} selected)
              </label>
              <div
                className={`border rounded-md p-2 min-h-10 bg-gray-50 flex flex-wrap gap-1 mb-2 ${
                  formErrors.coreMembers ? "border-red-500" : "border-gray-300"
                }`}
              >
                {formData.coreMembers.length === 0 ? (
                  <span className="text-gray-500 text-sm italic">
                    None selected
                  </span>
                ) : (
                  formData.coreMembers.map((id) => (
                    <Pill
                      key={id}
                      label={id}
                      onRemove={() => removePill("coreMembers", id)}
                      color="green"
                    />
                  ))
                )}
              </div>
              <input
                type="text"
                placeholder="e.g., Alice, Bob, Charlie or STD001, STD002"
                value={coreMembersInput}
                onChange={(e) => setCoreMembersInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A]"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter names or IDs separated by commas
              </p>
              {formErrors.coreMembers && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.coreMembers}
                </p>
              )}
            </div>

            {/* Center Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Location *
              </label>
              <div className="relative">
                <select
                  name="centerLocation"
                  value={formData.centerLocation}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none ${
                    formErrors.centerLocation
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${prefillLocation ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  disabled={!!prefillLocation || isSubmitting}
                >
                  <option value="">Select Location</option>
                  <option>{prefillLocation}</option>
                </select>
                {!prefillLocation && !isSubmitting && (
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={18}
                  />
                )}
              </div>
              {formErrors.centerLocation && !prefillLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.centerLocation}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-sm text-slate-900 hover:bg-gray-100 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50 duration-200 transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                "Create Club"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PillProps {
  label: string;
  onRemove: () => void;
  color?: "blue" | "green" | "gray";
}

function Pill({ label, onRemove, color = "gray" }: PillProps) {
  const colors = {
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${colors[color]} transition-all`}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-red-500 hover:text-red-700 font-bold leading-none"
        aria-label={`Remove ${label}`}
      >
        ×
      </button>
    </span>
  );
}

export default AddClubModal;
