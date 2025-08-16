import { Edit3 } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import profileData from "../Constants/ProfileData";

const OtherDetailsCard = () => (
  <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-bold text-gray-900">Other Details</h3>
    </div>
    <div className="space-y-4">
      <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
          <FaLocationDot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
            Address
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {profileData.basicInfo.address}
          </div>
        </div>
      </div>
      <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
          <FaUser className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
            Gender
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {profileData.basicInfo.gender}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OtherDetailsCard;
