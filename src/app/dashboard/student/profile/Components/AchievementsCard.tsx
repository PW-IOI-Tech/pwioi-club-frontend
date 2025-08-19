import { useState, useEffect } from "react";
import { Plus, Edit3, X, Trash2, Star } from "lucide-react";
import axios from "axios";

interface Achievement {
  id?: string;
  title: string;
  description: string;
  organisation: string;
  startDate: string;
}

// Modal Component
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

// Add Achievement Modal
interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (achievement: Achievement) => void;
}

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    description: "",
    organisation: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Achievement, string>>
  >({});

  const handleInputChange = (field: keyof Achievement, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Achievement, string>> = {};

    if (!formData.title.trim())
      newErrors.title = "Achievement title is required";
    if (!formData.description.trim()) {
      newErrors.description = "Achievement description is required";
    } else if (formData.description.length < 10) {
      newErrors.description =
        "Description should be at least 10 characters long";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description should not exceed 500 characters";
    }
    if (!formData.organisation.trim())
      newErrors.organisation = "Organisation is required";
    if (!formData.startDate) {
      newErrors.startDate = "Date is required";
    } else if (new Date(formData.startDate) > new Date()) {
      newErrors.startDate = "Date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        organisation: formData.organisation.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      organisation: "",
      startDate: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Achievement">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Achievement Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Employee of the Month"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 ${
              errors.title ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            placeholder="Describe your achievement and its impact..."
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 resize-none ${
              errors.description ? "border-red-400" : "border-gray-400"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Organisation *
          </label>
          <input
            type="text"
            value={formData.organisation}
            onChange={(e) => handleInputChange("organisation", e.target.value)}
            placeholder="e.g., Google, Microsoft, University Name"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 ${
              errors.organisation ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.organisation && (
            <p className="mt-1 text-sm text-red-600">{errors.organisation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full p-3 border rounded-sm focus:ring-2 ${
              errors.startDate ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700"
          >
            Add Achievement
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Achievement Modal
interface EditAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (achievement: Achievement) => void;
  achievement: Achievement | null;
}

const EditAchievementModal: React.FC<EditAchievementModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  achievement,
}) => {
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    description: "",
    organisation: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Achievement, string>>
  >({});

  // Update form data when achievement changes
  useState(() => {
    if (achievement) {
      setFormData(achievement);
    }
  });

  const handleInputChange = (field: keyof Achievement, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Achievement, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Achievement title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Achievement description is required";
    } else if (formData.description.length < 10) {
      newErrors.description =
        "Description should be at least 10 characters long";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description should not exceed 500 characters";
    }

    if (!formData.organisation.trim()) {
      newErrors.organisation = "Organisation is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Date is required";
    } else if (new Date(formData.startDate) > new Date()) {
      newErrors.startDate = "Date cannot be in the future";
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
        description: formData.description.trim(),
        organisation: formData.organisation.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    if (achievement) {
      setFormData(achievement);
    }
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Achievement">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Achievement Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Employee of the Month"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 ${
              errors.title ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your achievement and its impact..."
            rows={4}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 resize-none ${
              errors.description ? "border-red-400" : "border-gray-400"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Organisation *
          </label>
          <input
            type="text"
            value={formData.organisation}
            onChange={(e) => handleInputChange("organisation", e.target.value)}
            placeholder="e.g., Google, Microsoft, University Name"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 ${
              errors.organisation ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.organisation && (
            <p className="mt-1 text-sm text-red-600">{errors.organisation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-90ring-slate-900 ${
              errors.startDate ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
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
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out"
          >
            Update Achievement
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  achievementTitle?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  achievementTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Achievement">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete the{" "}
          <strong>&ldquo;{achievementTitle}&ldquo;</strong> achievement? This
          action cannot be undone.
        </p>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all cursor-pointer text-sm duration-200 ease-in-out"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};
const AchievementsCard: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.sub;

  // Fetch Achievements
  useEffect(() => {
    if (studentId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/achievements`,
          { withCredentials: true }
        )
        .then((res) => {
          const fetched = res.data.data.map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            organisation: a.organisation,
            startDate: a.start_date,
          }));
          setAchievements(fetched);
        })
        .catch((err) => console.error("Error fetching achievements:", err));
    }
  }, [studentId]);

  // Add Achievement
  const handleAddAchievement = async (newAchievement: Achievement) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/achievements`,
        {
          title: newAchievement.title,
          description: newAchievement.description,
          organisation: newAchievement.organisation,
          start_date: newAchievement.startDate,
        },
        { withCredentials: true }
      );
      const added = res.data.data;
      setAchievements((prev) => [
        ...prev,
        {
          id: added.id,
          title: added.title,
          description: added.description,
          organisation: added.organisation,
          startDate: added.start_date,
        },
      ]);
    } catch (err) {
      console.error("Error adding achievement:", err);
    }
  };

  // Edit Achievement
  const handleEditAchievement = async (updatedAchievement: Achievement) => {
    if (selectedAchievement?.id) {
      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/achievements/${selectedAchievement.id}`,
          {
            title: updatedAchievement.title,
            description: updatedAchievement.description,
            organisation: updatedAchievement.organisation,
            start_date: updatedAchievement.startDate,
          },
          { withCredentials: true }
        );
        const updated = res.data.data;
        setAchievements((prev) =>
          prev.map((ach) =>
            ach.id === updated.id
              ? {
                  id: updated.id,
                  title: updated.title,
                  description: updated.description,
                  organisation: updated.organisation,
                  startDate: updated.start_date,
                }
              : ach
          )
        );
        setSelectedAchievement(null);
        setEditIndex(null);
      } catch (err) {
        console.error("Error updating achievement:", err);
      }
    }
  };

  // Delete Achievement
  const handleDeleteAchievement = async () => {
    if (selectedAchievement?.id) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/achievements/${selectedAchievement.id}`,
          { withCredentials: true }
        );
        setAchievements((prev) =>
          prev.filter((ach) => ach.id !== selectedAchievement.id)
        );
        setShowDeleteModal(false);
        setSelectedAchievement(null);
        setEditIndex(null);
      } catch (err) {
        console.error("Error deleting achievement:", err);
      }
    }
  };

  const openEditModal = (achievement: Achievement, index: number) => {
    setSelectedAchievement(achievement);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (achievement: Achievement, index: number) => {
    setSelectedAchievement(achievement);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        {/* Modals */}
        <AddAchievementModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAchievement}
        />
        <EditAchievementModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditAchievement}
          achievement={selectedAchievement}
        />
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAchievement}
          achievementTitle={selectedAchievement?.title}
        />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id || index}
              className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md"
            >
              <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-900 mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-slate-800 mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-slate-700">
                      {achievement.organisation} •{" "}
                      {new Date(achievement.startDate).getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(achievement, index)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit achievement"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(achievement, index)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:bg-blue-50"
          >
            <Plus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <span className="text-sm text-gray-600 font-medium">
              Add Achievement
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AchievementsCard;
