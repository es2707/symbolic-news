import Script from "next/script";
import { headers } from "next/headers";
import { siteConfig } from "./config";
import type { FeedItem } from "./lib/feed";
import { loadFeed } from "./lib/feed";
import { requestSiteUrl } from "./lib/site-url";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, generatedAt, warnings } = await loadFeed();
  const requestHeaders = await headers();
  const siteUrl = requestSiteUrl(requestHeaders);
  const videos = items.filter((item) => item.kind === "video").slice(0, 8);
  const articles = items
    .filter((item) => item.kind === "article")
    .slice(0, 8);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${siteUrl}/`,
    inLanguage: "en",
    description:
      "A current index of videos, essays, and official social posts about symbolism, religion, and culture.",
  };

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Symbolradar, back to top">
          <span className="brand-mark" aria-hidden="true">
            <i />
          </span>
          <span>{siteConfig.name}</span>
        </a>
        <nav aria-label="Content streams">
          <a href="#videos">Videos</a>
          <a href="#essays">Essays</a>
          <a href="#social">Social</a>
        </nav>
        <span className="updated">
          <i aria-hidden="true" />
          Updated {formatUpdated(generatedAt)}
        </span>
      </header>

      <section className="intro">
        <p className="kicker">A live source index</p>
        <h1>
          What is new,
          <span>without the noise.</span>
        </h1>
        <p>
          Three focused streams from official channels and carefully filtered
          English-language discoveries. Every item links back to its original
          publisher.
        </p>
      </section>

      {warnings.length > 0 && (
        <aside className="feed-warning" role="status">
          One or more live sources could not be reached. Available sources are
          still shown below.
        </aside>
      )}

      <section className="streams" aria-label="Latest content">
        <Stream
          id="videos"
          index="01"
          title="Videos"
          description="Official uploads and relevant English-language appearances or mentions."
          items={videos}
        />

        <Stream
          id="essays"
          index="02"
          title="Essays"
          description="Long-form writing from official publications and author feeds."
          items={articles}
          footerLink={{
            label: "Browse all Symbolic World articles",
            url: siteConfig.articleIndexUrl,
          }}
        />

        <section className="stream social-stream" id="social">
          <StreamHeader
            index="03"
            title="Social"
            description="Live X timelines and verified links to official profiles elsewhere."
          />

          <div className="social-links" aria-label="Official social profiles">
            {siteConfig.socialProfiles.map((profile) => (
              <a
                href={profile.url}
                key={`${profile.network}:${profile.name}`}
                rel="noreferrer"
                target="_blank"
              >
                <span>{profile.network}</span>
                <strong>{profile.name}</strong>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>

          <div className="x-timelines">
            {siteConfig.xProfiles.map((profile) => (
              <article className="x-card" key={profile.handle}>
                <header>
                  <div>
                    <span>X</span>
                    <strong>@{profile.handle}</strong>
                  </div>
                  <a href={profile.url} rel="noreferrer" target="_blank">
                    Open ↗
                  </a>
                </header>
                <a
                  className="twitter-timeline"
                  data-chrome="noheader nofooter noborders transparent"
                  data-height="430"
                  data-theme="light"
                  href={profile.url}
                >
                  Latest posts from @{profile.handle}
                </a>
              </article>
            ))}
          </div>
        </section>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <i />
          </span>
          <span>{siteConfig.name}</span>
        </a>
        <p>
          Metadata and short excerpts only. All work belongs to its original
          publishers.
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </main>
  );
}

function Stream({
  id,
  index,
  title,
  description,
  items,
  footerLink,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  items: FeedItem[];
  footerLink?: { label: string; url: string };
}) {
  return (
    <section className="stream" id={id}>
      <StreamHeader index={index} title={title} description={description} />
      <div className="stream-list">
        {items.length > 0 ? (
          items.map((item) => <StreamCard item={item} key={item.id} />)
        ) : (
          <p className="empty-state">No current items are available.</p>
        )}
      </div>
      {footerLink && (
        <a
          className="stream-footer-link"
          href={footerLink.url}
          rel="noreferrer"
          target="_blank"
        >
          {footerLink.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </section>
  );
}

function StreamHeader({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <header className="stream-heading">
      <span>{index}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  );
}

function StreamCard({ item }: { item: FeedItem }) {
  return (
    <article className={`stream-card ${item.kind}`}>
      <a href={item.url} rel="noreferrer" target="_blank">
        {item.imageUrl && (
          <div className="card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" loading="lazy" src={item.imageUrl} />
          </div>
        )}
        <div className="card-content">
          <p className="card-meta">
            <span>{item.label}</span>
            <time dateTime={item.publishedAt}>
              {formatDate(item.publishedAt)}
            </time>
          </p>
          <h3>{item.title}</h3>
          <p className="card-description">{item.description}</p>
          <p className="card-byline">
            <span>{item.author}</span>
            <b aria-hidden="true">↗</b>
          </p>
        </div>
      </a>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Oslo",
  }).format(new Date(value));
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
