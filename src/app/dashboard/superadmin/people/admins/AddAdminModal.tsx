import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminCreated: (adminData: {
    name: string;
    email: string;
    phoneNumber: string;
    linkedinLink: string;
    designation: string;
    role: "ADMIN" | "OPS" | "BATCHOPS" | "SUPER_ADMIN";
  }) => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  linkedinLink: string;
  designation: string;
  role: string;
}

const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "OPS", label: "Operations" },
  { value: "BATCHOPS", label: "Batch Operations" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onAdminCreated,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    linkedinLink: "",
    designation: "",
    role: "",
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
        name: "",
        email: "",
        phoneNumber: "",
        linkedinLink: "",
        designation: "",
        role: "",
      });
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

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(
        formData.phoneNumber.replace(/[\s\-\(\)]/g, "")
      )
    ) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (!formData.role.trim()) {
      errors.role = "Role is required";
    }

    if (
      formData.linkedinLink &&
      !formData.linkedinLink.includes("linkedin.com")
    ) {
      errors.linkedinLink = "Please enter a valid LinkedIn URL";
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

    onAdminCreated({
      ...formData,
      role: formData.role as "ADMIN" | "OPS" | "BATCHOPS" | "SUPER_ADMIN",
    });

    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      linkedinLink: "",
      designation: "",
      role: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        linkedinLink: "",
        designation: "",
        role: "",
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
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Admin</h3>

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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., +1 202 555 0198"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleInputChange}
                placeholder="e.g., https://linkedin.com/in/johnsmith"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.linkedinLink ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.linkedinLink && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.linkedinLink}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional - Include full LinkedIn URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="e.g., System Administrator"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.designation ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.designation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.designation}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.role && (
                <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
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
                "Create Admin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
