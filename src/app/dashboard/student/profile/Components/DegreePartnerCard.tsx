import { useEffect, useState } from "react";
import axios from "axios";
import { RiGraduationCapFill } from "react-icons/ri";

interface DegreePartnerData {
  collegeName: string;
  degreeName: string;
  specialization: string;
  startDate: string;
  endDate: string;
}

const DegreePartnerCard = () => {
  const [degreePartner, setDegreePartner] = useState<DegreePartnerData | null>(null);
  const [loading, setLoading] = useState(true);

  // get studentId from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.id;

  useEffect(() => {
    const fetchDegreePartner = async () => {
      try {
        if (!studentId) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/degree-partner`,
          { withCredentials: true }
        );

        if (response.data?.success) {
          const { externalDegree } = response.data.data;

          if (externalDegree) {
            setDegreePartner({
              collegeName: externalDegree.collegeName,
              degreeName: externalDegree.degreeName,
              specialization: externalDegree.specialization,
              startDate: externalDegree.startDate,
              endDate: externalDegree.endDate,
            });
          } else {
            setDegreePartner(null);
          }
        }
      } catch (error) {
        console.error("Error fetching degree partner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDegreePartner();
  }, [studentId]);

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Degree Partner</h3>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading degree details...</p>
      ) : degreePartner ? (
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <RiGraduationCapFill className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900">{degreePartner.collegeName}</h4>
            <p className="font-semibold text-xs text-slate-800 mb-2 pb-2 mr-4 border-b-[0.25px] border-b-slate-700">
              {degreePartner.degreeName}
            </p>
            <p className="text-sm text-slate-700 mb-2 leading-tight">
              {degreePartner.specialization}
            </p>
            <p className="text-xs rounded-full px-4 py-1 bg-blue-800 text-white w-fit mt-3">
              {new Date(degreePartner.startDate).getFullYear()} -{" "}
              {new Date(degreePartner.endDate).getFullYear()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">No degree partner found</p>
      )}
    </div>
  );
};

export default DegreePartnerCard;
