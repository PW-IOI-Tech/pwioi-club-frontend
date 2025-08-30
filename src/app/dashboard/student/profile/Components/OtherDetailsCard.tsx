import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Check, X, Edit } from "lucide-react";
import { useState } from "react";

const OtherDetailsCard = ({
  contactData,
  onUpdateContact,
}: {
  contactData: any;
  onUpdateContact: (field: string, value: string) => void;
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressValue, setAddressValue] = useState(contactData?.address || "");

  const handleSaveAddress = () => {
    onUpdateContact("address", addressValue.trim() || "NA");
    setIsEditingAddress(false);
  };

  const handleCancelEdit = () => {
    setAddressValue(contactData?.address || "");
    setIsEditingAddress(false);
  };

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Other Details</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="h-8 w-8 rounded-full bg-slate-900 p-1 flex items-center justify-center">
            <FaLocationDot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1">
              Address
            </div>
            {isEditingAddress ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Enter address"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <button
                    onClick={handleSaveAddress}
                    className="p-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="text-sm font-semibold text-slate-900 cursor-pointer flex items-center"
                onClick={() => setIsEditingAddress(true)}
                title="Click to edit"
              >
                {contactData?.address || "NA"}
                <Edit className="ml-2 w-3 h-3 text-slate-900 hover:text-slate-700" />
              </div>
            )}
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
              {contactData?.gender || "NA"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherDetailsCard;
