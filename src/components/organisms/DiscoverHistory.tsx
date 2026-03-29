import { HistoryImageSlider } from "@/components/molecules/HistoryImageSlider";
import { SpotlightSection } from "@/components/organisms/SpotlightSection";
import { flintHistorySliderSlides, historySpotlights } from "@/lib/data";

export function DiscoverHistory() {
  return (
    <SpotlightSection
      title="Discover the History"
      subtitle="Heritage & landmarks"
      items={historySpotlights}
      variant="history"
      className="bg-[#eef2f7]"
      beforeCards={<HistoryImageSlider slides={flintHistorySliderSlides} />}
    />
  );
}
