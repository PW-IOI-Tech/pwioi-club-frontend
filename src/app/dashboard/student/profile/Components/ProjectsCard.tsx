import React, { useState } from "react";
import { Plus, Edit3, ExternalLink, Trash2, X } from "lucide-react";
import { VscGithub } from "react-icons/vsc";
import profileData from "../Constants/ProfileData";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  githubUrl?: string;
  liveUrl?: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProjectsCard = () => {
  const [projects, setProjects] = useState<Project[]>(profileData.projects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState<Project>({
    name: "",
    description: "",
    technologies: [],
    startDate: "",
    endDate: "",
    githubUrl: "",
    liveUrl: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      githubUrl: "",
      liveUrl: "",
    });
  };

  const handleAddProject = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handleEditProject = (index: number) => {
    setSelectedProjectIndex(index);
    setFormData(projects[index]);
    setShowEditModal(true);
  };

  const handleDeleteProject = (index: number) => {
    setSelectedProjectIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProjectIndex !== null) {
      const updatedProjects = projects.filter(
        (_, index) => index !== selectedProjectIndex
      );
      setProjects(updatedProjects);
    }
    setShowDeleteModal(false);
    setSelectedProjectIndex(null);
  };

  const handleSubmit = (isEdit: boolean) => {
    if (isEdit && selectedProjectIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[selectedProjectIndex] = formData;
      setProjects(updatedProjects);
      setShowEditModal(false);
    } else {
      setProjects([...projects, formData]);
      setShowAddModal(false);
    }
    resetForm();
    setSelectedProjectIndex(null);
  };

  const handleTechChange = (techString: string) => {
    const techArray = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    setFormData({ ...formData, technologies: techArray });
  };

  const ProjectModal = ({
    isEdit = false,
    isVisible,
    onClose,
  }: {
    isEdit?: boolean;
    isVisible: boolean;
    onClose: () => void;
  }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-sm shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto text-sm border border-gray-400 ">
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
                value={formData.technologies.join(", ")}
                onChange={(e) => handleTechChange(e.target.value)}
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
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
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
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
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
                value={formData.githubUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
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
                value={formData.liveUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourproject.com"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-sm border-gray-400 hover:bg-gray-100 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(isEdit)}
              className="px-4 py-2 bg-slate-900 text-white font-medium rounded-sm hover:bg-slate-700 transition-colors cursor-pointer duration-200 ease-in-out"
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
        <div className="bg-white rounded-sm shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-400 ">
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
            <span className="font-semibold">"{projectName}"</span>? This action
            cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium cursor-pointer border-gray-400 border rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700 transition-colors cursor-pointer duration-200 ease-in-out"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        {/* Add Project Modal */}
        <ProjectModal
          isVisible={showAddModal}
          onClose={() => setShowAddModal(false)}
        />

        {/* Edit Project Modal */}
        <ProjectModal
          isEdit={true}
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)}
        />

        {/* Delete Confirmation Modal */}
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
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="p-5 hover:shadow-md hover:border-blue-300 transition-all bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-slate-900">{project.name}</h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditProject(index)}
                    className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(index)}
                    className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4 leading-tight">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-slate-200 text-gray-600 text-xs font-medium rounded">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 mb-4">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <button className="h-8 w-8 rounded-full bg-slate-300 p-1 flex items-center justify-center cursor-pointer group">
                    <VscGithub className="text-slate-900 w-4 h-4 group-hover:scale-110 duration-100 ease-in-out transition-transform" />
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="h-8 w-8 rounded-full bg-slate-300 p-1 flex items-center justify-center cursor-pointer group">
                    <ExternalLink className="text-slate-900 w-4 h-4 group-hover:scale-110 duration-100 ease-in-out transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {projects.length < 4 && (
            <div
              onClick={handleAddProject}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group flex items-center justify-center flex-col"
            >
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto" />
              <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                Add New Project
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsCard;
