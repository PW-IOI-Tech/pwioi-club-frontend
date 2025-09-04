import React from "react";
import { BookOpen, GraduationCap, Trophy, Users, Filter } from "lucide-react";

const AcademicsShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section Shimmer */}
        <div className="bg-[#12294c] rounded-sm border border-gray-400 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-slate-700 rounded-sm mb-2 animate-pulse"></div>
              <div className="h-4 w-80 bg-slate-700 rounded-sm animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white px-4 py-3 rounded-sm border border-gray-200"
                >
                  <div className="h-3 w-16 bg-gray-200 rounded-sm mb-1 animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded-sm animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Filters Shimmer */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg p-6 border border-gray-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
              <Filter className="w-4 h-4 text-blue-600 opacity-50" />
            </div>
            <div className="h-6 w-48 bg-gray-200 rounded-sm animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gray-200 rounded-sm mb-2 animate-pulse"></div>
                <div className="h-12 bg-white rounded-sm border border-gray-300 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-12 w-36 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="h-12 w-28 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>
            <div className="h-10 w-64 bg-amber-100 rounded-sm animate-pulse"></div>
          </div>
        </div>

        {/* Performance Trend Chart Shimmer */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
          <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4">
            <div className="h-6 w-80 bg-gray-200 rounded-sm animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="h-80 bg-gray-100 rounded-sm animate-pulse"></div>
          </div>
        </div>

        {/* Leaderboards Shimmer */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
                    {i === 0 ? (
                      <Users className="w-4 h-4 text-white opacity-50" />
                    ) : (
                      <Trophy className="w-4 h-4 text-white opacity-50" />
                    )}
                  </div>
                  <div className="h-5 w-40 bg-gray-200 rounded-sm animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[...Array(2)].map((_, j) => (
                    <div
                      key={j}
                      className="bg-white p-3 rounded-sm shadow-sm border border-gray-400"
                    >
                      <div className="h-3 w-16 bg-gray-200 rounded-sm mb-1 animate-pulse"></div>
                      <div className="h-8 w-12 bg-gray-200 rounded-sm animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-16 bg-gray-50 rounded-sm border border-gray-200 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Courses Shimmer */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
          <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white opacity-50" />
              </div>
              <div className="h-5 w-48 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="h-6 w-20 bg-blue-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className="text-left py-4">
                        <div className="h-4 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="py-4">
                          <div className="h-4 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Completed Courses Shimmer */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-lg border border-gray-400 overflow-hidden">
          <div className="bg-gradient-to-br from-white to-indigo-50 border-b border-b-gray-400 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#12294c] rounded-sm flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white opacity-50" />
                </div>
                <div className="h-5 w-36 bg-gray-200 rounded-sm animate-pulse"></div>
                <div className="h-6 w-20 bg-green-100 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 text-slate-900 opacity-50"></div>
                <div className="h-10 w-32 bg-[#12294c] rounded-sm animate-pulse"></div>
                <div className="h-10 w-20 bg-[#12294c] rounded-sm animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className="text-left py-4">
                        <div className="h-4 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="py-4">
                          <div className="h-4 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsShimmer;
