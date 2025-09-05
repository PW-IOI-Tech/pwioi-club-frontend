"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import Table from "../../Table";
import AddBatchModal from "./AddBatchModal";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TableBatch {
  id: string;
  name: string;
  department: string;
  center: string;
}

interface Center {
  id: string;
  name: string;
  location: string;
  code: string;
}

export default function BatchManagement() {
  const [batches, setBatches] = useState<TableBatch[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch centers from backend
  useEffect(() => {
    const getCenters = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/center/all`, {
          withCredentials: true,
        });

        const fetchedCenters: Center[] = res.data.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          code: c.code,
        }));

        setCenters(fetchedCenters);
      } catch (err) {
        console.error("Error fetching centers:", err);
      }
    };

    getCenters();
  }, []);

  // Fetch batches for selected center
  const fetchBatches = useCallback(
    async (centerId: string, centerName: string) => {
      if (!centerId) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/batches/center/${centerId}`,
          {
            withCredentials: true,
          }
        );

        const fetchedBatches: TableBatch[] = res.data.data.map(
          (batch: any) => ({
            id: batch.id,
            name: batch.name,
            department: batch.school.name,
            center: centerName,
          })
        );

        setBatches(fetchedBatches);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Filter batches by selected center (since we're already fetching by center, just return all batches)
  const filteredBatches = useMemo(() => {
    return batches; // No need to filter since we already fetch by center
  }, [batches]);

  // Stats for selected center (use all batches since we fetch by center)
  const statistics = useMemo(() => {
    return { totalBatches: batches.length };
  }, [batches]);

  const handleUpdateBatch = useCallback(async (updatedItem: any) => {
    const batchItem = updatedItem as TableBatch;

    try {
      await axios.patch(
        `${BACKEND_URL}/api/batches/${batchItem.id}`,
        { name: batchItem.name },
        { withCredentials: true }
      );

      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === batchItem.id ? { ...batch, ...batchItem } : batch
        )
      );
    } catch (err) {
      console.error("Error updating batch:", err);
      // Optionally show error message to user
    }
  }, []);

  const handleDeleteBatch = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;

    try {
      await axios.delete(`${BACKEND_URL}/api/batches/${deleteId}`, {
        withCredentials: true,
      });

      setBatches((prev) => prev.filter((batch) => batch.id !== deleteId));
    } catch (err) {
      console.error("Error deleting batch:", err);
      // Optionally show error message to user
    }
  }, []);

  const handleAddBatch = useCallback(
    async (newBatchData: {
      centerName: string;
      depName: string;
      batchName: string;
      schoolId: string;
    }) => {
      if (!selectedCenter) return;

      try {
        await axios.post(
          `${BACKEND_URL}/api/batches/create`,
          {
            schoolId: newBatchData.schoolId,
            name: newBatchData.batchName,
          },
          { withCredentials: true }
        );

        // Refresh batches after successful creation
        fetchBatches(selectedCenter.id, selectedCenter.name);
        setIsAddBatchModalOpen(false);
      } catch (err) {
        console.error("Error creating batch:", err);
        // Optionally show error message to user
      }
    },
    [selectedCenter, fetchBatches]
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddBatchModalOpen(true);
  }, [selectedCenter]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddBatchModalOpen(false);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const found = centers.find((c) => c.id === value) || null;
    setSelectedCenter(found);

    if (found) {
      fetchBatches(found.id, found.name);
      setTimeout(() => setShowContent(true), 400);
    } else {
      setShowContent(false);
      setBatches([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Batch Management</h2>

        {/* Center Selection */}
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
              value={selectedCenter?.id || ""}
              onChange={handleLocationChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm"
            >
              <option value="">Select Location to Proceed</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        {!selectedCenter || !showContent || loading ? (
          <ShimmerSkeleton />
        ) : (
          <>
            {/* Stats + Add batch */}
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
              title={`Batches in ${selectedCenter.name}`}
              filterField="department"
              badgeFields={["department"]}
              selectFields={{
                department: ["SOT", "SOM", "SOH"],
              }}
              nonEditableFields={["id", "center", "department"]}
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
          prefillLocation={selectedCenter?.location || ""}
          centerId={selectedCenter?.id || ""}
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
