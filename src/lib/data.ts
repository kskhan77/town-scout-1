// src/lib/data.ts

export interface Landmark {
  title: string;
  image: string;
  tags: string[];
}

/** Local archive under /public/historic — all images in that folder */
export interface HistorySliderSlide {
  src: string;
  alt: string;
  caption?: string;
  /** Short encyclopedia-style blurb (shown in lightbox or tooltips later) */
  wikiSummary?: string;
}

/**
 * Every image in `public/historic`. Order: Flint overview → strike era → archives → misc.
 * Replace captions/summaries anytime; paths must match filenames exactly (case-sensitive on Linux).
 */
export const flintHistorySliderSlides: HistorySliderSlide[] = [
  {
    src: "/historic/history-of-flint.jpg",
    alt: "Historical overview imagery related to Flint, Michigan",
    caption: "History of Flint",
    wikiSummary:
      "Flint’s story spans Indigenous Anishinaabe homelands, lumber and carriage-making, and its role as a center of General Motors manufacturing and 20th-century labor history.",
  },
  {
    src: "/historic/history_coverart_022019.jpg",
    alt: "Flint history cover artwork, February 2019",
    caption: "Flint history feature art",
    wikiSummary:
      "Editorial or program artwork used to highlight Flint’s past—often tied to museum, media, or community history projects.",
  },
  {
    src: "/historic/History_coverart_032019.jpg",
    alt: "Flint history cover artwork, March 2019",
    caption: "Flint history feature art",
    wikiSummary:
      "Promotional or publication imagery celebrating local heritage and civic memory in Genesee County.",
  },
  {
    src: "/historic/flint-sit-down-strike-gettyimages-97322226.avif",
    alt: "Flint sit-down strike era photograph",
    caption: "Sit-down strike era",
    wikiSummary:
      "The 1936–37 Flint sit-down strike at General Motors Fisher Body plants helped establish the UAW and reshaped American industrial relations.",
  },
  {
    src: "/historic/fisher-plant-strikers-inside.jpg",
    alt: "Workers inside Fisher Body plant during the Flint sit-down strike",
    caption: "Fisher Body plant",
    wikiSummary:
      "Strikers occupied Fisher Body Plant No. 3 in Flint, maintaining round-the-clock control of the factory until GM recognized the union.",
  },
  {
    src: "/historic/strike-meal-cafeteria.jpg",
    alt: "Strikers eating in a cafeteria during the Flint sit-down strike",
    caption: "Strike kitchen",
    wikiSummary:
      "Communal meals sustained sit-down strikers for weeks; kitchens and discipline inside the plant were part of the occupation strategy.",
  },
  {
    src: "/historic/national-guard-flint-1937.jpg",
    alt: "National Guard activity in Flint during the 1937 strike period",
    caption: "National Guard, 1937",
    wikiSummary:
      "State forces were deployed during the strike; confrontations—including the “Battle of the Running Bulls”—drew national attention to Flint.",
  },
  {
    src: "/historic/women-of-flint-painting.jpg",
    alt: "Women of Flint, WPA-era painting",
    caption: "Women of Flint",
    wikiSummary:
      "Joseph Vavak’s 1937 painting Women of Flint (Smithsonian American Art Museum) depicts women’s roles in community and industrial life during the Depression era.",
  },
  {
    src: "/historic/065_orig.jpg",
    alt: "Historical photograph from the Flint archive",
    caption: "Archive photograph",
    wikiSummary:
      "Primary-source photograph from a local or institutional collection documenting people, streets, or events in Genesee County.",
  },
  {
    src: "/historic/JI01a002.jpg",
    alt: "Genesee County historical photograph JI01a002",
    caption: "Archive: JI01a002",
    wikiSummary:
      "Catalogued historical image—often from a library, museum, or university manuscript collection covering Flint and surrounding communities.",
  },
  {
    src: "/historic/JI01a003.jpg",
    alt: "Genesee County historical photograph JI01a003",
    caption: "Archive: JI01a003",
    wikiSummary:
      "Catalogued historical image from regional archives, useful for streetscape, portrait, or event research.",
  },
  {
    src: "/historic/JI01h007.jpg",
    alt: "Genesee County historical photograph JI01h007",
    caption: "Archive: JI01h007",
    wikiSummary:
      "Historical photograph preserved for public history and education about Flint and Genesee County.",
  },
  {
    src: "/historic/JI01h009.jpg",
    alt: "Genesee County historical photograph JI01h009",
    caption: "Archive: JI01h009",
    wikiSummary:
      "Regional archive image supporting exhibits, walking tours, and digital history projects.",
  },
  {
    src: "/historic/JI01h020.jpg",
    alt: "Genesee County historical photograph JI01h020",
    caption: "Archive: JI01h020",
    wikiSummary:
      "Preserved visual record of buildings, transportation, or daily life in the Flint area.",
  },
  {
    src: "/historic/t20e3-107w-1.jpg",
    alt: "Historical photograph from the Flint archive",
    caption: "Archive photograph",
    wikiSummary:
      "Archival image from a numbered collection; consult your institution’s finding aid for exact date and subject.",
  },
  {
    src: "/historic/temperance-f4-second-series.png",
    alt: "Temperance movement or related historical graphic, second series",
    caption: "Temperance era graphic",
    wikiSummary:
      "Flint and Michigan were active in the temperance and reform movements of the 19th and early 20th centuries; such images reflect that civic discourse.",
  },
];

/** Historic Landmarks — matches Figma card copy */
export const historicLandmarksOfFlint: Landmark[] = [
  {
    title: "Flint Cultural Center",
    image: "/train.svg",
    tags: ["Local Artists", "Live Music", "Food Trucks"],
  },
  {
    title: "Crossroads Village",
    image: "/framerMarket.svg",
    tags: ["Fresh Produce", "Local Vendors", "Saturday 9AM - 2PM"],
  },
  {
    title: "Capitol Theatre",
    image: "/capital.svg",
    tags: ["Family Night", "Blankets & Chairs", "Fridays at Sunset"],
  },
];

/** Current events — “What’s Happening Now” */
export const happeningNowSpotlights: Landmark[] = [
  {
    title: "Flint Cultural Center",
    image: "/train.svg",
    tags: ["Local artists & exhibits", "Live music series", "Family programs"],
  },
  {
    title: "Farmers Market at Crossroads",
    image: "/framerMarket.svg",
    tags: ["Fresh produce", "Local vendors", "Saturdays · 9AM – 2PM"],
  },
  {
    title: "Capitol Theatre",
    image: "/capital.svg",
    tags: ["Concerts & comedy", "Classic film nights", "Community rentals"],
  },
];
