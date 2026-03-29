"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { HistorySliderSlide } from "@/lib/data";

interface HistoryImageSliderProps {
  slides: HistorySliderSlide[];
  className?: string;
}

export function HistoryImageSlider({ slides, className = "" }: HistoryImageSliderProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

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
    const id = window.setInterval(goNext, 6500);
    return () => window.clearInterval(id);
  }, [count, goNext]);

  if (count === 0) return null;

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label="Flint history imagery"
    >
      <div className="relative aspect-[16/9] w-full max-h-[min(28rem,56vw)] min-h-[200px] overflow-hidden rounded-2xl border border-[#dce3eb] bg-[#e2e8f0] shadow-[0_12px_40px_-12px_rgba(0,45,91,0.18)]">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              i === index ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/85 via-[#002D5B]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 z-20 px-5 py-4 md:px-8 md:py-5">
              <p className="text-sm font-semibold leading-snug text-white drop-shadow-sm md:text-base">
                {slide.caption}
              </p>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 md:px-3">
          <button
            type="button"
            onClick={goPrev}
            className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-[#002D5B] shadow-md backdrop-blur-sm transition hover:bg-white md:size-11"
            aria-label="Previous slide"
          >
            <span className="sr-only">Previous</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-[#002D5B] shadow-md backdrop-blur-sm transition hover:bg-white md:size-11"
            aria-label="Next slide"
          >
            <span className="sr-only">Next</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1} of ${count}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-9 bg-[#002D5B]" : "w-2 bg-[#c5ced9] hover:bg-[#9aa5b4]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
