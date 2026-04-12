"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { EventCard, type EventItem } from "@/components/molecules/EventCard";
import { AddEventForm } from "@/components/organisms/AddEventForm";
import { EditEventModal } from "@/components/organisms/EditEventModal";

export function EventsSection() {
  const { status } = useSession();
  const canManage = status === "authenticated";
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  async function loadEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("townscout-events-refresh"));
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (!canManage) setEditingEvent(null);
  }, [canManage]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      image: (form.elements.namedItem("image") as HTMLInputElement).value || undefined,
      latitude: (form.elements.namedItem("latitude") as HTMLInputElement).value,
      longitude: (form.elements.namedItem("longitude") as HTMLInputElement).value,
    };

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Failed to create event. Please check all fields.");
      return;
    }

    form.reset();
    loadEvents();
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingEvent) return;
    setLoading(true);

    const form = e.currentTarget;
    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      image: (form.elements.namedItem("image") as HTMLInputElement).value || undefined,
      latitude: (form.elements.namedItem("latitude") as HTMLInputElement).value,
      longitude: (form.elements.namedItem("longitude") as HTMLInputElement).value,
    };

    await fetch(`/api/events/${editingEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    setEditingEvent(null);
    loadEvents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    loadEvents();
  }

  return (
    <>
      {events.length === 0 ? (
        <p className="mt-6 text-neutral-500 md:mt-8">No upcoming events. Check back soon.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={setEditingEvent}
              onDelete={handleDelete}
              showActions={canManage}
            />
          ))}
        </ul>
      )}

      {canManage && editingEvent && (
        <EditEventModal
          event={editingEvent}
          loading={loading}
          onSave={handleEdit}
          onCancel={() => setEditingEvent(null)}
        />
      )}

      {canManage ? <AddEventForm loading={loading} error={error} onSubmit={handleAdd} /> : null}
    </>
  );
}
