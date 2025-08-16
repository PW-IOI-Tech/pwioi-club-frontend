import { Edit3 } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import profileData from "../Constants/ProfileData";

const ContactCard = () => (
  <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
    </div>
    <div className="space-y-2">
      <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
          <IoMdMail className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
            Email
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {profileData.basicInfo.email}
          </div>
        </div>
      </div>
      <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
          <FaPhoneAlt className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
            Phone
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {profileData.basicInfo.phone}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactCard;
