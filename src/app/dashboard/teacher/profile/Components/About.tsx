import { useState, useEffect } from "react";
import { Plus, Edit3, Check, X } from "lucide-react";
import axios from "axios";


const About: React.FC<any> = ({ aboutDetails }) => {
  const [aboutText, setAboutText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    if (aboutDetails?.about) {
      setAboutText(aboutDetails.about);
    }
  }, [aboutDetails]);

  const handleStartEditing = () => {
    setEditText(aboutText);
    setIsEditing(true);
  };

const handleSave = async () => {
  try {
    const trimmed = editText.trim();
    setAboutText(trimmed);
    setIsEditing(false);

    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teachers/profile/basic-details`,
      { about: trimmed }, 
      { withCredentials: true } 
    );
    console.log("About updated successfully!");
  } catch (error) {
    console.error("Error updating About section:", error);
  }
};


  const handleCancel = () => {
    setEditText(aboutText);
    setIsEditing(false);
  };

  const handleAddAbout = () => {
    setEditText("");
    setIsEditing(true);
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">About</h3>
        {aboutText && !isEditing && (
          <button
            onClick={handleStartEditing}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Tell us about yourself
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Write a brief description about yourself, your teaching philosophy, experience, and what makes you unique as an educator..."
                rows={8}
                className="w-full p-3 border border-gray-400 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {editText.length} characters
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-400 rounded-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-all cursor-pointer duration-200 ease-in-out text-sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Save About
              </button>
            </div>
          </div>
        ) : aboutText ? (
          <div className="p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 hover:shadow-md hover:border-blue-800">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {aboutText}
            </p>
          </div>
        ) : (
          <button
            onClick={handleAddAbout}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mx-auto mb-1" />
            <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
              Add About Section
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default About;
