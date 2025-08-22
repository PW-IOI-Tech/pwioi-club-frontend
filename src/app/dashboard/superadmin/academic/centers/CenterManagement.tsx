"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddCenterModal from "./AddCenterModal";

interface TableCenter {
  id: string;
  centerName: string;
  location: string;
  code: string;
}

const initialCenters: TableCenter[] = [
  {
    id: "1",
    centerName: "Bangalore Tech Hub",
    location: "Electronic City, Bangalore, Karnataka",
    code: "1",
  },
  {
    id: "2",
    centerName: "Lucknow Campus",
    location: "Gomti Nagar, Lucknow, Uttar Pradesh",
    code: "2",
  },
  {
    id: "3",
    centerName: "Pune Innovation Center",
    location: "Hinjewadi, Pune, Maharashtra",
    code: "3",
  },
  {
    id: "4",
    centerName: "Noida Business Park",
    location: "Sector 62, Noida, Uttar Pradesh",
    code: "4",
  },
];

export default function CenterManagement() {
  const [centers, setCenters] = useState<TableCenter[]>(initialCenters);
  const [error, setError] = useState("");
  const [isAddCenterModalOpen, setIsAddCenterModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalCenters: centers.length,
      activeCenters: centers.length, // Assuming all centers are active for now
    }),
    [centers]
  );

  const handleUpdateCenter = useCallback((updatedItem: any) => {
    const centerItem = updatedItem as TableCenter;
    setCenters((prev) =>
      prev.map((center) =>
        center.id === centerItem.id ? { ...center, ...centerItem } : center
      )
    );
  }, []);

  const handleDeleteCenter = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setCenters((prev) => prev.filter((center) => center.id !== deleteId));
  }, []);

  const handleAddCenter = useCallback(
    (newCenterData: { centerName: string; location: string; code: string }) => {
      const newCenter: TableCenter = {
        id: Date.now().toString(),
        centerName: newCenterData.centerName,
        location: newCenterData.location,
        code: newCenterData.code,
      };

      setCenters((prev) => [...prev, newCenter]);
      setIsAddCenterModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddCenterModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddCenterModalOpen(false);
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
          Center Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Centers</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalCenters}
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
              <h3 className="text-lg font-semibold">Add New Center</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new center record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={centers}
          title="Centers Overview"
          filterField="centerName"
          badgeFields={["code"]}
          selectFields={{
            code: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          }}
          nonEditableFields={["id"]}
          onDelete={handleDeleteCenter}
          onEdit={handleUpdateCenter}
          hiddenColumns={["id"]}
        />

        <AddCenterModal
          isOpen={isAddCenterModalOpen}
          onClose={handleCloseAddModal}
          onCenterCreated={handleAddCenter}
        />
      </div>
    </div>
  );
}
