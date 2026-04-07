/**
 * USPS ZIP codes commonly used for Flint, MI and immediate Genesee County
 * communities Town Scout serves. Extend this list if coverage changes.
 */
const FLINT_SERVICE_ZIPS = new Set([
  "48501",
  "48502",
  "48503",
  "48504",
  "48505",
  "48506",
  "48507",
  "48509",
  "48519",
  "48529",
  "48531",
  "48532",
  "48550",
  "48551",
  "48552",
  "48553",
  "48554",
  "48555",
  "48556",
  "48557",
  "48559",
]);

export function normalizeZip(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}

export function isFlintServiceZip(raw: string): boolean {
  const z = normalizeZip(raw);
  return z.length === 5 && FLINT_SERVICE_ZIPS.has(z);
}
