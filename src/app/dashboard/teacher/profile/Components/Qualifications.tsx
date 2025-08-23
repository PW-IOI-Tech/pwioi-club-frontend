import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit3, X, Trash2, Award } from "lucide-react";

interface Qualification {
  id?: string;
  degree: string;
  institution: string;
  field_of_study: string;
  grade: number;
  start_date: string;
  end_date: string;
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

interface AddQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (qualification: Qualification) => void;
}

const AddQualificationModal: React.FC<AddQualificationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Qualification>({
    degree: "",
    institution: "",
    field_of_study: "",
    grade: 0,
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Qualification, string>>
  >({});

  const degreeOptions = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree (PhD)",
    "Professional Degree",
    "Certificate Program",
    "Teaching Certificate",
    "Teaching Diploma",
    "B.Ed (Bachelor of Education)",
    "M.Ed (Master of Education)",
    "Other",
  ];

  const handleInputChange = (
    field: keyof Qualification,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Qualification, string>> = {};
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.institution.trim())
      newErrors.institution = "Institution is required";
    if (!formData.field_of_study.trim())
      newErrors.field_of_study = "Field of study is required";

    if (!formData.grade || formData.grade <= 0) {
      newErrors.grade = "Grade is required and must be greater than 0";
    } else if (formData.grade > 100) {
      newErrors.grade = "Grade cannot exceed 100%";
    }

    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    } else if (
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd({
        ...formData,
        id: Date.now().toString(),
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        field_of_study: formData.field_of_study.trim(),
        grade: Number(formData.grade),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      degree: "",
      institution: "",
      field_of_study: "",
      grade: 0,
      start_date: "",
      end_date: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Qualification">
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Degree/Certificate *
          </label>
          <select
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
              errors.degree ? "border-red-400" : "border-gray-400"
            }`}
          >
            <option value="">Select a qualification</option>
            {degreeOptions.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
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
            placeholder="e.g., University of Education, Teachers College"
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
            Field of Study/Specialization *
          </label>
          <input
            type="text"
            value={formData.field_of_study}
            onChange={(e) => handleInputChange("field_of_study", e.target.value)}
            placeholder="e.g., Mathematics Education, Elementary Education"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.field_of_study ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.field_of_study && (
            <p className="mt-1 text-sm text-red-600">{errors.field_of_study}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Grade/GPA (%) *
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
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.start_date ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.end_date ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
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
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out"
          >
            Add Qualification
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface EditQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (qualification: Qualification) => void;
  qualification: Qualification | null;
}

const EditQualificationModal: React.FC<EditQualificationModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  qualification,
}) => {
  const [formData, setFormData] = useState<Qualification>({
    degree: "",
    institution: "",
    field_of_study: "",
    grade: 0,
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Qualification, string>>
  >({});

  const degreeOptions = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree (PhD)",
    "Professional Degree",
    "Certificate Program",
    "Teaching Certificate",
    "Teaching Diploma",
    "B.Ed (Bachelor of Education)",
    "M.Ed (Master of Education)",
    "Other",
  ];

  // Update form data when qualification changes
  useEffect(() => {
    if (qualification) {
      setFormData(qualification);
    }
  }, [qualification]);

  const handleInputChange = (
    field: keyof Qualification,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Qualification, string>> = {};

    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required";
    }

    if (!formData.field_of_study.trim()) {
      newErrors.field_of_study = "Field of study is required";
    }

    if (!formData.grade || formData.grade <= 0) {
      newErrors.grade = "Grade is required and must be greater than 0";
    } else if (formData.grade > 100) {
      newErrors.grade = "Grade cannot exceed 100%";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    } else if (
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
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
        field_of_study: formData.field_of_study.trim(),
        grade: Number(formData.grade),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    if (qualification) {
      setFormData(qualification);
    }
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Qualification">
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Degree/Certificate *
          </label>
          <select
            value={formData.degree}
            onChange={(e) => handleInputChange("degree", e.target.value)}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.degree ? "border-red-400" : "border-gray-400"
            }`}
          >
            <option value="">Select a qualification</option>
            {degreeOptions.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
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
            placeholder="e.g., University of Education, Teachers College"
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
            Field of Study/Specialization *
          </label>
          <input
            type="text"
            value={formData.field_of_study}
            onChange={(e) => handleInputChange("field_of_study", e.target.value)}
            placeholder="e.g., Mathematics Education, Elementary Education"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.field_of_study ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.field_of_study && (
            <p className="mt-1 text-sm text-red-600">{errors.field_of_study}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Grade/GPA (%) *
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
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.start_date ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.end_date ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
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
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out"
          >
            Update Qualification
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  qualificationTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  qualificationTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Qualification">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{qualificationTitle}&rdquo;</strong>? This action
          cannot be undone.
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

const Qualifications: React.FC = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQualification, setSelectedQualification] =
    useState<Qualification | null>(null);
  const [_editIndex, setEditIndex] = useState<number | null>(null);

  const storedTeacher = localStorage.getItem("user");
let teacherId: string | null = null;

if (storedTeacher) {
  try {
    const parsedTeacher = JSON.parse(storedTeacher);
    teacherId = parsedTeacher?.id || null;
  } catch (error) {
    console.error("Error parsing teacher from localStorage:", error);
  }
}

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/${teacherId}/academic-history`,{withCredentials:true});
        if (res.data) {
          const q: Qualification[] = Object.values(res.data)
            .filter(Boolean)
            .map((edu: any) => ({
              id: edu.id,
              degree: edu.degree,
              institution: edu.institution,
              field_of_study: edu.field_of_study,
              grade: edu.grade,
              start_date: edu.start_date,
              end_date: edu.end_date,
            }));
          setQualifications(q);
        }
      } catch (err) {
        console.error("Failed to fetch qualifications", err);
      }
    };
    fetchQualifications();
  }, [teacherId]);

  const handleAddQualification = async (newQualification: Qualification) => {
    try {
      const payload = {
        degree: newQualification.degree,
        institution: newQualification.institution,
        field_of_study: newQualification.field_of_study,
        grade: newQualification.grade,
        start_date: newQualification.start_date,
        end_date: newQualification.end_date,
      };
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/${teacherId}/academic-history`,
        payload,{withCredentials:true}
      );
      setQualifications((prev) => [...prev, { ...newQualification, id: res.data.id }]);
    } catch (err) {
      console.error("Failed to add qualification", err);
    }
    setShowAddModal(false);
  };

const handleEditQualification = async (updatedQualification: Qualification) => {
  if (!updatedQualification.id) return;
  try {
    const payload = {
      degree: updatedQualification.degree,
      institution: updatedQualification.institution,
      field_of_study: updatedQualification.field_of_study,
      grade: updatedQualification.grade,
      start_date: updatedQualification.start_date,
      end_date: updatedQualification.end_date,
    };

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/${teacherId}/academic-history/${updatedQualification.id}`,
      payload,
      { withCredentials: true }
    );

    setQualifications((prev) =>
      prev.map((q) =>
        q.id === updatedQualification.id ? { ...updatedQualification, ...res.data } : q
      )
    );
  } catch (err) {
    console.error("Failed to edit qualification", err);
  }
  setShowEditModal(false);
};


const handleDeleteQualification = async () => {
  if (selectedQualification?.id) {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/${teacherId}/academic-history/${selectedQualification.id}`,
        { withCredentials: true }
      );

      setQualifications((prev) =>
        prev.filter((q) => q.id !== selectedQualification.id)
      );
    } catch (err) {
      console.error("Failed to delete qualification", err);
    }
  }
  setShowDeleteModal(false);
};


  const openEditModal = (qualification: Qualification, index: number) => {
    setSelectedQualification(qualification);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (qualification: Qualification, index: number) => {
    setSelectedQualification(qualification);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        <AddQualificationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddQualification}
        />

        <EditQualificationModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditQualification}
          qualification={selectedQualification}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteQualification}
          qualificationTitle={
            selectedQualification
              ? `${selectedQualification.degree} at ${selectedQualification.institution}`
              : undefined
          }
        />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Qualifications</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {qualifications.length>0 && qualifications.map((qual, index) => (
            <div
              key={qual.id || index}
              className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md hover:border-blue-800"
            >
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-900 mb-1">
                      {qual?.degree}
                    </h4>
                    <p className="text-sm text-slate-800">{qual?.institution}</p>
                    <p className="text-sm text-slate-700 font-medium mb-3">
                      {qual?.field_of_study}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                        Grade: {qual.grade}%
                      </span>
                      <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                        {new Date(qual?.start_date).getFullYear()} -{" "}
                        {new Date(qual?.end_date).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(qual, index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-sm cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(qual, index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {qualifications.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                Add Teaching Qualification
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Qualifications;
