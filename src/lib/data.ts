// src/lib/data.ts

export interface Landmark {
  title: string;
  image: string;
  tags: string[];
}

export const landmarkData: Landmark[] = [
  { 
    title: "Flint Cultural Center", 
    image: "/train.svg", 
    tags: ["Local Artists", "Live Music", "Food Trucks"] 
  },
  { 
    title: "Crossroads Village", 
    image: "/framerMarket.svg", 
    tags: ["Fresh Produce", "Local Vendors", "Saturday 9AM - 2PM"] 
  },
  { 
    title: "Capitol Theatre", 
    image: "/capital.svg", 
    tags: ["Family Night", "Blankets & Chairs", "Fridays at Sunset"] 
  },
];