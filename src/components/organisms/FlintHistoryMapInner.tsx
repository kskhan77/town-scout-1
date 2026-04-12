"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FLINT_HISTORY_MAP_ACCENT, type HistorySliderSlide } from "@/lib/data";
import { FLINT_MAP_CENTER } from "@/lib/flintMapPlaces";
import {
  FLINT_MAP_POPUP_OPTIONS,
  flintMapPinIcon,
  flintMapPopupHtml,
  flintMapTooltipHtml,
} from "@/lib/flintLeafletMap";
import { userLocationLeafletIcon } from "@/lib/leafletUserLocation";
import { safeMapImageUrl, truncate } from "@/lib/mapPopupHtml";

const BADGE = "Archive";

export type HistoryMapUserPos = { lat: number; lng: number };

function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters)) return "";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function distanceToSlide(user: HistoryMapUserPos, slide: HistorySliderSlide): number {
  return L.latLng(user.lat, user.lng).distanceTo(L.latLng(slide.mapLat, slide.mapLng));
}

function tooltipSubtitle(slide: HistorySliderSlide, userPos: HistoryMapUserPos | null | undefined): string {
  const base = "Flint historical photograph";
  if (!userPos) return base;
  const m = distanceToSlide(userPos, slide);
  return `${formatDistanceMeters(m)} from you · ${truncate(slide.caption ?? slide.alt, 36)}`;
}

interface FlintHistoryMapInnerProps {
  slides: HistorySliderSlide[];
  selectedSlideIndex: number;
  onMarkerSelect: (index: number) => void;
  /** When set, shows “you are here” and live distances in tooltips (same idea as Explore). */
  userPos?: HistoryMapUserPos | null;
}

export default function FlintHistoryMapInner({
  slides,
  selectedSlideIndex,
  onMarkerSelect,
  userPos = null,
}: FlintHistoryMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<(L.Marker | null)[]>([]);
  const skipInitialFlyRef = useRef(true);
  /** One-time fit around the user + nearby archive pins after first location fix. */
  const userLocationFramedRef = useRef(false);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const accent = FLINT_HISTORY_MAP_ACCENT;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(FLINT_MAP_CENTER, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const userGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = markersGroup;
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
      markersLayerRef.current = null;
      userLayerRef.current = null;
      markersRef.current = [];
      userMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const group = markersLayerRef.current;
    if (!group) return;

    group.clearLayers();
    markersRef.current = [];

    slides.forEach((slide, i) => {
      const title = slide.caption ?? slide.alt;
      const img = safeMapImageUrl(slide.src);
      const m = L.marker([slide.mapLat, slide.mapLng], {
        icon: flintMapPinIcon(accent),
      });

      m.bindTooltip(
        flintMapTooltipHtml({
          badge: BADGE,
          title,
          subtitle: tooltipSubtitle(slide, null),
          imageUrl: img,
          accent,
        }),
        {
          direction: "top",
          sticky: true,
          opacity: 1,
          offset: [0, -6],
          className: "ts-map-tooltip-shell",
        },
      );

      m.bindPopup(
        flintMapPopupHtml({
          badge: BADGE,
          title,
          metaLines: [`Photo ${i + 1} of ${slides.length}`, "From the Town Scout Flint archive"],
          description: slide.wikiSummary ?? slide.alt,
          imageUrl: img,
          accent,
        }),
        FLINT_MAP_POPUP_OPTIONS,
      );

      m.on("click", () => {
        onMarkerSelect(i);
      });

      m.addTo(group);
      markersRef.current[i] = m;
    });
  }, [mapReady, slides, onMarkerSelect, accent]);

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
        icon: userLocationLeafletIcon("history"),
        zIndexOffset: 2500,
      });
      m.bindPopup("You are here");
      m.addTo(userGroup);
      userMarkerRef.current = m;
    } else {
      userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
    }

    slides.forEach((slide, i) => {
      const marker = markersRef.current[i];
      if (!marker) return;
      const title = slide.caption ?? slide.alt;
      const img = safeMapImageUrl(slide.src);
      const tip = marker.getTooltip();
      if (tip) {
        tip.setContent(
          flintMapTooltipHtml({
            badge: BADGE,
            title,
            subtitle: tooltipSubtitle(slide, userPos ?? null),
            imageUrl: img,
            accent,
          }),
        );
      }
    });
  }, [userPos, mapReady, slides, accent]);

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
    const ranked = slides
      .map((slide) => ({
        slide,
        d: u.distanceTo(L.latLng(slide.mapLat, slide.mapLng)),
      }))
      .sort((a, b) => a.d - b.d);

    const WITHIN_M = 4500;
    const nearby = ranked.filter((r) => r.d <= WITHIN_M);
    const pts: L.LatLng[] = [u];
    if (nearby.length > 0) {
      nearby.forEach((r) => pts.push(L.latLng(r.slide.mapLat, r.slide.mapLng)));
    } else {
      ranked.slice(0, 6).forEach((r) => pts.push(L.latLng(r.slide.mapLat, r.slide.mapLng)));
    }

    map.fitBounds(L.latLngBounds(pts), {
      padding: narrow ? [40, 40] : [64, 64],
      maxZoom: 15,
      animate: true,
    });
    window.setTimeout(() => map.invalidateSize({ animate: false }), 100);
  }, [mapReady, userPos, slides]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const slide = slides[selectedSlideIndex];
    if (!slide) return;

    if (skipInitialFlyRef.current) {
      skipInitialFlyRef.current = false;
      return;
    }

    mapRef.current.flyTo([slide.mapLat, slide.mapLng], 15, { duration: 0.55 });
    const marker = markersRef.current[selectedSlideIndex];
    if (marker) {
      window.setTimeout(() => marker.openPopup(), 280);
    }
  }, [selectedSlideIndex, mapReady, slides]);

  return (
    <div
      ref={containerRef}
      className="townscout-leaflet-frame z-0 h-full min-h-0 w-full rounded-none border-0 bg-[#f4efe8] shadow-none"
      role="presentation"
    />
  );
}
