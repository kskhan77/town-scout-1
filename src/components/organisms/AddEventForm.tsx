"use client";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-[#002D5B] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#002D5B]";

interface AddEventFormProps {
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AddEventForm({ loading, error, onSubmit }: AddEventFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl rounded-2xl bg-white p-8 shadow-md md:mt-10">
      <h2 className="text-lg font-bold text-[#002D5B]">Add an Event</h2>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="add-title" className={labelClass}>Title</label>
          <input id="add-title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="add-date" className={labelClass}>Date & Time</label>
          <input id="add-date" name="date" type="datetime-local" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="add-location" className={labelClass}>Location</label>
          <input id="add-location" name="location" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="add-description" className={labelClass}>Description</label>
          <textarea id="add-description" name="description" rows={3} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="add-image" className={labelClass}>Image URL (optional)</label>
          <input id="add-image" name="image" className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="add-latitude" className={labelClass}>
              Latitude (optional, for map)
            </label>
            <input
              id="add-latitude"
              name="latitude"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 43.0151"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="add-longitude" className={labelClass}>
              Longitude (optional)
            </label>
            <input
              id="add-longitude"
              name="longitude"
              type="text"
              inputMode="decimal"
              placeholder="e.g. -83.6897"
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          Use both coordinates to pin this event on the Flint map (WGS84). Leave blank if unknown.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-[#00D1FF] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#00B8E6] disabled:opacity-60"
      >
        {loading ? "Creating…" : "Add Event"}
      </button>
    </form>
  );
}
