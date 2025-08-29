"use client";

import React from "react";
import { Users, Plus } from "lucide-react";

interface SubjectStatisticsCardsProps {
  totalSubjects: number;
  totalCredits: number;
  onAddSubject: () => void;
}

export const SubjectStatisticsCards: React.FC<SubjectStatisticsCardsProps> = ({
  totalSubjects,
  totalCredits,
  onAddSubject,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="p-6 text-center">
          <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
          <h4 className="text-lg text-slate-900 mb-1">Total Subjects</h4>
          <p className="text-5xl font-bold text-[#1B3A6A]">{totalSubjects}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
        <div className="p-6 text-center">
          <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
          <h4 className="text-lg text-slate-900 mb-1">Total Credits</h4>
          <p className="text-5xl font-bold text-green-600">{totalCredits}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 flex items-center justify-center p-6">
        <button
          onClick={onAddSubject}
          className="flex flex-col items-center justify-center w-full h-full text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <div className="bg-gray-200 rounded-full p-3 mb-2 hover:bg-gray-300 transition-colors">
            <Plus size={24} />
          </div>
          <h3 className="text-lg font-semibold">Add New Subject</h3>
          <p className="text-sm text-gray-600 mt-1">Create a new subject record</p>
        </button>
      </div>
    </div>
  );
};