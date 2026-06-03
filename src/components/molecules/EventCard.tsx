"use client";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image?: string | null;
};

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <li className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-green-600">
        {new Date(event.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <h2 className="mt-1 text-lg font-bold text-[#002D5B]">{event.title}</h2>
      <p className="mt-1 text-sm text-gray-500">{event.location}</p>
      <p className="mt-3 text-sm text-gray-600">{event.description}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(event)}
          className="rounded-full border border-cyan-400 px-4 py-1.5 text-xs font-semibold text-green-600 hover:bg-cyan-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
