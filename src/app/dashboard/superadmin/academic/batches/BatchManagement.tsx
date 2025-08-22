"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddBatchModal from "./AddBatchModal";

interface TableBatch {
  id: string;
  name: string;
  department: string;
  center: string;
}

const initialBatches: TableBatch[] = [
  {
    id: "1",
    name: "SOT24BAN",
    department: "SOT",
    center: "Bangalore",
  },
  {
    id: "2",
    name: "SOM24LUC",
    department: "SOM",
    center: "Lucknow",
  },
  {
    id: "3",
    name: "SOH24PUN",
    department: "SOH",
    center: "Pune",
  },
];

export default function BatchManagement() {
  const [batches, setBatches] = useState<TableBatch[]>(initialBatches);
  const [error, setError] = useState("");
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [userCenter] = useState("Bangalore");

  const statistics = useMemo(
    () => ({
      totalBatches: batches.length,
    }),
    [batches]
  );

  const handleUpdateBatch = useCallback((updatedItem: any) => {
    const batchItem = updatedItem as TableBatch;
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === batchItem.id ? { ...batch, ...batchItem } : batch
      )
    );
  }, []);

  const handleDeleteBatch = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setBatches((prev) => prev.filter((batch) => batch.id !== deleteId));
  }, []);

  const handleAddBatch = useCallback(
    (newBatchData: {
      centerName: string;
      depName: string;
      batchName: string;
    }) => {
      const newBatch: TableBatch = {
        id: Date.now().toString(),
        name: newBatchData.batchName,
        department: newBatchData.depName,
        center: newBatchData.centerName,
      };

      setBatches((prev) => [...prev, newBatch]);
      setIsAddBatchModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddBatchModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddBatchModalOpen(false);
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
          Batch Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Batches</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalBatches}
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
              <h3 className="text-lg font-semibold">Add New Batch</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new batch record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={batches}
          title="Batches Overview"
          filterField="department"
          badgeFields={["department"]}
          selectFields={{
            department: ["SOT", "SOM", "SOH"],
            center: ["Bangalore", "Lucknow", "Pune"],
          }}
          nonEditableFields={["id"]}
          onDelete={handleDeleteBatch}
          onEdit={handleUpdateBatch}
          hiddenColumns={["id"]}
        />

        <AddBatchModal
          isOpen={isAddBatchModalOpen}
          onClose={handleCloseAddModal}
          userCenter={userCenter}
          onBatchCreated={handleAddBatch}
        />
      </div>
    </div>
  );
}
