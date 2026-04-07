/** Event pin payload for `/api/events/map` and Leaflet markers. */
export type MapEventPoint = {
  id: string;
  title: string;
  date: string;
  location: string;
  description?: string | null;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  /** `ticketmaster` = Discovery API; omit or `db` = Prisma listings. */
  source?: "db" | "ticketmaster";
  /** External detail / tickets link (HTTPS only in popups). */
  url?: string | null;
};
