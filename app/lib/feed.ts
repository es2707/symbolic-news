import { siteConfig } from "../config.ts";

export type FeedSource = "youtube" | "substack" | "mention";

export type FeedItem = {
  id: string;
  source: FeedSource;
  label: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  author: string;
  publishedAt: string;
};

type LoadResult = {
  items: FeedItem[];
  generatedAt: string;
  warnings: string[];
};

export async function loadFeed(): Promise<LoadResult> {
  const tasks = [
    ...siteConfig.youtubeChannels.map((channel) =>
      loadYouTube(channel.channelId, channel.name),
    ),
    ...siteConfig.substackFeeds.map((feed) =>
      loadSubstack(feed.url, feed.name),
    ),
    loadMentions(),
    loadYouTubeDiscoveries(),
  ];

  const results = await Promise.allSettled(tasks);
  const warnings: string[] = [];
  const items = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value;
    warnings.push(`Source ${index + 1} is temporarily unavailable.`);
    return [];
  });

  return {
    items: normalizeFeedItems(items),
    generatedAt: new Date().toISOString(),
    warnings,
  };
}

export function normalizeFeedItems(items: FeedItem[], limit = 45): FeedItem[] {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const unique: FeedItem[] = [];

  for (const item of items) {
    const sourceId = `${item.source}:${item.id}`;
    const url = canonicalUrl(item.url);
    if (seenIds.has(sourceId) || seenUrls.has(url)) continue;

    seenIds.add(sourceId);
    seenUrls.add(url);
    unique.push({ ...item, url });
  }

  return unique
    .sort((a, b) => {
      const guestPriority =
        Number(b.label === "Guest appearance") -
        Number(a.label === "Guest appearance");
      if (guestPriority !== 0) return guestPriority;

      return (
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, limit);
}

export function canonicalUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (
        key.toLowerCase().startsWith("utm_") ||
        ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(key.toLowerCase())
      ) {
        url.searchParams.delete(key);
      }
    }
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return value;
  }
}

async function loadYouTubeDiscoveries(): Promise<FeedItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const publishedAfter = discoveryWindowStart();
  const searches = siteConfig.people.map(async (person) => {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.search = new URLSearchParams({
      part: "snippet",
      type: "video",
      order: "date",
      maxResults: "20",
      publishedAfter,
      q: person.name,
      key: apiKey,
    }).toString();

    const response = await fetch(searchUrl, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`YouTube search returned ${response.status}`);

    const data = (await response.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          channelTitle?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
          title?: string;
        };
      }>;
    };

    return (data.items ?? []).flatMap((result) => {
      const videoId = result.id?.videoId;
      const snippet = result.snippet;
      if (!videoId || !snippet?.title || !snippet.publishedAt) return [];
      if (
        !matchesPersonMention(
          `${snippet.title} ${snippet.description ?? ""}`,
          person.name,
        )
      ) {
        return [];
      }

      return [
        {
          id: `discovery:${videoId}`,
          source: "mention" as const,
          label: "Guest appearance",
          title: clean(snippet.title),
          description: clean(snippet.description ?? "").slice(0, 220),
          url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
          imageUrl: safeImage(
            snippet.thumbnails?.high?.url ??
              snippet.thumbnails?.medium?.url ??
              "",
          ),
          author: clean(snippet.channelTitle ?? "YouTube"),
          publishedAt: validDate(snippet.publishedAt),
        },
      ];
    }).slice(0, 6);
  });

  const results = await Promise.allSettled(searches);
  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

function discoveryWindowStart() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear() - 2, now.getUTCMonth(), 1),
  ).toISOString();
}

export function matchesPersonMention(value: string, personName: string) {
  return normalizeSearchText(value).includes(normalizeSearchText(personName));
}

function normalizeSearchText(value: string) {
  return clean(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function loadYouTube(
  channelId: string,
  channelName: string,
): Promise<FeedItem[]> {
  const xml = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`,
  );

  return blocks(xml, "entry").slice(0, 12).map((entry) => {
    const videoId = value(entry, "yt:videoId");
    const url =
      attribute(entry, "link", "href") ||
      `https://www.youtube.com/watch?v=${videoId}`;
    return {
      id: `youtube:${videoId}`,
      source: "youtube",
      label: "Video",
      title: clean(value(entry, "title")),
      description: clean(value(entry, "media:description")).slice(0, 220),
      url: safeUrl(url, "https://www.youtube.com/"),
      imageUrl:
        safeImage(attribute(entry, "media:thumbnail", "url")) ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined),
      author: clean(value(entry, "name")) || channelName,
      publishedAt: validDate(value(entry, "published")),
    };
  });
}

async function loadSubstack(
  feedUrl: string,
  publicationName: string,
): Promise<FeedItem[]> {
  const xml = await fetchText(feedUrl);

  return blocks(xml, "item").slice(0, 12).map((item, index) => {
    const link = clean(value(item, "link"));
    const richText =
      value(item, "content:encoded") || value(item, "description");
    return {
      id: `substack:${link || index}`,
      source: "substack",
      label: "Essay",
      title: clean(value(item, "title")),
      description: clean(richText).slice(0, 240),
      url: safeUrl(link, "https://substack.com/@matthieupageau"),
      imageUrl: safeImage(imageFromHtml(richText)),
      author: clean(value(item, "dc:creator")) || publicationName,
      publishedAt: validDate(value(item, "pubDate")),
    };
  });
}

async function loadMentions(): Promise<FeedItem[]> {
  const query = encodeURIComponent(
    '"Jonathan Pageau" OR "Matthieu Pageau" OR "Jean-Philippe Marceau"',
  );
  const xml = await fetchText(
    `https://news.google.com/rss/search?q=${query}&hl=en&gl=US&ceid=US:en`,
  );

  return blocks(xml, "item").slice(0, 18).map((item, index) => {
    const title = clean(value(item, "title"));
    const source = clean(value(item, "source"));
    return {
      id: `mention:${index}:${title}`,
      source: "mention",
      label: "Mention",
      title,
      description: source
        ? `Found via ${source}. Open the original result to read or watch more.`
        : "A new result from an external channel or publication.",
      url: safeUrl(clean(value(item, "link")), "https://news.google.com/"),
      author: source || "External source",
      publishedAt: validDate(value(item, "pubDate")),
    };
  });
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/xml",
      "User-Agent": "Symbolradar/1.0 (+https://openai.com)",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`The source returned ${response.status}`);
  return response.text();
}

function blocks(xml: string, tag: string) {
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map(
    (match) => match[1],
  );
}

function value(xml: string, tag: string) {
  const match = xml.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return match?.[1] ?? "";
}

function attribute(xml: string, tag: string, name: string) {
  const match = xml.match(
    new RegExp(`<${tag}\\b[^>]*\\b${name}=["']([^"']+)["'][^>]*>`, "i"),
  );
  return match?.[1] ?? "";
}

function imageFromHtml(html: string) {
  return html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ?? "";
}

export function clean(input: string) {
  return decodeEntities(
    input
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function decodeEntities(input: string) {
  const entities: Record<string, string> = {
    amp: "&",
    apos: "'",
    quot: '"',
    lt: "<",
    gt: ">",
    nbsp: " ",
  };
  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (entity, name) => entities[name] ?? entity);
}

function validDate(value: string) {
  const date = new Date(clean(value));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

export function safeUrl(value: string, fallback: string) {
  try {
    const url = new URL(decodeEntities(value));
    return url.protocol === "https:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function safeImage(value: string) {
  if (!value) return undefined;
  try {
    const url = new URL(decodeEntities(value));
    const allowed =
      url.protocol === "https:" &&
      (url.hostname === "i.ytimg.com" ||
        url.hostname.endsWith(".substackcdn.com") ||
        url.hostname === "substackcdn.com");
    return allowed ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
