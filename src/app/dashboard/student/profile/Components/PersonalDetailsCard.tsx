"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiEdit2Line } from "react-icons/ri";
import { X } from "lucide-react";

interface PersonalDetails {
  fathers_name: string;
  mothers_name: string;
  fathers_contact_number: string;
  mothers_contact_number: string;
  fathers_occupation: string;
  mothers_occupation: string;
}

const PersonalDetailsCard = () => {
  const [personalDetails, setPersonalDetails] =
    useState<PersonalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<PersonalDetails>({
    fathers_name: "",
    mothers_name: "",
    fathers_contact_number: "",
    mothers_contact_number: "",
    fathers_occupation: "",
    mothers_occupation: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const student = storedUser ? JSON.parse(storedUser) : null;
        if (!student) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${student.id}/personal-details`,
          { withCredentials: true }
        );

        const data = res.data.data;
        setPersonalDetails(data);
        setFormData({
          fathers_name: data.fathers_name || "",
          mothers_name: data.mothers_name || "",
          fathers_contact_number: data.fathers_contact_number || "",
          mothers_contact_number: data.mothers_contact_number || "",
          fathers_occupation: data.fathers_occupation || "",
          mothers_occupation: data.mothers_occupation || "",
        });
      } catch (err) {
        console.error("Failed to fetch personal details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, []);

  const handleOpenModal = () => {
    if (personalDetails) {
      setFormData({
        fathers_name: personalDetails.fathers_name || "",
        mothers_name: personalDetails.mothers_name || "",
        fathers_contact_number: personalDetails.fathers_contact_number || "",
        mothers_contact_number: personalDetails.mothers_contact_number || "",
        fathers_occupation: personalDetails.fathers_occupation || "",
        mothers_occupation: personalDetails.mothers_occupation || "",
      });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      const storedUser = localStorage.getItem("user");
      const student = storedUser ? JSON.parse(storedUser) : null;
      if (!student) throw new Error("User not authenticated");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${student.id}/personal-details`,
        { personal_email: student?.email, ...formData },
        { withCredentials: true }
      );

      setPersonalDetails({ ...formData });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || "Failed to save personal details."
      );
    }
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
        <button
          onClick={handleOpenModal}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer"
          aria-label="Edit personal details"
        >
          <RiEdit2Line className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Father&lsquo;s Name
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.fathers_name || "NA"}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Mother&lsquo;s Name
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.mothers_name || "NA"}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Father&lsquo;s Contact
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.fathers_contact_number || "NA"}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Mother&lsquo;s Contact
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.mothers_contact_number || "NA"}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Father&lsquo;s Occupation
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.fathers_occupation || "NA"}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Mother&lsquo;s Occupation
            </label>
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {personalDetails?.mothers_occupation || "NA"}
            </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-2xl border border-gray-400 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Personal Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {formError && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded border border-red-100">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Father&lsquo;s Name
                    </label>
                    <input
                      type="text"
                      name="fathers_name"
                      value={formData.fathers_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="fathers_contact_number"
                      value={formData.fathers_contact_number}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="e.g., +91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="fathers_occupation"
                      value={formData.fathers_occupation}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mother&lsquo;s Name
                    </label>
                    <input
                      type="text"
                      name="mothers_name"
                      value={formData.mothers_name}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="mothers_contact_number"
                      value={formData.mothers_contact_number}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="e.g., +91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="mothers_occupation"
                      value={formData.mothers_occupation}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-sm text-sm font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-sm text-sm font-medium transition cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsCard;
