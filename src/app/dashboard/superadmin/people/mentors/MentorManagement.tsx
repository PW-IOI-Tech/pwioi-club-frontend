"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddMentorModal from "./AddMentorModal";
import axios from "axios";
import { ManagementShimmer } from "../admins/AdminManagement";

interface TableMentor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  linkedinLink: string;
  designation: string;
  company: string;
}

export default function MentorManagement() {
  const [mentors, setMentors] = useState<TableMentor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/all`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const mappedMentors: TableMentor[] = res.data.data.map((c: any) => ({
            id: c.id,
            mentorName: c.name,
            email: c.email,
            phone: c.phone,
            linkedin: c.linkedin,
            designation: c.designation,
            company: c.company,
          }));
          setMentors(mappedMentors);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch mentors");
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const statistics = useMemo(
    () => ({
      totalMentors: mentors.length,
    }),
    [mentors]
  );

  const handleUpdateMentor = useCallback(async (updatedItem: any) => {
    const mentorItem = updatedItem as TableMentor;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/${mentorItem.id}`,
        mentorItem,
        {
          withCredentials: true,
        }
      );
      setMentors((prev) =>
        prev.map((mentor) =>
          mentor.id === mentorItem.id ? res.data.data : mentor
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update mentor");
    }
  }, []);

  const handleDeleteMentor = useCallback(async (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/${deleteId}`,
        { withCredentials: true }
      );
      setMentors((prev) => prev.filter((mentor) => mentor.id !== deleteId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete mentor");
    }
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddMentorModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddMentorModalOpen(false);
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

  return loading ? (
    <ManagementShimmer />
  ) : (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Mentor Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Mentors</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalMentors}
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
              <h3 className="text-lg font-semibold">Add New Mentor</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new mentor record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={mentors}
          title="Mentors Overview"
          filterField="company"
          badgeFields={["company"]}
          selectFields={{}}
          nonEditableFields={["id"]}
          onDelete={handleDeleteMentor}
          onEdit={handleUpdateMentor}
          hiddenColumns={["id", "createdAt", "updatedAt"]}
        />

        <AddMentorModal
          isOpen={isAddMentorModalOpen}
          onClose={handleCloseAddModal}
          onMentorAdded={(newMentor) => {
            setMentors((prev) => [...prev, newMentor]);
          }}
        />
      </div>
    </div>
  );
}
