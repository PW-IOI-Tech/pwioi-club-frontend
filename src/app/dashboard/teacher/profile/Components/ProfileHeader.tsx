import { useState } from "react";
import { Building, User, UserCheck, Briefcase } from "lucide-react";

interface TeacherProfileData {
  name: string;
  centerId: string;
  designation: string;
}

const TeacherProfileHeader = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [profileData] = useState<TeacherProfileData>({
    name: user?.name,
    centerId: "CTR-2024-001",
    designation: user?.designation,
  });

  return (
    <div className="bg-[#12294c] rounded-sm shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-white">
                {profileData.name}
              </h1>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 font-medium">
                  {profileData.designation}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">ID:</span>
                  <span className="text-gray-200">{profileData.centerId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">Center:</span>
                  <span className="text-gray-200">Main Campus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileHeader;
