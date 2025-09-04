"use client";

import React from "react";
import { CircleCheckBig, Code, GraduationCap } from "lucide-react";

const CodeLabPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center p-4 lg:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#12294c]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#12294c]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-8 w-full">
          <div className="w-20 h-20 mx-auto bg-[#12294c] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#12294c]/20 animate-spin [animation-duration:6s]">
            <Code className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          CodeLab Pro
        </h1>
        <p className="text-xl text-[#12294c] font-semibold mb-6">
          is coming soon
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
          Our advanced coding platform for teachers and students is under
          development. Get ready for seamless coding assessments, real-time
          evaluation, and more.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-3 text-left px-2">
          <div className="flex items-center space-x-2.5 p-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow hover:border-[#12294c]/20 transition-all duration-200">
            <div className="w-7 h-7 rounded bg-[#12294c]/10 flex items-center justify-center">
              <Code className="w-3.5 h-3.5 text-[#12294c]" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Real-time Coding
            </span>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow hover:border-[#12294c]/20 transition-all duration-200">
            <div className="w-7 h-7 rounded bg-[#12294c]/10 flex items-center justify-center">
              <CircleCheckBig className="w-3.5 h-3.5 text-[#12294c]" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Auto Evaluation
            </span>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow hover:border-[#12294c]/20 transition-all duration-200">
            <div className="w-7 h-7 rounded bg-[#12294c]/10 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-[#12294c]" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              For Teachers & Students
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLabPage;
