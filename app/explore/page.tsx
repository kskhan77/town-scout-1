import type { Metadata } from "next";
import { ExploreMapSection } from "./ExploreMapSection";

export const metadata: Metadata = {
  title: "Explore | Town Scout",
  description:
    "Browse Flint landmarks on an interactive map with photos, tags, and short stories for each place.",
};

export default function ExplorePage() {
  return (
    <main className="flex h-[max(28rem,calc(100dvh-9.5rem))] w-full flex-col bg-[#e8eef0]">
      <ExploreMapSection />
    </main>
  );
}
