 import Image from 'next/image';

interface LandmarkCardProps {
  imageSrc: string;
  title: string;
  tags: string[];
}

export const LandmarkCard = ({ imageSrc, title, tags }: LandmarkCardProps) => {
  return (
    <div className="group relative bg-[#1E293B] rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20 border border-white/5">
      
      {/* 1. Header Area with Centered Round Image */}
      <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-[#2D3A4F] to-[#1E293B]">
        <div className="relative w-32 h-32 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-xl">
          <div className="relative w-30 h-30">
            <Image 
              src={imageSrc} 
              alt={title}
              fill
              className="object-contain" 
            />
          </div>
        </div>
        <div className="absolute w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* 2. Content Area */}
      <div className="p-8 space-y-4 bg-[#1E293B]">
        <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <ul className="space-y-3">
          {tags.map((tag, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-400 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
};