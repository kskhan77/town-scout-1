// // src/app/page.tsx
// import { HeroSection } from "@/components/organisms/HeroSection";
// import { FeatureCards } from "@/components/organisms/FeatureCards";

// export default function Home() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* 1. Hero Section (Image of Flint) */}
//       <HeroSection />

//       {/* 2. Historic Landmarks Section */}
//       <FeatureCards title="HISTORIC LANDMARKS OF FLINT" />

//       {/* 3. Middle "City Skyline" Divider (Visual from your image) */}
//       <div className="w-full h-20 bg-[url('/skyline.svg')] bg-repeat-x bg-contain opacity-10"></div>

//       {/* 4. What's Happening Section */}
//       <FeatureCards title="WHAT'S HAPPENING NOW" />

//       {/* 5. Stats or Join Section */}
//       <section className="bg-gray-50 py-20 text-center">
//          <h2 className="text-3xl font-bold text-blue-900 mb-4">Join Our Local Community</h2>
//          <p className="text-gray-500 mb-8">Be a TownScout Insider.</p>
//          <div className="flex justify-center max-w-md mx-auto gap-2">
//             <input type="email" placeholder="Enter your email" className="px-4 py-2 border rounded-full w-full outline-none focus:ring-2 focus:ring-cyan-300" />
//             <button className="bg-cyan-400 text-white px-6 py-2 rounded-full font-bold">Signup</button>
//          </div>
//       </section>
//     </div>
//   );
// }
// i am keeping old code for my reference as above i refactored the code to use LandmarkGrid instead of FeatureCards for better clarity and separation of concerns. The new code is as follows:

import { HeroSection } from "@/components/organisms/HeroSection";
import { LandmarkGrid } from "@/components/organisms/LandmarkGrid";
import { SkylineDivider } from "@/components/atoms/SkylineDivider";

export default function Home() {
  return (
    <main>
      <HeroSection />
      
      <LandmarkGrid title="Historic Landmarks of Flint" />
      
      <SkylineDivider />
      
      <LandmarkGrid title="What's Happening Now" />
      
      {/* Stats Section would follow here */}
    </main>
  );
}