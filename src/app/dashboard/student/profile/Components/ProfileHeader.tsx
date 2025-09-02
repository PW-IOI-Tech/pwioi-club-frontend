import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building,
  Calendar,
  Code,
  GraduationCap,
  School,
  User,
  UserCheck,
} from "lucide-react";
import { ProfileHeaderShimmer } from "../ProfileBuilderShimmer";

interface ProfileData {
  studentId: string;
  enrollmentId: string;
  name: string;
  center?: { id: string; name: string } | null;
  school?: { id: string; name: string } | null;
  batch?: { id: string; name: string } | null;
  semester?: { id: string; number: number } | null;
  division?: { id: string; code: string } | null;
}

const ProfileHeader = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const studentId = user?.id;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/basic-details`,
          { withCredentials: true }
        );

        setProfileData(res.data.data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) {
    return <ProfileHeaderShimmer />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-lg border border-gray-200 p-6 mb-6">
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
            <div className="grid grid-cols-2 lg:grid-cols-3 space-x-8 space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="font-medium">ID:</span>
                <span>{profileData.enrollmentId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Center:</span>
                <span>{profileData.center?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4 text-blue-600" />
                <span className="font-medium">School:</span>
                <span>{profileData.school?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Batch:</span>
                <span>{profileData.batch?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Semester:</span>
                <span>{profileData.semester?.number}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Division:</span>
                <span>{profileData.division?.code}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
