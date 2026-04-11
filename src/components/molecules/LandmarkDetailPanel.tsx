// src/components/molecules/LandmarkDetailPanel.tsx
'use client';

import { useState } from 'react';
import { MapLandmark } from '@/components/organisms/MapView';

interface LandmarkDetailPanelProps {
  landmark: MapLandmark;
  onClose: () => void;
}

function PhotoCarousel({ landmark }: { landmark: MapLandmark }) {
  // Build the full photo list: images array takes priority, falls back to single image
  const photos: string[] = landmark.images && landmark.images.length > 0
    ? landmark.images
    : landmark.image ? [landmark.image] : [];

  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  const current = photos[index];
  const isExternal = current.startsWith('http');

  return (
    <div className="relative w-full h-52 bg-gray-100 shrink-0 overflow-hidden select-none">
      {/* Photo */}
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current}
          alt={`${landmark.title} photo ${index + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#002D5B] to-[#004080]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={landmark.title}
            className="w-32 h-32 object-contain opacity-60"
          />
        </div>
      )}

      {/* Prev / Next — only shown when multiple photos */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors"
            aria-label="Next photo"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs rounded-full px-2 py-0.5">
            {index + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function LandmarkDetailPanel({ landmark, onClose }: LandmarkDetailPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] md:bottom-auto md:top-0 md:right-0 md:left-auto md:w-96 md:h-full flex flex-col bg-white shadow-2xl border-t md:border-t-0 md:border-l border-gray-200 max-h-[65vh] md:max-h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4 bg-[#002D5B] text-white shrink-0">
        <div className="flex-1 pr-2">
          <h2 className="text-lg font-extrabold leading-tight">{landmark.title}</h2>
          <div className="flex flex-wrap gap-1 mt-2">
            {landmark.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-cyan-400/20 text-cyan-200 rounded-full px-2 py-0.5 border border-cyan-400/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-2xl leading-none shrink-0 mt-0.5"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Photo carousel */}
      <PhotoCarousel landmark={landmark} />

      {/* Body */}
      <div className="p-4 flex-1">
        {landmark.description ? (
          <p className="text-sm text-gray-700 leading-relaxed">{landmark.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No description available.</p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            📍 {landmark.latitude.toFixed(4)}°N, {Math.abs(landmark.longitude).toFixed(4)}°W
          </p>
        </div>
      </div>
    </div>
  );
}
