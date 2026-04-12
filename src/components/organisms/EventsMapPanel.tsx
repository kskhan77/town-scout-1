"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { InfoTip } from "@/components/atoms/InfoTip";
import {
  categoryPinColors,
  flintStaticMapPlaces,
  type StaticPlaceCategory,
} from "@/lib/flintMapPlaces";
import type { MapEventPoint } from "@/lib/mapEventPoint";

const MAP_BOX_STYLE: CSSProperties = {
  height: "clamp(24rem, 65vh, 48rem)",
  minHeight: "22rem",
};

const FlintEventsMapInner = dynamic(() => import("@/components/organisms/FlintEventsMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-[#e8eef2] text-sm text-neutral-500"
      style={MAP_BOX_STYLE}
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

type EventsMapTabId = "listings" | "shows" | "historic";

function IconEvents() {
  return (
    <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShows() {
  return (
    <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18V5l12-2v13M9 18a3 3 0 100 6 3 3 0 000-6zm12-2a3 3 0 10-6 0 3 3 0 006 0z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHistoric() {
  return (
    <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hasCoords(e: MapEventPoint) {
  const { latitude: lat, longitude: lng } = e;
  return (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

function isDbEvent(e: MapEventPoint) {
  return e.source !== "ticketmaster";
}

export function EventsMapPanel() {
  const [events, setEvents] = useState<MapEventPoint[]>([]);
  const [activeTab, setActiveTab] = useState<EventsMapTabId>("listings");

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

  const dbEvents = useMemo(() => events.filter(isDbEvent), [events]);
  const tmEvents = useMemo(
    () => events.filter((e) => e.source === "ticketmaster"),
    [events],
  );

  const localPinned = useMemo(() => dbEvents.filter(hasCoords).length, [dbEvents]);
  const tmPinned = useMemo(() => tmEvents.filter(hasCoords).length, [tmEvents]);
  const tmCount = tmEvents.length;

  const { visibleEvents, showHistoric, showEvents } = useMemo(() => {
    switch (activeTab) {
      case "listings":
        return { visibleEvents: dbEvents, showHistoric: false, showEvents: true };
      case "shows":
        return { visibleEvents: tmEvents, showHistoric: false, showEvents: true };
      case "historic":
      default:
        return { visibleEvents: [], showHistoric: true, showEvents: false };
    }
  }, [activeTab, dbEvents, tmEvents]);

  const legendItems = useMemo(() => {
    if (activeTab === "historic") {
      return STATIC_LEGEND.map((item) => ({
        key: item.key as StaticPlaceCategory | "event" | "ticketmaster",
        label: item.label,
      }));
    }
    if (activeTab === "listings") {
      return [{ key: "event" as const, label: "Events" }];
    }
    return [{ key: "ticketmaster" as const, label: "Shows & live events" }];
  }, [activeTab]);

  const tabs: {
    id: EventsMapTabId;
    label: string;
    icon: ReactNode;
    helpShort: string;
    help: ReactNode;
  }[] = [
    {
      id: "listings",
      label: `·${localPinned}`,
      icon: <IconEvents />,
      helpShort:
        "Town Scout event listings with map pins. Visible to everyone; sign-in not required to view the map.",
      help: (
        <>
          Listings published on Town Scout that include latitude and longitude appear as{" "}
          <strong>cyan pins</strong>. Anyone can browse this map—you do not need an account to view events
          on the map.
        </>
      ),
    },
    {
      id: "shows",
      label: `·${tmPinned}`,
      icon: <IconShows />,
      helpShort:
        tmCount === 0
          ? "Regional shows appear when an event feed is enabled for this area."
          : "Orange pins: concerts, games, and live events near Flint. Tap a pin for details.",
      help:
        tmCount === 0 ? (
          <>
            When an area event feed is configured, <strong>orange pins</strong> will show regional concerts,
            games, and performances. The list below still shows all Town Scout listings.
          </>
        ) : (
          <>
            <strong>Orange pins</strong> are shows and live events in the wider Flint / Genesee area. Open a pin
            for times, venue, and links.
          </>
        ),
    },
    {
      id: "historic",
      label: `·${flintStaticMapPlaces.length}`,
      icon: <IconHistoric />,
      helpShort: "Landmarks and venues—culture, parks, transport—without calendar event pins.",
      help: (
        <>
          Static points for landmarks, museums, parks, and transport hubs around Genesee County. No calendar
          event pins on this layer.
        </>
      ),
    },
  ];

  const tabTitles: Record<EventsMapTabId, string> = {
    listings: "Events",
    shows: "Around",
    historic: "Historic",
  };

  return (
    <section className="mt-4 md:mt-5" aria-label="Interactive event map">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:gap-x-2 md:gap-y-2">
        {/* Desktop: empty cell above tab column so tabs align with map top (legend only spans map column). */}
        <div className="hidden md:col-start-1 md:row-start-1 md:block" aria-hidden="true" />

        <div className="order-2 flex flex-wrap gap-x-3 gap-y-1 border-b border-neutral-200 pb-2 md:order-none md:col-start-2 md:row-start-1 md:pb-2">
          {legendItems.map(({ key, label }) => (
            <span key={key} className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600">
              <span
                className="inline-block size-2 shrink-0 rounded-full border border-white shadow"
                style={{ background: categoryPinColors[key] }}
              />
              {label}
            </span>
          ))}
        </div>

        <div
          className="order-1 flex w-full min-w-0 shrink-0 flex-row gap-1.5 rounded-xl border border-slate-200/90 bg-slate-100/80 p-1 shadow-inner sm:gap-2 md:order-none md:col-start-1 md:row-start-2 md:w-[6.25rem] md:max-w-none md:flex-col md:gap-2 md:self-start md:rounded-lg"
          role="group"
          aria-label="Map view mode"
        >
          {tabs.map((t) => {
            const selected = activeTab === t.id;
            const title = tabTitles[t.id];
            return (
              <div key={t.id} className="relative min-w-0 flex-1 md:flex-none">
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-controls="events-map-panel"
                  id={`events-map-tab-${t.id}`}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative z-0 flex min-h-[3.25rem] w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-md px-1 pb-1 pe-4 pt-2 text-center transition touch-manipulation md:min-h-0 md:gap-0 md:px-1 md:pb-1 md:pe-5 md:pt-3.5 ${
                    selected
                      ? "bg-gradient-to-b from-[#002d5b] to-[#0c5f75] text-white shadow-sm ring-1 ring-[#001a33]/35"
                      : "border-2 border-slate-300 bg-white text-slate-600 shadow-sm hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span className={selected ? "text-white" : "text-[#002d5b]"}>{t.icon}</span>
                  <span
                    className={`block max-w-full truncate text-[8px] font-bold uppercase leading-tight tracking-wide sm:text-[9px] ${
                      selected ? "text-white/95" : "text-slate-500"
                    }`}
                  >
                    {title}
                  </span>
                  <span
                    className={`block text-[9px] font-semibold tabular-nums leading-none sm:text-[10px] ${
                      selected ? "text-cyan-200" : "text-slate-600"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
                <div className="pointer-events-none absolute end-0 top-0 z-10 md:end-1 md:top-0.5">
                  <span className="pointer-events-auto">
                    <InfoTip
                      shortTitle={t.helpShort}
                      label={`Help: ${title}`}
                      side="bottom"
                      embedded
                      tabSelected={selected}
                      tooltipBrand
                    >
                      {t.help}
                    </InfoTip>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          id="events-map-panel"
          className="order-3 min-h-0 md:order-none md:col-start-2 md:row-start-2"
          aria-labelledby={`events-map-tab-${activeTab}`}
        >
          <div className="relative min-h-0">
            <FlintEventsMapInner
              events={visibleEvents}
              showHistoric={showHistoric}
              showEvents={showEvents}
              frameStyle={MAP_BOX_STYLE}
            />
            <p className="mt-1.5 text-center text-[10px] text-neutral-500 md:text-xs">
              © OpenStreetMap contributors
              {activeTab === "shows" && tmCount > 0
                ? " · Some show listings © their respective providers"
                : null}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
