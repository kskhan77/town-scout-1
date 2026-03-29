import { LandmarkCard } from '../molecules/LandmarkCard';
import { landmarkData } from '@/lib/data';

interface SectionProps {
  title: string;
}

export const LandmarkGrid = ({ title }: SectionProps) => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-[#002D5B] tracking-tighter uppercase mb-2">
            {title}
        </h2>
        <p className="text-cyan-500 font-bold text-sm tracking-widest uppercase">
            Your Town, Your Schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {landmarkData.map((item, i) => (
          <LandmarkCard 
            key={i}
            title={item.title}
            imageSrc={item.image}
            tags={item.tags}
          />
        ))}
      </div>
    </section>
  );
};