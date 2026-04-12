// src/components/organisms/HeroSection.tsx
import Link from "next/link";
import { HERO_OUTER_PAD, PAGE_SHELL } from "@/lib/pageLayout";

/** Navy → teal gradient — same family as auth CTAs, sized for the hero. */
const heroPrimaryCta =
  "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center rounded-xl bg-gradient-to-r from-[#002d5b] to-[#0e7490] px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-[#002d5b]/20 transition hover:brightness-[1.05] active:scale-[0.99] md:min-h-[3.25rem] md:min-w-[11rem] md:px-10 md:py-4 md:text-lg";

/** Light secondary — matches site secondary buttons (navy text, cyan border). */
const heroSecondaryCta =
  "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center rounded-xl border-2 border-[#00d1ff] bg-white px-8 py-3.5 text-base font-semibold text-[#002d5b] shadow-md shadow-[#002d5b]/10 transition hover:bg-cyan-50 active:scale-[0.99] md:min-h-[3.25rem] md:min-w-[11rem] md:px-10 md:py-4 md:text-lg";

export const HeroSection = () => {
  return (
    <section
      className={`w-full bg-[#f3f6fa] ${HERO_OUTER_PAD}`}
      aria-labelledby="hero-heading"
    >
      <div className={PAGE_SHELL}>
        <div
          className="relative isolate min-h-[min(68svh,640px)] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0e2a44] shadow-[0_20px_50px_-12px_rgba(0,45,91,0.25)] ring-1 ring-slate-900/5 md:min-h-[min(72svh,700px)] md:rounded-3xl"
        >
          {/* Wider + slightly taller than frame so pillarbox bars in the file are clipped (object-cover alone keeps them). */}
          <div className="absolute inset-0 overflow-hidden bg-[#0e2a44]" aria-hidden>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute left-1/2 top-1/2 z-0 h-[108%] w-[142%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Lighter tint so the footage stays visible; still enough contrast for white type */}
          <div
            className="absolute inset-0 z-[1] bg-gradient-to-br from-[#002d5b]/50 via-[#002d5b]/28 to-[#001f3d]/45"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_100%_90%_at_50%_35%,transparent_0%,rgba(0,26,51,0.22)_100%)]"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[min(68svh,640px)] flex-col items-center justify-center px-6 py-14 text-center md:min-h-[min(72svh,700px)] md:px-10 md:py-16">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] md:text-xs md:tracking-[0.32em]">
              Flint, Michigan
            </p>
            <h1
              id="hero-heading"
              className="mb-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.4)] sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
            >
              Town Scout
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-white/95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] md:mb-12 md:max-w-2xl md:text-xl">
              Discovering the heart of your town, one landmark at a time.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link href="/explore" className={heroPrimaryCta}>
                Explore now
              </Link>
              <Link href="/events" className={heroSecondaryCta}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
