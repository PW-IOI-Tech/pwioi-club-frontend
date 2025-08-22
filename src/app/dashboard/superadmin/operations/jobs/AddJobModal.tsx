import React, { useState } from "react";
import { ChevronDown, Plus, Minus, X } from "lucide-react";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (jobData: {
    jobTitle: string;
    location: string;
    jdLink: string;
    workMode: "online" | "onsite" | "hybrid";
    jobType: "internship" | "full-time";
    companyName: string;
    vacancyCount: string;
    eligibility: string;
    desc: string;
    closingDate: string;
  }) => void;
}

interface FormData {
  jobTitle: string;
  location: string;
  jdLink: string;
  workMode: "online" | "onsite" | "hybrid" | "";
  jobType: "internship" | "full-time" | "";
  companyName: string;
  vacancyCount: string;
  eligibility: string;
  desc: string;
  closingDate: string;
}

const workModes = [
  { value: "online", label: "Online" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

const jobTypes = [
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full-time" },
];

const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    location: "",
    jdLink: "",
    workMode: "",
    jobType: "",
    companyName: "",
    vacancyCount: "1",
    eligibility: "",
    desc: "",
    closingDate: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        jobTitle: "",
        location: "",
        jdLink: "",
        workMode: "",
        jobType: "",
        companyName: "",
        vacancyCount: "1",
        eligibility: "",
        desc: "",
        closingDate: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

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

  const handleVacancyCountChange = (increment: boolean) => {
    const currentCount = parseInt(formData.vacancyCount) || 1;
    const newCount = increment
      ? currentCount + 1
      : Math.max(1, currentCount - 1);

    setFormData((prev) => ({ ...prev, vacancyCount: newCount.toString() }));

    if (formErrors.vacancyCount) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.vacancyCount;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.jdLink.trim()) {
      errors.jdLink = "Job description link is required";
    } else if (!isValidUrl(formData.jdLink)) {
      errors.jdLink = "Please enter a valid URL";
    }

    if (!formData.workMode) {
      errors.workMode = "Work mode is required";
    }

    if (!formData.jobType) {
      errors.jobType = "Job type is required";
    }

    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    if (!formData.vacancyCount || parseInt(formData.vacancyCount) < 1) {
      errors.vacancyCount = "Vacancy count must be at least 1";
    }

    if (!formData.eligibility.trim()) {
      errors.eligibility = "Eligibility criteria is required";
    }

    if (!formData.desc.trim()) {
      errors.desc = "Job description is required";
    } else if (formData.desc.length < 20) {
      errors.desc = "Description must be at least 20 characters";
    }

    if (!formData.closingDate) {
      errors.closingDate = "Closing date is required";
    } else {
      const selectedDate = new Date(formData.closingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.closingDate = "Closing date must be today or in the future";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    onJobCreated({
      jobTitle: formData.jobTitle,
      location: formData.location,
      jdLink: formData.jdLink,
      workMode: formData.workMode as "online" | "onsite" | "hybrid",
      jobType: formData.jobType as "internship" | "full-time",
      companyName: formData.companyName,
      vacancyCount: formData.vacancyCount,
      eligibility: formData.eligibility,
      desc: formData.desc,
      closingDate: formData.closingDate,
    });

    setFormData({
      jobTitle: "",
      location: "",
      jdLink: "",
      workMode: "",
      jobType: "",
      companyName: "",
      vacancyCount: "1",
      eligibility: "",
      desc: "",
      closingDate: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        jobTitle: "",
        location: "",
        jdLink: "",
        workMode: "",
        jobType: "",
        companyName: "",
        vacancyCount: "1",
        eligibility: "",
        desc: "",
        closingDate: "",
      });
      setFormErrors({});
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-400 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors duration-200 cursor-pointer"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-4 pr-8">
          Add New Job
        </h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Software Developer"
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.jobTitle ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.jobTitle}
                </p>
              )}
            </div>

            {/* Location and Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore"
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Corp"
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.companyName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.companyName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.companyName}
                  </p>
                )}
              </div>
            </div>

            {/* JD Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description Link *
              </label>
              <input
                type="url"
                name="jdLink"
                value={formData.jdLink}
                onChange={handleInputChange}
                placeholder="https://example.com/job-posting"
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.jdLink ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.jdLink && (
                <p className="mt-1 text-sm text-red-600">{formErrors.jdLink}</p>
              )}
            </div>

            {/* Work Mode and Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Mode *
                </label>
                <div className="relative">
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className={`w-full pl-2 pr-10 py-2 border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                      formErrors.workMode ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Work Mode</option>
                    {workModes.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={18}
                  />
                </div>
                {formErrors.workMode && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.workMode}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className={`w-full pl-2 pr-10 py-2 border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                      formErrors.jobType ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Job Type</option>
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={18}
                  />
                </div>
                {formErrors.jobType && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.jobType}
                  </p>
                )}
              </div>
            </div>

            {/* Vacancy Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vacancy Count *
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleVacancyCountChange(false)}
                  className="w-8 h-8 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] cursor-pointer"
                  disabled={
                    isSubmitting || parseInt(formData.vacancyCount) <= 1
                  }
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  name="vacancyCount"
                  value={formData.vacancyCount}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-20 px-3 py-2 border rounded-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.vacancyCount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => handleVacancyCountChange(true)}
                  className="w-8 h-8 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] cursor-pointer"
                  disabled={isSubmitting}
                >
                  <Plus size={16} />
                </button>
              </div>
              {formErrors.vacancyCount && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.vacancyCount}
                </p>
              )}
            </div>

            {/* Eligibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eligibility Criteria *
              </label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                placeholder="e.g., B.Tech/B.E in CS/IT"
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.eligibility ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.eligibility && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.eligibility}
                </p>
              )}
            </div>

            {/* Closing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Date *
              </label>
              <input
                type="date"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.closingDate ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.closingDate && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.closingDate}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                placeholder="Enter detailed job description..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] resize-vertical ${
                  formErrors.desc ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.desc && (
                <p className="mt-1 text-sm text-red-600">{formErrors.desc}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimum 20 characters required
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
                "Create Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
