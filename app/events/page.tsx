import type { Metadata } from "next";
import { EventsMapPanel } from "@/components/organisms/EventsMapPanel";
import { EventsSection } from "@/components/organisms/EventsSection";
import { PAGE_SHELL } from "@/lib/pageLayout";

export const metadata: Metadata = {
  title: "Events | Town Scout",
};

export default function EventsPage() {
  return (
    <main className="w-full bg-[#f7f9fc] py-14 md:py-20">
      <div className={PAGE_SHELL}>
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ccf4]">Town Scout</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl">
            Local events
          </h1>
          <p className="mt-3 text-sm text-neutral-600 md:text-base">
            Discover what&apos;s happening in Flint—explore the map for historic places and venues, then browse
            upcoming listings below.
          </p>
        </header>
        <EventsMapPanel />
        <EventsSection />
      </div>
    </main>
  );
}
