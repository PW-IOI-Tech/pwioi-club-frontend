import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated: (batchData: {
    centerName: string;
    depName: string;
    batchName: string;
    schoolId: string;
  }) => void;
  prefillLocation?: string;
  centerId?: string;
}

interface FormData {
  centerId: string;
  centerName: string;
  depName: string;
  batchName: string;
  schoolId: string;
}

interface School {
  id: string;
  name: string;
}
const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onBatchCreated,
  prefillLocation,
  centerId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    centerId: "",
    centerName: "",
    depName: "",
    batchName: "",
    schoolId: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch schools when centerId is available
  useEffect(() => {
    const fetchSchools = async () => {
      if (!centerId) return;

      setLoadingSchools(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/schools/${centerId}`, {
          withCredentials: true,
        });

        const fetchedSchools: School[] = res.data.data.map((school: any) => ({
          id: school.id,
          name: school.name,
        }));

        setSchools(fetchedSchools);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };

    if (isOpen && centerId) {
      fetchSchools();
    }
  }, [isOpen, centerId]);

  useEffect(() => {
    if (isOpen) {
      if (prefillLocation && centerId) {
        setFormData({
          centerId,
          centerName: prefillLocation,
          depName: "",
          batchName: "",
          schoolId: "",
        });
      } else {
        setFormData({
          centerId: "",
          centerName: "",
          depName: "",
          batchName: "",
          schoolId: "",
        });
      }
      setFormErrors({});
    }
  }, [isOpen, prefillLocation, centerId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "depName") {
      const selectedSchool = schools.find((s) => s.name === value);
      setFormData((prev) => ({
        ...prev,
        depName: value,
        schoolId: selectedSchool?.id || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
      errors.centerName = "Center is required";
    }

    if (!formData.depName.trim()) {
      errors.depName = "School is required";
    }

    if (!formData.schoolId.trim()) {
      errors.depName = "School selection is required";
    }

    if (!formData.batchName.trim()) {
      errors.batchName = "Batch name is required";
    } else if (formData.batchName.length < 3) {
      errors.batchName = "Batch name must be at least 3 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onBatchCreated(formData);
      setFormData({
        centerId: centerId || "",
        centerName: prefillLocation || "",
        depName: "",
        batchName: "",
        schoolId: "",
      });
      setFormErrors({});
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        centerId: centerId || "",
        centerName: prefillLocation || "",
        depName: "",
        batchName: "",
        schoolId: "",
      });
      setFormErrors({});
      onClose();
    }
  };

  const generateBatchName = (center: string, department: string) => {
    if (!center || !department) return "";
    const year = new Date().getFullYear().toString().slice(-2);
    const centerCode = center.slice(0, 3).toUpperCase();
    return `${department}${year}${centerCode}`;
  };

  useEffect(() => {
    if (formData.centerName && formData.depName) {
      const suggestedName = generateBatchName(
        formData.centerName,
        formData.depName
      );
      if (!formData.batchName) {
        setFormData((prev) => ({
          ...prev,
          batchName: suggestedName,
        }));
      }
    }
  }, [formData.centerName, formData.depName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm p-6 max-w-md w-full border border-gray-400">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Batch</h3>

        {formErrors.submit && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
            {formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center *
              </label>
              <div className="relative">
                <select
                  name="centerName"
                  value={formData.centerName}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-gray-50 cursor-not-allowed ${
                    formErrors.centerName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled
                >
                  <option value={formData.centerName}>
                    {formData.centerName}
                  </option>
                </select>

                {!prefillLocation && !isSubmitting && (
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={18}
                  />
                )}
              </div>
              {formErrors.centerName && !prefillLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.centerName}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <div className="relative">
                <select
                  name="depName"
                  value={formData.depName}
                  onChange={handleInputChange}
                  className={`w-full pl-2 pr-10 py-2 border rounded-md bg-white focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] appearance-none cursor-pointer ${
                    formErrors.depName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting || loadingSchools}
                >
                  <option value="">
                    {loadingSchools ? "Loading schools..." : "Select School"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
              {formErrors.depName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.depName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name *
              </label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                placeholder="e.g., SOT24BAN"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3A6A] focus:border-[#1B3A6A] ${
                  formErrors.batchName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {formErrors.batchName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.batchName}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Auto-suggested based on center and school selection
              </p>
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
              className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 flex items-center disabled:opacity-50"
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
                "Create Batch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;
