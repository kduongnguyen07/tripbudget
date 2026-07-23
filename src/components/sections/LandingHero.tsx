import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Destination, UserPreferences } from '../../types';

interface LandingHeroProps {
  destinations: Destination[];
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  totalBudget: number;
  setTotalBudget: (val: number) => void;
  numDays: number;
  setNumDays: (val: number) => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onSearchOptimize: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  totalBudget,
  setTotalBudget,
  numDays,
  setNumDays,
  preferences,
  setPreferences,
  onSearchOptimize
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between pt-36 pb-20 px-8 bg-slate-900 text-white overflow-hidden">
      
      {/* High-res Panoramic Mountain Background Image with Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1570784291136-121f0611fa67?auto=format&fit=crop&w=2000&q=85" 
          alt="Vietnam Mountains"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Soft Blue/Teal Gradient Fog Overlay matching Screenshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950/90" />
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        
        {/* Left Side Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="text-2xl sm:text-3xl font-light text-slate-200 tracking-wide font-sans">
            Explore the Beauty of
          </div>

          <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tight font-serif leading-[1.05]">
            Vietnam
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
            The breathtaking limestone karsts of Ha Long, terraced valleys of Sa Pa, and ancient streets of Hoi An are waiting for you. Optimize your dream trip based on your personal budget with our PuLP AI algorithm.
          </p>
        </motion.div>

        {/* Right Side Vertical Scroll Down Indicator */}
        <div className="hidden lg:flex lg:col-span-4 justify-end items-center">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-300 transform rotate-90 origin-right">
            <span>Scroll down</span>
            <div className="w-12 h-px bg-slate-400" />
          </div>
        </div>

      </div>

      {/* Bottom Counter Indicator (01 / 05) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-12 pb-16 text-slate-300 font-sans">
        <div className="flex items-center gap-3 font-semibold text-sm">
          <span className="text-2xl font-bold text-white">01</span>
          <span className="text-slate-400">/ 05</span>
          <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden ml-2">
            <div className="w-1/3 h-full bg-orange-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* FLOATING INTERACTIVE SEARCH & OPTIMIZER WIDGET (Overlapping bottom of hero) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 max-w-6xl mx-auto w-full -mb-36 px-4"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-widget border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-slate-800">
          
          {/* Field 1: Destination Selector */}
          <div className="md:col-span-3 space-y-1 border-r border-slate-100 pr-4">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Destination</span>
            </label>
            <select
              value={selectedDestination.id}
              onChange={(e) => {
                const found = destinations.find(d => d.id === e.target.value);
                if (found) onSelectDestination(found);
              }}
              className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer py-1"
            >
              {destinations.map(d => (
                <option key={d.id} value={d.id} className="text-slate-900 font-medium">
                  {d.name.split('-')[0].trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Field 2: Total Budget */}
          <div className="md:col-span-3 space-y-1 border-r border-slate-100 pr-4">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-orange-500" />
              <span>Total Budget (VNĐ)</span>
            </label>
            <select
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer py-1"
            >
              <option value={5000000}>5.000.000 VNĐ (Tiết Kiệm)</option>
              <option value={10000000}>10.000.000 VNĐ (Tiêu Chuẩn)</option>
              <option value={18000000}>18.000.000 VNĐ (Nghỉ Dưỡng)</option>
              <option value={30000000}>30.000.000 VNĐ (Luxury)</option>
            </select>
          </div>

          {/* Field 3: Duration Days */}
          <div className="md:col-span-2 space-y-1 border-r border-slate-100 pr-4">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>Duration</span>
            </label>
            <select
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
              className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer py-1"
            >
              <option value={2}>02 Days</option>
              <option value={3}>03 Days</option>
              <option value={5}>05 Days</option>
              <option value={7}>07 Days</option>
            </select>
          </div>

          {/* Field 4: Travel Style */}
          <div className="md:col-span-2 space-y-1 pr-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              <span>Travel Style</span>
            </label>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'foodie') setPreferences({ stay: 1.0, food: 2.2, transport: 1.0, activities: 1.2 });
                else if (val === 'luxury') setPreferences({ stay: 2.5, food: 1.5, transport: 1.5, activities: 1.2 });
                else if (val === 'budget') setPreferences({ stay: 0.7, food: 1.0, transport: 0.8, activities: 1.8 });
                else setPreferences({ stay: 1.0, food: 1.0, transport: 1.0, activities: 1.0 });
              }}
              className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer py-1"
            >
              <option value="balanced">Balanced</option>
              <option value="foodie">Foodie (Ẩm Thực)</option>
              <option value="luxury">Luxury Stay</option>
              <option value="budget">Backpacker</option>
            </select>
          </div>

          {/* Field 5: ORANGE SQUARE CTA SEARCH BUTTON */}
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={onSearchOptimize}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all group"
              title="Optimize Trip Budget"
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </motion.div>

    </section>
  );
};
