"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
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

const LOCATIONS = ["Bangalore", "Lucknow", "Pune", "Noida"] as const;

export default function BatchManagement() {
  const [batches, setBatches] = useState<TableBatch[]>(initialBatches);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredBatches = useMemo(() => {
    if (!selectedLocation) return [];
    return batches.filter((batch) => batch.center === selectedLocation);
  }, [batches, selectedLocation]);

  const statistics = useMemo(() => {
    const filtered = batches.filter((b) => b.center === selectedLocation);
    return {
      totalBatches: filtered.length,
    };
  }, [batches, selectedLocation]);

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
        center: selectedLocation,
      };

      setBatches((prev) => [...prev, newBatch]);
      setIsAddBatchModalOpen(false);
    },
    [selectedLocation]
  );

  const handleOpenAddModal = useCallback(() => {
    if (!selectedLocation) {
      alert("Please select a center location first.");
      return;
    }
    setIsAddBatchModalOpen(true);
  }, [selectedLocation]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddBatchModalOpen(false);
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
        <h2 className="text-3xl font-bold text-slate-900">Batch Management</h2>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-6 text-center">
                <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
                <h4 className="text-lg text-slate-900 mb-1">Total Batches</h4>
                <p className="text-5xl font-bold text-[#1B3A6A]">
                  {statistics.totalBatches}
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
                  <h3 className="text-lg font-semibold">Add New Batch</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new batch record
                  </p>
                </button>
              </div>
            </div>

            <Table
              data={filteredBatches}
              title={`Batches in ${selectedLocation}`}
              filterField="department"
              badgeFields={["department"]}
              selectFields={{
                department: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={["id", "center"]}
              onDelete={handleDeleteBatch}
              onEdit={handleUpdateBatch}
              hiddenColumns={["id"]}
            />
          </>
        )}

        <AddBatchModal
          isOpen={isAddBatchModalOpen}
          onClose={handleCloseAddModal}
          onBatchCreated={handleAddBatch}
          prefillLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
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
