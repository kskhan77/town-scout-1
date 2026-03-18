// src/components/organisms/HeroSection.tsx
import { Button } from '../atoms/Button';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] overflow-hidden flex items-center justify-center">
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
      <div className="relative z-20 text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
            TOWN SCOUT
        </h1>
        <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto opacity-90">
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
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-20"></div>
    </section>
  );
};