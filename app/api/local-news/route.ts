import { NextResponse } from "next/server";
import { parseRssItems } from "@/lib/localFeed/parseRss";

type Article = { title: string; url: string; source?: string; publishedAt?: string };

const FALLBACK: Article[] = [
  {
    title: "Flint-area news on MLive",
    url: "https://www.mlive.com/flint/",
    source: "MLive",
  },
  {
    title: "City of Flint — news & updates",
    url: "https://www.cityofflint.com/",
    source: "City of Flint",
  },
  {
    title: "Flint & Genesee County — ABC12",
    url: "https://www.abc12.com/location/Flint",
    source: "ABC12",
  },
];

async function fromNewsApi(key: string): Promise<Article[] | null> {
  const q = encodeURIComponent("Flint Michigan");
  const url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${key}`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    articles?: Array<{
      title: string;
      url: string;
      source?: { name?: string };
      publishedAt?: string;
    }>;
  };
  const list = data.articles ?? [];
  return list
    .filter((a) => a.title && a.url)
    .map((a) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));
}

async function fromGoogleNewsRss(): Promise<Article[] | null> {
  const q = encodeURIComponent("Flint Michigan");
  const rssUrl = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
  const res = await fetch(rssUrl, {
    headers: {
      "User-Agent": "TownScout/1.0 (Flint local news widget)",
    },
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  const xml = await res.text();
  const items = parseRssItems(xml, 10);
  return items.length ? items : null;
}

export async function GET() {
  try {
    const key = process.env.NEWS_API_ORG_KEY?.trim();
    if (key) {
      const articles = await fromNewsApi(key);
      if (articles?.length) {
        return NextResponse.json({
          source: "newsapi",
          articles,
        });
      }
    }

    const rss = await fromGoogleNewsRss();
    if (rss?.length) {
      return NextResponse.json({ source: "rss", articles: rss });
    }

    return NextResponse.json({
      source: "fallback",
      articles: FALLBACK,
    });
  } catch {
    return NextResponse.json({
      source: "error",
      articles: FALLBACK,
    });
  }
}
