"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categoryPinColors, type StaticPlaceCategory } from "@/lib/flintMapPlaces";
import type { MapEventPoint } from "@/lib/mapEventPoint";

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

const STATIC_LEGEND: { key: StaticPlaceCategory; label: string }[] = [
  { key: "historic", label: "Historic" },
  { key: "culture", label: "Culture" },
  { key: "park", label: "Parks" },
  { key: "transport", label: "Transport" },
];

function hasCoords(e: MapEventPoint) {
  const { latitude: lat, longitude: lng } = e;
  return (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

export function EventsMapPanel() {
  const [events, setEvents] = useState<MapEventPoint[]>([]);
  const [showHistoric, setShowHistoric] = useState(true);
  const [showLocalListings, setShowLocalListings] = useState(true);
  const [showTicketmaster, setShowTicketmaster] = useState(true);

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

  const tmCount = useMemo(
    () => events.filter((e) => e.source === "ticketmaster").length,
    [events],
  );

  const localPinned = useMemo(
    () =>
      events.filter((e) => e.source !== "ticketmaster" && hasCoords(e)).length,
    [events],
  );

  const tmPinned = useMemo(
    () =>
      events.filter((e) => e.source === "ticketmaster" && hasCoords(e)).length,
    [events],
  );

  const visibleEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.source === "ticketmaster") return showTicketmaster;
      return showLocalListings;
    });
  }, [events, showLocalListings, showTicketmaster]);

  const legendItems = useMemo(() => {
    const items: {
      key: StaticPlaceCategory | "event" | "ticketmaster";
      label: string;
    }[] = [...STATIC_LEGEND, { key: "event", label: "Your listings" }];
    if (tmCount > 0) {
      items.push({
        key: "ticketmaster",
        label: "Live shows (Ticketmaster)",
      });
    }
    return items;
  }, [tmCount]);

  const anyEventLayer = showLocalListings || showTicketmaster;

  return (
    <section className="mt-8" aria-labelledby="events-map-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="events-map-heading" className="text-lg font-bold text-[#002D5B]">
            Explore Flint on the map
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">
            Cyan pins are events you add in Town Scout. Orange pins are regional concerts and shows from
            Ticketmaster when{" "}
            <code className="rounded bg-slate-100 px-1 text-xs text-slate-800">
              TICKETMASTER_API_KEY
            </code>{" "}
            is configured.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#334155]">
              <input
                type="checkbox"
                checked={showHistoric}
                onChange={(e) => setShowHistoric(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-[#e53e3e] focus:ring-[#e53e3e]"
              />
              Historic &amp; places
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#334155]">
              <input
                type="checkbox"
                checked={showLocalListings}
                onChange={(e) => setShowLocalListings(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-[#00ccf4] focus:ring-[#00ccf4]"
              />
              Your listings ({localPinned} on map)
            </label>
            {tmCount > 0 ? (
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#334155]">
                <input
                  type="checkbox"
                  checked={showTicketmaster}
                  onChange={(e) => setShowTicketmaster(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-[#ed8936] focus:ring-[#ed8936]"
                />
                Live shows ({tmPinned} on map)
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-b border-neutral-200 pb-4">
        {legendItems.map(({ key, label }) => (
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
        <FlintEventsMapInner
          events={visibleEvents}
          showHistoric={showHistoric}
          showEvents={anyEventLayer}
        />
        <p className="mt-2 text-center text-xs text-neutral-500">
          © OpenStreetMap contributors
          {tmCount > 0 ? " · Concert/show listings © Ticketmaster" : null}
        </p>
      </div>
    </section>
  );
}
