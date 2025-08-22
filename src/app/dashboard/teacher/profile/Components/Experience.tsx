import { useEffect, useState } from "react";
import { Plus, Edit3, X, Trash2, Briefcase, ChevronDown } from "lucide-react";

interface TeacherExperience {
  id?: string;
  title: string;
  companyName: string;
  location?: string;
  workMode: string;
  startDate: string;
  endDate?: string;
  description?: string;
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

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (experience: TeacherExperience) => void;
}

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<TeacherExperience>({
    title: "",
    companyName: "",
    location: "",
    workMode: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherExperience, string>>
  >({});

  const workModeOptions = ["WFH", "WFO", "Hybrid"];

  const handleInputChange = (field: keyof TeacherExperience, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherExperience, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.workMode.trim()) newErrors.workMode = "Work mode is required";

    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (
      formData.endDate &&
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
        id: Date.now().toString(),
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location?.trim(),
        description: formData.description?.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      companyName: "",
      location: "",
      workMode: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Experience">
      <div className="space-y-2 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Mathematics Teacher, Principal"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.title ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="e.g., ABC School, XYZ Educational Institute"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.companyName ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., Bengaluru, Karnataka"
            className="w-full p-3 border border-gray-400 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Work Mode *
          </label>
          <div className="relative">
            <select
              value={formData.workMode}
              onChange={(e) => handleInputChange("workMode", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 appearance-none cursor-pointer ${
                errors.workMode ? "border-red-400" : "border-gray-400"
              }`}
            >
              <option value="">Select work mode</option>
              {workModeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.workMode && (
            <p className="mt-1 text-sm text-red-600">{errors.workMode}</p>
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
              End Date
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

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={4}
            className="w-full p-3 border border-gray-400 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none h-[75px]"
          />
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
            Add Experience
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (experience: TeacherExperience) => void;
  experience: TeacherExperience | null;
}

const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  experience,
}) => {
  const [formData, setFormData] = useState<TeacherExperience>({
    title: "",
    companyName: "",
    location: "",
    workMode: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherExperience, string>>
  >({});

  const workModeOptions = ["WFH", "WFO", "Hybrid"];

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    }
  }, [experience]);

  const handleInputChange = (field: keyof TeacherExperience, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherExperience, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.workMode.trim()) {
      newErrors.workMode = "Work mode is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (
      formData.endDate &&
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
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location?.trim(),
        description: formData.description?.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    if (experience) {
      setFormData(experience);
    }
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Experience">
      <div className="space-y-1 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Mathematics Teacher, Principal"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.title ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="e.g., ABC School, XYZ Educational Institute"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.companyName ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., Bengaluru, Karnataka"
            className="w-full p-3 border border-gray-400 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Work Mode *
          </label>
          <div className="relative">
            <select
              value={formData.workMode}
              onChange={(e) => handleInputChange("workMode", e.target.value)}
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 appearance-none cursor-pointer ${
                errors.workMode ? "border-red-400" : "border-gray-400"
              }`}
            >
              <option value="">Select work mode</option>
              {workModeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.workMode && (
            <p className="mt-1 text-sm text-red-600">{errors.workMode}</p>
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
              End Date
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

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={4}
            className="w-full p-3 border border-gray-400 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none h-[75px]"
          />
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
            Update Experience
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
  experienceTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  experienceTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Experience">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{experienceTitle}&rdquo;</strong>? This action cannot
          be undone.
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

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<TeacherExperience[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<TeacherExperience | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddExperience = (newExperience: TeacherExperience) => {
    setExperiences((prev) => [...prev, newExperience]);
    setShowAddModal(false);
  };

  const handleEditExperience = (updatedExperience: TeacherExperience) => {
    if (editIndex !== null) {
      setExperiences((prev) =>
        prev.map((exp, index) =>
          index === editIndex ? updatedExperience : exp
        )
      );
    }
    setShowEditModal(false);
  };

  const handleDeleteExperience = () => {
    if (editIndex !== null) {
      setExperiences((prev) => prev.filter((_, index) => index !== editIndex));
    }
    setShowDeleteModal(false);
  };

  const openEditModal = (experience: TeacherExperience, index: number) => {
    setSelectedExperience(experience);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (experience: TeacherExperience, index: number) => {
    setSelectedExperience(experience);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const startYear = start.getFullYear();

    if (!end) {
      return `${startMonth} ${startYear} - Present`;
    }

    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const endYear = end.getFullYear();

    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        <AddExperienceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddExperience}
        />

        <EditExperienceModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditExperience}
          experience={selectedExperience}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteExperience}
          experienceTitle={
            selectedExperience
              ? `${selectedExperience.title} at ${selectedExperience.companyName}`
              : undefined
          }
        />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Experience</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp.id || index}
              className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md hover:border-blue-800"
            >
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-900 mb-1">
                      {exp.title}
                    </h4>
                    <p className="text-sm text-slate-800">{exp.companyName}</p>
                    {exp.location && (
                      <p className="text-sm text-slate-700">{exp.location}</p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2 mb-3">
                      <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                        {exp.workMode}
                      </span>
                      <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(exp, index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-sm cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(exp, index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                Add Teaching Experience
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Experience;
