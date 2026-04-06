"use client";

import { useCallback, useEffect, useState } from "react";
import { HistoryImageSlider } from "@/components/molecules/HistoryImageSlider";
import { flintHistorySliderSlides } from "@/lib/data";
import { PAGE_SHELL } from "@/lib/pageLayout";

export function DiscoverHistorySection() {
  const count = flintHistorySliderSlides.length;
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(goNext, 8000);
    return () => window.clearInterval(id);
  }, [count, goNext]);

  return (
    <section
      className="w-full bg-white text-neutral-900"
      aria-labelledby="discover-history-heading"
    >
      <div className={`${PAGE_SHELL} py-16 md:py-20 lg:py-24`}>
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 md:text-sm">
              Old image gallery for Flint MI
            </p>
            <h2
              id="discover-history-heading"
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
