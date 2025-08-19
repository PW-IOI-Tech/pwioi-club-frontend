"use client";

import { useEffect, useState } from "react";
import { Plus, Award, ExternalLink, Edit3, X, Trash2 } from "lucide-react";
import axios from "axios";
import profileData from "../Constants/ProfileData";

interface Certification {
  id?: string;
  name: string;
  organisation: string;
  startDate: string;
  endDate: string;
  link: string;
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

// Add Certification Modal
interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (certification: Certification) => void;
}

const AddCertificationModal: React.FC<AddCertificationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Certification>({
    name: "",
    organisation: "",
    startDate: "",
    endDate: "",
    link: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Certification, string>>
  >({});

  const handleInputChange = (field: keyof Certification, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Certification, string>> = {};

    if (!formData.name.trim())
      newErrors.name = "Certification name is required";
    if (!formData.organisation.trim())
      newErrors.organisation = "Organisation is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    )
      newErrors.endDate = "End date must be after start date";
    if (formData.link && !isValidUrl(formData.link))
      newErrors.link = "Please enter a valid URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const studentId = user?.sub;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/certifications`,
        {
          name: formData.name,
          organisation: formData.organisation,
          start_date: formData.startDate,
          end_date: formData.endDate,
          link: formData.link,
        },
        { withCredentials: true }
      );

      onAdd({
        ...formData,
        id: response.data.data.id,
      });
      handleClose();
    } catch (err) {
      console.error("Failed to create certification", err);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      organisation: "",
      startDate: "",
      endDate: "",
      link: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Certification">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Certification Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., AWS Solutions Architect"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.name ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Organisation *
          </label>
          <input
            type="text"
            value={formData.organisation}
            onChange={(e) => handleInputChange("organisation", e.target.value)}
            placeholder="e.g., Amazon Web Services"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.organisation ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.organisation && (
            <p className="mt-1 text-sm text-red-600">{errors.organisation}</p>
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
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-sm ${
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
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-sm ${
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
            Certification Link
          </label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="https://example.com/certificate"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.link ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link}</p>
          )}
        </div>
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer text-sm"
          >
            Add Certification
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Certification Modal
interface EditCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (certification: Certification) => void;
  certification: Certification | null;
}

const EditCertificationModal: React.FC<EditCertificationModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  certification,
}) => {
  const [formData, setFormData] = useState<Certification>({
    name: "",
    organisation: "",
    startDate: "",
    endDate: "",
    link: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Certification, string>>
  >({});

  useEffect(() => {
    if (certification) setFormData(certification);
  }, [certification]);

  const handleInputChange = (field: keyof Certification, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Certification, string>> = {};
    if (!formData.name.trim())
      newErrors.name = "Certification name is required";
    if (!formData.organisation.trim())
      newErrors.organisation = "Organisation is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    )
      newErrors.endDate = "End date must be after start date";
    if (formData.link && !isValidUrl(formData.link))
      newErrors.link = "Please enter a valid URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !certification?.id) return;

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const studentId = user?.sub;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/certifications/${certification.id}`,
        {
          name: formData.name,
          organisation: formData.organisation,
          start_date: formData.startDate,
          end_date: formData.endDate,
          link: formData.link,
        },
        { withCredentials: true }
      );
      onEdit(formData);
      handleClose();
    } catch (err) {
      console.error("Failed to update certification", err);
    }
  };

  const handleClose = () => {
    if (certification) setFormData(certification);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Certification">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Certification Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., AWS Solutions Architect"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.name ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Organisation *
          </label>
          <input
            type="text"
            value={formData.organisation}
            onChange={(e) => handleInputChange("organisation", e.target.value)}
            placeholder="e.g., Amazon Web Services"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.organisation ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.organisation && (
            <p className="mt-1 text-sm text-red-600">{errors.organisation}</p>
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
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-sm ${
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
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-sm ${
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
            Certification Link
          </label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="https://example.com/certificate"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              errors.link ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer text-sm"
          >
            Update Certification
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
  certificationName?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  certificationName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Certification">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete the{" "}
          <strong>{certificationName}</strong> certification? This action cannot
          be undone.
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

const CertificationsCard: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const fetchCertifications = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const studentId = user?.sub;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/certifications`,
        { withCredentials: true }
      );

      const data = response.data.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        organisation: c.organisation,
        startDate: c.start_date,
        endDate: c.end_date,
        link: c.link,
      }));
      setCertifications(data);
    } catch (err) {
      console.error("Failed to fetch certifications", err);
      setCertifications([...profileData.certifications]);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleAddCertification = (newCertification: Certification) => {
    setCertifications([...certifications, newCertification]);
  };

  const handleEditCertification = (updatedCertification: Certification) => {
    if (editIndex !== null) {
      const updatedCertifications = [...certifications];
      updatedCertifications[editIndex] = updatedCertification;
      setCertifications(updatedCertifications);
      setEditIndex(null);
      setSelectedCertification(null);
    }
  };

  const handleDeleteCertification = async () => {
    if (editIndex !== null && selectedCertification?.id) {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const studentId = user?.sub;

        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/certifications/${selectedCertification.id}`,
          { withCredentials: true }
        );
        const updatedCertifications = certifications.filter(
          (_, i) => i !== editIndex
        );
        setCertifications(updatedCertifications);
      } catch (err) {
        console.error("Failed to delete certification", err);
      }
      setShowDeleteModal(false);
      setEditIndex(null);
      setSelectedCertification(null);
    }
  };

  const openEditModal = (certification: Certification, index: number) => {
    setSelectedCertification(certification);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (certification: Certification, index: number) => {
    setSelectedCertification(certification);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  const handleExternalLinkClick = (link: string) => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <AddCertificationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCertification}
      />
      <EditCertificationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditCertification}
        certification={selectedCertification}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCertification}
        certificationName={selectedCertification?.name}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            {certifications.length}/3
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:shadow-md hover:border-blue-800 transition-all bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 p-1 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{cert.name}</h4>
                <p className="text-sm text-slate-800">{cert.organisation}</p>
                <p className="text-xs text-slate-700">
                  {new Date(cert.startDate).getFullYear()} -{" "}
                  {new Date(cert.endDate).getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExternalLinkClick(cert.link)}
                className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                title="View certificate"
                disabled={!cert.link}
                style={{ opacity: cert.link ? 1 : 0.5 }}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEditModal(cert, index)}
                className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                title="Edit certification"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeleteModal(cert, index)}
                className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                title="Delete certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {certifications.length < 3 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
            <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
              Add Certification
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificationsCard;
