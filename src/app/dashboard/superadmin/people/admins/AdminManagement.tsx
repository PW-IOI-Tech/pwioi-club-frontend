"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddAdminModal from "./AddAdminModal";

interface TableAdmin {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  linkedinLink: string;
  designation: string;
  role: "admin" | "ops" | "teacher" | "manager" | "developer";
}

const initialAdmins: TableAdmin[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@university.edu",
    phoneNumber: "+1 202 555 0198",
    linkedinLink: "https://linkedin.com/in/johnsmith",
    designation: "System Administrator",
    role: "admin",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@edusupport.org",
    phoneNumber: "+1 202 555 0173",
    linkedinLink: "https://linkedin.com/in/sarahjohnson",
    designation: "Operations Lead",
    role: "ops",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@teachtech.ai",
    phoneNumber: "+1 202 555 0144",
    linkedinLink: "https://linkedin.com/in/michaelchen",
    designation: "Senior Instructor",
    role: "teacher",
  },
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState<TableAdmin[]>(initialAdmins);
  const [error, setError] = useState("");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalAdmins: admins.length,
    }),
    [admins]
  );

  const handleUpdateAdmin = useCallback((updatedItem: any) => {
    const adminItem = updatedItem as TableAdmin;
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminItem.id ? { ...admin, ...adminItem } : admin
      )
    );
  }, []);

  const handleDeleteAdmin = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setAdmins((prev) => prev.filter((admin) => admin.id !== deleteId));
  }, []);

  const handleAddAdmin = useCallback(
    (newAdminData: {
      name: string;
      email: string;
      phoneNumber: string;
      linkedinLink: string;
      designation: string;
      role: "admin" | "ops" | "teacher" | "manager" | "developer";
    }) => {
      const newAdmin: TableAdmin = {
        id: Date.now().toString(),
        name: newAdminData.name,
        email: newAdminData.email,
        phoneNumber: newAdminData.phoneNumber,
        linkedinLink: newAdminData.linkedinLink,
        designation: newAdminData.designation,
        role: newAdminData.role,
      };

      setAdmins((prev) => [...prev, newAdmin]);
      setIsAddAdminModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddAdminModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddAdminModalOpen(false);
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
          badgeFields={["role", "company"]}
          selectFields={{
            company: [
              "University of Tech",
              "EduSupport Inc",
              "TeachTech AI",
              "Global Ed Corp",
              "NextGen Learning",
            ],
            role: ["Admin", "Ops", "Teacher", "Manager", "Developer"],
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
          hiddenColumns={["id"]}
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
