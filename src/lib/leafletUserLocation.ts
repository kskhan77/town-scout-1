import L from "leaflet";

const ICON_PX = 52;
const ANCHOR = ICON_PX / 2;

/**
 * Pulsing “you are here” marker for Leaflet maps (Explore vs History colorways).
 * Pair with CSS in `app/globals.css` (`.ts-user-loc`, keyframes).
 */
export function userLocationLeafletIcon(kind: "explore" | "history"): L.DivIcon {
  const mod = kind === "history" ? "ts-user-loc--history" : "ts-user-loc--explore";
  const html = `<div class="ts-user-loc ${mod}" role="presentation">
    <span class="ts-user-loc__ring"></span>
    <span class="ts-user-loc__dot"></span>
  </div>`;
  return L.divIcon({
    className: "ts-user-loc-root",
    html,
    iconSize: [ICON_PX, ICON_PX],
    iconAnchor: [ANCHOR, ANCHOR],
    popupAnchor: [0, -ANCHOR],
  });
}
