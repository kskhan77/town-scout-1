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
import { safeMapImageUrl } from "@/lib/mapPopupHtml";

const BADGE = "Archive";

interface FlintHistoryMapInnerProps {
  slides: HistorySliderSlide[];
  selectedSlideIndex: number;
  onMarkerSelect: (index: number) => void;
}

export default function FlintHistoryMapInner({
  slides,
  selectedSlideIndex,
  onMarkerSelect,
}: FlintHistoryMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<(L.Marker | null)[]>([]);
  const skipInitialFlyRef = useRef(true);
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
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = group;

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
      layerRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const group = layerRef.current;
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
          subtitle: "Flint historical photograph",
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
      className="townscout-leaflet-frame z-0 w-full rounded-2xl border border-amber-900/15 bg-[#f4efe8] shadow-[0_12px_40px_-20px_rgba(120,53,15,0.22)]"
      style={{ height: 460, minHeight: 320 }}
      role="presentation"
    />
  );
}
