/**
 * Insert sample Flint-area events (April → August, current year).
 * Idempotent: removes rows whose description ends with the seed marker, then recreates.
 *
 *   npm run seed:events
 *
 * Requires DATABASE_URL in .env.local (or .env).
 */
import { config } from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

const SEED_SUFFIX = "\n\n— TownScout sample data";

/** Use calendar year from env SEED_EVENT_YEAR or current UTC year */
const Y = Number(process.env.SEED_EVENT_YEAR) || new Date().getUTCFullYear();

type SeedEvent = {
  title: string;
  /** ISO local-ish: we'll build Date in America/Detroit by passing Y-M-D and time */
  dateIso: string;
  location: string;
  description: string;
  image?: string;
  latitude?: number;
  longitude?: number;
};

const events: SeedEvent[] = [
  {
    title: "Flint Farmers Market — opening Saturday",
    dateIso: `${Y}-04-12T14:00:00.000Z`,
    location: "Flint Farmers Market, 420 E Boulevard Dr, Flint, MI",
    description:
      "Opening weekend for the outdoor market: local produce, baked goods, and live music. Free parking nearby." +
      SEED_SUFFIX,
    latitude: 43.0158,
    longitude: -83.6898,
  },
  {
    title: "Downtown Walking History Tour",
    dateIso: `${Y}-04-19T14:00:00.000Z`,
    location: "Starts at Capitol Theatre, Flint, MI",
    description:
      "Guided 90-minute walk covering Vehicle City architecture and sit-down strike landmarks. Wear comfortable shoes." +
      SEED_SUFFIX,
    latitude: 43.01505,
    longitude: -83.68965,
  },
  {
    title: "Flint River Cleanup — Earth Week",
    dateIso: `${Y}-04-22T15:00:00.000Z`,
    location: "Flint River Trail access, downtown Flint",
    description:
      "Volunteer litter pickup along the riverwalk; gloves and bags provided. All ages welcome with a guardian." +
      SEED_SUFFIX,
    latitude: 43.01545,
    longitude: -83.68715,
  },
  {
    title: "Jazz Night at the Capitol",
    dateIso: `${Y}-05-03T23:00:00.000Z`,
    location: "Capitol Theatre, Flint, MI",
    description:
      "Regional jazz quartet plus open-mic first set. Bar opens at 6:30 PM; show at 7:00 PM." + SEED_SUFFIX,
    latitude: 43.01505,
    longitude: -83.68965,
  },
  {
    title: "Family Matinee — Whiting Auditorium",
    dateIso: `${Y}-05-17T17:00:00.000Z`,
    location: "Flint Cultural Center, Flint, MI",
    description:
      "Kid-friendly performance and instrument petting zoo in the lobby. Tickets at the box office." + SEED_SUFFIX,
    latitude: 43.01235,
    longitude: -83.69238,
  },
  {
    title: "Memorial Day Community Remembrance",
    dateIso: `${Y}-05-26T15:00:00.000Z`,
    location: "Veterans Memorial Park area, Flint, MI",
    description:
      "Brief ceremony, color guard, and community picnic to follow. Bring a lawn chair." + SEED_SUFFIX,
    latitude: 43.0105,
    longitude: -83.695,
  },
  {
    title: "FIA Free Saturday Admission",
    dateIso: `${Y}-06-07T16:00:00.000Z`,
    location: "Flint Institute of Arts, Flint, MI",
    description:
      "Free general admission all day; special gallery talk at 2 PM on Michigan artists." + SEED_SUFFIX,
    latitude: 43.01205,
    longitude: -83.68385,
  },
  {
    title: "Juneteenth Celebration — Genesee County",
    dateIso: `${Y}-06-19T18:00:00.000Z`,
    location: "Downtown Flint festival footprint",
    description:
      "Food vendors, youth performances, and resource fair. Schedule posted week-of on city channels." +
      SEED_SUFFIX,
    latitude: 43.014,
    longitude: -83.688,
  },
  {
    title: "Fourth of July — Downtown viewing area",
    dateIso: `${Y}-07-04T21:00:00.000Z`,
    location: "Riverfront / Kettering area, Flint, MI",
    description:
      "Family zone opens at 6 PM; fireworks approx. dusk. Road closures on Mott Foundation map." + SEED_SUFFIX,
    latitude: 43.0128,
    longitude: -83.6845,
  },
  {
    title: "Food Truck Rally — Cultural Center lawn",
    dateIso: `${Y}-07-20T21:30:00.000Z`,
    location: "Flint Cultural Center, Flint, MI",
    description:
      "Rotating trucks, local beer garden (21+), and acoustic set until 9 PM." + SEED_SUFFIX,
    latitude: 43.01235,
    longitude: -83.69238,
  },
  {
    title: "Summer Concert — Crossroads Village",
    dateIso: `${Y}-08-02T19:00:00.000Z`,
    location: "Crossroads Village, Genesee County",
    description:
      "Historic village grounds; brass band and ice cream social. Separate gate pricing—check Huckleberry Railroad site." +
      SEED_SUFFIX,
    latitude: 43.0619,
    longitude: -83.8508,
  },
  {
    title: "Back to the Bricks — Cruise weekend",
    dateIso: `${Y}-08-16T15:00:00.000Z`,
    location: "Saginaw St corridor, Flint, MI",
    description:
      "Classic car cruise and downtown festivities; expect heavy foot traffic Saturday–Sunday." + SEED_SUFFIX,
    latitude: 43.0153,
    longitude: -83.6894,
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }

  const deleted = await prisma.event.deleteMany({
    where: { description: { endsWith: SEED_SUFFIX } },
  });
  console.log(`Removed ${deleted.count} previous sample event(s).`);

  for (const e of events) {
    await prisma.event.create({
      data: {
        title: e.title,
        date: new Date(e.dateIso),
        location: e.location,
        description: e.description,
        image: e.image ?? null,
        latitude: e.latitude ?? null,
        longitude: e.longitude ?? null,
      },
    });
  }

  console.log(`Inserted ${events.length} Flint sample events (year ${Y}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
