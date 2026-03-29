import { HeroSection } from "@/components/organisms/HeroSection";
import { DiscoverHistory } from "@/components/organisms/DiscoverHistory";
import { HistoricLandmarks } from "@/components/organisms/HistoricLandmarks";
import { WhatsHappeningNow } from "@/components/organisms/WhatsHappeningNow";
import { CommunitySignup } from "@/components/organisms/CommunitySignup";

export default function Home() {
  return (
    <main className="w-full bg-[#f7f9fc] text-neutral-900">
      <HeroSection />
      <DiscoverHistory />
      <HistoricLandmarks />
      <WhatsHappeningNow />
      <CommunitySignup />
    </main>
  );
}
