"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddAdminModal from "./AddAdminModal";
import axios from "axios";

interface TableAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  pwId?: string | null;
  linkedin?: string | null;
  designation?: string | null;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<TableAdmin[]>([]);
  const [error, setError] = useState("");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin`; 


  // ✅ Fetch all admins
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/all`, {withCredentials:true}
      );
      if (res.data.success) {
        setAdmins(
          res.data.data.map((a: any) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            phone: a.phone,
            pwId: a.pwId,
            linkedin: a.linkedin,
            designation: a.designation,
            role: a.role.role,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          }))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const statistics = useMemo(
    () => ({
      totalAdmins: admins.length,
    }),
    [admins]
  );

  // ✅ Update admin
  const handleUpdateAdmin = useCallback(
    async (updatedItem: any) => {
      try {
        const res = await axios.put(
          `${backendUrl}/${updatedItem.id}`,
          updatedItem,
         {withCredentials:true}
        );
        if (res.data.success) {
          setAdmins((prev) =>
            prev.map((a) =>
              a.id === updatedItem.id ? { ...a, ...updatedItem } : a
            )
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update admin");
      }
    },
    []
  );

  // ✅ Delete admin
  const handleDeleteAdmin = useCallback(
    async (id: string | number) => {
      try {
        const deleteId = typeof id === "number" ? id.toString() : id;
        await axios.delete(`${backendUrl}/${deleteId}`, {withCredentials:true});
        setAdmins((prev) => prev.filter((a) => a.id !== deleteId));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete admin");
      }
    },
    []
  );

// ✅ Add new admin
const handleAddAdmin = useCallback(
  async (newAdminData: {
    name: string;
    email: string;
    phoneNumber: string;       // frontend field
    linkedinLink: string;      // frontend field
    designation: string;
    role: "admin" | "ops" | "teacher" | "manager" | "developer";
    pwId?: string; 
  }) => {
    try {
      // ✅ sanitize before sending
      const payload = {
        name: newAdminData.name,
        email: newAdminData.email,
        phone: newAdminData.phoneNumber,   
        designation: newAdminData.designation,
        role: newAdminData.role,

        // only send pwId if present, else omit
        ...(newAdminData["pwId"] ? { pwId: newAdminData["pwId"] } : {}),

        // send linkedin only if valid url
        ...(newAdminData.linkedinLink?.trim().startsWith("http")
          ? { linkedin: newAdminData.linkedinLink.trim() }
          : {}),

        businessHeadCenters: [],
        academicHeadCenters: [],
      };

      const res = await axios.post(`${backendUrl}/create`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        setAdmins((prev) => [...prev, res.data.data.admin]);
        setIsAddAdminModalOpen(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add admin");
    }
  },
  []
);



  const handleOpenAddModal = useCallback(() => {
    setIsAddAdminModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddAdminModalOpen(false);
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading admins...</p>;
  }

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
          Admin Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Admins</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalAdmins}
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
              <h3 className="text-lg font-semibold">Add New Admin</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new admin record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={admins}
          title="Admins Overview"
          filterField="role"
          badgeFields={["role"]}
          selectFields={{
            role: ["admin", "ops", "teacher", "manager", "developer"],
            designation: [
              "System Administrator",
              "Operations Lead",
              "Senior Instructor",
              "IT Manager",
              "Lead Developer",
              "Academic Coordinator",
            ],
          }}
          nonEditableFields={["id"]}
          onDelete={handleDeleteAdmin}
          onEdit={handleUpdateAdmin}
          hiddenColumns={["id", "pwId", "createdAt", "updatedAt"]}
        />

        <AddAdminModal
          isOpen={isAddAdminModalOpen}
          onClose={handleCloseAddModal}
          onAdminCreated={handleAddAdmin}
        />
      </div>
    </div>
  );
}
