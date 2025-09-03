import React, { useState } from "react";
import axios from "axios";

interface AddCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCenterCreated: (centerData: {
    centerName: string;
    location: string;
    code: string;
  }) => void;
}

interface FormData {
  centerName: string;
  location: string;
  code: string;
}

const AddCenterModal: React.FC<AddCenterModalProps> = ({
  isOpen,
  onClose,
  onCenterCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    centerName: "",
    location: "",
    code: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        centerName: "",
        location: "",
        code: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!formData.centerName.trim()) {
      errors.centerName = "Center name is required";
    } else if (formData.centerName.length > 100) {
      errors.centerName = "Center name must be less than 100 characters";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    } else if (formData.location.length > 200) {
      errors.location = "Location must be less than 200 characters";
    }

    if (!formData.code.trim()) {
      errors.code = "Code is required";
    } else if (!/^\d+$/.test(formData.code)) {
      errors.code = "Code must be a number";
    } else if (parseInt(formData.code) < 1 || parseInt(formData.code) > 999) {
      errors.code = "Code must be between 1 and 999";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.centerName,
        location: formData.location,
        code: Number(formData.code),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/create`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        onCenterCreated(formData);
        setFormData({ centerName: "", location: "", code: "" });
        setFormErrors({});
        onClose();
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setFormErrors({ submit: error.response.data.message });
      } else {
        setFormErrors({ submit: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ centerName: "", location: "", code: "" });
      setFormErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm p-6 max-w-md w-full border border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Center</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Name *
              </label>
              <input
                type="text"
                name="centerName"
                value={formData.centerName}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore Tech Hub"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.centerName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
                maxLength={100}
              />
              {formErrors.centerName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.centerName}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter a descriptive name for the center (max 100 characters)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Electronic City, Bangalore, Karnataka"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] resize-vertical ${
                  formErrors.location ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
                maxLength={200}
              />
              {formErrors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.location}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the full address of the center (max 200 characters)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., 1, 2, 3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.code ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
                maxLength={3}
              />
              {formErrors.code && (
                <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter a unique numeric code (1–999)
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
                "Create Center"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCenterModal;
