// src/lib/data.ts

export interface Landmark {
  title: string;
  image: string;
  tags: string[];
}

/** Hero carousel for Discover the History — swap for `/public/flint/*.jpg` when you have local assets */
export interface HistorySliderSlide {
  src: string;
  alt: string;
  caption: string;
}

export const flintHistorySliderSlides: HistorySliderSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80",
    alt: "Evening city skyline with lights",
    caption: "Downtown Flint & the Flint River — heart of Genesee County",
  },
  {
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=80",
    alt: "Urban street and architecture at dusk",
    caption: "Saginaw Street corridor — shops, venues, and community life",
  },
  {
    src: "https://images.unsplash.com/photo-1564694202779-bc908c327862?auto=format&fit=crop&w=1920&q=80",
    alt: "Classic brick building facade",
    caption: "Historic architecture — Capitol Theatre, churches, and civic gems",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    alt: "Modern city towers reflecting sky",
    caption: "Flint’s skyline — renewal, culture, and neighborhood pride",
  },
];

/** Landmarks and heritage-focused spots — “Discover the History” */
export const historySpotlights: Landmark[] = [
  {
    title: "Capitol Theatre",
    image: "/capital.svg",
    tags: ["Opened 1928", "Spanish Revival architecture", "National Register landmark"],
  },
  {
    title: "Flint Cultural Center",
    image: "/train.svg",
    tags: ["1950s campus plan", "Institute of Arts & Sloan Museum", "Smithsonian affiliate"],
  },
  {
    title: "Crossroads Village",
    image: "/framerMarket.svg",
    tags: ["Living history village", "Huckleberry Railroad", "Seasonal heritage events"],
  },
];

/** Current events and recurring happenings — “What’s Happening Now” */
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
