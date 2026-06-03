import type { Metadata } from "next";
import { PAGE_SHELL } from "@/lib/pageLayout";
import { EventsSection } from "@/components/organisms/EventsSection";

export const metadata: Metadata = {
  title: "Events | Town Scout",
};

export default function EventsPage() {
  return (
    <main className="w-fulf7f9fcl bg-[#f7f9fc] py-14 md:py-20">
      <div className={PAGE_SHELL}>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl">
          Events
        </h1>
        <EventsSection />
      </div>
    </main>
  );
}
