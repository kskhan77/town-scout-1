"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LandmarkDetailPanel from "@/components/molecules/LandmarkDetailPanel";
import { historicLandmarksOfFlint } from "@/lib/data";
import { categoryPinColors, FLINT_MAP_CENTER } from "@/lib/flintMapPlaces";
import { flintMapPinIcon, flintMapTooltipHtml } from "@/lib/flintLeafletMap";
import { userLocationLeafletIcon } from "@/lib/leafletUserLocation";
import { safeMapImageUrl, truncate } from "@/lib/mapPopupHtml";

export interface MapLandmark {
  id: string;
  title: string;
  image: string;
  images?: string[];
  tags: string[];
  latitude: number;
  longitude: number;
  description?: string;
}

const landmarks: MapLandmark[] = historicLandmarksOfFlint
  .filter((l) => l.latitude != null && l.longitude != null && l.id != null)
  .map((l) => ({
    id: l.id!,
    title: l.title,
    image: l.image,
    images: l.images,
    tags: l.tags,
    latitude: l.latitude!,
    longitude: l.longitude!,
    description: l.description,
  }));

const ACCENT = categoryPinColors.historic;
const BADGE = "Landmark";

type UserPos = { lat: number; lng: number };

function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters)) return "";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function distanceBetweenUserAndLandmark(user: UserPos, lm: MapLandmark): number {
  return L.latLng(user.lat, user.lng).distanceTo(L.latLng(lm.latitude, lm.longitude));
}

function landmarkTooltipSubtitle(lm: MapLandmark, userPos: UserPos | null): string {
  const tagLine = lm.tags.length ? lm.tags.join(" · ") : "Flint landmark";
  const blurb = (lm.description ?? "").trim() || tagLine;
  const base = truncate(blurb, 52);
  if (!userPos) return base;
  const m = distanceBetweenUserAndLandmark(userPos, lm);
  return `${formatDistanceMeters(m)} from you · ${truncate(tagLine, 40)}`;
}

type NearbyRow = { lm: MapLandmark; distanceM: number | null };

function nearbyLandmarkRows(userPos: UserPos | null): NearbyRow[] {
  if (!userPos) {
    return [...landmarks]
      .map((lm) => ({ lm, distanceM: null }))
      .sort((a, b) => a.lm.title.localeCompare(b.lm.title));
  }
  return [...landmarks]
    .map((lm) => ({
      lm,
      distanceM: distanceBetweenUserAndLandmark(userPos, lm),
    }))
    .sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0));
}

function NearbyLandmarksRail({
  rows,
  userPos,
  onPick,
  selectedId,
}: {
  rows: NearbyRow[];
  userPos: UserPos | null;
  onPick: (lm: MapLandmark) => void;
  selectedId: string | null;
}) {
  return (
    <aside
      className="flex max-h-[min(40vh,320px)] shrink-0 flex-col border-t border-slate-200/90 bg-white/98 shadow-[0_-10px_36px_-14px_rgba(0,45,91,0.14)] backdrop-blur-sm md:h-full md:max-h-none md:w-[min(19rem,36vw)] md:border-t-0 md:border-l md:border-slate-200/90 md:shadow-none"
      aria-label="Landmarks sorted by distance from you"
    >
      <div className="shrink-0 border-b border-slate-100 px-3 py-3 md:px-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#00b8e6]">Near you</p>
        <h3 className="mt-0.5 text-sm font-bold leading-snug text-[#002D5B] md:text-base">
          Landmarks & distance
        </h3>
        {userPos ? (
          <p className="mt-1 text-[11px] leading-snug text-slate-500">
            Straight-line distance updates as you move.
          </p>
        ) : (
          <p className="mt-1 text-[11px] leading-snug text-amber-900/85">
            Allow location to sort by distance and show live meters from you.
          </p>
        )}
      </div>
      <ul
        className="min-h-0 flex-1 list-none space-y-1 overflow-y-auto overscroll-contain p-2 md:space-y-1.5 md:p-3"
        role="list"
      >
        {rows.map(({ lm, distanceM }, index) => {
          const isNearest = userPos && distanceM != null && index === 0;
          const isSelected = selectedId === lm.id;
          return (
            <li key={lm.id}>
              <button
                type="button"
                onClick={() => onPick(lm)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition md:gap-3 md:px-3 md:py-2.5 ${
                  isSelected
                    ? "border-cyan-400/70 bg-cyan-50/90 ring-1 ring-cyan-300/40"
                    : isNearest
                      ? "border-slate-200/90 bg-slate-50/95 hover:border-cyan-300/50 hover:bg-cyan-50/60"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50/90"
                }`}
              >
                {lm.image?.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lm.image}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover shadow-sm md:size-11"
                  />
                ) : (
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#002D5B]/10 to-cyan-100 text-xs font-bold text-[#002D5B]/50 md:size-11"
                    aria-hidden
                  >
                    {lm.title.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#002D5B]">{lm.title}</p>
                  {distanceM != null ? (
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-cyan-700">
                      {formatDistanceMeters(distanceM)} away
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-slate-400">Distance needs location</p>
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

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const landmarksLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarkMarkersRef = useRef<{ lm: MapLandmark; marker: L.Marker }[]>([]);
  const geoWatchRef = useRef<number | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  /** After first successful geolocation, fit the map around you + nearby pins once (Explore load). */
  const userLocationFramedRef = useRef(false);
  /** If location is unavailable, fit all landmarks once after a short wait (not on every paint). */
  const landmarksFallbackFitRef = useRef(false);

  const [mapReady, setMapReady] = useState(false);
  const [userPos, setUserPos] = useState<UserPos | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<MapLandmark | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const narrow = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(FLINT_MAP_CENTER, narrow ? 15 : 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const landmarksGroup = L.layerGroup().addTo(map);
    const userGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    landmarksLayerRef.current = landmarksGroup;
    userLayerRef.current = userGroup;

    const fixSize = () => map.invalidateSize({ animate: false });
    map.whenReady(() => {
      fixSize();
      setMapReady(true);
    });
    requestAnimationFrame(fixSize);
    const t1 = window.setTimeout(fixSize, 100);
    const t2 = window.setTimeout(fixSize, 400);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => fixSize());
      resizeObserver.observe(el);
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      resizeObserver?.disconnect();
      setMapReady(false);
      map.remove();
      mapRef.current = null;
      landmarksLayerRef.current = null;
      userLayerRef.current = null;
      landmarkMarkersRef.current = [];
      landmarksFallbackFitRef.current = false;
      userMarkerRef.current = null;
    };
  }, []);

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

  useEffect(() => {
    if (!mapReady) return;
    const group = landmarksLayerRef.current;
    if (!group) return;

    group.clearLayers();
    landmarkMarkersRef.current = [];

    const narrow = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const pinSize = narrow ? "mobile" : "default";

    for (const lm of landmarks) {
      const m = L.marker([lm.latitude, lm.longitude], {
        icon: flintMapPinIcon(ACCENT, pinSize),
      });

      const img = safeMapImageUrl(lm.image);
      const subtitle = landmarkTooltipSubtitle(lm, null);

      m.bindTooltip(
        flintMapTooltipHtml({
          badge: BADGE,
          title: lm.title,
          subtitle,
          imageUrl: img,
          accent: ACCENT,
        }),
        {
          direction: "top",
          sticky: true,
          opacity: 1,
          offset: [0, -6],
          className: "ts-map-tooltip-shell",
        },
      );

      m.on("click", () => {
        setSelectedLandmark(lm);
      });

      m.addTo(group);
      landmarkMarkersRef.current.push({ lm, marker: m });
    }

    const map = mapRef.current;
    if (map) {
      // Tight default while waiting for location — avoids zooming out to the whole city first.
      map.setView(FLINT_MAP_CENTER, 15, { animate: false });
      window.setTimeout(() => map.invalidateSize({ animate: false }), 50);
    }
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (userPos) return;

    const delayMs = 2200;
    const id = window.setTimeout(() => {
      const map = mapRef.current;
      if (!map || landmarksFallbackFitRef.current) return;
      landmarksFallbackFitRef.current = true;
      const pts = landmarks.map((lm) => L.latLng(lm.latitude, lm.longitude));
      if (pts.length === 1) {
        map.setView(pts[0], 15, { animate: true });
      } else if (pts.length > 1) {
        map.fitBounds(L.latLngBounds(pts), {
          padding: [40, 40],
          maxZoom: 15,
          animate: true,
        });
      }
      window.setTimeout(() => map.invalidateSize({ animate: false }), 80);
    }, delayMs);

    return () => window.clearTimeout(id);
  }, [mapReady, userPos]);

  useEffect(() => {
    if (!mapReady) return;
    const userGroup = userLayerRef.current;
    if (!userGroup) return;

    if (!userPos) {
      if (userMarkerRef.current) {
        userGroup.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    } else if (!userMarkerRef.current) {
      const m = L.marker([userPos.lat, userPos.lng], {
        icon: userLocationLeafletIcon("explore"),
        zIndexOffset: 2500,
      });
      m.bindPopup("You are here");
      m.addTo(userGroup);
      userMarkerRef.current = m;
    } else {
      userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
    }

    for (const { lm, marker } of landmarkMarkersRef.current) {
      const img = safeMapImageUrl(lm.image);
      const subtitle = landmarkTooltipSubtitle(lm, userPos);
      const tip = marker.getTooltip();
      if (tip) {
        tip.setContent(
          flintMapTooltipHtml({
            badge: BADGE,
            title: lm.title,
            subtitle,
            imageUrl: img,
            accent: ACCENT,
          }),
        );
      }
    }
  }, [userPos, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!userPos) {
      userLocationFramedRef.current = false;
      return;
    }
    if (userLocationFramedRef.current) return;
    userLocationFramedRef.current = true;

    const map = mapRef.current;
    const narrow = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const u = L.latLng(userPos.lat, userPos.lng);
    const ranked = landmarks
      .map((lm) => ({
        lm,
        d: u.distanceTo(L.latLng(lm.latitude, lm.longitude)),
      }))
      .sort((a, b) => a.d - b.d);

    const nearestKm = (ranked[0]?.d ?? 0) / 1000;
    if (nearestKm > 30) {
      map.setView(u, 15, { animate: true });
    } else {
      const pts: L.LatLng[] = [u];
      ranked.slice(0, 5).forEach((r) => pts.push(L.latLng(r.lm.latitude, r.lm.longitude)));
      map.fitBounds(L.latLngBounds(pts), {
        padding: narrow ? [22, 22] : [36, 36],
        maxZoom: 17,
        animate: true,
      });
    }
    window.setTimeout(() => map.invalidateSize({ animate: false }), 100);
  }, [mapReady, userPos]);

  const panelDistanceM =
    selectedLandmark && userPos
      ? distanceBetweenUserAndLandmark(userPos, selectedLandmark)
      : null;

  const nearbyRows = useMemo(() => nearbyLandmarkRows(userPos), [userPos]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col md:flex-row">
      <div
        ref={containerRef}
        className="townscout-leaflet-frame relative z-0 min-h-0 min-w-0 flex-1 bg-[#eef4f8] md:h-full"
        role="presentation"
      />
      <NearbyLandmarksRail
        rows={nearbyRows}
        userPos={userPos}
        selectedId={selectedLandmark?.id ?? null}
        onPick={setSelectedLandmark}
      />
      {selectedLandmark ? (
        <LandmarkDetailPanel
          landmark={selectedLandmark}
          distanceFromUserM={panelDistanceM}
          onClose={() => setSelectedLandmark(null)}
        />
      ) : null}
    </div>
  );
}
