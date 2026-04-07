"use client";

import { useCallback, useEffect, useState } from "react";
import { HistoryImageSlider } from "@/components/molecules/HistoryImageSlider";
import { flintHistorySliderSlides } from "@/lib/data";
import { PAGE_SHELL } from "@/lib/pageLayout";

type DiscoverHistorySectionProps = {
  /** Controlled index when used with the history map (e.g. `/history`). */
  galleryIndex?: number;
  onGalleryIndexChange?: (index: number) => void;
  /** When false, disables the landing-page autoplay carousel. */
  autoAdvance?: boolean;
  /** Use inside a parent that already applies `PAGE_SHELL` (avoids nested max-width). */
  disablePageShell?: boolean;
  className?: string;
  sectionClassName?: string;
  headingId?: string;
};

export function DiscoverHistorySection({
  galleryIndex: controlledGalleryIndex,
  onGalleryIndexChange,
  autoAdvance = true,
  disablePageShell = false,
  className = "",
  sectionClassName = "",
  headingId,
}: DiscoverHistorySectionProps = {}) {
  const count = flintHistorySliderSlides.length;
  const [internalIndex, setInternalIndex] = useState(0);
  const controlled =
    controlledGalleryIndex !== undefined && onGalleryIndexChange !== undefined;
  const index = controlled ? controlledGalleryIndex : internalIndex;

  const setIndex = useCallback(
    (i: number) => {
      if (controlled) onGalleryIndexChange(i);
      else setInternalIndex(i);
    },
    [controlled, onGalleryIndexChange],
  );

  const goNext = useCallback(() => {
    setIndex((index + 1) % count);
  }, [count, index, setIndex]);

  const goPrev = useCallback(() => {
    setIndex((index - 1 + count) % count);
  }, [count, index, setIndex]);

  useEffect(() => {
    if (!autoAdvance || controlled || count <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setInternalIndex((i) => (i + 1) % count);
    }, 8000);
    return () => window.clearInterval(id);
  }, [autoAdvance, controlled, count]);

  /** Match PAGE_SHELL gutters when the outer section is already inside a shell (e.g. `/history` card). */
  const shell = disablePageShell
    ? "w-full px-5 sm:px-6 md:px-10 lg:px-12"
    : PAGE_SHELL;
  const h2Id = headingId ?? "discover-history-heading";

  return (
    <section
      className={`w-full bg-white text-neutral-900 ${sectionClassName} ${className}`.trim()}
      aria-labelledby={h2Id}
    >
      <div
        className={`${shell} ${disablePageShell ? "py-8 md:py-10 lg:py-12" : "py-16 md:py-20 lg:py-24"}`}
      >
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 md:text-sm">
              Old image gallery for Flint MI
            </p>
            <h2
              id={h2Id}
              className="text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl lg:text-[2.5rem] lg:leading-tight"
            >
              Discover the History
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1 self-start md:pt-1">
            <button
              type="button"
              onClick={goPrev}
              className="flex size-11 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#002D5B] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
              aria-label="Previous photo"
            >
              <span className="text-xl leading-none" aria-hidden>
                ‹
              </span>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex size-11 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#002D5B] shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
              aria-label="Next photo"
            >
              <span className="text-xl leading-none" aria-hidden>
                ›
              </span>
            </button>
          </div>
        </div>

        <HistoryImageSlider
          slides={flintHistorySliderSlides}
          index={index}
          onIndexChange={setIndex}
        />
      </div>
    </section>
  );
}
