import Link from "next/link";
import { siteConfig } from "../config";

export function SiteHeader({ updatedAt }: { updatedAt?: string }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Symbolic Search, home">
        <span className="brand-mark" aria-hidden="true">
          <i />
        </span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/videos">Videos</Link>
        <Link href="/essays">Essays</Link>
        <Link href="/social">Social</Link>
        <Link href="/#people">People</Link>
      </nav>
      {updatedAt ? (
        <span className="updated">
          <i aria-hidden="true" />
          Updated {formatUpdated(updatedAt)}
        </span>
      ) : (
        <span />
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <Link className="brand footer-brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <i />
        </span>
        <span>{siteConfig.name}</span>
      </Link>
      <p>
        Metadata and short excerpts only. All work belongs to its original
        publishers.
      </p>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  }).format(new Date(value));
}
