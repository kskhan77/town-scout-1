import type { Metadata } from "next";
import { InfoTip } from "@/components/atoms/InfoTip";
import { EventsMapPanel } from "@/components/organisms/EventsMapPanel";
import { EventsSection } from "@/components/organisms/EventsSection";
import { PAGE_SHELL } from "@/lib/pageLayout";

export const metadata: Metadata = {
  title: "Events | Town Scout",
};

export default function EventsPage() {
  return (
    <main className="w-full bg-[#f7f9fc] py-6 md:py-10">
      <div className={PAGE_SHELL}>
        <header className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00ccf4] md:text-xs">
            Town Scout
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#002D5B] md:text-3xl">
              Local events
            </h1>
            <InfoTip
              side="bottom"
              shortTitle="Map: switch Events, Around town, or Historic. Listings and add-event form are below."
              label="About this page"
            >
              Explore the <strong>map</strong> using the side controls (events, regional shows, historic
              places). Scroll down for the <strong>event listings</strong> and, when signed in, to add an
              event.
            </InfoTip>
          </div>
        </header>
        <EventsMapPanel />
        <EventsSection />
      </div>
    </main>
  );
}
