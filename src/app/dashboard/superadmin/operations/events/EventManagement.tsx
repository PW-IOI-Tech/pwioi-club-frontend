"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Calendar, Plus } from "lucide-react";
import Table from "../../Table";
import AddEventModal from "./AddEventModal";

interface TableEvent {
  id: string;
  eventName: string;
  organizer: string;
  venue: string;
  type:
    | "workshop"
    | "seminar"
    | "conference"
    | "hackathon"
    | "webinar"
    | "networking";
  startDate: string;
  endDate: string;
  description: string;
  isVisible: string;
  thumbnailUrl: string;
}

const initialEvents: TableEvent[] = [
  {
    id: "1",
    eventName: "Tech Innovation Summit 2025",
    organizer: "Tech Community",
    venue: "Bangalore Convention Center",
    type: "conference",
    startDate: "2025-09-15",
    endDate: "2025-09-17",
    description:
      "A comprehensive summit showcasing the latest in technology innovation and digital transformation",
    isVisible: "true",
    thumbnailUrl: "https://example.com/tech-summit-thumb.jpg",
  },
  {
    id: "2",
    eventName: "AI Workshop for Beginners",
    organizer: "DataTech Institute",
    venue: "Online Platform",
    type: "workshop",
    startDate: "2025-08-25",
    endDate: "2025-08-25",
    description:
      "Hands-on workshop introducing artificial intelligence concepts and practical applications",
    isVisible: "true",
    thumbnailUrl: "https://example.com/ai-workshop-thumb.jpg",
  },
  {
    id: "3",
    eventName: "Startup Networking Meet",
    organizer: "Entrepreneur Hub",
    venue: "Mumbai Business Center",
    type: "networking",
    startDate: "2025-09-01",
    endDate: "2025-09-01",
    description:
      "Connect with fellow entrepreneurs, investors, and industry leaders in an informal setting",
    isVisible: "false",
    thumbnailUrl: "https://example.com/networking-thumb.jpg",
  },
];

export default function EventManagement() {
  const [events, setEvents] = useState<TableEvent[]>(initialEvents);
  const [error, setError] = useState("");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const statistics = useMemo(
    () => ({
      totalEvents: events.length,
      visibleEvents: events.filter((event) => event.isVisible == "true").length,
      upcomingEvents: events.filter(
        (event) => new Date(event.startDate) > new Date()
      ).length,
    }),
    [events]
  );

  const handleUpdateEvent = useCallback((updatedItem: any) => {
    const eventItem = updatedItem as TableEvent;
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventItem.id ? { ...event, ...eventItem } : event
      )
    );
  }, []);

  const handleDeleteEvent = useCallback((id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;
    setEvents((prev) => prev.filter((event) => event.id !== deleteId));
  }, []);

  const handleAddEvent = useCallback(
    (newEventData: {
      eventName: string;
      organizer: string;
      venue: string;
      type:
        | "workshop"
        | "seminar"
        | "conference"
        | "hackathon"
        | "webinar"
        | "networking";
      startDate: string;
      endDate: string;
      description: string;
      isVisible: string;
      thumbnailUrl: string;
    }) => {
      const newEvent: TableEvent = {
        id: Date.now().toString(),
        ...newEventData,
      };

      setEvents((prev) => [...prev, newEvent]);
      setIsAddEventModalOpen(false);
    },
    []
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddEventModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddEventModalOpen(false);
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
          Event Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Calendar className="w-8 h-8 text-slate-900 mx-auto mb-2" />
              <h4 className="text-lg text-slate-900 mb-1">Total Events</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalEvents}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="text-lg text-slate-900 mb-1">Visible Events</h4>
              <p className="text-5xl font-bold text-green-600">
                {statistics.visibleEvents}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-lg text-slate-900 mb-1">Upcoming Events</h4>
              <p className="text-5xl font-bold text-blue-600">
                {statistics.upcomingEvents}
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
              <h3 className="text-lg font-semibold">Add New Event</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new event</p>
            </button>
          </div>
        </div>

        <Table
          data={events}
          title="Events Overview"
          filterField="type"
          badgeFields={["type"]}
          selectFields={{
            type: [
              "workshop",
              "seminar",
              "conference",
              "hackathon",
              "webinar",
              "networking",
            ],
            isVisible: ["true", "false"],
          }}
          nonEditableFields={["id"]}
          onDelete={handleDeleteEvent}
          onEdit={handleUpdateEvent}
          hiddenColumns={["id"]}
        />

        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={handleCloseAddModal}
          onEventCreated={handleAddEvent}
        />
      </div>
    </div>
  );
}
