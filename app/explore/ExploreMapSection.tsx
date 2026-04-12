"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/organisms/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[240px] w-full items-center justify-center bg-slate-200/80 text-neutral-500">
      <p className="text-sm font-medium md:text-base">Loading map…</p>
    </div>
  ),
});

export function ExploreMapSection() {
  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
      aria-label="Explore Flint landmarks map"
    >
      <div className="relative flex h-full min-h-0 flex-col">
        <MapView />
        <p className="pointer-events-none absolute bottom-2 left-1/2 z-[401] max-w-[90vw] -translate-x-1/2 text-center text-[10px] leading-tight text-slate-600 drop-shadow-sm md:bottom-3 md:text-[11px]">
          © OpenStreetMap contributors · Approximate placement
        </p>
      </div>
    </section>
  );
}
