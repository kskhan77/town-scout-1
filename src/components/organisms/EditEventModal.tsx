"use client";

import type { EventItem } from "@/components/molecules/EventCard";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#002D5B] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#002D5B]";

interface EditEventModalProps {
  event: EventItem;
  loading: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

function toDatetimeLocal(dateStr: string) {
  return new Date(dateStr).toISOString().slice(0, 16);
}

export function EditEventModal({ event, loading, onSave, onCancel }: EditEventModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form onSubmit={onSave} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-bold text-[#002D5B]">Edit Event</h2>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" name="title" required defaultValue={event.title} className={inputClass} />
          </div>
          <div>
            <label htmlFor="date" className={labelClass}>Date & Time</label>
            <input id="date" name="date" type="datetime-local" required defaultValue={toDatetimeLocal(event.date)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input id="location" name="location" required defaultValue={event.location} className={inputClass} />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" name="description" rows={3} required defaultValue={event.description} className={inputClass} />
          </div>
          <div>
            <label htmlFor="image" className={labelClass}>Image URL (optional)</label>
            <input id="image" name="image" defaultValue={event.image ?? ""} className={inputClass} />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#00D1FF] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#00B8E6] disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
