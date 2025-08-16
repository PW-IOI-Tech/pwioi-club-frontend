import { RiGraduationCapFill } from "react-icons/ri";
import profileData from "../Constants/ProfileData";

const DegreePartnerCard = () => (
  <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-bold text-gray-900">Degree Partner</h3>
    </div>
    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
        <RiGraduationCapFill className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900">
          {profileData.degreePartner.collegeName}
        </h4>
        <p className="font-semibold text-xs text-slate-800 mb-2 pb-2 mr-4 border-b-[0.25px] border-b-slate-700">
          {profileData.degreePartner.degreeName}
        </p>
        <p className="text-sm text-slate-700 mb-2 leading-tight">
          {profileData.degreePartner.specialization}
        </p>
        <p className="text-xs rounded-full px-4 py-1 bg-blue-800 text-white w-fit mt-3">
          {new Date(profileData.degreePartner.startDate).getFullYear()} -{" "}
          {new Date(profileData.degreePartner.endDate).getFullYear()}
        </p>
      </div>
    </div>
  </div>
);

export default DegreePartnerCard;
