"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FLINT_MAP_CENTER, categoryPinColors, flintStaticMapPlaces } from "@/lib/flintMapPlaces";
import { esc, safeMapImageUrl, truncate } from "@/lib/mapPopupHtml";

function pinIcon(color: string) {
  const c = esc(color);
  const inner = `<div style="position:relative;width:30px;height:38px;pointer-events:none;">
    <div style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:11px solid ${c};filter:brightness(0.88);"></div>
    <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:linear-gradient(165deg,#ffffff 0%,${c} 58%);border:3px solid #fff;box-shadow:0 3px 14px rgba(0,45,91,0.3),0 0 0 1px rgba(0,0,0,0.05);"></div>
  </div>`;
  return L.divIcon({
    className: "townscout-map-pin",
    html: inner,
    iconSize: [30, 38],
    iconAnchor: [15, 36],
    popupAnchor: [0, -34],
    tooltipAnchor: [0, -28],
  });
}

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

function hoverHtml(params: {
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  accent: string;
}): string {
  const img = params.imageUrl
    ? `<img class="ts-map-tip__img" src="${esc(params.imageUrl)}" alt="" />`
    : `<div class="ts-map-tip__ph" style="background:linear-gradient(135deg,${esc(params.accent)}33,${esc(params.accent)}88);">${esc(params.title.slice(0, 1))}</div>`;
  return `<div class="ts-map-tip">
    <div class="ts-map-tip__media">${img}</div>
    <div class="ts-map-tip__meta">
      <span class="ts-map-tip__badge" style="--accent:${esc(params.accent)}">${esc(params.badge)}</span>
      <div class="ts-map-tip__title">${esc(params.title)}</div>
      ${params.subtitle ? `<div class="ts-map-tip__sub">${esc(params.subtitle)}</div>` : ""}
    </div>
  </div>`;
}

function popupHtml(params: {
  badge: string;
  title: string;
  metaLines: string[];
  description: string;
  imageUrl: string | null;
  accent: string;
}): string {
  const hero = params.imageUrl
    ? `<div class="ts-map-pop__hero"><img src="${esc(params.imageUrl)}" alt="" /></div>`
    : `<div class="ts-map-pop__hero ts-map-pop__hero--empty" style="background:linear-gradient(145deg,${esc(params.accent)}22,${esc(params.accent)}66);"></div>`;
  const meta = params.metaLines
    .filter(Boolean)
    .map((l) => `<div class="ts-map-pop__meta-line">${esc(l)}</div>`)
    .join("");
  const desc = params.description
    ? `<p class="ts-map-pop__desc">${esc(truncate(params.description, 220))}</p>`
    : "";
  return `<div class="ts-map-pop">
    ${hero}
    <div class="ts-map-pop__body">
      <span class="ts-map-pop__badge" style="--accent:${esc(params.accent)}">${esc(params.badge)}</span>
      <h3 class="ts-map-pop__title">${esc(params.title)}</h3>
      <div class="ts-map-pop__meta">${meta}</div>
      ${desc}
    </div>
  </div>`;
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

    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(FLINT_MAP_CENTER, 12);

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
    map.whenReady(fixSize);
    requestAnimationFrame(fixSize);
    const t1 = window.setTimeout(fixSize, 100);
    const t2 = window.setTimeout(fixSize, 400);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => fixSize());
      resizeObserver.observe(el);
    }

    setMapReady(true);

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

    if (showHistoric) {
      for (const p of flintStaticMapPlaces) {
        const color = categoryPinColors[p.category];
        const m = L.marker([p.lat, p.lng], { icon: pinIcon(color) });
        const img = safeMapImageUrl(p.image);
        m.bindTooltip(
          hoverHtml({
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
          popupHtml({
            badge: categoryLabel(p.category),
            title: p.title,
            metaLines: [p.subtitle ?? "", "Flint area landmark"],
            description: p.subtitle ?? "",
            imageUrl: img,
            accent: color,
          }),
          {
            maxWidth: 320,
            className: "ts-map-popup-shell",
            closeButton: true,
          },
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
        const m = L.marker([lat, lng], { icon: pinIcon(color) });
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
          hoverHtml({
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
          popupHtml({
            badge: "Event",
            title: ev.title,
            metaLines: [when, ev.location],
            description: desc,
            imageUrl: img,
            accent: color,
          }),
          {
            maxWidth: 320,
            className: "ts-map-popup-shell",
            closeButton: true,
          },
        );
        m.addTo(group);
      }
    }
  }, [mapReady, events, showHistoric, showEvents]);

  return (
    <div
      ref={containerRef}
      className="z-0 w-full overflow-hidden rounded-2xl border border-black/10 bg-[#e8eef2] shadow-[0_12px_40px_-20px_rgba(0,45,91,0.25)]"
      style={{ height: 420, minHeight: 320 }}
      role="presentation"
    />
  );
}
