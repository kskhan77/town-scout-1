// src/components/organisms/MapView.tsx
'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { historicLandmarksOfFlint } from '@/lib/data';
import LandmarkDetailPanel from '@/components/molecules/LandmarkDetailPanel';

// Fix Leaflet's default marker icon paths broken by webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const unlockedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const lockedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-icon-locked',
});

export interface MapLandmark {
  id: string;
  title: string;
  image: string;
  images?: string[];
  tags: string[];
  latitude: number;
  longitude: number;
  description?: string;
}

const landmarks: MapLandmark[] = historicLandmarksOfFlint
  .filter((l) => l.latitude != null && l.longitude != null && l.id != null)
  .map((l) => ({
    id: l.id!,
    title: l.title,
    image: l.image,
    images: l.images,
    tags: l.tags,
    latitude: l.latitude!,
    longitude: l.longitude!,
    description: l.description,
  }));

const FLINT_CENTER: [number, number] = [43.0125, -83.6875];
const GEOFENCE_RADIUS_M = 50;

export default function MapView() {
  const [selectedLandmark, setSelectedLandmark] = useState<MapLandmark | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locationAccurate, setLocationAccurate] = useState(true);
  const watcherRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    watcherRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        setLocationAccurate(accuracy <= 100);

        // Use Leaflet's built-in distanceTo to check the geofence
        const userLatLng = L.latLng(latitude, longitude);
        setUnlockedIds((prev) => {
          const next = new Set(prev);
          landmarks.forEach((lm) => {
            const dist = userLatLng.distanceTo(L.latLng(lm.latitude, lm.longitude));
            if (dist <= GEOFENCE_RADIUS_M) next.add(lm.id);
          });
          return next;
        });
      },
      () => {
        // Location denied or unavailable — show fallback
        setLocationAccurate(false);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => {
      if (watcherRef.current !== null) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
    };
  }, []);

  function distanceLabel(lm: MapLandmark): string {
    if (!userPos) return '';
    const m = L.latLng(userPos.lat, userPos.lng).distanceTo(L.latLng(lm.latitude, lm.longitude));
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km away` : `${Math.round(m)} m away`;
  }

  return (
    <div className="relative w-full h-full">
      {/* Grey out locked markers */}
      <style>{`.leaflet-marker-icon-locked { filter: grayscale(1) opacity(0.5); }`}</style>

      <MapContainer center={FLINT_CENTER} zoom={13} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location dot */}
        {userPos && (
          <CircleMarker
            center={[userPos.lat, userPos.lng]}
            radius={10}
            pathOptions={{ color: '#00D1FF', fillColor: '#00D1FF', fillOpacity: 0.8, weight: 2 }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}

        {/* Landmark markers */}
        {landmarks.map((lm) => {
          const unlocked = unlockedIds.has(lm.id);
          return (
            <Marker
              key={lm.id}
              position={[lm.latitude, lm.longitude]}
              icon={unlocked ? unlockedIcon : lockedIcon}
              eventHandlers={{
                click() {
                  if (unlocked) setSelectedLandmark(lm);
                },
              }}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-bold text-[#002D5B]">{lm.title}</p>
                  {unlocked ? (
                    <button
                      onClick={() => setSelectedLandmark(lm)}
                      className="mt-1 text-cyan-600 underline text-xs"
                    >
                      View details →
                    </button>
                  ) : (
                    <>
                      <p className="text-gray-500 text-xs mt-1">
                        {distanceLabel(lm) || 'Location unknown'}
                      </p>
                      <p className="text-gray-400 text-xs">🔒 Get within 50 m to unlock</p>
                      {!locationAccurate && (
                        <button
                          onClick={() => {
                            setUnlockedIds((prev) => new Set([...prev, lm.id]));
                            setSelectedLandmark(lm);
                          }}
                          className="mt-2 w-full text-xs bg-[#002D5B] text-white rounded px-2 py-1 hover:bg-[#003d7a]"
                        >
                          I&apos;m Here (fallback)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Landmark detail panel */}
      {selectedLandmark && (
        <LandmarkDetailPanel
          landmark={selectedLandmark}
          onClose={() => setSelectedLandmark(null)}
        />
      )}
    </div>
  );
}
