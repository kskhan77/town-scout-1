"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { categoryPinColors, type StaticPlaceCategory } from "@/lib/flintMapPlaces";
import type { MapEventPoint } from "@/components/organisms/FlintEventsMapInner";

const FlintEventsMapInner = dynamic(() => import("@/components/organisms/FlintEventsMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-[#e8eef2] text-sm text-neutral-500"
      style={{ height: 420, minHeight: 320 }}
    >
      Loading map…
    </div>
  ),
});

const legend: { key: StaticPlaceCategory | "event"; label: string }[] = [
  { key: "historic", label: "Historic" },
  { key: "culture", label: "Culture" },
  { key: "park", label: "Parks" },
  { key: "transport", label: "Transport" },
  { key: "event", label: "Your events" },
];

export function EventsMapPanel() {
  const [events, setEvents] = useState<MapEventPoint[]>([]);
  const [showHistoric, setShowHistoric] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  const fetchEvents = useCallback(() => {
    void (async () => {
      try {
        const res = await fetch("/api/events/map");
        if (!res.ok) return;
        const data = (await res.json()) as MapEventPoint[];
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      }
    })();
  }, []);

  useEffect(() => {
    fetchEvents();
    window.addEventListener("townscout-events-refresh", fetchEvents);
    return () => window.removeEventListener("townscout-events-refresh", fetchEvents);
  }, [fetchEvents]);

  const pinnedCount = events.filter(
    (e) => e.latitude != null && e.longitude != null && Number.isFinite(e.latitude) && Number.isFinite(e.longitude),
  ).length;

  return (
    <section className="mt-8" aria-labelledby="events-map-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="events-map-heading" className="text-lg font-bold text-[#002D5B]">
            Explore Flint on the map
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">
            Historic landmarks and venues (like the Figma explorer). Toggle layers; add latitude/longitude when
            creating an event to pin it here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#334155]">
            <input
              type="checkbox"
              checked={showHistoric}
              onChange={(e) => setShowHistoric(e.target.checked)}
              className="size-4 rounded border-neutral-300 text-[#e53e3e] focus:ring-[#e53e3e]"
            />
            Historic & places
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#334155]">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={(e) => setShowEvents(e.target.checked)}
              className="size-4 rounded border-neutral-300 text-[#00ccf4] focus:ring-[#00ccf4]"
            />
            Calendar events ({pinnedCount} on map)
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-b border-neutral-200 pb-4">
        {legend.map(({ key, label }) => (
          <span key={key} className="inline-flex items-center gap-2 text-xs text-neutral-600">
            <span
              className="inline-block size-2.5 shrink-0 rounded-full border border-white shadow"
              style={{ background: categoryPinColors[key] }}
            />
            {label}
          </span>
        ))}
      </div>

      <div className="relative mt-4">
        <FlintEventsMapInner events={events} showHistoric={showHistoric} showEvents={showEvents} />
        <p className="mt-2 text-center text-xs text-neutral-500">
          © OpenStreetMap contributors
        </p>
      </div>
    </section>
  );
}
