import Image from 'next/image';
import Link from 'next/link';
import { PAGE_SHELL } from '@/lib/pageLayout';

export const Footer = () => {
  return (
    <footer className="relative w-full bg-white pt-20">
      
      {/* 1. The Skyline Silhouette (Middle Section) */}
      <div className="w-full h-24 relative overflow-hidden">
         {/* If you have the skyline.svg in /public, uncomment below */}
         <Image src="/skyline.svg" alt="City Skyline" fill className="object-cover opacity-20" /> 
         <div className="absolute bottom-0 w-full border-b border-gray-100"></div>
      </div>

      <div className={`${PAGE_SHELL} py-12`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-gray-100 pt-10">
          
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#002D5B] rounded-full flex items-center justify-center text-white text-xs">TS</div>
              <span className="font-bold text-[#002D5B]">TOWN SCOUT</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discovering the heart of your town, one landmark at a time. Join our community of local scouts.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-bold text-[#002D5B] mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-cyan-500">Home</Link></li>
              <li><Link href="/events" className="hover:text-cyan-500">Local Events</Link></li>
              <li><Link href="/history" className="hover:text-cyan-500">History Archives</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-[#002D5B] mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-cyan-500">City Resources</Link></li>
              <li><Link href="#" className="hover:text-cyan-500">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-cyan-500">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Copyright */}
          <div>
            <h4 className="font-bold text-[#002D5B] mb-4">Connect</h4>
            <p className="text-sm text-gray-500 mb-4">© 2026 TownScout. Built for Flint, MI.</p>
            <div className="flex gap-4">
              {/* Social Icons would go here */}
              <div className="w-8 h-8 rounded-full bg-gray-100"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Hand-Drawn Mountain Pattern (Bottom Section) */}
      <div className="w-full h-32 relative mt-10">
         {/* This matches the black and white mountain sketches in your image */}
         <div className="absolute bottom-0 w-full h-full bg-[linear-gradient(180deg,transparent,#e2e8f0)] opacity-60" />
      </div>
    </footer>
  );
};