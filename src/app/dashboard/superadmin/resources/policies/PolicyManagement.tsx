"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus } from "lucide-react";
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

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<TablePolicy[]>(initialPolicies);
  const [error, setError] = useState("");
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalPolicies: policies.length,
      activePolicies: policies.filter((policy) => policy.isActive === "true")
        .length,
    }),
    [policies]
  );

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
        centerLocation: newPolicyData.centerLocation,
      };

      setPolicies((prev) => [...prev, newPolicy]);
      setIsAddPolicyModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddPolicyModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddPolicyModalOpen(false);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => setError("")}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Policy Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Policies</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalPolicies}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Active Policies</h4>
              <p className="text-5xl font-bold text-green-600">
                {statistics.activePolicies}
              </p>
            </div>
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
          data={policies}
          title="Policies Overview"
          filterField="isActive"
          badgeFields={["isActive", "version", "centerLocation"]}
          selectFields={{
            isActive: ["true", "false"],
            version: ["1.0", "1.5", "2.0", "2.2", "3.0"],
            centerLocation: ["bangalore", "lucknow", "pune", "noida"],
          }}
          nonEditableFields={["id", "centerLocation"]}
          onDelete={handleDeletePolicy}
          onEdit={handleUpdatePolicy}
          hiddenColumns={["id"]}
        />

        <AddPolicyModal
          isOpen={isAddPolicyModalOpen}
          onClose={handleCloseAddModal}
          onPolicyCreated={handleAddPolicy}
        />
      </div>
    </div>
  );
}
