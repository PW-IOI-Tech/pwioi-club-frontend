"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddPolicyModal from "./AddPolicyModal";

interface TablePolicy {
  id: string;
  policyName: string;
  pdfUrl: string;
  effectiveDate: string;
  isActive: string;
  version: string;
  centerLocation: string;
}

const initialPolicies: TablePolicy[] = [
  {
    id: "1",
    policyName: "Code of Conduct Policy",
    pdfUrl: "https://example.com/policies/code-of-conduct-v2.0.pdf",
    effectiveDate: "2024-01-15",
    isActive: "true",
    version: "2.0",
    centerLocation: "Bangalore",
  },
  {
    id: "2",
    policyName: "Remote Work Policy",
    pdfUrl: "https://example.com/policies/remote-work-v1.5.pdf",
    effectiveDate: "2024-03-01",
    isActive: "true",
    version: "1.5",
    centerLocation: "Lucknow",
  },
  {
    id: "3",
    policyName: "Data Privacy Policy",
    pdfUrl: "https://example.com/policies/data-privacy-v2.2.pdf",
    effectiveDate: "2023-12-01",
    isActive: "false",
    version: "2.2",
    centerLocation: "Pune",
  },
  {
    id: "4",
    policyName: "Leave Management Policy",
    pdfUrl: "https://example.com/policies/leave-management-v3.0.pdf",
    effectiveDate: "2024-04-01",
    isActive: "true",
    version: "3.0",
    centerLocation: "Noida",
  },
];

const LOCATIONS = ["Bangalore", "Lucknow", "Pune", "Noida"] as const;

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<TablePolicy[]>(initialPolicies);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredPolicies = useMemo(() => {
    if (!selectedLocation) return [];
    return policies.filter(
      (policy) => policy.centerLocation === selectedLocation
    );
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

  const handleUpdatePolicy = useCallback((updatedItem: any) => {
    const policyItem = updatedItem as TablePolicy;
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyItem.id ? { ...policy, ...policyItem } : policy
      )
    );
  }, []);

  const handleDeletePolicy = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setPolicies((prev) => prev.filter((policy) => policy.id !== deleteId));
  }, []);

  const handleAddPolicy = useCallback(
    (newPolicyData: {
      policyName: string;
      pdfUrl: string;
      effectiveDate: string;
      isActive: string;
      version: string;
      centerLocation: string;
    }) => {
      const newPolicy: TablePolicy = {
        id: Date.now().toString(),
        policyName: newPolicyData.policyName,
        pdfUrl: newPolicyData.pdfUrl,
        effectiveDate: newPolicyData.effectiveDate,
        isActive: newPolicyData.isActive,
        version: newPolicyData.version,
        centerLocation: selectedLocation,
      };

      setPolicies((prev) => [...prev, newPolicy]);
      setIsAddPolicyModalOpen(false);
    },
    [selectedLocation]
  );

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);

    if (value) {
      setTimeout(() => {
        setShowContent(true);
      }, 400);
    } else {
      setShowContent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Policy Management</h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-100 mb-2"
          >
            Select Center Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
            >
              <option value="">Select Location to Proceed</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
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
                isActive: ["true", "false"],
                version: ["1.0", "1.5", "2.0", "2.2", "3.0"],
                centerLocation: ["Bangalore", "Lucknow", "Pune", "Noida"],
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
