"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { DiscoverHistorySection } from "@/components/organisms/DiscoverHistorySection";
import { flintHistorySliderSlides } from "@/lib/data";

const FlintHistoryMapInner = dynamic(() => import("@/components/organisms/FlintHistoryMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-2xl border border-amber-900/15 bg-[#f4efe8] text-sm text-amber-900/60"
      style={{ height: 460, minHeight: 320 }}
    >
      Loading map…
    </div>
  ),
});

export function HistoryExplorer() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const onMarkerSelect = useCallback((i: number) => setGalleryIndex(i), []);

  return (
    <>
      <section className="mt-10" aria-labelledby="history-map-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="history-map-heading"
              className="text-lg font-bold tracking-tight text-[#002D5B] md:text-xl"
            >
              Archive on the map
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              Each pin matches a photograph below—hover for a preview, click to read more, or choose a
              thumbnail to fly the map to that story.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/80">
            {flintHistorySliderSlides.length} locations · Flint area
          </p>
        </div>

        <div className="relative mt-5">
          <FlintHistoryMapInner
            slides={flintHistorySliderSlides}
            selectedSlideIndex={galleryIndex}
            onMarkerSelect={onMarkerSelect}
          />
          <p className="mt-2 text-center text-xs text-neutral-500">
            © OpenStreetMap contributors · Approximate map placement for exploration
          </p>
        </div>
      </section>

      <DiscoverHistorySection
        galleryIndex={galleryIndex}
        onGalleryIndexChange={setGalleryIndex}
        autoAdvance={false}
        disablePageShell
        sectionClassName="mt-4 bg-white md:mt-6 md:rounded-3xl md:border md:border-neutral-200/90 md:shadow-sm md:ring-1 md:ring-black/[0.03]"
        headingId="history-page-gallery-heading"
      />
    </>
  );
}
