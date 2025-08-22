import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit3, X, Trash2, FileText, ExternalLink } from "lucide-react";

interface ResearchPaper {
  id?: string;
  title: string;
  abstract: string;
  publicationDate: string;
  journal_name: string;
  doi: string;
  url: string;
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
      <div className="bg-white rounded-sm shadow-2xl border border-gray-400 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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

interface AddResearchPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paper: ResearchPaper) => void;
}
const AddResearchPaperModal: React.FC<AddResearchPaperModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<ResearchPaper>({
    title: "",
    abstract: "",
    publicationDate: "",
    journal_name: "",
    doi: "",
    url: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResearchPaper, string>>
  >({});

  const handleInputChange = (field: keyof ResearchPaper, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ResearchPaper, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.journal_name.trim())
      newErrors.journal_name = "Journal name is required";
    if (!formData.publicationDate)
      newErrors.publicationDate = "Publication date is required";
    else if (new Date(formData.publicationDate) > new Date())
      newErrors.publicationDate = "Publication date cannot be in the future";
    if (formData.url?.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }
    if (formData.doi?.trim()) {
      const doiPattern = /^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/;
      if (!doiPattern.test(formData.doi.trim())) {
        newErrors.doi = "Please enter a valid DOI (e.g., 10.1000/journal.example)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/research-papers`,
        formData,
        { withCredentials: true }
      );
      onAdd(res.data.data); 
      handleClose();
    } catch (err) {
      console.error("Error adding paper", err);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      abstract: "",
      publicationDate: "",
      journal_name: "",
      doi: "",
      url: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Research Paper">
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Impact of Technology on Student Learning Outcomes"
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
            Abstract
          </label>
          <textarea
            value={formData.abstract}
            onChange={(e) => handleInputChange("abstract", e.target.value)}
            placeholder="Brief summary of the research paper..."
            rows={4}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-vertical ${
              errors.abstract ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.abstract && (
            <p className="mt-1 text-sm text-red-600">{errors.abstract}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Publication Date *
            </label>
            <input
              type="date"
              value={formData.publicationDate}
              onChange={(e) =>
                handleInputChange("publicationDate", e.target.value)
              }
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.publicationDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.publicationDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.publicationDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Journal Name *
            </label>
            <input
              type="text"
              value={formData.journal_name}
              onChange={(e) => handleInputChange("journal_name", e.target.value)}
              placeholder="e.g., Journal of Educational Technology"
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
                errors.journal_name ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.journal_name && (
              <p className="mt-1 text-sm text-red-600">{errors.journal_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            DOI (Digital Object Identifier)
          </label>
          <input
            type="text"
            value={formData.doi}
            onChange={(e) => handleInputChange("doi", e.target.value)}
            placeholder="e.g., 10.1000/journal.example.2024.001"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.doi ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.doi && (
            <p className="mt-1 text-sm text-red-600">{errors.doi}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            URL/Link
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            placeholder="https://example.com/paper"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.url ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
        </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700"
        >
          Add Research Paper
        </button>
        </div>      </div>
    </Modal>
  );
};
interface EditResearchPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (paper: ResearchPaper) => void;
  paper: ResearchPaper | null;
}
const EditResearchPaperModal: React.FC<EditResearchPaperModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  paper,
}) => {
  const [formData, setFormData] = useState<ResearchPaper>({
    title: "",
    abstract: "",
    publicationDate: "",
    journal_name: "",
    doi: "",
    url: "",
  });
    const [errors, setErrors] = useState<
    Partial<Record<keyof ResearchPaper, string>>
  >({});

  useEffect(() => {
    if (paper) setFormData(paper);
  }, [paper]);
    const handleInputChange = (field: keyof ResearchPaper, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ResearchPaper, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.journal_name.trim()) {
      newErrors.journal_name = "Journal name is required";
    }

    if (!formData.publicationDate) {
      newErrors.publicationDate = "Publication date is required";
    } else if (new Date(formData.publicationDate) > new Date()) {
      newErrors.publicationDate = "Publication date cannot be in the future";
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    if (formData.doi && formData.doi.trim()) {
      const doiPattern = /^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/;
      if (!doiPattern.test(formData.doi.trim())) {
        newErrors.doi =
          "Please enter a valid DOI (e.g., 10.1000/journal.example)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paper?.id) return;

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/research-papers/${paper.id}`,
        formData,
        { withCredentials: true }
      );
      onEdit(res.data.data);
      onClose();
    } catch (err) {
      console.error("Error editing paper", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Research Paper">
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Impact of Technology on Student Learning Outcomes"
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
            Abstract
          </label>
          <textarea
            value={formData.abstract}
            onChange={(e) => handleInputChange("abstract", e.target.value)}
            placeholder="Brief summary of the research paper..."
            rows={4}
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-vertical ${
              errors.abstract ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.abstract && (
            <p className="mt-1 text-sm text-red-600">{errors.abstract}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Publication Date *
            </label>
            <input
              type="date"
              value={formData.publicationDate}
              onChange={(e) =>
                handleInputChange("publicationDate", e.target.value)
              }
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer ${
                errors.publicationDate ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.publicationDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.publicationDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Journal Name *
            </label>
            <input
              type="text"
              value={formData.journal_name}
              onChange={(e) => handleInputChange("journal_name", e.target.value)}
              placeholder="e.g., Journal of Educational Technology"
              className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
                errors.journal_name ? "border-red-400" : "border-gray-400"
              }`}
            />
            {errors.journal_name && (
              <p className="mt-1 text-sm text-red-600">{errors.journal_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            DOI (Digital Object Identifier)
          </label>
          <input
            type="text"
            value={formData.doi}
            onChange={(e) => handleInputChange("doi", e.target.value)}
            placeholder="e.g., 10.1000/journal.example.2024.001"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.doi ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.doi && (
            <p className="mt-1 text-sm text-red-600">{errors.doi}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            URL/Link
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            placeholder="https://example.com/paper"
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.url ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
        </div>

                <div className="flex space-x-3 pt-2">

<button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700"
        >
          Update Research Paper
        </button>
        </div>
      </div>
    </Modal>
  );
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  paperTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paperTitle?: string;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Research Paper">
    <p className="text-gray-700">
      Are you sure you want to delete <strong>{paperTitle}</strong>?
    </p>
    <div className="flex space-x-3 pt-2">
      <button onClick={onClose} className="flex-1 px-4 py-2 border">Cancel</button>
      <button
        onClick={onConfirm}
        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </Modal>
);

const ResearchPapers: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/research-papers`,
          { withCredentials: true }
        );
        setPapers(res.data.data);
      } catch (err) {
        console.error("Error fetching papers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const handleAddPaper = (newPaper: ResearchPaper) =>
    setPapers((prev) => [...prev, newPaper]);

  const handleEditPaper = (updated: ResearchPaper) =>
    setPapers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const handleDeletePaper = async () => {
    if (!selectedPaper?.id) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/research-papers/${selectedPaper.id}`,
        { withCredentials: true }
      );
      setPapers((prev) => prev.filter((p) => p.id !== selectedPaper.id));
    } catch (err) {
      console.error("Error deleting paper", err);
    }
    setShowDeleteModal(false);
  };

  if (loading) return <p>Loading papers...</p>;
    const openEditModal = (paper: ResearchPaper, index: number) => {
    setSelectedPaper(paper);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (paper: ResearchPaper, index: number) => {
    setSelectedPaper(paper);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };


  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Research Papers</h3>
          <button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {papers.map((paper, index) => (
            <div
              key={paper.id || index}
              className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md hover:border-blue-800"
            >
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 flex-1">
                        {paper.title}
                      </h4>
                      {paper.url && (
                        <button
                          onClick={() => handleExternalLink(paper.url)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-sm cursor-pointer"
                          title="Open paper link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-800 font-medium mb-2">
                      {paper.journal_name}
                    </p>
                    {paper.abstract && (
                      <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                        {paper.abstract}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                      <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                        {new Date(paper.publicationDate).getFullYear()}
                      </span>
                      {paper.doi && (
                        <span className="px-4 py-1 bg-slate-900 text-white rounded-full">
                          DOI: {paper.doi}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(paper, index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-sm cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(paper, index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {papers.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                Add Research Paper
              </span>
            </button>
          )}
        </div>
      </div>

      <AddResearchPaperModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPaper}
      />
      <EditResearchPaperModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditPaper}
        paper={selectedPaper}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePaper}
        paperTitle={selectedPaper?.title}
      />
    </>
  );
};

export default ResearchPapers;
