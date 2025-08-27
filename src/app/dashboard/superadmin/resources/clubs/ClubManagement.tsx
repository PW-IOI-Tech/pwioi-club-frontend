"use client";

import React, { useState, useMemo } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddClubModal from "./AddClubModal";

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

const centers = ["Bangalore", "Lucknow", "Pune", "Noida"];

const mockFaculties: Record<string, string[]> = {
  Bangalore: [
    "FAC001 - Dr. Priya Sharma",
    "FAC002 - Prof. Rajesh Kumar",
    "FAC003 - Dr. Anjali Patel",
    "FAC004 - Prof. Vikram Singh",
  ],
  Lucknow: [
    "FAC101 - Dr. Meena Verma",
    "FAC102 - Prof. Arvind Mishra",
    "FAC103 - Dr. Sunita Yadav",
  ],
  Pune: [
    "FAC201 - Prof. Deepak Joshi",
    "FAC202 - Dr. Neha Deshmukh",
    "FAC203 - Prof. Sandeep Reddy",
  ],
  Noida: [
    "FAC301 - Dr. Ravi Malhotra",
    "FAC302 - Prof. Pooja Bansal",
    "FAC303 - Dr. Amit Khanna",
  ],
};

const mockStudents: Record<string, string[]> = {
  Bangalore: [
    "STD001 - Aditya Rao",
    "STD002 - Sneha Iyer",
    "STD003 - Arjun Menon",
    "STD004 - Kavya Nair",
  ],
  Lucknow: [
    "STD101 - Aman Pandey",
    "STD102 - Divya Tiwari",
    "STD103 - Rohit Srivastava",
  ],
  Pune: [
    "STD201 - Omkar Kulkarni",
    "STD202 - Shruti Joshi",
    "STD203 - Pranav Desai",
  ],
  Noida: [
    "STD301 - Karan Mehta",
    "STD302 - Tanvi Chawla",
    "STD303 - Vedant Agarwal",
  ],
};

const categories = ["Tech", "Social", "Sports", "Arts", "Academic", "Cultural"];

export default function ClubManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddClub = (newClubData: Omit<Club, "id">) => {
    const newClub: Club = {
      ...newClubData,
      id: `club_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setClubs((prev) => [...prev, newClub]);
    setIsAddModalOpen(false);
  };

  const handleDeleteClub = (id: string | number) => {
    const stringId = typeof id === "number" ? id.toString() : id;
    setClubs((prev) => prev.filter((club) => club.id !== stringId));
  };

  const handleUpdateClub = (updatedItem: GenericTableItem) => {
    if (isValidClub(updatedItem)) {
      const updatedClub = updatedItem as Club;
      setClubs((prev) =>
        prev.map((club) => (club.id === updatedClub.id ? updatedClub : club))
      );
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

  const filteredClubs = useMemo(() => {
    if (!selectedLocation) return [];
    return clubs.filter((club) => club.centerLocation === selectedLocation);
  }, [clubs, selectedLocation]);

  const stats = useMemo(() => {
    return {
      totalClubs: filteredClubs.length,
      techClubs: filteredClubs.filter((c) => c.category === "Tech").length,
      sportsClubs: filteredClubs.filter((c) => c.category === "Sports").length,
    };
  }, [filteredClubs]);

  const studentIds = (mockStudents[selectedLocation] || []).map(
    (student) => student.split(" - ")[0]
  );
  const facultyIds = (mockFaculties[selectedLocation] || []).map(
    (faculty) => faculty.split(" - ")[0]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          Club Management
        </h2>

        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="text-sm font-medium text-gray-100 mb-2 flex items-center gap-1">
            Select Center Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer appearance-none text-sm font-medium"
            >
              <option value="">Select a center to begin</option>
              {centers.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
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
              title={`Clubs in ${selectedLocation}`}
              filterField="clubName"
              badgeFields={["category", "leaderId"]}
              selectFields={{
                category: categories,
                leaderId: mockStudents[selectedLocation] || [],
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
          prefillLocation={selectedLocation}
          faculties={facultyIds}
          students={studentIds}
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
