import Link from "next/link";
import type { FeedItem } from "../lib/feed";
import { ContentList } from "./ContentList";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function ArchivePage({
  title,
  description,
  items,
  updatedAt,
  children,
}: {
  title: string;
  description: string;
  items?: FeedItem[];
  updatedAt: string;
  children?: React.ReactNode;
}) {
  return (
    <main id="top">
      <SiteHeader updatedAt={updatedAt} />
      <section className="archive-intro">
        <Link href="/">Home</Link>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="archive-section">
        {items ? (
          <ContentList
            archive
            initialCount={12}
            items={items}
            pageSize={12}
          />
        ) : (
          children
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
