import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types';
import { WatercolorWreath, WatercolorCorner } from './WatercolorFlorals';

interface FooterSectionProps {
  config: WeddingConfig;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ config }) => {
  const activeTheme = config.themes.find((t) => t.id === config.activeThemeId) || config.themes[0];

  return (
    <footer className="relative py-16 px-4 bg-[#FAF7F2] border-t border-[#E8DECf] text-center overflow-hidden">
      <WatercolorCorner
        tone={activeTheme.floralTone}
        position="bottom-left"
        className="absolute bottom-0 left-0 w-32 h-32 opacity-70"
      />
      <WatercolorCorner
        tone={activeTheme.floralTone}
        position="bottom-right"
        className="absolute bottom-0 right-0 w-32 h-32 opacity-70"
      />

      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
        <WatercolorWreath tone={activeTheme.floralTone} className="w-56 mb-4" />

        <p className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold mb-2">
          With Love & Gratitude
        </p>

        <h3 className="font-script text-4xl sm:text-5xl text-[#2E2420] my-1">
          {config.couple.groom.shortName} <span className="font-serif-display text-2xl text-[#C5A059]">&</span> {config.couple.bride.shortName}
        </h3>

        <p className="font-sans-body text-xs sm:text-sm text-[#736357] max-w-md mt-3 leading-relaxed">
          Thank you for being part of our story and celebrating the beginning of our forever journey.
        </p>

        <div className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#DFC186] text-xs font-serif-display font-semibold text-[#8C6D3B]">
          <Heart className="w-3.5 h-3.5 text-[#C38D9E] fill-current" />
          <span>{config.couple.hashtag}</span>
        </div>

        <p className="text-[10px] text-[#A6988D] font-sans-body mt-8 tracking-wider">
          Forever & Always • {config.weddingDate.displayDate}
        </p>
      </div>
    </footer>
  );
};
