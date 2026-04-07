import type { MapEventPoint } from "@/lib/mapEventPoint";
import { FLINT_MAP_CENTER } from "@/lib/flintMapPlaces";

const FLINT_LATLONG = `${FLINT_MAP_CENTER[0]},${FLINT_MAP_CENTER[1]}`;

type TmEvent = {
  id?: string;
  name?: string;
  url?: string;
  info?: string;
  pleaseNote?: string;
  dates?: { start?: { dateTime?: string; localDate?: string; localTime?: string } };
  images?: Array<{ url?: string; ratio?: string; width?: number }>;
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
      location?: { latitude?: string; longitude?: string };
    }>;
  };
};

function pickImage(images: TmEvent["images"]): string | null {
  if (!images?.length) return null;
  const wide =
    images.find((i) => i.ratio === "16_9" && (i.width ?? 0) >= 500) ??
    images.find((i) => i.ratio === "16_9") ??
    images[0];
  const u = wide?.url?.trim();
  return u && u.startsWith("https://") ? u : null;
}

function eventDateISO(e: TmEvent): string {
  const d = e.dates?.start;
  if (d?.dateTime) {
    const t = Date.parse(d.dateTime);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  if (d?.localDate) {
    const time = d.localTime ? `T${d.localTime}` : "T12:00:00";
    const t = Date.parse(`${d.localDate}${time}`);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return new Date().toISOString();
}

function locationLine(venue: {
  name?: string;
  city?: { name?: string };
  state?: { stateCode?: string };
}): string {
  const parts = [venue.name, venue.city?.name, venue.state?.stateCode].filter(Boolean);
  return parts.join(", ") || "Flint area";
}

function blurb(e: TmEvent): string {
  const note = (e.info ?? e.pleaseNote ?? "").trim();
  if (note) return note.slice(0, 280);
  const seg = e.classifications?.[0]?.segment?.name;
  const genre = e.classifications?.[0]?.genre?.name;
  return [seg, genre].filter(Boolean).join(" · ") || "Live event near Flint.";
}

/**
 * Ticketmaster Discovery API — geo search around Flint.
 * @see https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */
export async function fetchTicketmasterMapEvents(
  apiKey: string,
  signal?: AbortSignal,
): Promise<MapEventPoint[]> {
  const params = new URLSearchParams({
    apikey: apiKey,
    latlong: FLINT_LATLONG,
    radius: "45",
    unit: "miles",
    size: "35",
    sort: "date,asc",
    countryCode: "US",
  });
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;
  const res = await fetch(url, { signal, next: { revalidate: 1800 } });
  if (!res.ok) return [];

  const data = (await res.json()) as { _embedded?: { events?: TmEvent[] } };
  const raw = data._embedded?.events ?? [];
  const out: MapEventPoint[] = [];

  for (const e of raw) {
    const id = e.id;
    const title = e.name?.trim();
    if (!id || !title) continue;
    const venue = e._embedded?.venues?.[0];
    if (!venue?.location) continue;
    const lat = Number(venue.location.latitude);
    const lng = Number(venue.location.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const ticketUrl = e.url?.trim();
    out.push({
      id: `tm-${id}`,
      title,
      date: eventDateISO(e),
      location: locationLine(venue),
      description: blurb(e),
      image: pickImage(e.images),
      latitude: lat,
      longitude: lng,
      source: "ticketmaster",
      url: ticketUrl && ticketUrl.startsWith("https://") ? ticketUrl : null,
    });
  }

  return out;
}
