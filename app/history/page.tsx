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
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-[#f7f9fc] text-neutral-900">
      <div className="shrink-0 border-b border-amber-900/10 bg-gradient-to-b from-white to-[#fffdfb] pt-1 pb-1.5 md:pt-1.5 md:pb-2">
        <div className={PAGE_SHELL}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 md:text-[11px]">
            Flint, Michigan
          </p>
          <h1 className="mt-0.5 text-lg font-black uppercase leading-tight tracking-tight text-[#002D5B] md:text-xl">
            History archives
          </h1>
        </div>
      </div>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <HistoryExplorer />
      </main>
    </div>
  );
}
