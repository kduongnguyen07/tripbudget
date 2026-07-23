import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Sparkles } from 'lucide-react';
import { Destination } from '../../types';
import { handleImageError, VIETNAM_LANDMARK_IMAGES } from '../../utils/imageUtils';

interface MasonryGridProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
}

export const MasonryGridSection: React.FC<MasonryGridProps> = ({
  destinations,
  onSelectDestination
}) => {
  return (
    <section id="masonry" className="py-24 px-8 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold font-sans">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Danh Lam Thắng Cảnh Việt Nam</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black font-serif text-slate-900 tracking-tight">
          Sacred Places & <span className="text-amber-600">World Heritage</span>
        </h2>
        
        <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed">
          Thỏa sức khám phá di sản thiên nhiên và văn hóa Việt Nam. Chọn địa điểm để thuật toán PuLP tự động tối ưu chi phí chuyến đi.
        </p>
      </div>

      {/* Asymmetric Masonry Grid matching Screenshot Section 3 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Large Left Vertical Card (Column 1-5) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          onClick={() => onSelectDestination(destinations[0])}
          className="md:col-span-5 relative rounded-3xl overflow-hidden shadow-widget min-h-[480px] group cursor-pointer border border-slate-200"
        >
          <img 
            src={destinations[0]?.hero_image || VIETNAM_LANDMARK_IMAGES.ha_long} 
            alt={destinations[0]?.name}
            onError={(e) => handleImageError(e, destinations[0]?.name)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans">Di Sản UNESCO</span>
            <h3 className="text-2xl font-bold font-serif">{destinations[0]?.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-sans">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{destinations[0]?.region}</span>
            </div>
          </div>
        </motion.div>

        {/* Right 2x2 Masonry Cards (Column 6-12) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {destinations.slice(1, 5).map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onSelectDestination(dest)}
              className="relative rounded-3xl overflow-hidden shadow-card h-60 group cursor-pointer border border-slate-200"
            >
              <img 
                src={dest.hero_image} 
                alt={dest.name}
                onError={(e) => handleImageError(e, dest.name)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold font-serif text-base truncate">{dest.name.split('-')[0].trim()}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold font-sans">
                    <Star className="w-3 h-3 fill-amber-400" /> 4.9
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans">{dest.region}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
};
