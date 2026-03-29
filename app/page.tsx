import { HeroSection } from "@/components/organisms/HeroSection";
import { DiscoverHistory } from "@/components/organisms/DiscoverHistory";
import { WhatsHappeningNow } from "@/components/organisms/WhatsHappeningNow";
import { CommunitySignup } from "@/components/organisms/CommunitySignup";
import { SkylineDivider } from "@/components/atoms/SkylineDivider";

export default function Home() {
  return (
    <main className="w-full bg-[#f7f9fc] text-neutral-900">
      <HeroSection />
      <DiscoverHistory />
      <SkylineDivider />
      <WhatsHappeningNow />
      <CommunitySignup />
    </main>
  );
}
