import React, { useState, useEffect } from 'react';
import { 
  Navbar, 
  HeroSection, 
  BoutiqueJourneysSection, 
  DestinationDetailSection, 
  WheelOfLifeSection, 
  ItineraryCanvas, 
  AdminLoginModal, 
  AdminDashboardModal 
} from './components';
import { DataProvider, useData } from './context/DataContext';
import { Destination, OptimizationResult, UserPreferences } from './types';
import { optimizeBudgetApi } from './services/api';
import { Compass, Heart } from 'lucide-react';

function MainContent() {
  const { destinations, theme } = useData();
  const isLight = theme === 'light';

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(destinations[0] || null);
  const [detailDestination, setDetailDestination] = useState<Destination | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Hidden Route /muriel or #muriel or Ctrl+Shift+M Key Combo listener
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/muriel') || hash === '#muriel') {
        setIsLoginOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Optimization Input State
  const [totalBudget, setTotalBudget] = useState<number>(10000000); // 10 Million VND default
  const [numDays, setNumDays] = useState<number>(3); // 3 days default
  const [preferences, setPreferences] = useState<UserPreferences>({
    stay: 1.0,
    food: 1.2,
    transport: 1.0,
    activities: 1.0
  });

  // Optimization Result State
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Trigger calculation when inputs change
  const runOptimization = async () => {
    if (!selectedDestination) return;
    setLoading(true);
    try {
      const res = await optimizeBudgetApi(
        totalBudget,
        numDays,
        selectedDestination.id,
        preferences
      );
      setResult(res);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDestination) {
      runOptimization();
    }
  }, [totalBudget, numDays, preferences, selectedDestination]);

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    // Smooth scroll to canvas section
    const canvasElement = document.getElementById('canvas');
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = (dest: Destination) => {
    setDetailDestination(dest);
    setTimeout(() => {
      const detailElement = document.getElementById('destination-detail');
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setDetailDestination(null);
    const journeysElement = document.getElementById('journeys');
    if (journeysElement) {
      journeysElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-[#d4af37] selection:text-[#0C0805] ${
      isLight ? 'bg-[#FAF7F2] text-[#231F1D]' : 'bg-[#0C0805] text-white'
    }`}>
      
      {/* 1. Header Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* 2. Hero Section (Fullscreen Edge-to-Edge) */}
        <HeroSection 
          onStartOptimize={() => handleNavigate('journeys')}
        />

        {/* 3. Destinations Collection Grid */}
        <BoutiqueJourneysSection 
          destinations={destinations}
          onSelectDestination={handleSelectDestination}
          onLearnMore={handleLearnMore}
        />

        {/* 4. Dedicated Destination Detail Section */}
        <DestinationDetailSection 
          destination={detailDestination}
          onSelectForPlanning={handleSelectDestination}
          onClose={handleCloseDetail}
        />

        {/* 5. Heritage & Cultural Experiences Interactive Slider */}
        <WheelOfLifeSection />

        {/* 6. Interactive Itinerary & Map Canvas */}
        <ItineraryCanvas 
          selectedDestination={selectedDestination || destinations[0]}
          allDestinations={destinations}
          onSelectDestination={handleSelectDestination}
          totalBudget={totalBudget}
          setTotalBudget={setTotalBudget}
          numDays={numDays}
          setNumDays={setNumDays}
          preferences={preferences}
          setPreferences={setPreferences}
          result={result}
          loading={loading}
          onRecalculate={runOptimization}
        />
      </main>

      {/* Admin Passcode Login Modal */}
      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Master Admin CMS Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 7. Clean Luxury Footer */}
      <footer className={`py-12 px-8 text-xs font-sans border-t transition-colors duration-500 ${
        isLight ? 'bg-[#F4F0E8] text-[#4A4238] border-[#E5DEC9]' : 'bg-[#060403] text-white border-amber-950/40'
      }`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-6 ${
            isLight ? 'border-[#E5DEC9]' : 'border-amber-950/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-md ${
                isLight ? 'bg-[#B8860B] text-white' : 'bg-[#d4af37] text-[#0C0805]'
              }`}>
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className={`font-extrabold text-sm font-sans tracking-widest uppercase ${
                  isLight ? 'text-[#231F1D]' : 'text-white'
                }`}>TRIPBUDGET VIETNAM</div>
                <p className={`text-[11px] ${isLight ? 'text-[#665E55]' : 'text-slate-400'}`}>Website Lập Kế Hoạch & Dự Toán Chi Phí Du Lịch Việt Nam</p>
              </div>
            </div>

            <div className={`text-[11px] ${isLight ? 'text-[#665E55]' : 'text-slate-400'}`}>
              Khám Phá Di Sản Thiên Nhiên & Văn Hóa Việt Nam
            </div>
          </div>

          <div className={`flex flex-col md:flex-row justify-between items-center text-[11px] gap-4 ${
            isLight ? 'text-[#8A8075]' : 'text-slate-500'
          }`}>
            <div>© 2026 TripBudget Vietnam. All rights reserved.</div>
            <div className="flex items-center gap-1">
              <span>Bản quyền nội dung thuộc về</span>
              <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
              <span>Du Lịch Việt Nam</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

export function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}

