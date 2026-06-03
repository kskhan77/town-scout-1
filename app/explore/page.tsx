// app/explore/page.tsx
'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Leaflet requires browser APIs — must be loaded client-side only
const MapView = dynamic(() => import('@/components/organisms/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <p className="text-gray-500 text-lg">Loading map…</p>
    </div>
  ),
});

export default function ExplorePage() {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#002D5B] text-white z-10 shadow-md shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
        <span className="text-lg font-extrabold tracking-tight">
          TOWN SCOUT — Explore
        </span>
        <span className="w-24" />
      </div>

      {/* Map fills remaining height */}
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}
