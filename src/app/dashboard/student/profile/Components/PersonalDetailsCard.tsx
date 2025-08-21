"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonalDetailsCard = () => {
  const [personalDetails, setPersonalDetails] = useState<any>(null);

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

        setPersonalDetails(res.data.data);
      } catch (err) {
        console.error("Failed to fetch personal details", err);
      }
    };

    fetchPersonalDetails();
  }, []);

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
      </div>
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
            Contact
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {personalDetails?.fathers_contact_number || "NA"}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Contact
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {personalDetails?.mothers_contact_number || "NA"}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Occupation
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {personalDetails?.fathers_occupation || "NA"}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
            Occupation
          </label>
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {personalDetails?.mothers_occupation || "NA"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsCard;
