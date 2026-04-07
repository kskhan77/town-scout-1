"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FLINT_MAP_CENTER, categoryPinColors, flintStaticMapPlaces } from "@/lib/flintMapPlaces";
import {
  FLINT_MAP_POPUP_OPTIONS,
  flintMapPinIcon,
  flintMapPopupHtml,
  flintMapTooltipHtml,
} from "@/lib/flintLeafletMap";
import { safeMapImageUrl } from "@/lib/mapPopupHtml";

function categoryLabel(
  kind: "historic" | "culture" | "park" | "transport" | "event",
): string {
  const map = {
    historic: "Historic",
    culture: "Culture",
    park: "Parks & nature",
    transport: "Transport",
    event: "Event",
  };
  return map[kind];
}

export type MapEventPoint = {
  id: string;
  title: string;
  date: string;
  location: string;
  description?: string | null;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

interface FlintEventsMapInnerProps {
  events: MapEventPoint[];
  showHistoric: boolean;
  showEvents: boolean;
}

function collectVisibleLatLngs(
  showHistoric: boolean,
  showEvents: boolean,
  events: MapEventPoint[],
): L.LatLng[] {
  const pts: L.LatLng[] = [];
  if (showHistoric) {
    for (const p of flintStaticMapPlaces) {
      pts.push(L.latLng(p.lat, p.lng));
    }
  }
  if (showEvents) {
    for (const ev of events) {
      const lat = ev.latitude;
      const lng = ev.longitude;
      if (lat == null || lng == null) continue;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      pts.push(L.latLng(lat, lng));
    }
  }
  return pts;
}

export default function FlintEventsMapInner({
  events,
  showHistoric,
  showEvents,
}: FlintEventsMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const initialZoom =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? 13 : 12;

    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(FLINT_MAP_CENTER, initialZoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = group;

    const fixSize = () => {
      map.invalidateSize({ animate: false });
    };
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
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const group = layerRef.current;
    if (!group) return;

    group.clearLayers();

    const narrow =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const pinSize = narrow ? "mobile" : "default";

    if (showHistoric) {
      for (const p of flintStaticMapPlaces) {
        const color = categoryPinColors[p.category];
        const m = L.marker([p.lat, p.lng], { icon: flintMapPinIcon(color, pinSize) });
        const img = safeMapImageUrl(p.image);
        m.bindTooltip(
          flintMapTooltipHtml({
            badge: categoryLabel(p.category),
            title: p.title,
            subtitle: p.subtitle ?? "",
            imageUrl: img,
            accent: color,
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
            badge: categoryLabel(p.category),
            title: p.title,
            metaLines: [p.subtitle ?? "", "Flint area landmark"],
            description: p.subtitle ?? "",
            imageUrl: img,
            accent: color,
          }),
          FLINT_MAP_POPUP_OPTIONS,
        );
        m.addTo(group);
      }
    }

    if (showEvents) {
      for (const ev of events) {
        const lat = ev.latitude;
        const lng = ev.longitude;
        if (lat == null || lng == null) continue;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

        const color = categoryPinColors.event;
        const m = L.marker([lat, lng], { icon: flintMapPinIcon(color, pinSize) });
        const when = new Date(ev.date).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
        const img = safeMapImageUrl(ev.image ?? null);
        const desc = ev.description?.trim() ?? "";

        m.bindTooltip(
          flintMapTooltipHtml({
            badge: "Event",
            title: ev.title,
            subtitle: when,
            imageUrl: img,
            accent: color,
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
            badge: "Event",
            title: ev.title,
            metaLines: [when, ev.location],
            description: desc,
            imageUrl: img,
            accent: color,
          }),
          FLINT_MAP_POPUP_OPTIONS,
        );
        m.addTo(group);
      }
    }

    const map = mapRef.current;
    if (map) {
      const pts = collectVisibleLatLngs(showHistoric, showEvents, events);
      if (pts.length === 1) {
        map.setView(pts[0], narrow ? 15 : 14, { animate: false });
        window.setTimeout(() => map.invalidateSize({ animate: false }), 50);
      } else if (pts.length > 1) {
        const bounds = L.latLngBounds(pts);
        map.fitBounds(bounds, {
          padding: narrow ? [20, 20] : [40, 40],
          maxZoom: narrow ? 15 : 14,
          animate: false,
        });
        window.setTimeout(() => {
          map.invalidateSize({ animate: false });
        }, 50);
      } else {
        map.setView(FLINT_MAP_CENTER, narrow ? 13 : 12, { animate: false });
      }
    }
  }, [mapReady, events, showHistoric, showEvents]);

  return (
    <div
      ref={containerRef}
      className="townscout-leaflet-frame z-0 w-full rounded-2xl border border-black/10 bg-[#e8eef2] shadow-[0_12px_40px_-20px_rgba(0,45,91,0.25)]"
      style={{ height: 420, minHeight: 320 }}
      role="presentation"
    />
  );
}
