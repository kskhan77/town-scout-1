import Image from "next/image";
import { LandmarkCard } from "@/components/molecules/LandmarkCard";
import { historicLandmarksOfFlint } from "@/lib/data";
import { PAGE_SHELL } from "@/lib/pageLayout";

export function HistoricLandmarks() {
  return (
    <section
      className="w-full bg-[#f4f4f2] text-neutral-900"
      aria-labelledby="historic-landmarks-heading"
    >
      <div className={`${PAGE_SHELL} py-16 md:py-20 lg:py-24`}>
        <div className="mb-10 max-w-3xl md:mb-12">
          <h2
            id="historic-landmarks-heading"
            className="text-3xl font-extrabold tracking-tight text-[#002D5B] md:text-4xl"
          >
            Historic Landmarks of Flint
          </h2>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-500 md:text-sm">
            Your Town, Your Schedule
          </p>
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

        <div className="mt-14 md:mt-16">
          <div className="h-0.5 w-full bg-[#00D1FF]" aria-hidden />
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
