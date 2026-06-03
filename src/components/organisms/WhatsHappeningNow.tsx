import { SpotlightSection } from "@/components/organisms/SpotlightSection";
import { happeningNowSpotlights } from "@/lib/data";

export function WhatsHappeningNow() {
  return (
    <SpotlightSection
      title="What's Happening Now"
      subtitle="Your town, your schedule"
      items={happeningNowSpotlights}
      variant="happening"
      className="bg-white"
    />
  );
}
