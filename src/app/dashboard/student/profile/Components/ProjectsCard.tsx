import React, { useEffect, useState } from "react";
import { Plus, Edit3, ExternalLink, Trash2, X } from "lucide-react";
import { VscGithub } from "react-icons/vsc";
import axios from "axios";

interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  start_date: string;
  end_date: string;
  github_link?: string | null;
  live_link?: string | null;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "Ongoing";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProjectsCard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.id;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const emptyForm = {
    name: "",
    description: "",
    technologies: "",
    start_date: "",
    end_date: "",
    github_link: "",
    live_link: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!studentId) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/projects`,
          { withCredentials: true }
        );
        if (res.data.success) {
          const formatted = res.data.data.map((proj: any) => ({
            ...proj,
            technologies: proj.technologies
              ? proj.technologies.split(",").map((t: string) => t.trim())
              : [],
          }));
          setProjects(formatted);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [studentId]);

  const handleAddProject = () => {
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const handleEditProject = (index: number) => {
    setSelectedProjectIndex(index);
    const proj = projects[index];
    setFormData({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies.join(", "),
      start_date: proj.start_date,
      end_date: proj.end_date,
      github_link: proj.github_link || "",
      live_link: proj.live_link || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteProject = (index: number) => {
    setSelectedProjectIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProjectIndex === null) return;
    const project = projects[selectedProjectIndex];
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/projects/${project.id}`,
        { withCredentials: true }
      );
      setProjects(projects.filter((_, i) => i !== selectedProjectIndex));
    } catch (err) {
      console.error("Delete error:", err);
    }
    setShowDeleteModal(false);
    setSelectedProjectIndex(null);
  };

  const handleSubmit = async (isEdit: boolean, data: typeof formData) => {
    const payload = { ...data };
    try {
      if (isEdit && selectedProjectIndex !== null) {
        const project = projects[selectedProjectIndex];
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/projects/${project.id}`,
          payload,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        if (res.data.success) {
          const updated = [...projects];
          updated[selectedProjectIndex] = {
            ...res.data.data,
            technologies: res.data.data.technologies
              ? res.data.data.technologies.split(",").map((t: string) => t.trim())
              : [],
          };
          setProjects(updated);
        }
        setShowEditModal(false);
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/projects`,
          payload,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        if (res.data.success) {
          setProjects([
            ...projects,
            {
              ...res.data.data,
              technologies: res.data.data.technologies
                ? res.data.data.technologies.split(",").map((t: string) => t.trim())
                : [],
            },
          ]);
        }
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSelectedProjectIndex(null);
  };

  const ProjectModal = ({
    isEdit = false,
    isVisible,
    onClose,
    initialData,
    onSubmit,
  }: {
    isEdit?: boolean;
    isVisible: boolean;
    onClose: () => void;
    initialData: typeof formData;
    onSubmit: (data: typeof formData) => void;
  }) => {
    const [localFormData, setLocalFormData] = useState(initialData);

    useEffect(() => {
      if (isVisible) setLocalFormData(initialData);
    }, [isVisible, initialData]);

    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-sm shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto text-sm border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? "Edit Project" : "Add New Project"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={localFormData.name}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={localFormData.description}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={localFormData.technologies}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, technologies: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFormData.start_date}
                  onChange={(e) =>
                    setLocalFormData({ ...localFormData, start_date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFormData.end_date || ""}
                  onChange={(e) =>
                    setLocalFormData({ ...localFormData, end_date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                value={localFormData.github_link || ""}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, github_link: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Live URL (optional)
              </label>
              <input
                type="url"
                value={localFormData.live_link || ""}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, live_link: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourproject.com"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(localFormData)}
              className="px-4 py-2 bg-slate-900 text-white rounded-sm"
            >
              {isEdit ? "Update Project" : "Add Project"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = ({
    isVisible,
    onClose,
    onConfirm,
    projectName,
  }: {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
  }) => {
    if (!isVisible) return null;
    return (
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-sm shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Delete Project</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">&ldquo;{projectName}&ldquo;</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <ProjectModal
        isVisible={showAddModal || showEditModal}
        isEdit={showEditModal}
        initialData={formData}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onSubmit={(data) => handleSubmit(showEditModal, data)}
      />

      <DeleteConfirmationModal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        projectName={
          selectedProjectIndex !== null
            ? projects[selectedProjectIndex]?.name || ""
            : ""
        }
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">Projects</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            {projects.length}/4
          </span>
        </div>
        <button
          onClick={handleAddProject}
          className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id || index}
              className="p-5 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-slate-900">{project.name}</h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditProject(index)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies?.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-900 text-white text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies?.length > 3 && (
                  <span className="px-2 py-1 bg-slate-200 text-gray-600 text-xs rounded">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 mb-4">
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
              </div>
              <div className="flex items-center space-x-2">
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center"
                  >
                    <VscGithub className="text-slate-900 w-4 h-4" />
                  </a>
                )}
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center"
                  >
                    <ExternalLink className="text-slate-900 w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
          {projects.length < 4 && (
            <div
              onClick={handleAddProject}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group flex items-center justify-center flex-col"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">Add New Project</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsCard;
