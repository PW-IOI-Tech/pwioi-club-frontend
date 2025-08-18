import profileData from "../Constants/ProfileData";

const PersonalDetailsCard = () => (
  <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Father&lsquo;s Name
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.fathersName}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Mother&lsquo;s Name
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.mothersName}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Contact
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.fathersContact}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Contact
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.mothersContact}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Occupation
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.fathersOccupation}
        </p>
      </div>
      <div className="p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
        <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
          Occupation
        </label>
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {profileData.personalDetails.mothersOccupation}
        </p>
      </div>
    </div>
  </div>
);

export default PersonalDetailsCard;
