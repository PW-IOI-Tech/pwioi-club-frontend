"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../../Table";
import AddRoomModal from "./AddRoomModal";
import axios from "axios";
import { ManagementShimmer } from "../../people/admins/AdminManagement";

interface TableRoom {
  id: string;
  center: any;
  roomName: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomData: { center_id: string; roomName: string }) => void;
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<TableRoom[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
        {
          withCredentials: true,
        }
      );

      const mappedRooms: TableRoom[] = res.data.data.map((room: any) => ({
        id: room.id,
        center: room.center?.name || "N/A",
        roomName: room.name,
      }));

      setRooms(mappedRooms);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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

  const statistics = useMemo(
    () => ({
      totalRooms: rooms.length,
      roomsByCenter: rooms.reduce((acc: any, room) => {
        const key = room.center.toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    }),
    [rooms]
  );

  // ✅ Update Room
  const handleUpdateRoom = useCallback(async (updatedItem: any) => {
    try {
      const roomItem = updatedItem as TableRoom;
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${roomItem.id}`,
        { name: roomItem.roomName },
        { withCredentials: true }
      );

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomItem.id ? { ...room, ...roomItem } : room
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update room");
    }
  }, []);

  // ✅ Delete Room
  const handleDeleteRoom = useCallback(async (id: string | number) => {
    try {
      const deleteId = typeof id === "number" ? id.toString() : id;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${deleteId}`,
        { withCredentials: true }
      );

      setRooms((prev) => prev.filter((room) => room.id !== deleteId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete room");
    }
  }, []);

  const handleAddRoom = useCallback(
    async (newRoomData: { center_id: any; roomName: string }) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`,
          {
            name: newRoomData.roomName,
            center_id: newRoomData.center_id || "",
          },
          { withCredentials: true }
        );

        const newRoom: TableRoom = {
          id: res.data.data.id,
          center: res.data.data.center.name,
          roomName: res.data.data.name,
        };

        setRooms((prev) => [...prev, newRoom]);
        setIsAddRoomModalOpen(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add room");
      }
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddRoomModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddRoomModalOpen(false);
  }, []);

  if (loading) {
    return <ManagementShimmer />;
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
    <div className="min-h-screen p-2">
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
            center: Array.from(
              new Set(rooms.map((room) => room.center.toLowerCase()))
            ),
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
          centers={centers}
        />
      </div>
    </div>
  );
}
