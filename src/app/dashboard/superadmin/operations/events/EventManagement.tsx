"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import Table from "../../Table";
import AddEventModal from "./AddEventModal";
import axios from "axios";

interface TableEvent {
  id: string;
  eventName: string;
  organizer: string;
  venue: string;
  type: "hackathon" | "seminar" | "workshop" | "activity" | "club_event";
  startDate: string;
  endDate: string;
  description: string;
  isVisible: string;
  thumbnailUrl: string;
}

export default function EventManagement() {
  const [events, setEvents] = useState<TableEvent[]>([]);
  const [error, setError] = useState("");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const typeMappingLocal: Record<string, string> = {
    workshop: "WORKSHOP",
    seminar: "SEMINAR",
    conference: "ACTIVITY",
    hackathon: "HACKATHON",
    webinar: "CLUB_EVENT",
    networking: "CLUB_EVENT",
  };

  const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event`;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/All`, { withCredentials: true });
      const rawEvents = res.data.data || [];

      const filteredEvents = rawEvents.map((event: any) => {
        const { is_visible, thumbnail, createdAt, updatedAt, ...rest } = event;
        return {
          id: rest.id,
          eventName: rest.name,
          organizer: rest.organiser,
          venue: rest.venue,
          type: rest.type.toLowerCase(),
          startDate: new Date(rest.start_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          endDate: new Date(rest.end_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          description: rest.description,
          isVisible: is_visible ? "true" : "false",
          thumbnailUrl: thumbnail || "",
        };
      });

      setEvents(filteredEvents);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const statistics = useMemo(
    () => ({
      totalEvents: events.length,
      visibleEvents: events.filter((event) => event.isVisible === "true")
        .length,
      upcomingEvents: events.filter(
        (event) => new Date(event.startDate) > new Date()
      ).length,
    }),
    [events]
  );

  const handleUpdateEvent = useCallback(async (updatedItem: any) => {
    try {
      const eventItem = updatedItem as TableEvent;

      const payload = {
        name: eventItem.eventName,
        organiser: eventItem.organizer,
        venue: eventItem.venue,
        type: typeMappingLocal[eventItem.type],
        start_date: new Date(eventItem.startDate).toISOString(),
        end_date: new Date(eventItem.endDate).toISOString(),
        description: eventItem.description,
        is_visible: eventItem.isVisible === "true",
        thumbnail: eventItem.thumbnailUrl,
      };

      await axios.put(`${API_BASE}/${eventItem.id}`, payload, {
        withCredentials: true,
      });

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventItem.id ? { ...event, ...eventItem } : event
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event");
    }
  }, []);

  const handleDeleteEvent = useCallback(async (id: string | number) => {
    try {
      const deleteId = typeof id === "number" ? id.toString() : id;
      await axios.delete(`${API_BASE}/${deleteId}`, {
        withCredentials: true,
      });

      setEvents((prev) => prev.filter((event) => event.id !== deleteId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  }, []);

  const handleAddEvent = useCallback(async (newEventData: any) => {
    try {
      const eventItem = newEventData as TableEvent;

      const payload = {
        name: eventItem.eventName,
        organiser: eventItem.organizer,
        venue: eventItem.venue,
        type: typeMappingLocal[eventItem.type],
        start_date: new Date(eventItem.startDate).toISOString(),
        end_date: new Date(eventItem.endDate).toISOString(),
        description: eventItem.description,
        is_visible: eventItem.isVisible === "true",
        thumbnail: eventItem.thumbnailUrl,
      };

      const res = await axios.post(`${API_BASE}`, payload, {
        withCredentials: true,
      });

      const createdEvent = res.data.data;

      const formattedEvent: TableEvent = {
        id: createdEvent.id,
        eventName: createdEvent.name,
        organizer: createdEvent.organiser,
        venue: createdEvent.venue,
        type: createdEvent.type.toLowerCase(),
        startDate: new Date(createdEvent.start_date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
        endDate: new Date(createdEvent.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        description: createdEvent.description,
        isVisible: createdEvent.is_visible ? "true" : "false",
        thumbnailUrl: createdEvent.thumbnail || "",
      };

      setEvents((prev) => [...prev, formattedEvent]);
      setIsAddEventModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  }, []);

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
    <div className="min-h-screen p-2">
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

        {/* 👇 ONLY show shimmer for table while loading */}
        {loading ? (
          <TableShimmer />
        ) : (
          <Table
            data={events}
            title="Events Overview"
            filterField="type"
            badgeFields={["type"]}
            selectFields={{
              type: [
                { label: "Hackathon", value: "hackathon" },
                { label: "Seminar", value: "seminar" },
                { label: "Workshop", value: "workshop" },
                { label: "Activity", value: "activity" },
                { label: "Club Event", value: "club_event" },
              ],
              isVisible: [
                { label: "True", value: "true" },
                { label: "False", value: "false" },
              ],
            }}
            nonEditableFields={["id"]}
            onDelete={handleDeleteEvent}
            onEdit={handleUpdateEvent}
            hiddenColumns={["id", "isVisible", "createdAt", "updatedAt"]}
          />
        )}

        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={handleCloseAddModal}
          onEventCreated={handleAddEvent}
        />
      </div>
    </div>
  );
}

export const TableShimmer = () => {
  return (
    <div className="bg-white rounded-sm border border-gray-400 overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
              <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-300 rounded"></div>
              <div className="col-span-2 h-8 bg-gray-300 rounded-full"></div>
              <div className="col-span-2 flex justify-end space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};
