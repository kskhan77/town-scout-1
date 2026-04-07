function stripCdata(s: string) {
  const t = s.trim();
  if (t.startsWith("<![CDATA[")) {
    return t.slice(9).replace(/\]\]>$/, "").trim();
  }
  return t;
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export type RssArticle = { title: string; url: string; source?: string };

/** Minimal RSS `<item>` parser for Google News–style feeds. */
export function parseRssItems(xml: string, limit: number): RssArticle[] {
  const out: RssArticle[] = [];
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null && out.length < limit) {
    const block = m[1];
    const titleRaw = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const linkRaw = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1];
    if (!titleRaw || !linkRaw) continue;
    const title = decodeEntities(stripCdata(titleRaw.trim()));
    const url = decodeEntities(stripCdata(linkRaw.trim()));
    const src =
      block.match(/<source[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/i) ??
      block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
    const source = src
      ? decodeEntities(stripCdata((src[2] ?? src[1] ?? "").trim()))
      : undefined;
    if (title && url) out.push({ title, url, source });
  }
  return out;
}
