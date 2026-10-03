import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DressCode, FloralTheme } from '../types';
import { WatercolorDivider } from './WatercolorFlorals';
import { BotanicalRoseHeaderOrnament } from './BotanicalRoseDecorations';

interface DressCodeSectionProps {
  dressCode: DressCode;
  theme: FloralTheme;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ dressCode, theme }) => {
  return (
    <section id="dresscode" className="relative py-16 px-4 sm:px-6 bg-[#FCFAF6] overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#43657D] font-semibold">
            Wedding Attire
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            Dress Code & Palette
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            قواعد اللباس والألوان
          </h3>
          <BotanicalRoseHeaderOrnament theme={theme} className="my-2" />
          <p className="font-sans-body text-xs sm:text-sm text-[#5D6F7C] max-w-md mx-auto">
            {dressCode.description}
          </p>
        </div>

        {/* Color Palette Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FAF7F2] border border-[#E6DCce] rounded-3xl p-6 sm:p-8 shadow-sm my-6"
        >
          <p className="text-xs font-serif-display font-semibold uppercase tracking-wider text-[#8C6D3B] mb-5">
            Recommended Attire Palette
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {(dressCode?.colorPalette || []).map((color, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md border-2 border-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-serif-display font-semibold text-[#2E2420] mt-2">
                  {color.name}
                </span>
                <span className="text-[10px] font-sans-body text-[#8C7A6B] uppercase">
                  {color.hex}
                </span>
              </div>
            ))}
          </div>

          {/* Guidelines Checklist */}
          {dressCode?.guidelines && dressCode.guidelines.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#E8DECf] text-left max-w-md mx-auto space-y-2.5">
              {(dressCode.guidelines || []).map((guide, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#63554B]">
                  {guide.toLowerCase().includes('refrain') || guide.toLowerCase().includes('avoid') ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  )}
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
