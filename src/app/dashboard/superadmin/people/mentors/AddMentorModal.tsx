import React, { useState } from "react";
import axios from "axios";

interface AddMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMentorAdded: (mentor: any) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  designation: string;
  company: string;
}

const AddMentorModal: React.FC<AddMentorModalProps> = ({
  isOpen,
  onClose,
  onMentorAdded,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    designation: "",
    company: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const EMAIL_REGEX =
      /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "A valid email is required";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (!formData.company.trim()) {
      errors.company = "Company is required";
    }

    if (!formData.linkedin.trim()) {
      errors.linkedin = "LinkedIn URL is required";
    } else {
      let urlToTest = formData.linkedin.trim();

      if (
        !urlToTest.startsWith("http://") &&
        !urlToTest.startsWith("https://")
      ) {
        urlToTest = "https://" + urlToTest;
      }

      try {
        const url = new URL(urlToTest);

        if (
          !url.hostname.endsWith("linkedin.com") &&
          !/^linkedin\.[a-z]{2,}$/.test(url.hostname)
        ) {
          errors.linkedin =
            "URL must be from linkedin.com or its regional domains (e.g., linkedin.in)";
        }

        if (
          !url.pathname.startsWith("/in/") &&
          !url.pathname.startsWith("/company/") &&
          !url.pathname.startsWith("/school/")
        ) {
          errors.linkedin =
            "Please enter a valid LinkedIn profile or page URL (e.g., linkedin.com/in/username)";
        }
      } catch {
        errors.linkedin = "Please enter a valid URL";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          designation: formData.designation,
          company: formData.company,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        onMentorAdded(res.data.data);
        handleClose();
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        designation: "",
        company: "",
      });
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
      <div className="bg-white rounded-sm p-6 max-w-lg w-full border border-gray-400 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Mentor</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Smith"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., john.smith@company.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +91 9876543210"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile *
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="e.g., https://linkedin.com/in/johnsmith"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.linkedin ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.linkedin && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.linkedin}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Please include the full LinkedIn profile URL
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineer"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.designation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.designation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.designation}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Google"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                    formErrors.company ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.company && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company}
                </p>
              )}
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
                "Create Mentor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMentorModal;
