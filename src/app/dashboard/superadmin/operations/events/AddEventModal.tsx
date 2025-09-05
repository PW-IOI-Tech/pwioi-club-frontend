import React, { useState } from "react";
import { ChevronDown, X, Eye, EyeOff } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (eventData: {
    eventName: string;
    organizer: string;
    venue: string;
    type:
      | "workshop"
      | "seminar"
      | "conference"
      | "hackathon"
      | "webinar"
      | "networking";
    startDate: string;
    endDate: string;
    description: string;
    isVisible: string;
    thumbnailUrl: string;
  }) => void;
}

interface FormData {
  eventName: string;
  organizer: string;
  venue: string;
  type:
    | "workshop"
    | "seminar"
    | "conference"
    | "hackathon"
    | "webinar"
    | "networking"
    | "";
  startDate: string;
  endDate: string;
  description: string;
  isVisible: string;
  thumbnailUrl: string;
}

const eventTypes = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "hackathon", label: "Hackathon" },
  { value: "webinar", label: "Webinar" },
  { value: "networking", label: "Networking" },
];

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    organizer: "",
    venue: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    isVisible: "true",
    thumbnailUrl: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        eventName: "",
        organizer: "",
        venue: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        isVisible: "true",
        thumbnailUrl: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    if (!formData.eventName.trim()) {
      errors.eventName = "Event name is required";
    }

    if (!formData.organizer.trim()) {
      errors.organizer = "Organizer is required";
    }

    if (!formData.venue.trim()) {
      errors.venue = "Venue is required";
    }

    if (!formData.type) {
      errors.type = "Event type is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        errors.endDate = "End date must be after start date";
      }
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      errors.thumbnailUrl = "Please enter a valid URL";
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

    onEventCreated({
      eventName: formData.eventName,
      organizer: formData.organizer,
      venue: formData.venue,
      type: formData.type as
        | "workshop"
        | "seminar"
        | "conference"
        | "hackathon"
        | "webinar"
        | "networking",
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      isVisible: formData.isVisible,
      thumbnailUrl: formData.thumbnailUrl,
    });

    setFormData({
      eventName: "",
      organizer: "",
      venue: "",
      type: "",
      startDate: "",
      endDate: "",
      description: "",
      isVisible: "true",
      thumbnailUrl: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        eventName: "",
        organizer: "",
        venue: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        isVisible: "true",
        thumbnailUrl: "",
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
          Add New Event
        </h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="e.g., Tech Innovation Summit 2025"
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.eventName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.eventName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.eventName}
                </p>
              )}
            </div>

            {/* Organizer and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Community"
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.organizer ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.organizer && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.organizer}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore Convention Center"
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.venue ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.venue && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.venue}
                  </p>
                )}
              </div>
            </div>

            {/* Event Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type *
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.type ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map((type) => (
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
              {formErrors.type && (
                <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
              )}
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
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
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/event-thumbnail.jpg"
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.thumbnailUrl ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.thumbnailUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.thumbnailUrl}
                </p>
              )}
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible == "true"}
                  onChange={handleInputChange}
                  className="sr-only"
                  disabled={isSubmitting}
                />
                <div className="relative">
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      formData.isVisible ? "bg-[#1B3A6A]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.isVisible ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                  {formData.isVisible ? (
                    <>
                      <Eye size={16} className="mr-1" />
                      Event is visible
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} className="mr-1" />
                      Event is hidden
                    </>
                  )}
                </span>
              </label>
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
                placeholder="Enter detailed event description..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] resize-vertical ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
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
              className="px-4 py-2 bg-[#12294c] text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50 cursor-pointer duration-200 ease-in-out transition-transform"
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
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
