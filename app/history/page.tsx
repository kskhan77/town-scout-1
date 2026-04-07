import type { Metadata } from "next";
import { HistoryExplorer } from "@/components/organisms/HistoryExplorer";
import { PAGE_SHELL } from "@/lib/pageLayout";

export const metadata: Metadata = {
  title: "Flint history archives | Town Scout",
  description:
    "Explore Flint, Michigan through archival photographs on a map and in the same gallery featured on the Town Scout home page.",
};

export default function HistoryPage() {
  return (
    <main className="w-full bg-[#f7f9fc] pb-20 text-neutral-900 md:pb-24">
      <div className="border-b border-amber-900/10 bg-gradient-to-b from-white via-[#fffdfb] to-[#f7f9fc] pt-14 pb-10 md:pt-16 md:pb-12">
        <div className={PAGE_SHELL}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 md:text-sm">
            Flint, Michigan
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            History archives
          </h1>
          
        </div>
      </div>

      <div className={PAGE_SHELL}>
        <HistoryExplorer />
      </div>
    </main>
  );
}
