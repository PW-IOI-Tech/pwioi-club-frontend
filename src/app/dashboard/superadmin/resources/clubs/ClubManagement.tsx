"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddClubModal from "./AddClubModal";
import axios from "axios";

interface Club {
  id: string;
  clubName: string;
  category: string;
  leaderId: string;
  description: string;
  establishedDate: string;
  centerLocation: string;
  clubOfficials: string[];
  coreMembers: string[];
}

interface GenericTableItem {
  id: string | number;
  [key: string]: any;
}

const mockFaculties: Record<string, string[]> = {
  Bangalore: ["FAC001 - Dr. Priya Sharma", "FAC002 - Prof. Rajesh Kumar"],
  Lucknow: ["FAC101 - Dr. Meena Verma", "FAC102 - Prof. Arvind Mishra"],
  Pune: ["FAC201 - Prof. Deepak Joshi", "FAC202 - Dr. Neha Deshmukh"],
  Noida: ["FAC301 - Dr. Ravi Malhotra", "FAC302 - Prof. Pooja Bansal"],
};

const mockStudents: Record<string, string[]> = {
  Bangalore: ["STD001 - Aditya Rao", "STD002 - Sneha Iyer"],
  Lucknow: ["STD101 - Aman Pandey", "STD102 - Divya Tiwari"],
  Pune: ["STD201 - Omkar Kulkarni", "STD202 - Shruti Joshi"],
  Noida: ["STD301 - Karan Mehta", "STD302 - Tanvi Chawla"],
};

const categories = ["Tech", "Social", "Sports", "Arts", "Academic", "Cultural"];

export default function ClubManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);

  // ✅ Add Club
  const handleAddClub = async (newClubData: Omit<Club, "id">) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/club`,
        {
          name: newClubData.clubName,
          category: newClubData.category,
          description: newClubData.description,
          center_id: newClubData.centerLocation,
          leader_enrollment_id: newClubData.leaderId,
          established_date: newClubData.establishedDate,
          official_ids: newClubData.clubOfficials.map((id) => ({
            id,
            type: "teacher",
          })),
          core_team_enrollment_ids: newClubData.coreMembers,
        },
        { withCredentials: true }
      );

      const createdClub = res.data.data;
      setClubs((prev) => [
        ...prev,
        {
          id: createdClub.id,
          clubName: createdClub.name,
          category: createdClub.category,
          leaderId: createdClub.leader_enrollment_id,
          description: createdClub.description,
          establishedDate: createdClub.established_date,
          centerLocation: createdClub.center_id,
          clubOfficials: createdClub.officials?.map((o: any) => o.id) || [],
          coreMembers: createdClub.core_team_enrollment_ids || [],
        },
      ]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add club:", err);
    }
  };

  // ✅ Delete Club
  const handleDeleteClub = async (id: string | number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/club/${id}`,
        { withCredentials: true }
      );
      setClubs((prev) => prev.filter((club) => club.id !== id));
    } catch (err) {
      console.error("Failed to delete club:", err);
    }
  };

  // ✅ Update Club
  const handleUpdateClub = async (updatedItem: GenericTableItem) => {
    if (!isValidClub(updatedItem)) return;
    const updatedClub = updatedItem as Club;

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/club/${updatedClub.id}`,
        {
          name: updatedClub.clubName,
          category: updatedClub.category,
          description: updatedClub.description,
          established_date: updatedClub.establishedDate,
          leader_enrollment_id: updatedClub.leaderId,
        },
        { withCredentials: true }
      );

      const savedClub = res.data.data;
      setClubs((prev) =>
        prev.map((club) =>
          club.id === updatedClub.id
            ? {
                id: savedClub.id,
                clubName: savedClub.name,
                category: savedClub.category,
                leaderId: savedClub.leader_enrollment_id,
                description: savedClub.description,
                establishedDate: savedClub.established_date,
                centerLocation: savedClub.center_id,
                clubOfficials: savedClub.officials?.map((o: any) => o.id) || [],
                coreMembers: savedClub.core_team_enrollment_ids || [],
              }
            : club
        )
      );
    } catch (err) {
      console.error("Failed to update club:", err);
    }
  };

  const isValidClub = (item: GenericTableItem): item is Club => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.clubName === "string" &&
      typeof item.category === "string" &&
      typeof item.leaderId === "string" &&
      typeof item.description === "string" &&
      typeof item.establishedDate === "string" &&
      typeof item.centerLocation === "string" &&
      Array.isArray(item.clubOfficials) &&
      Array.isArray(item.coreMembers)
    );
  };

  // ✅ Filter clubs for selected center
  const filteredClubs = useMemo(() => {
    if (!selectedLocation) return [];
    return clubs.filter((club) => club.centerLocation === selectedLocation.id);
  }, [clubs, selectedLocation]);

  // ✅ Stats
  const stats = useMemo(() => {
    return {
      totalClubs: filteredClubs.length,
      techClubs: filteredClubs.filter((c) => c.category === "Tech").length,
      sportsClubs: filteredClubs.filter((c) => c.category === "Sports").length,
    };
  }, [filteredClubs]);

  // ✅ Fetch centers
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

  // ✅ Fetch clubs when center changes
  useEffect(() => {
    if (!selectedLocation) return;

    const fetchClubs = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/club/center/${selectedLocation.id}`,
          { withCredentials: true }
        );

        const mappedClubs: Club[] = res.data.data.map((club: any) => ({
          id: club.id,
          clubName: club.name,
          category: club.category,
          leaderId: club.leader_enrollment_id,
          description: club.description,
          establishedDate: club.established_date,
          centerLocation: club.center_id,
          clubOfficials: club.officials?.map((o: any) => o.id) || [],
          coreMembers: club.core_team_enrollment_ids || [],
        }));
        setClubs(mappedClubs);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    fetchClubs();
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          Club Management
        </h2>

        {/* ✅ Dropdown Fix */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="text-sm font-medium text-gray-100 mb-2 flex items-center gap-1">
            Select Center Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation?.id || ""}
              onChange={(e) =>
                setSelectedLocation(
                  centers.find((c) => c.id === e.target.value) || null
                )
              }
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm font-medium"
            >
              <option value="">Select a center to begin</option>
              {centers?.map((loc) => (
                <option key={loc?.id} value={loc?.id}>
                  {loc?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedLocation ? (
          <ShimmerSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Clubs"
                value={stats.totalClubs}
                icon={<Users className="w-8 h-8 text-[#1B3A6A]" />}
                bgColor="from-white to-indigo-50"
                textColor="text-[#1B3A6A]"
              />
              <StatCard
                title="Tech Clubs"
                value={stats.techClubs}
                icon={
                  <svg
                    className="w-8 h-8 text-green-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                }
                bgColor="from-white to-green-50"
                textColor="text-green-600"
              />
              <div
                className="bg-white border border-gray-400 rounded-sm p-6 flex items-center justify-center cursor-pointer group"
                onClick={() => setIsAddModalOpen(true)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Plus className="w-8 h-8 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Add New Club
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Register a new student club
                  </p>
                </div>
              </div>
            </div>

            <Table
              data={filteredClubs as GenericTableItem[]}
              title={`Clubs in ${selectedLocation?.name}`}
              filterField="clubName"
              badgeFields={["category", "leaderId"]}
              selectFields={{
                category: categories,
                leaderId: mockStudents[selectedLocation?.name] || [],
              }}
              nonEditableFields={["id", "centerLocation"]}
              onDelete={handleDeleteClub}
              onEdit={handleUpdateClub}
              hiddenColumns={["id"]}
            />
          </>
        )}

        <AddClubModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onClubCreated={handleAddClub}
          prefillLocation={selectedLocation?.location}
          faculties={mockFaculties[selectedLocation?.name] || []}
          students={mockStudents[selectedLocation?.name] || []}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

function StatCard({ title, value, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${bgColor} rounded-sm border border-gray-400 p-6 text-center`}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <h4 className="text-lg font-medium text-slate-900 mb-1">{title}</h4>
      <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
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
