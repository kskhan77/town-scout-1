import L from "leaflet";
import type { PopupOptions } from "leaflet";
import { esc, truncate } from "@/lib/mapPopupHtml";

/**
 * Symmetric padding so autoPan keeps the whole card in view without shoving it to the bottom.
 * (Huge top-only padding made Leaflet pan south and clip the popup footer.)
 */
const POPUP_EDGE = 52;

export const FLINT_MAP_POPUP_OPTIONS: PopupOptions = {
  maxWidth: 320,
  className: "ts-map-popup-shell",
  closeButton: true,
  autoPan: true,
  keepInView: true,
  autoPanPadding: L.point(POPUP_EDGE, POPUP_EDGE),
  autoPanPaddingTopLeft: L.point(POPUP_EDGE, POPUP_EDGE),
  autoPanPaddingBottomRight: L.point(POPUP_EDGE, POPUP_EDGE),
};

/** Shared pin style for Flint maps (events + history). */
export function flintMapPinIcon(color: string): L.DivIcon {
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

export function flintMapTooltipHtml(params: {
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

export function flintMapPopupHtml(params: {
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
