import type { ReactNode } from "react";
import { LandmarkCard } from "@/components/molecules/LandmarkCard";
import type { Landmark } from "@/lib/data";
import { PAGE_SHELL } from "@/lib/pageLayout";

export type SpotlightVariant = "history" | "happening";

interface SpotlightSectionProps {
  title: string;
  subtitle: string;
  items: Landmark[];
  variant: SpotlightVariant;
  className?: string;
  beforeCards?: ReactNode;
}

export function SpotlightSection({
  title,
  subtitle,
  items,
  variant,
  className = "",
  beforeCards,
}: SpotlightSectionProps) {
  const isHistory = variant === "history";

  return (
    <section
      className={`w-full ${className}`.trim()}
      aria-labelledby={`section-${variant}`}
    >
      <div className={`${PAGE_SHELL} py-16 md:py-20 lg:py-24`}>
        <div className="mb-10 max-w-3xl md:mb-12">
          <p
            className={
              isHistory
                ? "mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800 md:text-sm"
                : "mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 md:text-sm"
            }
          >
            {subtitle}
          </p>
          <h2
            id={`section-${variant}`}
            className="text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl lg:text-[2.5rem] lg:leading-tight"
          >
            {title}
          </h2>
        </div>

        {beforeCards ? <div className="mb-12 md:mb-14">{beforeCards}</div> : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 lg:grid-cols-3 lg:gap-10">
          {items.map((item) => (
            <LandmarkCard
              key={item.title}
              title={item.title}
              imageSrc={item.image}
              tags={item.tags}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
