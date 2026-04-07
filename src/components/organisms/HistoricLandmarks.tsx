import Image from "next/image";
import { LandmarkCard } from "@/components/molecules/LandmarkCard";
import { historicLandmarksOfFlint } from "@/lib/data";
import { PAGE_SHELL, SECTION_PAD_Y } from "@/lib/pageLayout";

export function HistoricLandmarks() {
  return (
    <section
      className="w-full bg-[#e8eef5] text-slate-900"
      aria-labelledby="historic-landmarks-heading"
    >
      <div className={`${PAGE_SHELL} ${SECTION_PAD_Y}`}>
        <div className="mb-8 max-w-3xl md:mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#0ea5c4] md:text-sm md:tracking-[0.24em]">
            Your town, your schedule
          </p>
          <h2
            id="historic-landmarks-heading"
            className="text-3xl font-extrabold tracking-tight text-[#002d5b] md:text-4xl lg:text-[2.35rem] lg:leading-tight"
          >
            Historic landmarks of Flint
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 lg:grid-cols-3 lg:gap-10">
          {historicLandmarksOfFlint.map((item) => (
            <LandmarkCard
              key={item.title}
              title={item.title}
              imageSrc={item.image}
              tags={item.tags}
              variant="landmark"
            />
          ))}
        </div>

        <div className="mt-12 md:mt-14">
          <div className="h-1 w-full max-w-4xl rounded-full bg-gradient-to-r from-transparent via-[#00ccf4] to-transparent opacity-90" aria-hidden />
          <div className="relative mt-6 h-20 w-full overflow-hidden md:h-24">
            <Image
              src="/skyline.svg"
              alt=""
              fill
              className="object-cover object-bottom opacity-25"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
