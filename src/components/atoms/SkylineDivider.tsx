import { PAGE_SHELL } from "@/lib/pageLayout";

export const SkylineDivider = () => (
  <div className={`${PAGE_SHELL} py-6 md:py-8`}>
    <div
      className="pointer-events-none h-24 w-full bg-[url('/skyline.svg')] bg-contain bg-repeat-x opacity-[0.22] md:h-28"
      role="presentation"
    />
  </div>
);
