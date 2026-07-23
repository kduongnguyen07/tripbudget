import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, ChevronRight } from 'lucide-react';
import { Destination } from '../../types';
import { handleImageError } from '../../utils/imageUtils';

interface MoreThanTravelProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
}

export const MoreThanTravelSection: React.FC<MoreThanTravelProps> = ({
  destinations,
  onSelectDestination
}) => {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto space-y-12 bg-white relative overflow-hidden">
      
      {/* Decorative Leaf Graphic accents matching Screenshot Section 5 */}
      <div className="absolute top-10 left-4 text-emerald-600/10 pointer-events-none">
        <Leaf className="w-32 h-32 transform -rotate-45" />
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-sans">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hơn Cả Một Chuyến Đi</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black font-serif text-slate-900 tracking-tight">
          More Than <span className="text-emerald-700">Travel</span>
        </h2>
        
        <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed">
          Chúng tôi mang đến những chuyến đi lưu giữ kỷ niệm sâu sắc, tôn vinh cảnh quan thiên nhiên và bảo tồn văn hóa truyền thống Việt Nam.
        </p>
      </div>

      {/* Destination Horizontal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            onClick={() => onSelectDestination(dest)}
            className="bg-white rounded-3xl overflow-hidden shadow-card border border-slate-200 group hover:shadow-widget transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={dest.hero_image} 
                alt={dest.name}
                onError={(e) => handleImageError(e, dest.name)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                {dest.region}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="font-bold font-serif text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                {dest.name}
              </h3>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{dest.activities[0]?.name}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-900">Chi tiết PuLP</span>
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  Tối Ưu Ngân Sách <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};
