import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, Hotel, Utensils, Ticket, X } from 'lucide-react';
import { Destination, OptimizationResult, UserPreferences } from '../../types';
import { MapboxMap } from '../common/MapboxMap';
import { BudgetOptimizerControls } from './BudgetOptimizerControls';
import { InfographicExporter } from '../common/InfographicExporter';
import { useData } from '../../context/DataContext';

interface ItineraryCanvasProps {
  selectedDestination: Destination;
  allDestinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  totalBudget: number;
  setTotalBudget: (val: number) => void;
  numDays: number;
  setNumDays: (val: number) => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  result: OptimizationResult | null;
  loading: boolean;
  onRecalculate: () => void;
}

export const ItineraryCanvas: React.FC<ItineraryCanvasProps> = ({
  selectedDestination,
  allDestinations,
  onSelectDestination,
  totalBudget,
  setTotalBudget,
  numDays,
  setNumDays,
  preferences,
  setPreferences,
  result,
  loading,
  onRecalculate
}) => {
  const { theme } = useData();
  const isLight = theme === 'light';
  const [showItineraryModal, setShowItineraryModal] = useState<boolean>(false);

  return (
    <motion.section 
      id="canvas"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className={`py-24 px-8 max-w-7xl mx-auto space-y-12 font-sans transition-colors duration-500 ${
        isLight ? 'bg-[#FAF7F2] text-[#231F1D]' : 'bg-[#0C0805] text-white'
      }`}
    >
      
      {/* Section Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 ${
        isLight ? 'border-[#E5DEC9]' : 'border-amber-950/40'
      }`}>
        <div className="space-y-3 max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold font-sans ${
            isLight 
              ? 'bg-white border-[#D4C5A9] text-[#B8860B]' 
              : 'bg-[#14100c] border-[#d4af37]/40 text-[#d4af37]'
          }`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>Lập Lịch Trình & Dự Toán Chi Phí</span>
          </div>

          <h2 className={`text-3xl sm:text-5xl font-extrabold font-serif tracking-tight ${
            isLight ? 'text-[#231F1D]' : 'text-white'
          }`}>
            Lịch Trình Chi Tiết: <span className={isLight ? 'text-[#B8860B]' : 'text-[#d4af37]'}>{selectedDestination.name.split('-')[0].trim()}</span>
          </h2>

          <p className={`text-sm sm:text-base font-sans leading-relaxed ${
            isLight ? 'text-[#665E55]' : 'text-slate-400'
          }`}>
            Điều chỉnh tổng chi phí và thời gian đi để tạo lịch trình du lịch cá nhân hóa và cập nhật vị trí trên bản đồ.
          </p>
        </div>
      </div>

      {/* Static Split View Layout (ZERO STICKY JITTER - Fixed static grid columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Map (STATIC, NO STICKY SHIFTING) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] flex items-center gap-2 font-sans">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              Bản Đồ Điểm Đến Du Lịch
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-[#14100c] px-3 py-1 rounded-full border border-amber-950/50">
              Bản Đồ Tương Tác
            </span>
          </div>

          <MapboxMap 
            selectedDestination={selectedDestination}
            allDestinations={allDestinations}
            onSelectDestination={onSelectDestination}
          />
        </div>

        {/* Right Column: Optimizer Controls (STATIC, NO STICKY SHIFTING) */}
        <div className="lg:col-span-6 space-y-6">
          <BudgetOptimizerControls 
            totalBudget={totalBudget}
            setTotalBudget={setTotalBudget}
            numDays={numDays}
            setNumDays={setNumDays}
            preferences={preferences}
            setPreferences={setPreferences}
            result={result}
            loading={loading}
            onRecalculate={onRecalculate}
            onViewItineraryCard={() => setShowItineraryModal(true)}
          />
        </div>

      </div>

      {/* POPUP MODAL ITINERARY CARD OVERLAY - Z-INDEX 99999 TO GUARANTEE OVERLAPPING ON TOP OF LEAFLET MAP */}
      <AnimatePresence>
        {showItineraryModal && result && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowItineraryModal(false)}
              className="fixed inset-0 bg-[#0C0805]/95 backdrop-blur-md z-[99998]"
            />

            {/* Modal Card Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#14100c] border-2 border-[#d4af37]/50 rounded-3xl overflow-hidden shadow-2xl z-[99999] my-auto text-white font-sans max-h-[90vh] flex flex-col"
            >
              
              {/* Modal Top Header Row: PDF EXPORT BUTTON AT TOP LEFT + CLOSE BUTTON AT TOP RIGHT */}
              <div className="p-6 bg-[#0C0805] border-b border-amber-950/60 flex items-center justify-between gap-4 shrink-0">
                
                {/* TOP LEFT CORNER: PDF Exporter Button */}
                <div>
                  <InfographicExporter result={result} timelineElementId="optimized-timeline-printable" />
                </div>

                {/* TOP RIGHT CORNER: Close Button */}
                <button
                  onClick={() => setShowItineraryModal(false)}
                  className="w-10 h-10 rounded-full bg-[#14100c] hover:bg-[#d4af37] hover:text-[#0C0805] text-white flex items-center justify-center border border-amber-950/60 transition-all cursor-pointer shadow-lg shrink-0"
                  title="Đóng lịch trình"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* Scrollable Timeline Content */}
              <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1 bg-[#14100c]" id="optimized-timeline-printable">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-950/40 pb-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-[#d4af37]" />
                      Lịch Trình Chi Tiết Từng Ngày ({result.params.num_days} Ngày)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-sans">
                      Dự toán phân bổ chi phí lưu trú, ăn uống, di chuyển và các điểm tham quan tại {selectedDestination.name.split('-')[0].trim()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold font-sans bg-[#0C0805] p-3 rounded-2xl border border-amber-950/50">
                    <div className="text-sky-400">Lưu trú: {result.summary.allocations.stay.daily.toLocaleString('vi-VN')}đ/ngày</div>
                    <div className="text-[#d4af37]">Ẩm thực: {result.summary.allocations.food.daily.toLocaleString('vi-VN')}đ/ngày</div>
                    <div className="text-emerald-400">Tham quan: {result.summary.allocations.activities.daily.toLocaleString('vi-VN')}đ/ngày</div>
                  </div>
                </div>

                {/* Daily Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.daily_itinerary.map((day, idx) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-[#0C0805] rounded-3xl p-6 border border-amber-950/50 shadow-xl space-y-5"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-amber-950/40 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#d4af37] text-[#0C0805] font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/20 font-sans">
                            N{day.day}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white font-serif">{day.title}</h4>
                            <span className="text-[11px] text-[#d4af37] font-bold font-sans">{selectedDestination.name.split('-')[0].trim()}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-sans">Chi phí/ngày</span>
                          <span className="font-extrabold text-white text-sm font-sans">
                            {day.daily_total.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      {/* Day Category Allocations */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-sans">
                        <div className="bg-[#14100c] p-2 rounded-xl border border-sky-900/30">
                          <span className="text-slate-500 block text-[10px]">Lưu Trú</span>
                          <span className="font-bold text-sky-400">{day.stay_cost.toLocaleString('vi-VN')}đ</span>
                        </div>

                        <div className="bg-[#14100c] p-2 rounded-xl border border-amber-900/30">
                          <span className="text-slate-500 block text-[10px]">Ẩm Thực</span>
                          <span className="font-bold text-[#d4af37]">{day.food_cost.toLocaleString('vi-VN')}đ</span>
                        </div>

                        <div className="bg-[#14100c] p-2 rounded-xl border border-purple-900/30">
                          <span className="text-slate-500 block text-[10px]">Di Chuyển</span>
                          <span className="font-bold text-purple-400">{day.transport_cost.toLocaleString('vi-VN')}đ</span>
                        </div>

                        <div className="bg-[#14100c] p-2 rounded-xl border border-emerald-900/30">
                          <span className="text-slate-500 block text-[10px]">Tham Quan</span>
                          <span className="font-bold text-emerald-400">{day.activities_cost.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>

                      {/* Suggested Activities */}
                      <div className="space-y-2.5 pt-1 font-sans">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Hoạt Động Trọng Tâm:</span>
                        {day.suggested_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-[#14100c] p-3 rounded-xl border border-amber-950/40 text-xs">
                            <div className="flex items-center gap-2.5">
                              <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                              <div>
                                <span className="font-bold text-white block">{item.name}</span>
                                <span className="text-[10px] text-slate-500">Thời gian ~ {item.duration_hrs}h</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-[#d4af37]">
                                {item.cost === 0 ? 'Miễn Phí' : `${item.cost.toLocaleString('vi-VN')} đ`}
                              </span>
                              <span className="text-[10px] text-amber-400 block font-bold">★ {item.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </motion.div>
                  ))}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.section>
  );
};
