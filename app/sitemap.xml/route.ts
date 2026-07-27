import { resolveSiteUrl } from "../lib/site-url";
import { siteConfig } from "../config";

export function GET(request: Request) {
  const siteUrl = resolveSiteUrl(request.url);
  const paths = [
    "",
    "/videos",
    "/essays",
    "/social",
    ...siteConfig.people.map((person) => `/people/${person.slug}`),
  ];
  const urls = paths
    .map(
      (path) =>
        [
          "  <url>",
          `    <loc>${siteUrl}${path || "/"}</loc>`,
          "    <changefreq>hourly</changefreq>",
          "    <priority>0.8</priority>",
          "  </url>",
        ].join("\n"),
    )
    .join("\n");
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
