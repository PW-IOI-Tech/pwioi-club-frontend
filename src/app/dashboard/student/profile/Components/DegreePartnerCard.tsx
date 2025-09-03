import { useEffect, useState } from "react";
import axios from "axios";
import { RiGraduationCapFill } from "react-icons/ri";
import { Edit3, X } from "lucide-react";

interface DegreePartnerData {
  collegeName: string;
  degreeName: string;
  specialization: string;
  startDate: string;
  endDate: string;
}

const DegreePartnerCard = () => {
  const [degreePartner, setDegreePartner] = useState<DegreePartnerData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DegreePartnerData>({
    collegeName: "",
    degreeName: "",
    specialization: "",
    startDate: "",
    endDate: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?.id;

  const fetchDegreePartner = async () => {
    if (!studentId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/degree-partner`,
        { withCredentials: true }
      );

      if (response.data?.success && response.data.data.externalDegree) {
        const { externalDegree } = response.data.data;
        const mappedData: DegreePartnerData = {
          collegeName: externalDegree.college_name,
          degreeName: externalDegree.degree_name,
          specialization: externalDegree.specialization,
          startDate: externalDegree.start_date.split("T")[0],
          endDate: externalDegree.end_date.split("T")[0],
        };
        setDegreePartner(mappedData);
      }
    } catch (error) {
      console.error("Error fetching degree partner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDegreePartner();
  }, [studentId]);

  const openModal = () => {
    setFormData(
      degreePartner || {
        collegeName: "",
        degreeName: "",
        specialization: "",
        startDate: "",
        endDate: "",
      }
    );
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.collegeName ||
      !formData.degreeName ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setFormError("All fields are required.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students-profile/${studentId}/degree-partner`,
        {
          college_name: formData.collegeName,
          degree_name: formData.degreeName,
          specialisation: formData.specialization,
          start_date: new Date(formData.startDate).toISOString(),
          end_date: new Date(formData.endDate).toISOString(),
        },
        { withCredentials: true }
      );

      setDegreePartner(formData);
      setIsModalOpen(false);
    } catch (error: any) {
      setFormError(
        error.response?.data?.message || "Failed to save. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Degree Partner</h3>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-sm shadow-lg border border-gray-400 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Degree Partner</h3>
        <button
          onClick={openModal}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-300"
          aria-label="Edit degree partner"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {degreePartner ? (
        <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <RiGraduationCapFill className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900">
              {degreePartner.collegeName}
            </h4>
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
        <p className="text-sm text-gray-600">
          No degree partner information added yet.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-2xl border border-gray-400 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {degreePartner ? "Edit Degree Partner" : "Add Degree Partner"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {formError && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded border border-red-100">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    College Name
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g., ABC University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    name="degreeName"
                    value={formData.degreeName}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g., Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-sm text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-sm text-sm font-medium transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DegreePartnerCard;
