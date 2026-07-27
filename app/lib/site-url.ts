const LOCAL_SITE_URL = "http://localhost:3000";

export function resolveSiteUrl(fallback?: string) {
  for (const candidate of [process.env.SITE_URL, fallback, LOCAL_SITE_URL]) {
    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      return url.origin;
    } catch {
      // Try the next candidate.
    }
  }

  return LOCAL_SITE_URL;
}

export function requestSiteUrl(requestHeaders: {
  get(name: string): string | null;
}) {
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/i.test(host);
  const protocol = forwardedProtocol ?? (isLocal ? "http" : "https");

  return resolveSiteUrl(`${protocol}://${host}`);
}
