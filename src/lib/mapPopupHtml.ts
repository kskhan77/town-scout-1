/** Escape text for Leaflet HTML tooltips/popups (no scripts). */
export function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Allow only same-origin paths or http(s) image URLs for map HTML. */
export function safeMapImageUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  return null;
}

export function truncate(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
