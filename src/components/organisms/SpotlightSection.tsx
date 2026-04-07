import type { ReactNode } from "react";
import { LandmarkCard } from "@/components/molecules/LandmarkCard";
import type { Landmark } from "@/lib/data";
import { PAGE_SHELL, SECTION_PAD_Y } from "@/lib/pageLayout";

export type SpotlightVariant = "history" | "happening" | "landmark";

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
      <div className={`${PAGE_SHELL} ${SECTION_PAD_Y}`}>
        <div className="mb-8 max-w-3xl md:mb-10">
          <p
            className={
              isHistory
                ? "mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-800 md:text-sm"
                : "mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#0ea5c4] md:text-sm"
            }
          >
            {subtitle}
          </p>
          <h2
            id={`section-${variant}`}
            className="text-3xl font-black uppercase tracking-tight text-[#002d5b] md:text-4xl lg:text-[2.5rem] lg:leading-tight"
          >
            {title}
          </h2>
        </div>

        {beforeCards ? <div className="mb-8 md:mb-10">{beforeCards}</div> : null}

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
