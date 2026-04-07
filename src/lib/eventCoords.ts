/** Parse coordinate from JSON: empty → null, number → value, invalid → error. */
export function parseBodyCoord(
  value: unknown,
): { ok: true; value: number | null } | { ok: false } {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return { ok: false };
  return { ok: true, value: n };
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
