/**
 * Static Flint-area points for the events / explore map (historic & venues).
 * Coordinates are approximate center points for labeling on the map.
 */
export type StaticPlaceCategory = "historic" | "culture" | "park" | "transport";

export interface StaticMapPlace {
  id: string;
  title: string;
  subtitle?: string;
  /** Optional image for map hover / popup (path under /public). */
  image?: string;
  lat: number;
  lng: number;
  category: StaticPlaceCategory;
}

export const FLINT_MAP_CENTER: [number, number] = [43.0125, -83.6875];

export const flintStaticMapPlaces: StaticMapPlace[] = [
  {
    id: "flint-cultural-center",
    title: "Flint Cultural Center",
    subtitle: "The Whiting, FIM, museums",
    image: "/whiting.svg",
    lat: 43.01235,
    lng: -83.69238,
    category: "culture",
  },
  {
    id: "capitol-theatre",
    title: "Capitol Theatre",
    subtitle: "Historic downtown venue",
    image: "/capital.svg",
    lat: 43.01505,
    lng: -83.68965,
    category: "historic",
  },
  {
    id: "crossroads-village",
    title: "Crossroads Village",
    subtitle: "Living history near Flushing",
    image: "/framerMarket.svg",
    lat: 43.0619,
    lng: -83.8508,
    category: "historic",
  },
  {
    id: "flint-institute-arts",
    title: "Flint Institute of Arts",
    subtitle: "Art museum",
    image: "/historic/history-of-flint.jpg",
    lat: 43.01205,
    lng: -83.68385,
    category: "culture",
  },
  {
    id: "flint-riverwalk",
    title: "Flint River & Riverwalk",
    subtitle: "Waterfront & trails",
    image: "/historic/history_coverart_022019.jpg",
    lat: 43.01545,
    lng: -83.68715,
    category: "park",
  },
  {
    id: "bishop-airport",
    title: "Bishop International Airport",
    subtitle: "Regional airport",
    image: "/historic/065_orig.jpg",
    lat: 42.9654,
    lng: -83.7435,
    category: "transport",
  },
];

export const categoryPinColors: Record<StaticPlaceCategory | "event", string> = {
  historic: "#e53e3e",
  culture: "#805ad5",
  park: "#38a169",
  transport: "#3182ce",
  event: "#00ccf4",
};
