import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';
import { useData } from '../../context/DataContext';

interface HeroSectionProps {
  onStartOptimize: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartOptimize }) => {
  const { heroConfig, theme } = useData();
  const isLight = theme === 'light';

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-between pt-32 bg-[#0C0805] text-white overflow-hidden font-sans">
      
      {/* High-Definition Fullscreen Background Scenery with Silky Smooth Reveal */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.15, filter: 'brightness(0.7)' }}
        animate={{ opacity: 1, scale: 1.05, filter: 'brightness(1)' }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <SafeImage 
          src={heroConfig.backgroundImage} 
          alt={heroConfig.titleLine1}
          fallbackTitle="Việt Nam - Di Sản Thiên Nhiên"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Dark Vignette Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-b from-[#0C0805]/60 via-[#0C0805]/30 to-[#0C0805]/80" 
        />
      </motion.div>

      {/* Main Content Container with Staggered Silk Entrance */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full my-auto text-center flex flex-col items-center space-y-6">
        
        <div className="space-y-6 max-w-3xl">
          {/* Sub-badge: Uppercase with extra letter spacing tracking-[0.2em] */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37] font-sans drop-shadow-md"
          >
            {heroConfig.badge}
          </motion.div>

          {/* Primary Headline: Cormorant Garamond font-serif with italic emphasis */}
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold font-serif tracking-tight text-white leading-[1.08] drop-shadow-lg"
          >
            {heroConfig.titleLine1} <br />
            <span className="font-serif italic font-normal text-slate-100">{heroConfig.titleLine2}</span>{' '}
            <span className="font-serif text-[#d4af37]">{heroConfig.titleHighlight}</span>
          </motion.h1>

          {/* CTA Play Button: Smooth Fade-In effect appearing AFTER headline (delay: 1.8s) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.8, ease: 'easeInOut' }}
            className="pt-4 flex items-center justify-center"
          >
            <button
              onClick={onStartOptimize}
              className="group bg-[#0C0805]/80 hover:bg-[#d4af37] hover:text-[#0C0805] backdrop-blur-md text-white border border-[#d4af37]/70 font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all flex items-center gap-3 shadow-2xl cursor-pointer font-sans"
            >
              <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0C0805] flex items-center justify-center group-hover:bg-[#0C0805] group-hover:text-[#d4af37] transition-colors">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>{heroConfig.ctaButtonText}</span>
            </button>
          </motion.div>
        </div>

      </div>

      {/* Smooth Transition Gradient into Next Section */}
      <div className={`relative z-10 w-full h-24 bg-gradient-to-b from-transparent ${
        isLight ? 'to-[#FAF7F2]' : 'to-[#0C0805]'
      } pointer-events-none transition-colors duration-500`} />

    </section>
  );
};
