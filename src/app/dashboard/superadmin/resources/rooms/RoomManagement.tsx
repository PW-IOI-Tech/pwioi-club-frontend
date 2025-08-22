"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddRoomModal from "./AddRoomModal";

interface TableRoom {
  id: string;
  center: string;
  roomName: string;
}

const initialRooms: TableRoom[] = [
  {
    id: "1",
    center: "Bangalore",
    roomName: "Conference Room A",
  },
  {
    id: "2",
    center: "Lucknow",
    roomName: "Meeting Room 101",
  },
  {
    id: "3",
    center: "Pune",
    roomName: "Training Hall B",
  },
  {
    id: "4",
    center: "Noida",
    roomName: "Seminar Room 1",
  },
  {
    id: "5",
    center: "Bangalore",
    roomName: "Board Room",
  },
  {
    id: "6",
    center: "Lucknow",
    roomName: "Discussion Room 202",
  },
];

export default function RoomManagement() {
  const [rooms, setRooms] = useState<TableRoom[]>(initialRooms);
  const [error, setError] = useState("");
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalRooms: rooms.length,
      roomsByCenter: {
        bangalore: rooms.filter((room) => room.center === "bangalore").length,
        lucknow: rooms.filter((room) => room.center === "lucknow").length,
        pune: rooms.filter((room) => room.center === "pune").length,
        noida: rooms.filter((room) => room.center === "noida").length,
      },
    }),
    [rooms]
  );

  const handleUpdateRoom = useCallback((updatedItem: any) => {
    const roomItem = updatedItem as TableRoom;
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomItem.id ? { ...room, ...roomItem } : room
      )
    );
  }, []);

  const handleDeleteRoom = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setRooms((prev) => prev.filter((room) => room.id !== deleteId));
  }, []);

  const handleAddRoom = useCallback(
    (newRoomData: { center: string; roomName: string }) => {
      const newRoom: TableRoom = {
        id: Date.now().toString(),
        center: newRoomData.center,
        roomName: newRoomData.roomName,
      };

      setRooms((prev) => [...prev, newRoom]);
      setIsAddRoomModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddRoomModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddRoomModalOpen(false);
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
          Room Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Rooms</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalRooms}
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
              <h3 className="text-lg font-semibold">Add New Room</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new room record
              </p>
            </button>
          </div>
        </div>

        <Table
          data={rooms}
          title="Rooms Overview"
          filterField="center"
          badgeFields={["center"]}
          selectFields={{
            center: ["bangalore", "lucknow", "pune", "noida"],
          }}
          nonEditableFields={["id", "center"]}
          onDelete={handleDeleteRoom}
          onEdit={handleUpdateRoom}
          hiddenColumns={["id"]}
        />

        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={handleCloseAddModal}
          onRoomCreated={handleAddRoom}
        />
      </div>
    </div>
  );
}
