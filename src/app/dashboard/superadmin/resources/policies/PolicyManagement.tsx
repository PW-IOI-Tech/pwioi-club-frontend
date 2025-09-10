"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddPolicyModal from "./AddPolicyModal";
import axios from "axios";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface TablePolicy {
  id: string;
  policyName: string;
  pdfUrl: string;
  effectiveDate: string;
  isActive: string;
  version: string;
  centerLocation: string;
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<TablePolicy[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/center/all`,
          { withCredentials: true }
        );
        setCenters(res.data.data);
      } catch (err) {
        console.error("Failed to fetch centers:", err);
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    if (!selectedCenterId) return;
    const fetchPolicies = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/policy/center/${selectedCenterId}`,
          { withCredentials: true }
        );

        const mappedPolicies: TablePolicy[] = res.data.data.map((p: any) => ({
          id: p.id,
          policyName: p.name,
          pdfUrl: p.pdf_url,
          effectiveDate: formatDate(p.effective_date),
          isActive: String(p.is_active),
          version: p.policy_version,
          centerLocation:
            centers.find((c) => c.id === p.center_id)?.location || "",
        }));

        setPolicies(mappedPolicies);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      }
    };
    fetchPolicies();
  }, [selectedCenterId, centers]);

  const filteredPolicies = useMemo(() => {
    if (!selectedLocation) return [];
    return policies.filter((p) => p.centerLocation === selectedLocation);
  }, [policies, selectedLocation]);

  const statistics = useMemo(() => {
    const filtered = policies.filter(
      (p) => p.centerLocation === selectedLocation
    );
    return {
      totalPolicies: filtered.length,
      activePolicies: filtered.filter((p) => p.isActive === "true").length,
    };
  }, [policies, selectedLocation]);

  const handleAddPolicy = useCallback(
    async (newPolicyData: {
      policyName: string;
      pdfUrl: string;
      effectiveDate: string;
      isActive: string;
      version: string;
      centerLocation: string;
    }) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/policy`,
          {
            name: newPolicyData.policyName,
            pdf_url: newPolicyData.pdfUrl,
            effective_date: new Date(newPolicyData.effectiveDate).toISOString(),
            is_active: newPolicyData.isActive === "true",
            policy_version: newPolicyData.version,
            center_id: selectedCenterId,
          },
          { withCredentials: true }
        );

        const p = res.data.data;
        const mappedPolicy: TablePolicy = {
          id: p.id,
          policyName: p.name,
          pdfUrl: p.pdf_url,
          effectiveDate: formatDate(p.effective_date),
          isActive: String(p.is_active),
          version: p.policy_version,
          centerLocation:
            centers.find((c) => c.id === p.center_id)?.location || "",
        };

        setPolicies((prev) => [...prev, mappedPolicy]);
        setIsAddPolicyModalOpen(false);
      } catch (err) {
        console.error("Failed to create policy:", err);
      }
    },
    [selectedCenterId, centers]
  );

  const handleUpdatePolicy = useCallback(
    async (updatedItem: any) => {
      try {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/policy/${updatedItem.id}`,
          {
            name: updatedItem.policyName,
            pdf_url: updatedItem.pdfUrl,
            effective_date: new Date(updatedItem.effectiveDate).toISOString(),
            is_active: updatedItem.isActive === "true",
            policy_version: updatedItem.version,
          },
          { withCredentials: true }
        );

        const p = res.data.data;
        const mappedPolicy: TablePolicy = {
          id: p.id,
          policyName: p.name,
          pdfUrl: p.pdf_url,
          effectiveDate: p.effective_date,
          isActive: String(p.is_active),
          version: p.policy_version,
          centerLocation:
            centers.find((c) => c.id === p.center_id)?.location || "",
        };

        setPolicies((prev) =>
          prev.map((policy) =>
            policy.id === mappedPolicy.id ? mappedPolicy : policy
          )
        );
      } catch (err) {
        console.error("Failed to update policy:", err);
      }
    },
    [centers]
  );

  const handleDeletePolicy = useCallback(async (id: string | number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/policy/${id}`,
        { withCredentials: true }
      );
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete policy:", err);
    }
  }, []);

  // 🔹 Handle location change (center selection)
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const centerId = e.target.value;
    const centerObj = centers.find((c) => c.id === centerId);

    setSelectedCenterId(centerId);
    setSelectedLocation(centerObj?.location || "");
    setShowContent(!!centerId);
  };

  const handleOpenAddModal = useCallback(() => {
    if (!selectedLocation) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddPolicyModalOpen(true);
  }, [selectedLocation]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddPolicyModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Policy Management</h2>

        <div className="bg-[#12294c] p-6 rounded-lg shadow-sm border border-gray-200">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-100 mb-2"
          >
            Select Center Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={selectedCenterId}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
            >
              <option value="">Select Location to Proceed</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {!selectedLocation ? (
          <ShimmerSkeleton />
        ) : !showContent ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Policies</h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalPolicies}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Active Policies</h4>
                <p className="text-5xl font-bold text-green-600">
                  {statistics.activePolicies}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 flex items-center justify-center p-6">
                <button
                  onClick={handleOpenAddModal}
                  className="flex flex-col items-center justify-center w-full h-full text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="bg-gray-200 rounded-full p-3 mb-2 hover:bg-gray-300 transition-colors">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">Add New Policy</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new policy record
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredPolicies}
              title={`Policies in ${selectedLocation}`}
              filterField="policyName"
              badgeFields={["isActive", "version", "centerLocation"]}
              selectFields={{
                isActive: [
                  { label: "Active", value: "true" },
                  { label: "Inactive", value: "false" },
                ],
                version: [
                  { label: "1.0", value: "1.0" },
                  { label: "1.5", value: "1.5" },
                  { label: "2.0", value: "2.0" },
                  { label: "2.2", value: "2.2" },
                  { label: "3.0", value: "3.0" },
                ],
                centerLocation: centers.map((c) => c.location),
              }}
              nonEditableFields={["id", "centerLocation"]}
              onDelete={handleDeletePolicy}
              onEdit={handleUpdatePolicy}
              hiddenColumns={["id"]}
            />
          </>
        )}

        <AddPolicyModal
          isOpen={isAddPolicyModalOpen}
          onClose={handleCloseAddModal}
          onPolicyCreated={handleAddPolicy}
          prefillLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-sm border border-gray-300 text-center"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
