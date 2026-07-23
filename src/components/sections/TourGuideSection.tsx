import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Destination } from '../../types';
import archipelagosData from '../../data/archipelagosData.json';

interface TourGuideSectionProps {
  destinations: Destination[];
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
}

export const TourGuideSection: React.FC<TourGuideSectionProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination
}) => {
  return (
    <section id="guide" className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Interactive Vietnam Vector Map SVG with Popups */}
        <div className="lg:col-span-7 relative flex justify-center">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-widget border border-slate-200 min-h-[460px] flex flex-col justify-between">
            
            {/* Map Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Interactive Vietnam Map</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Lãnh Thổ Việt Nam (Hoàng Sa & Trường Sa)
              </span>
            </div>

            {/* Stylized SVG Map Illustration with Interactive Pins */}
            <div className="relative w-full h-[360px] my-4 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
              
              {/* SVG Stylized Outline of Vietnam */}
              <svg viewBox="0 0 400 500" className="w-full h-full text-slate-300 fill-slate-200 stroke-slate-300 stroke-2">
                {/* S-shape Curve representing Vietnam */}
                <path d="M 170 40 Q 210 70 200 120 T 230 200 T 250 280 T 210 370 T 160 440 L 140 450 Q 110 430 130 380 Q 160 300 180 230 Q 170 160 140 100 Z" />
              </svg>

              {/* Hoàng Sa Archipelago Marker */}
              <div className="absolute top-1/3 right-8 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white">
                <span>🇻🇳</span> Hoàng Sa
              </div>

              {/* Trường Sa Archipelago Marker */}
              <div className="absolute bottom-1/4 right-4 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white">
                <span>🇻🇳</span> Trường Sa
              </div>

              {/* Destination Pins on Map */}
              {destinations.map((dest, i) => {
                const isSelected = dest.id === selectedDestination.id;
                // Map approximate SVG pin positions
                const pinPositions: Record<string, { top: string; left: string }> = {
                  'ha-noi': { top: '22%', left: '42%' },
                  'ha-long': { top: '24%', left: '55%' },
                  'sapa': { top: '15%', left: '32%' },
                  'ninh-binh': { top: '28%', left: '44%' },
                  'da-nang': { top: '48%', left: '56%' },
                  'hoi-an': { top: '52%', left: '58%' },
                  'phu-quoc': { top: '88%', left: '28%' }
                };

                const pos = pinPositions[dest.id] || { top: `${30 + i * 8}%`, left: `${40 + (i % 3) * 10}%` };

                return (
                  <div 
                    key={dest.id}
                    onClick={() => onSelectDestination(dest)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isSelected ? 'bg-orange-500 text-white scale-125 ring-4 ring-orange-200' : 'bg-slate-900 text-white hover:bg-orange-500'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Floating Card Popup matching Reference Screenshot */}
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-slate-950 text-white p-2.5 rounded-2xl shadow-widget z-30 border border-slate-700"
                      >
                        <img 
                          src={dest.hero_image} 
                          alt={dest.name} 
                          className="w-full h-20 object-cover rounded-xl mb-2"
                        />
                        <div className="font-bold text-xs text-white line-clamp-1">{dest.name.split('-')[0].trim()}</div>
                        <div className="text-[10px] text-orange-400 font-semibold">{dest.region}</div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

            </div>

            {/* Selected Destination Banner Footer */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Selected Region</span>
                <span className="font-bold text-sm text-white">{selectedDestination.name}</span>
              </div>
              <button 
                onClick={() => {
                  const canvas = document.getElementById('canvas');
                  if (canvas) canvas.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Optimize Trip →
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Text Information matching Screenshot */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="text-2xl font-light text-slate-500 font-serif">
            Vietnam
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight leading-tight">
            Tour Guide & <br />
            <span className="text-orange-500">PuLP Engine</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            {selectedDestination.name} is located in {selectedDestination.region}. Our intelligent PuLP linear programming optimization engine balances your budget across luxury stay, dining, transport, and heritage tours to maximize overall satisfaction.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Standard International Mapbox GL JS Integration</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Full compliance with Vietnam national sovereignty</span>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => {
                const canvas = document.getElementById('canvas');
                if (canvas) canvas.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-lg"
            >
              <span>See Detailed Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>

    </section>
  );
};
