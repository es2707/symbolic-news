import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentList } from "../../components/ContentList";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { SocialStreams } from "../../components/SocialStreams";
import { siteConfig } from "../../config";
import { loadFeed } from "../../lib/feed";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return siteConfig.people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = siteConfig.people.find((entry) => entry.slug === slug);

  return {
    title: person
      ? `${person.name} | Symbolic Search`
      : "Person | Symbolic Search",
    description: person?.description,
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = siteConfig.people.find((entry) => entry.slug === slug);
  if (!person) notFound();

  const { items, generatedAt } = await loadFeed();
  const personItems = items.filter((item) => item.people.includes(person.slug));

  return (
    <main id="top">
      <SiteHeader updatedAt={generatedAt} />
      <section className="archive-intro person-intro">
        <Link href="/#people">People</Link>
        <h1>{person.name}</h1>
        <p>{person.description}</p>
      </section>
      <section className="person-content">
        <div className="person-results">
          <h2>Latest results</h2>
          <ContentList
            archive
            initialCount={12}
            items={personItems}
            pageSize={12}
          />
        </div>
        <aside className="person-social">
          <h2>Official profiles</h2>
          <SocialStreams personSlug={person.slug} />
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
