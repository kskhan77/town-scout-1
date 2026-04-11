// src/lib/data.ts

export interface Landmark {
  id?: string;
  title: string;
  image: string;
  images?: string[];
  tags: string[];
  latitude?: number;
  longitude?: number;
  description?: string;
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
    id: "flint-cultural-center",
    title: "Flint Cultural Center",
    image: "/whiting.svg",
    tags: ["Local Artists", "Live Music", "Food Trucks"],
    latitude: 43.0195,
    longitude: -83.6783,
    description:
      "A nationally recognized arts and cultural campus spanning 55 acres at 1221 E Kearsley St. Home to the Flint Institute of Arts, Flint Institute of Music, Sloan Museum, and the Whiting Auditorium — one of Michigan's premier performing arts venues.",
  },
  {
    id: "crossroads-village",
    title: "Crossroads Village",
    image: "/framerMarket.svg",
    tags: ["Fresh Produce", "Local Vendors", "Saturday 9AM - 2PM"],
    latitude: 43.0931,
    longitude: -83.6506,
    description:
      "A living history village set in the 1860s–1900s era, featuring over 30 restored historic buildings, a paddle-wheel riverboat, and a Venetian Carousel on the shores of Mott Lake. A beloved Genesee County destination for families and history enthusiasts.",
  },
  {
    id: "capitol-theatre",
    title: "Capitol Theatre",
    image: "/capital.svg",
    tags: ["Family Night", "Blankets & Chairs", "Fridays at Sunset"],
    latitude: 43.0153,
    longitude: -83.6889,
    description:
      "A breathtaking 1928 movie palace at 140 E 2nd St in downtown Flint. After a landmark $37 million restoration, it reopened as a premier live entertainment venue hosting concerts, comedy, classic films, and community events. Managed by the Flint Institute of Music.",
  },
  {
    id: "chevy-in-the-hole",
    title: "Chevy in the Hole",
    image: "/historic/ChevyInTheHole.jpg",
    images: ["/historic/ChevyInTheHole.jpg", "/historic/Flint_Sit-Down_Strike_National_Guard.jpg"],
    tags: ["Industrial History", "Flint River", "Chevy Commons"],
    latitude: 43.0086,
    longitude: -83.7099,
    description:
      "Once the beating industrial heart of Flint, \"Chevy in the Hole\" was the original Chevrolet manufacturing complex straddling the Flint River. At its peak it employed tens of thousands of workers. Today it has been reborn as Chevy Commons — a restored green space with meadows, wetlands, and event grounds along the river.",
  },
  {
    id: "buick-city",
    title: "Buick City",
    image: "/historic/buickcity.avif",
    images: ["/historic/buickcity.avif", "/historic/Buick_motor_works_flint_1907.jpg"],
    tags: ["Automotive Heritage", "GM History", "Industrial Site"],
    latitude: 43.0421,
    longitude: -83.6842,
    description:
      "The sprawling 412-acre Buick City complex on E Leith St was the world's most vertically integrated automobile plant, operating from 1904 to 1999. At its height it produced 900 Buicks per day and employed over 28,000 workers. The site's closure marked the end of an era in American manufacturing and in Flint's history.",
  },
  {
    id: "fisher-body-plant",
    title: "Fisher Body Plant (Strike Site)",
    image: "/historic/fisherbody1.avif",
    images: [
      "/historic/fisherbody1.avif",
      "/historic/fisher-plant-strikers-inside.jpg",
      "/historic/flint-sit-down-strike-gettyimages-97322226.avif",
      "/historic/national-guard-flint-1937.jpg",
    ],
    tags: ["Labor History", "UAW", "1936–37 Sit-Down Strike"],
    latitude: 43.0104,
    longitude: -83.7102,
    description:
      "On December 30, 1936, autoworkers occupied General Motors' Fisher Body Plant No. 1 on S Saginaw St, launching the historic 44-day Flint Sit-Down Strike. Facing freezing temperatures and police confrontation — including the \"Battle of the Running Bulls\" — strikers held firm until GM recognized the UAW. It was a pivotal moment that reshaped American labor rights forever.",
  },
  {
    id: "atwood-stadium",
    title: "Atwood Stadium",
    image: "/historic/Kennedy.jpg",
    images: ["/historic/Kennedy.jpg", "/historic/Atwood.jpg"],
    tags: ["Athletics", "JFK Rally 1960", "FDR Rally 1936"],
    latitude: 43.0172,
    longitude: -83.7023,
    description:
      "Historic 11,000-seat stadium at 701 University Ave in Flint's Carriage Town district, owned by Kettering University. A stage for Flint's greatest moments: President Franklin D. Roosevelt drew a massive crowd here in 1936, and Senator John F. Kennedy electrified 13,000 supporters at a campaign rally in September 1960 — weeks before winning the presidency.",
  },
];

/** Current events — “What’s Happening Now” */
export const happeningNowSpotlights: Landmark[] = [
  {
    title: "Flint Cultural Center",
    image: "/whiting.svg",
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
