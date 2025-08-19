import { useEffect, useState } from "react";
import { Edit3, ExternalLink, Trash2, X, Linkedin, Github } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  link: string;
  icon: any;
}

interface PlatformConfig {
  name: string;
  icon: any;
  urlPattern: RegExp;
  placeholder: string;
}

const platformConfigs: Record<string, PlatformConfig> = {
  LinkedIn: {
    name: "LinkedIn",
    icon: Linkedin,
    urlPattern:
      /^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_]+\/?$/,
    placeholder: "https://linkedin.com/in/your-profile",
  },
  GitHub: {
    name: "GitHub",
    icon: Github,
    urlPattern: /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/,
    placeholder: "https://github.com/your-username",
  },
};

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
      <div className="bg-white rounded-lg shadow-2xl border border-gray-400 w-full max-w-md mx-4">
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

interface EditSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (link: string) => void;
  socialLink: SocialLink | null;
}

const EditSocialModal: React.FC<EditSocialModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  socialLink,
}) => {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (socialLink) setLink(socialLink.link);
  }, [socialLink]);

  const validateLink = (url: string): boolean => {
    if (!url || !socialLink) return false;
    const config = platformConfigs[socialLink.platform];
    return config
      ? config.urlPattern.test(url)
      : /^https?:\/\/[^\s]+$/.test(url);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!link) return setError("Link is required");
    if (!validateLink(link))
      return setError(`Please enter a valid ${socialLink?.platform} URL`);
    onEdit(link);
    handleClose();
  };

  const handleClose = () => {
    setLink(socialLink?.link || "");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit ${socialLink?.platform} Link`}
    >
      <div onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Link
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setError("");
            }}
            placeholder={
              socialLink
                ? platformConfigs[socialLink.platform]?.placeholder
                : "https://example.com"
            }
            className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm ${
              error ? "border-red-400" : "border-gray-400"
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-all cursor-pointer duration-200 ease-in-out text-sm"
          >
            Update Link
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
  platformName?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  platformName,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Social Link">
    <div className="space-y-4">
      <p className="text-gray-700">
        Are you sure you want to delete the {platformName} link?
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
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all cursor-pointer text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
);

const SocialLinksCard: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "GitHub",
      link: "https://github.com/johndoe",
      icon: Github,
    },
    {
      id: "2",
      platform: "LinkedIn",
      link: "https://linkedin.com/in/johndoe",
      icon: Linkedin,
    },
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<SocialLink | null>(null);

  const handleEditSocial = (newLink: string) => {
    if (!selectedSocial) return;
    setSocialLinks((prev) =>
      prev.map((s) =>
        s.id === selectedSocial.id ? { ...s, link: newLink } : s
      )
    );
    setShowEditModal(false);
  };

  const handleDeleteSocial = () => {
    if (!selectedSocial) return;
    setSocialLinks((prev) => prev.filter((s) => s.id !== selectedSocial.id));
    setShowDeleteModal(false);
  };

  const openEditModal = (social: SocialLink) => {
    setSelectedSocial(social);
    setShowEditModal(true);
  };

  const openDeleteModal = (social: SocialLink) => {
    setSelectedSocial(social);
    setShowDeleteModal(true);
  };

  const handleExternalLinkClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6 max-w-md mx-auto">
      <EditSocialModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditSocial}
        socialLink={selectedSocial}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSocial}
        platformName={selectedSocial?.platform}
      />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
      </div>
      <div className="space-y-3">
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <div
              key={social.id}
              className="flex items-center justify-between p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
                  <IconComponent className="text-white w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {social.platform}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExternalLinkClick(social.link)}
                  className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(social)}
                  className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer transition-colors"
                  title="Edit link"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(social)}
                  className="text-red-600 hover:text-red-900 p-1 cursor-pointer transition-colors"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {socialLinks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No social links available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinksCard;
