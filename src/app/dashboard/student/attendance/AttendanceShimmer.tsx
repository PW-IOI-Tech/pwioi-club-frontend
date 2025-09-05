"use client";

import React from "react";
import { BookOpen, TrendingUp, CheckCircle } from "lucide-react";

export const AttendanceDetailsShimmer = () => {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] border border-slate-900 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-6 w-48 bg-slate-700 rounded-sm mb-2 animate-pulse"></div>
              <div className="flex items-center gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium h-6 w-32 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="h-6 w-6 bg-slate-700 rounded-sm animate-pulse"></div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="flex flex-wrap gap-2 mb-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-40 bg-gray-200 rounded-sm animate-pulse"
              ></div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-white to-indigo-50 rounded-sm p-4 mb-6 border border-gray-400">
            <div className="h-5 w-32 bg-gray-200 rounded-sm mb-3 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-16 bg-gray-200 rounded-sm mx-auto mb-1 animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-indigo-50 rounded-sm p-4 border border-gray-400"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-white rounded-sm border border-gray-400">
                      <div className="h-6 w-8 bg-gray-200 rounded-sm mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-sm border border-gray-400">
                      <div className="h-6 w-8 bg-gray-200 rounded-sm mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-full h-2 border border-gray-400">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AttendancePageShimmer = () => {
  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section Shimmer */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div>
                <div className="h-8 w-64 bg-slate-700 rounded-sm mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-slate-700 rounded-sm animate-pulse"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/25 to-indigo-50/25 p-3 w-1/4 rounded-sm border border-gray-200/25 backdrop-blur-sm">
              <div className="h-3 w-24 bg-gray-200 rounded-sm mb-2 animate-pulse"></div>
              <div className="h-10 w-full bg-white rounded-sm animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center">
                  {i === 0 ? (
                    <TrendingUp className="w-4 h-4 text-white opacity-50" />
                  ) : i === 1 ? (
                    <CheckCircle className="w-4 h-4 text-white opacity-50" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-white opacity-50" />
                  )}
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-sm animate-pulse"></div>
                <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Breakdown Shimmer */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-3 space-y-4 border border-gray-400 p-4 rounded-sm">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-400 rounded-sm shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="h-5 w-40 bg-gray-200 rounded-sm mb-2 animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <div className="h-3 w-12 bg-gray-200 rounded-sm animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded-sm animate-pulse"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-sm">
                      <div className="h-5 w-8 bg-gray-200 rounded-sm mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-sm">
                      <div className="h-5 w-8 bg-gray-200 rounded-sm mx-auto mb-1 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="h-3 w-32 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseInformationShimmer = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-400 rounded-sm shadow-sm p-4 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded-md mb-2 w-3/4"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-md w-16"></div>
                <div className="h-5 bg-gray-200 rounded-md w-20"></div>
              </div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded-md"></div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <div className="h-3 bg-gray-200 rounded-md w-16"></div>
              <div className="h-3 bg-gray-200 rounded-md w-16"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-300 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-green-50 rounded-sm">
              <div className="h-5 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-3 bg-gray-200 rounded-md"></div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-sm">
              <div className="h-5 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-3 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="h-3 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
