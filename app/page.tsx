import { headers } from "next/headers";
import { ContentList } from "./components/ContentList";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { SocialStreams } from "./components/SocialStreams";
import { siteConfig } from "./config";
import type { FeedItem } from "./lib/feed";
import { loadFeed } from "./lib/feed";
import { requestSiteUrl } from "./lib/site-url";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, generatedAt, warnings } = await loadFeed();
  const requestHeaders = await headers();
  const siteUrl = requestSiteUrl(requestHeaders);
  const videos = items.filter((item) => item.kind === "video");
  const articles = items.filter((item) => item.kind === "article");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${siteUrl}/`,
    inLanguage: "en",
    description:
      "Browse videos, essays and social posts from selected sources.",
  };

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <SiteHeader updatedAt={generatedAt} />

      <section className="intro short-intro">
        <h1>Symbolic Search</h1>
        <p>Browse videos, essays and social posts from selected sources.</p>
      </section>

      {warnings.length > 0 && (
        <aside className="feed-warning" role="status">
          One or more live sources could not be reached. Available sources are
          still shown below.
        </aside>
      )}

      <section className="streams" aria-label="Latest content">
        <Stream
          archiveUrl="/videos"
          description="Official uploads and relevant English-language results."
          id="videos"
          index="01"
          items={videos}
          title="Videos"
        />

        <Stream
          archiveUrl="/essays"
          description="Writing from official publications and author feeds."
          id="essays"
          index="02"
          items={articles}
          title="Essays"
        />

        <section className="stream social-stream" id="social">
          <StreamHeader
            archiveUrl="/social"
            description="Live X timelines and verified official profiles."
            index="03"
            title="Social"
          />
          <SocialStreams />
          <a className="stream-footer-link" href="/social">
            View all social sources <span aria-hidden="true">→</span>
          </a>
        </section>
      </section>

      <section className="people-index" id="people">
        <header>
          <p className="kicker">People</p>
          <h2>Browse by person</h2>
        </header>
        <div>
          {siteConfig.people.map((person, index) => (
            <a href={`/people/${person.slug}`} key={person.slug}>
              <span>0{index + 1}</span>
              <strong>{person.name}</strong>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Stream({
  id,
  index,
  title,
  description,
  items,
  archiveUrl,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  items: FeedItem[];
  archiveUrl: string;
}) {
  return (
    <section className="stream" id={id}>
      <StreamHeader
        archiveUrl={archiveUrl}
        description={description}
        index={index}
        title={title}
      />
      <ContentList items={items} />
      <a className="stream-footer-link" href={archiveUrl}>
        View all {title.toLocaleLowerCase("en")}{" "}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

function StreamHeader({
  index,
  title,
  description,
  archiveUrl,
}: {
  index: string;
  title: string;
  description: string;
  archiveUrl: string;
}) {
  return (
    <header className="stream-heading">
      <span>{index}</span>
      <div>
        <h2>
          <a href={archiveUrl}>{title}</a>
        </h2>
        <p>{description}</p>
      </div>
    </header>
  );
}
