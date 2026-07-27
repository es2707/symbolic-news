import type { Metadata } from "next";
import { ArchivePage } from "../components/ArchivePage";
import { SocialStreams } from "../components/SocialStreams";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social | Symbolic Search",
  description: "Browse official social profiles and live X timelines.",
};

export default function SocialPage() {
  return (
    <ArchivePage
      description="Official profiles and live timelines. Scroll within each timeline for older posts."
      title="Social"
      updatedAt={new Date().toISOString()}
    >
      <SocialStreams expanded />
    </ArchivePage>
  );
}
