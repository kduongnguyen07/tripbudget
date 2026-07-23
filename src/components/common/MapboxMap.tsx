import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination } from '../../types';
import archipelagosData from '../../data/archipelagosData.json';

interface MapProps {
  selectedDestination: Destination;
  allDestinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
}

export const MapboxMap: React.FC<MapProps> = ({
  selectedDestination,
  allDestinations,
  onSelectDestination
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map (CartoDB Dark Matter tiles, zoomControl: false to remove +/- buttons)
    const map = L.map(mapContainerRef.current, {
      center: [16.0, 108.0],
      zoom: 5.5,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    mapRef.current = map;

    // 1. Add Archipelago Markers naturally from archipelagosData.json
    archipelagosData.forEach(arch => {
      const icon = L.divIcon({
        className: 'custom-arch-marker',
        html: `
          <div style="
            background: rgba(16, 185, 129, 0.9);
            border: 1.5px solid #34d399;
            color: white;
            padding: 3px 8px;
            border-radius: 16px;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🇻🇳</span> ${arch.name}
          </div>
        `,
        iconSize: [140, 26],
        iconAnchor: [70, 13]
      });

      L.marker([arch.coordinates[1], arch.coordinates[0]], { icon })
        .bindPopup(`
          <div style="color: #0f172a; padding: 4px; font-family: sans-serif;">
            <h4 style="font-weight: bold; margin-bottom: 2px; font-size: 12px;">${arch.name}</h4>
            <p style="font-size: 10px; color: #475569;">${arch.description}</p>
          </div>
        `)
        .addTo(map);
    });

    // 2. Add Destination Markers
    allDestinations.forEach(dest => {
      const isSelected = dest.id === selectedDestination.id;

      const icon = L.divIcon({
        className: 'custom-dest-marker',
        html: `
          <div style="
            background: ${isSelected ? '#d4af37' : '#1e293b'};
            color: ${isSelected ? '#0C0805' : '#ffffff'};
            border: 1.5px solid ${isSelected ? '#fbbf24' : '#d4af37'};
            padding: 4px 10px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: ${isSelected ? '0 0 16px rgba(212, 175, 55, 0.8)' : '0 4px 10px rgba(0,0,0,0.5)'};
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
          ">
            <span>📍</span>
            <span>${dest.name.split('-')[0].trim()}</span>
          </div>
        `,
        iconSize: [130, 26],
        iconAnchor: [65, 13]
      });

      const marker = L.marker([dest.coordinates[1], dest.coordinates[0]], { icon })
        .addTo(map)
        .on('click', () => {
          onSelectDestination(dest);
        });

      markersRef.current.push(marker);
    });

    return () => {
      map.remove();
    };
  }, [allDestinations]);

  // Fly to selected destination on change
  useEffect(() => {
    if (mapRef.current && selectedDestination) {
      mapRef.current.flyTo([selectedDestination.coordinates[1], selectedDestination.coordinates[0]], 8.5, {
        duration: 1.5
      });
    }
  }, [selectedDestination]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-amber-950/60 shadow-2xl">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#0C0805]" />

      {/* Selected Destination Tag Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-[#0C0805]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#d4af37]/40 flex items-center gap-2 shadow-xl">
        <span className="text-[#d4af37] font-bold">📍</span>
        <span className="text-xs font-extrabold text-white">{selectedDestination.name}</span>
      </div>
    </div>
  );
};
