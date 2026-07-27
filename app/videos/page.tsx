import type { Metadata } from "next";
import { ArchivePage } from "../components/ArchivePage";
import { loadFeed } from "../lib/feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos | Symbolic Search",
  description: "Browse current and older videos from selected sources.",
};

export default async function VideosPage() {
  const { items, generatedAt } = await loadFeed();

  return (
    <ArchivePage
      description="Official uploads and filtered English-language results, newest first."
      items={items.filter((item) => item.kind === "video")}
      title="Videos"
      updatedAt={generatedAt}
    />
  );
}
