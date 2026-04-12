"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiscoverHistorySection } from "@/components/organisms/DiscoverHistorySection";
import { flintHistorySliderSlides, type HistorySliderSlide } from "@/lib/data";
import { PAGE_SHELL } from "@/lib/pageLayout";

const FlintHistoryMapInner = dynamic(() => import("@/components/organisms/FlintHistoryMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-[#f4efe8] text-sm text-amber-900/60">
      Loading map…
    </div>
  ),
});

type UserPos = { lat: number; lng: number };

function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters)) return "";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function distanceToSlide(user: UserPos, slide: HistorySliderSlide): number {
  return L.latLng(user.lat, user.lng).distanceTo(L.latLng(slide.mapLat, slide.mapLng));
}

type NearbyRow = { slide: HistorySliderSlide; index: number; distanceM: number | null };

function nearbyRows(userPos: UserPos | null): NearbyRow[] {
  const slides = flintHistorySliderSlides;
  if (!userPos) {
    return slides
      .map((slide, index) => ({ slide, index, distanceM: null as number | null }))
      .sort((a, b) => (a.slide.caption ?? a.slide.alt).localeCompare(b.slide.caption ?? b.slide.alt));
  }
  return slides
    .map((slide, index) => ({
      slide,
      index,
      distanceM: distanceToSlide(userPos, slide),
    }))
    .sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0));
}

function NearbyArchiveRail({
  rows,
  userPos,
  selectedIndex,
  onPick,
}: {
  rows: NearbyRow[];
  userPos: UserPos | null;
  selectedIndex: number;
  onPick: (index: number) => void;
}) {
  return (
    <aside
      className="flex max-h-[min(40vh,320px)] shrink-0 flex-col border-t border-amber-900/15 bg-[#fffdfb]/98 shadow-[0_-10px_36px_-14px_rgba(120,53,15,0.12)] backdrop-blur-sm md:h-full md:max-h-none md:w-[min(19rem,36vw)] md:border-t-0 md:border-l md:border-amber-900/15 md:shadow-none"
      aria-label="Archive photos sorted by distance from you"
    >
      <div className="shrink-0 border-b border-amber-900/10 px-3 py-3 md:px-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800">Near you</p>
        <h3 className="mt-0.5 text-sm font-bold leading-snug text-[#002D5B] md:text-base">
          Archive by distance
        </h3>
        {userPos ? (
          <p className="mt-1 text-[11px] leading-snug text-neutral-600">
            Straight-line distance updates as you move.
          </p>
        ) : (
          <p className="mt-1 text-[11px] leading-snug text-amber-900/85">
            Allow location for your position on the map and live distances to each archive pin.
          </p>
        )}
      </div>
      <ul
        className="min-h-0 flex-1 list-none space-y-1 overflow-y-auto overscroll-contain p-2 md:space-y-1.5 md:p-3"
        role="list"
      >
        {rows.map(({ slide, index, distanceM }, rank) => {
          const title = slide.caption ?? slide.alt;
          const isNearest = userPos && distanceM != null && rank === 0;
          const isSelected = selectedIndex === index;
          return (
            <li key={`${slide.src}-${index}`}>
              <button
                type="button"
                onClick={() => onPick(index)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition md:gap-3 md:px-3 md:py-2.5 ${
                  isSelected
                    ? "border-amber-400/80 bg-amber-50/95 ring-1 ring-amber-300/50"
                    : isNearest
                      ? "border-amber-200/90 bg-amber-50/70 hover:border-amber-300 hover:bg-amber-50"
                      : "border-transparent hover:border-amber-100 hover:bg-amber-50/40"
                }`}
              >
                {slide.src.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.src}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover shadow-sm md:size-11"
                  />
                ) : (
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 text-xs font-bold text-amber-900/50 md:size-11"
                    aria-hidden
                  >
                    {title.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#002D5B]">{title}</p>
                  {distanceM != null ? (
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-amber-800">
                      {formatDistanceMeters(distanceM)} away
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-neutral-400">Distance needs location</p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function HistoryExplorer() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [userPos, setUserPos] = useState<UserPos | null>(null);
  const geoWatchRef = useRef<number | null>(null);

  const onMarkerSelect = useCallback((i: number) => setGalleryIndex(i), []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    geoWatchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setUserPos(null);
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    return () => {
      if (geoWatchRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchRef.current);
        geoWatchRef.current = null;
      }
    };
  }, []);

  const sortedRows = useMemo(() => nearbyRows(userPos), [userPos]);

  return (
    <>
      <section
        className="flex h-[max(22rem,calc(100dvh-12rem))] min-h-[22rem] w-full shrink-0 flex-col overflow-hidden bg-[#f4efe8] md:flex-row"
        aria-label="History archive map"
      >
        <div className="relative min-h-0 min-w-0 flex-1">
          <FlintHistoryMapInner
            slides={flintHistorySliderSlides}
            selectedSlideIndex={galleryIndex}
            onMarkerSelect={onMarkerSelect}
            userPos={userPos}
          />
          <p className="pointer-events-none absolute bottom-2 left-1/2 z-[401] max-w-[90vw] -translate-x-1/2 text-center text-[10px] leading-tight text-neutral-600 drop-shadow-sm md:bottom-3 md:text-[11px]">
            © OpenStreetMap contributors · Approximate placement
          </p>
        </div>
        <NearbyArchiveRail
          rows={sortedRows}
          userPos={userPos}
          selectedIndex={galleryIndex}
          onPick={setGalleryIndex}
        />
      </section>

      <div className={`${PAGE_SHELL} mt-3 shrink-0 pb-20 md:mt-4`}>
        <DiscoverHistorySection
          galleryIndex={galleryIndex}
          onGalleryIndexChange={setGalleryIndex}
          autoAdvance={false}
          disablePageShell
          sectionClassName="bg-white md:rounded-3xl md:border md:border-neutral-200/90 md:shadow-sm md:ring-1 md:ring-black/[0.03]"
          headingId="history-page-gallery-heading"
        />
      </div>
    </>
  );
}
