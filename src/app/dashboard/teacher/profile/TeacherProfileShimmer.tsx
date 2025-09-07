import React from "react";

const TeacherProfileShimmer = () => {
  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#12294c] rounded-sm shadow-sm border border-gray-400 p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="h-6 w-48 bg-slate-700 rounded-sm mb-2 animate-pulse"></div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-slate-600 rounded-sm"></div>
                        <div className="h-4 w-20 bg-slate-700 rounded-sm animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-400 rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-sm animate-pulse"></div>
                  <div className="h-5 w-12 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-100 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-400 rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                  <div className="h-5 w-12 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-100 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-400 rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-sm animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-100 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-400 rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-24 bg-gray-100 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-sm mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-400 rounded-sm shadow-sm p-4">
              <div className="h-5 w-24 bg-gray-200 rounded-sm mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 bg-gray-100 rounded-sm p-3">
                      <div className="h-4 w-20 bg-gray-200 rounded-sm mb-1 animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileShimmer;
