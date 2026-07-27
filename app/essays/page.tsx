import type { Metadata } from "next";
import { ArchivePage } from "../components/ArchivePage";
import { loadFeed } from "../lib/feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Essays | Symbolic Search",
  description: "Browse current and older essays from selected sources.",
};

export default async function EssaysPage() {
  const { items, generatedAt } = await loadFeed();

  return (
    <ArchivePage
      description="Essays and articles from official publications and author feeds, newest first."
      items={items.filter((item) => item.kind === "article")}
      title="Essays"
      updatedAt={generatedAt}
    />
  );
}
