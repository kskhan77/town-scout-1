import Image from "next/image";
import type { SpotlightVariant } from "@/components/organisms/SpotlightSection";

interface LandmarkCardProps {
  imageSrc: string;
  title: string;
  tags: string[];
  variant?: SpotlightVariant;
}

export const LandmarkCard = ({
  imageSrc,
  title,
  tags,
  variant = "happening",
}: LandmarkCardProps) => {
  const isHistory = variant === "history";
  const accentBullet = isHistory ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]";
  const titleHover = isHistory ? "group-hover:text-amber-300" : "group-hover:text-cyan-400";
  const bottomBar = isHistory ? "bg-amber-500" : "bg-cyan-400";

  return (
    <div className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/5 bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,45,91,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_-8px_rgba(0,209,255,0.12)] md:rounded-[32px]">
      <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-[#2D3A4F] to-[#1E293B]">
        <div className="relative size-32 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-xl">
          <div className="relative size-28">
            <Image src={imageSrc} alt={title} fill className="object-contain" sizes="112px" />
          </div>
        </div>
        <div
          className={`absolute w-40 h-40 rounded-full blur-3xl ${isHistory ? "bg-amber-500/10" : "bg-cyan-500/10"}`}
        />
      </div>

      <div className="flex flex-1 flex-col space-y-4 bg-[#1E293B] p-7 md:p-8">
        <h3 className={`text-white font-bold text-xl tracking-tight transition-colors ${titleHover}`}>
          {title}
        </h3>
        <ul className="space-y-3">
          {tags.map((tag) => (
            <li key={tag} className="flex items-center gap-3 text-gray-400 text-sm font-medium">
              <span className={`size-1.5 shrink-0 rounded-full ${accentBullet}`} />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full h-1.5 ${bottomBar} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />
    </div>
  );
};
