import { useEffect, useState } from "react";
import { Plus, Edit3, X, Trash2, GraduationCap } from "lucide-react";
import axios from "axios";

const mapEducationToBackend = (edu: AcademicHistory) => ({
  degree: edu.degree,
  institution: edu.institution,
  field_of_study: edu.fieldOfStudy,
  grade: edu.grade,
  start_date: edu.startDate,
  end_date: edu.endDate,
});

const mapDegreeLabel = (degree: string) => {
  switch (degree) {
    case "undergraduate":
      return "Undergraduation";
    case "x_education":
      return "10th Education";
    case "xii_education":
      return "12th Education";
    default:
      return degree;
  }
};

interface AcademicHistory {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  grade: number;
  startDate: string;
  endDate: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-sm shadow-2xl border border-gray-400 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface AddAcademicHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (education: AcademicHistory) => void;
}

const AddAcademicHistoryModal: React.FC<AddAcademicHistoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<AcademicHistory>({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    grade: 0,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AcademicHistory, string>>
  >({});

  const degreeOptions = [
    { label: "10th Education", value: "x_education" },
    { label: "12th Education", value: "xii_education" },
    { label: "Undergraduation", value: "undergraduate" },
  ];

  const handleInputChange = (
    field: keyof AcademicHistory,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AcademicHistory, string>> = {};
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.institution.trim())
      newErrors.institution = "Institution is required";
    if (!formData.fieldOfStudy.trim())
      newErrors.fieldOfStudy = "Field of study is required";

    if (!formData.grade || formData.grade <= 0) {
      newErrors.grade = "Grade is required and must be greater than 0";
    } else if (formData.grade > 100) {
      newErrors.grade = "Grade cannot exceed 100%";
    }

    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (
      formData.endDate &&
      new Date(formData.endDate) >
        new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
    ) {
      newErrors.endDate = "End date seems too far in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd({
        ...formData,
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        grade: Number(formData.grade),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      degree: "",
      institution: "",
      fieldOfStudy: "",
      grade: 0,
      startDate: "",
      endDate: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Education">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Degree *
          </label>
          <select
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.degree ? "border-red-400" : "border-gray-400"
            }`}
          >
            <option value="">Select a degree</option>
            {degreeOptions.map((degree) => (
              <option key={degree.value} value={degree.value}>
                {degree.label}
              </option>
            ))}
          </select>
          {errors.degree && (
            <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Institution *
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange("institution", e.target.value)}
            placeholder="e.g., Harvard University, MIT, Stanford"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.institution ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.institution && (
            <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Field of Study *
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
            placeholder="e.g., Computer Science, Business Administration"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.fieldOfStudy ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.fieldOfStudy && (
            <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Grade (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.grade || ""}
            onChange={(e) =>
              handleInputChange("grade", parseFloat(e.target.value) || 0)
            }
            placeholder="e.g., 85.5"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.grade ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.grade && (
            <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
                errors.startDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
                errors.endDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#12294c] text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out"
          >
            Add Education
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface EditAcademicHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (education: AcademicHistory) => void;
  education: AcademicHistory | null;
}

const EditAcademicHistoryModal: React.FC<EditAcademicHistoryModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  education,
}) => {
  const [formData, setFormData] = useState<AcademicHistory>({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    grade: 0,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AcademicHistory, string>>
  >({});

  const degreeOptions = [
    { label: "10th Education", value: "x_education" },
    { label: "12th Education", value: "xii_education" },
    { label: "Undergraduation", value: "undergraduate" },
  ];

  useEffect(() => {
    if (education) {
      setFormData(education);
    }
  }, [education]);

  const handleInputChange = (
    field: keyof AcademicHistory,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AcademicHistory, string>> = {};

    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required";
    }

    if (!formData.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Field of study is required";
    }

    if (!formData.grade || formData.grade <= 0) {
      newErrors.grade = "Grade is required and must be greater than 0";
    } else if (formData.grade > 100) {
      newErrors.grade = "Grade cannot exceed 100%";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onEdit({
        ...formData,
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        grade: Number(formData.grade),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    if (education) {
      setFormData(education);
    }
    setErrors({});
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Education">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Degree *
          </label>
          <select
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.degree ? "border-red-400" : "border-gray-400"
            }`}
          >
            <option value="">Select a degree</option>
            {degreeOptions.map((degree) => (
              <option key={degree.value} value={degree.value}>
                {degree.label}
              </option>
            ))}
          </select>

          {errors.degree && (
            <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Institution *
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange("institution", e.target.value)}
            placeholder="e.g., Harvard University, MIT, Stanford"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.institution ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.institution && (
            <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Field of Study *
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
            placeholder="e.g., Computer Science, Business Administration"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.fieldOfStudy ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.fieldOfStudy && (
            <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Grade (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.grade || ""}
            onChange={(e) =>
              handleInputChange("grade", parseFloat(e.target.value) || 0)
            }
            placeholder="e.g., 85.5"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.grade ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.grade && (
            <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.startDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.endDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#12294c] text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out"
          >
            Update Education
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  educationTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  educationTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Education">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{educationTitle}&rdquo;</strong>? This action cannot be
          undone.
        </p>
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AcademicHistoryCard: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.id;
  const [academicHistory, setAcademicHistory] = useState<AcademicHistory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEducation, setSelectedEducation] =
    useState<AcademicHistory | null>(null);
  const [_editIndex, setEditIndex] = useState<number | null>(null);

  const fetchAcademicHistory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/academic-history`,
        { withCredentials: true }
      );
      if (res.data?.data) {
        const { undergrad, xEducation, xiiEducation } = res.data.data;

        const formatted: AcademicHistory[] = [];
        if (undergrad) {
          formatted.push({
            id: undergrad.id,
            degree: mapDegreeLabel(undergrad.degree),
            institution: undergrad.institution,
            fieldOfStudy: undergrad.field_of_study,
            grade: undergrad.grade,
            startDate: undergrad.start_date,
            endDate: undergrad.end_date,
          });
        }
        if (xEducation) {
          formatted.push({
            id: xEducation.id,
            degree: mapDegreeLabel(xEducation.degree),
            institution: xEducation.institution,
            fieldOfStudy: xEducation.field_of_study,
            grade: xEducation.grade,
            startDate: xEducation.start_date,
            endDate: xEducation.end_date,
          });
        }
        if (xiiEducation) {
          formatted.push({
            id: xiiEducation.id,
            degree: mapDegreeLabel(xiiEducation.degree),
            institution: xiiEducation.institution,
            fieldOfStudy: xiiEducation.field_of_study,
            grade: xiiEducation.grade,
            startDate: xiiEducation.start_date,
            endDate: xiiEducation.end_date,
          });
        }
        setAcademicHistory(formatted);
      }
    } catch (error) {
      console.error("Error fetching academic history", error);
    }
  };

  useEffect(() => {
    fetchAcademicHistory();
  }, [studentId]);

  const handleAddEducation = async (newEducation: AcademicHistory) => {
    try {
      const payload: any = {};

      if (newEducation.degree === "undergraduate") {
        payload.undergraduate = mapEducationToBackend(newEducation);
      } else if (newEducation.degree === "x_education") {
        payload.x_education = mapEducationToBackend(newEducation);
      } else if (newEducation.degree === "xii_education") {
        payload.xii_education = mapEducationToBackend(newEducation);
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/academic-history`,
        payload,
        { withCredentials: true }
      );

      fetchAcademicHistory();
    } catch (error) {
      console.error("Error adding education", error);
    }
    setShowAddModal(false);
  };

  const handleEditEducation = async (updatedEducation: AcademicHistory) => {
    try {
      const payload: any = {};

      if (updatedEducation.degree === "undergraduate") {
        payload.undergraduate = mapEducationToBackend(updatedEducation);
      } else if (updatedEducation.degree === "x_education") {
        payload.x_education = mapEducationToBackend(updatedEducation);
      } else if (updatedEducation.degree === "xii_education") {
        payload.xii_education = mapEducationToBackend(updatedEducation);
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/academic-history`,
        payload,
        { withCredentials: true }
      );

      fetchAcademicHistory();
    } catch (error) {
      console.error("Error editing education", error);
    }
    setShowEditModal(false);
  };

  const handleDeleteEducation = async () => {
    try {
      if (!selectedEducation?.id) return;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/academic-history/${selectedEducation.id}`,
        { withCredentials: true }
      );
      fetchAcademicHistory();
    } catch (error) {
      console.error("Error deleting education", error);
    }
    setShowDeleteModal(false);
  };

  const openEditModal = (education: AcademicHistory, index: number) => {
    setSelectedEducation(education);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (education: AcademicHistory, index: number) => {
    setSelectedEducation(education);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Academic History</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {academicHistory.map((edu, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md hover:border-blue-800"
            >
              <div className="h-8 w-8 rounded-full bg-[#12294c] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-900 mb-1">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-slate-800">{edu.institution}</p>
                    <p className="text-sm text-slate-700 font-medium mb-3">
                      {edu.fieldOfStudy}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="px-4 py-1 bg-[#12294c] text-white rounded-full">
                        Grade: {edu.grade}%
                      </span>
                      <span className="px-4 py-1 bg-[#12294c] text-white rounded-full">
                        {new Date(edu.startDate).getFullYear()} -{" "}
                        {new Date(edu.endDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(edu, index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-sm cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(edu, index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {academicHistory.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                Add Education
              </span>
            </button>
          )}
        </div>
      </div>

      <AddAcademicHistoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEducation}
      />
      <EditAcademicHistoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditEducation}
        education={selectedEducation}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEducation}
        educationTitle={
          selectedEducation
            ? `${selectedEducation.degree} at ${selectedEducation.institution}`
            : undefined
        }
      />
    </>
  );
};

export default AcademicHistoryCard;
