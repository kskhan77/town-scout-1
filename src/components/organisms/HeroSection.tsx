// src/components/organisms/HeroSection.tsx
import { Button } from '../atoms/Button';
import { PAGE_SHELL } from '@/lib/pageLayout';

export const HeroSection = () => {
  return (
    <section className="relative flex h-[min(100vh,640px)] w-full items-center justify-center overflow-hidden md:h-[680px]">
      {/* 1. Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Dark Overlay (to make the text readable like in your image) */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* 3. Content Area */}
      <div className={`relative z-20 text-center text-white ${PAGE_SHELL}`}>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tighter md:text-7xl">
            TOWN SCOUT
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg font-medium opacity-90 md:text-xl">
            Discovering the heart of your town, one landmark at a time.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button variant="primary" className="px-10 py-4 text-lg shadow-2xl">
                Explore Now
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/20 px-10 py-4 text-lg">
                Learn More
            </Button>
        </div>
      </div>

      {/* 4. Bottom Wave/Fade (Optional: matches the smooth transition in your design) */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-28 w-full bg-gradient-to-t from-white to-transparent md:h-32" />
    </section>
  );
};