"use client";

import Image from "next/image";
import type { HistorySliderSlide } from "@/lib/data";

interface HistoryImageSliderProps {
  slides: HistorySliderSlide[];
  index: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

export function HistoryImageSlider({
  slides,
  index,
  onIndexChange,
  className = "",
}: HistoryImageSliderProps) {
  const count = slides.length;
  if (count === 0) return null;

  const active = slides[index];
  const caption = active.caption ?? active.alt;
  const story = active.wikiSummary ?? active.alt;

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label="Flint historical photograph gallery"
    >
      {/* Large focus panel — no horizontal scroll */}
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#1a2332] shadow-[0_24px_60px_-20px_rgba(0,45,91,0.35)] md:rounded-3xl">
        <div className="relative aspect-[16/11] w-full md:aspect-[2/1] lg:aspect-[21/9]">
          <div
            key={active.src}
            className="history-hero-animate absolute inset-0"
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              className="object-cover object-center grayscale contrast-[1.05] brightness-[0.98]"
              sizes="(max-width: 1280px) 100vw, 1024px"
              priority={index === 0}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#002D5B]/95 via-[#002D5B]/45 to-transparent"
              aria-hidden
            />
          </div>

          <div
            key={`caption-${index}`}
            className="history-caption-animate absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-16 md:px-10 md:pb-8 md:pt-24"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/95">
              Flint, Michigan · archive
            </p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
              {caption}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 md:text-base">
              {story}
            </p>
            <p className="mt-4 text-xs font-medium text-white/55">
              {index + 1} of {count}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnails: wrap — no overflow scroll */}
      <div className="mt-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 md:text-left">
          Select a photo
        </p>
        <ul className="flex flex-wrap justify-center gap-2.5 md:justify-start md:gap-3">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <li key={slide.src}>
                <button
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Photo ${i + 1} of ${count}: ${slide.alt}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative size-[3.25rem] overflow-hidden rounded-xl border-2 shadow-md transition-all duration-300 ease-out sm:size-14 md:size-16 ${
                    isActive
                      ? "z-10 scale-110 border-cyan-400 ring-2 ring-cyan-400/40 ring-offset-2 ring-offset-white"
                      : "border-white opacity-30 hover:scale-105 hover:opacity-100"
                  } `}
                >
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    className="object-cover grayscale"
                    sizes="64px"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
