import Script from "next/script";
import { headers } from "next/headers";
import { FeedExplorer } from "./components/FeedExplorer";
import { siteConfig } from "./config";
import { loadFeed } from "./lib/feed";
import { requestSiteUrl } from "./lib/site-url";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, generatedAt, warnings } = await loadFeed();
  const requestHeaders = await headers();
  const siteUrl = requestSiteUrl(requestHeaders);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Symbolradar",
    url: `${siteUrl}/`,
    inLanguage: "en",
    description:
      "A living feed of new videos, essays, conversations, and mentions concerning Matthieu Pageau, Jonathan Pageau, and Jean-Philippe Marceau.",
    about: siteConfig.people.map((person) => ({
      "@type": "Person",
      name: person.name,
      url: person.primaryUrl,
    })),
  };

  return (
    <main>
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
          <span>Symbolradar</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#feed">Feed</a>
          <a href="#discover">Discover</a>
          <a href="#x">X</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">A living archive of symbolic thought</p>
          <h1>
            Follow the pattern
            <span>as it unfolds.</span>
          </h1>
          <p className="hero-intro">
            New videos, essays, conversations, and mentions concerning Matthieu
            Pageau, Jonathan Pageau, and Jean-Philippe Marceau — all in one
            place.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#feed">
              Explore the latest <span aria-hidden="true">↓</span>
            </a>
            <span className="updated">
              <i aria-hidden="true" />
              Updated {formatUpdated(generatedAt)}
            </span>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit-center">
            <span>α</span>
            <i />
            <span>ω</span>
          </div>
          <p>language · pattern · creation</p>
        </div>
      </section>

      <section className="people-strip" aria-label="People being followed">
        {siteConfig.people.map((person, index) => (
          <a href={person.primaryUrl} target="_blank" rel="noreferrer" key={person.name}>
            <span>0{index + 1}</span>
            <strong>{person.name}</strong>
            <small>{person.role}</small>
            <b aria-hidden="true">↗</b>
          </a>
        ))}
      </section>

      <section className="feed-section" id="feed">
        <div className="section-heading">
          <div>
            <p className="kicker">Latest signals</p>
            <h2>The ongoing feed</h2>
          </div>
          <p>
            Guest appearances are shown first, followed by official sources and
            broader mentions. Sources are checked automatically.
          </p>
        </div>
        <FeedExplorer items={items} warnings={warnings} />
      </section>

      <section className="discovery-section" id="discover">
        <div className="discovery-copy">
          <p className="kicker">Beyond the established channels</p>
          <h2>Discover guest appearances</h2>
          <p>
            Explore live searches for podcasts, interviews, and mentions on
            YouTube and X. This makes it easier to find new channels without
            scraping or a paid data service.
          </p>
        </div>
        <div className="discovery-grid">
          {siteConfig.people.map((person) => (
            <article className="discovery-card" key={person.name}>
              <p>{person.monogram}</p>
              <h3>{person.name}</h3>
              <span>podcast · interview · guest</span>
              <div>
                <a href={person.youtubeSearch} target="_blank" rel="noreferrer">
                  Search YouTube <b aria-hidden="true">↗</b>
                </a>
                <a href={person.xSearch} target="_blank" rel="noreferrer">
                  Search X <b aria-hidden="true">↗</b>
                </a>
              </div>
            </article>
          ))}
        </div>
        <aside className="api-note">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Automatic YouTube discovery is active</strong>
            <p>
              New guest appearances from across YouTube are added directly to
              the feed. Searches refresh hourly, while the API key remains
              hidden from visitors.
            </p>
          </div>
        </aside>
      </section>

      <section className="x-section" id="x">
        <div className="section-heading light">
          <div>
            <p className="kicker">Live from X</p>
            <h2>The latest posts</h2>
          </div>
          <p>
            Official embedded profile timelines. X may set cookies when these
            timelines load.
          </p>
        </div>
        <div className="x-grid">
          {siteConfig.xProfiles.map((profile) => (
            <article className="x-card" key={profile.handle}>
              <header>
                <div>
                  <span>@</span>
                  <strong>{profile.name}</strong>
                </div>
                <a href={profile.url} target="_blank" rel="noreferrer">
                  Open on X ↗
                </a>
              </header>
              <a
                className="twitter-timeline"
                data-chrome="noheader nofooter noborders transparent"
                data-height="520"
                data-theme="light"
                href={profile.url}
              >
                Posts from @{profile.handle}
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <i />
          </span>
          <span>Symbolradar</span>
        </a>
        <p>
          Displays metadata and short excerpts. All content belongs to its
          original publishers.
        </p>
        <div>
          <a href="https://www.thesymbolicworld.com/" target="_blank" rel="noreferrer">
            The Symbolic World
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </main>
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
