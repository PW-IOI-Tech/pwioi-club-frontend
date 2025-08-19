import { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  X,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  LucideIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  link: string;
  icon: any;
}

interface NewSocialLink {
  platform: string;
  link: string;
  icon: LucideIcon;
}

interface PlatformConfig {
  name: string;
  icon: LucideIcon;
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
  Twitter: {
    name: "Twitter",
    icon: Twitter,
    urlPattern: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
    placeholder: "https://twitter.com/your-username",
  },
  GitHub: {
    name: "GitHub",
    icon: Github,
    urlPattern: /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/,
    placeholder: "https://github.com/your-username",
  },
  Instagram: {
    name: "Instagram",
    icon: Instagram,
    urlPattern: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
    placeholder: "https://instagram.com/your-username",
  },
  Facebook: {
    name: "Facebook",
    icon: Facebook,
    urlPattern: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
    placeholder: "https://facebook.com/your-profile",
  },
  YouTube: {
    name: "YouTube",
    icon: Youtube,
    urlPattern:
      /^https:\/\/(www\.)?youtube\.com\/(channel|c|user)\/[a-zA-Z0-9-_]+\/?$/,
    placeholder: "https://youtube.com/channel/your-channel",
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

interface AddSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (social: NewSocialLink) => void;
}

const AddSocialModal: React.FC<AddSocialModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [link, setLink] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [errors, setErrors] = useState<{ platform?: string; link?: string }>(
    {}
  );

  const validateLink = (url: string, platformName: string): boolean => {
    if (!url) return false;

    if (isCustom || platformName === "Website") {
      return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);
    }
    const config = platformConfigs[platformName];
    return config ? config.urlPattern.test(url) : false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { platform?: string; link?: string } = {};
    const finalPlatform = isCustom ? customPlatform : platform;

    if (!finalPlatform) newErrors.platform = "Platform is required";
    if (!link) newErrors.link = "Link is required";
    else if (!validateLink(link, finalPlatform)) {
      newErrors.link = isCustom
        ? "Please enter a valid URL"
        : `Please enter a valid ${finalPlatform} URL`;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const icon = isCustom
        ? Globe
        : platformConfigs[finalPlatform]?.icon || Globe;
      onAdd({ platform: finalPlatform, link, icon });
      handleClose();
    }
  };

  const handleClose = () => {
    setPlatform("");
    setCustomPlatform("");
    setLink("");
    setIsCustom(false);
    setErrors({});
    onClose();
  };

  const handlePlatformTypeChange = (custom: boolean) => {
    setIsCustom(custom);
    setErrors({});
    if (custom) setPlatform("");
    else setCustomPlatform("");
  };

  const getCurrentPlaceholder = (): string => {
    if (isCustom) return "https://example.com";
    if (platform && platformConfigs[platform]) {
      return platformConfigs[platform].placeholder;
    }
    return "https://example.com";
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Social Link">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Platform
          </label>
          <div className="space-x-2 flex mb-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="predefined"
                name="platformType"
                checked={!isCustom}
                onChange={() => handlePlatformTypeChange(false)}
              />
              <label htmlFor="predefined" className="text-sm text-gray-700">
                Select Platform
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="custom"
                name="platformType"
                checked={isCustom}
                onChange={() => handlePlatformTypeChange(true)}
              />
              <label htmlFor="custom" className="text-sm text-gray-700">
                Custom Platform
              </label>
            </div>
          </div>

          {!isCustom ? (
            <div className="relative w-full">
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  setErrors((prev: any) => ({ ...prev, platform: undefined }));
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                className={`appearance-none mt-2 w-full p-3 border rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-sm pr-10 ${
                  errors.platform ? "border-red-400" : "border-gray-400"
                }`}
              >
                <option value="">Select a platform</option>
                {Object.keys(platformConfigs).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-2/5 text-gray-600">
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>
          ) : (
            <input
              type="text"
              value={customPlatform}
              onChange={(e) => {
                setCustomPlatform(e.target.value);
                setErrors((prev) => ({ ...prev, platform: undefined }));
              }}
              placeholder="Enter platform name"
              className={`mt-2 w-full p-3 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                errors.platform ? "border-red-400" : "border-gray-400"
              }`}
            />
          )}
          {errors.platform && (
            <p className="mt-1 text-sm text-red-600">{errors.platform}</p>
          )}
        </div>

        {/* Link input */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Link
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setErrors((prev) => ({ ...prev, link: undefined }));
            }}
            placeholder={getCurrentPlaceholder()}
            className={`w-full p-3 border rounded-sm text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 ${
              errors.link ? "border-red-400" : "border-gray-400"
            }`}
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link}</p>
          )}
        </div>

        {/* Action buttons */}
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
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-all cursor-pointer duration-200 ease-in-out text-sm"
          >
            Add Link
          </button>
        </div>
      </form>
    </Modal>
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

  const handleSubmit = (e: React.FormEvent) => {
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="https://example.com"
            className={`w-full p-3 border rounded-sm ${
              error ? "border-red-400" : "border-gray-400"
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex space-x-3 pt-2">
          <button type="button" onClick={handleClose} className="flex-1 border">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-slate-900 text-white">
            Update Link
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
  platformName?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  platformName,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Social Link">
    <p>Are you sure you want to delete the {platformName} link?</p>
    <div className="flex space-x-3 pt-2">
      <button onClick={onClose} className="flex-1 border">
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-red-600 text-white rounded-sm"
      >
        Delete
      </button>
    </div>
  </Modal>
);

const SocialLinksCard: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<SocialLink | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.sub;

  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile`,
    withCredentials: true,
  });

  // Get all socials
  useEffect(() => {
    api
      .get(`/${studentId}/social-links`)
      .then((res) => {
        if (res.data.success) {
          const mapped = res.data.data.map((s: any) => ({
            id: s.id,
            platform: s.platform,
            link: s.link,
            icon: platformConfigs[s.platform]?.icon || Globe,
          }));
          setSocialLinks(mapped);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Add social
  const handleAddSocial = async (newSocial: NewSocialLink) => {
    try {
      const res = await api.post(`/${studentId}/social-links`, {
        platform: newSocial.platform,
        link: newSocial.link,
      });

      if (res.data.success) {
        setSocialLinks([
          ...socialLinks,
          {
            id: res.data.data.id,
            platform: res.data.data.platform,
            link: res.data.data.link,
            icon: newSocial.icon,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit social
  const handleEditSocial = async (newLink: string) => {
    if (!selectedSocial) return;
    try {
      const res = await api.patch(
        `/${studentId}/social-links/${selectedSocial.id}`,
        { link: newLink }
      );

      if (res.data.success) {
        setSocialLinks((prev) =>
          prev.map((s) =>
            s.id === selectedSocial.id ? { ...s, link: newLink } : s
          )
        );
      }
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete social
  const handleDeleteSocial = async () => {
    if (!selectedSocial) return;
    try {
      const res = await api.delete(
        `/${studentId}/social-links/${selectedSocial.id}`
      );

      if (res.data.success) {
        setSocialLinks((prev) => prev.filter((s) => s.id !== selectedSocial.id));
      }
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (social: SocialLink, index: number) => {
    setSelectedSocial(social);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const openDeleteModal = (social: SocialLink, index: number) => {
    setSelectedSocial(social);
    setEditIndex(index);
    setShowDeleteModal(true);
  };

  const handleExternalLinkClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border p-6">
      <AddSocialModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSocial}
      />
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <div
              key={index}
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
                  className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(social, index)}
                  className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                  title="Edit link"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(social, index)}
                  className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer mt-1"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto" />
          <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
            Add Social Link
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialLinksCard;
