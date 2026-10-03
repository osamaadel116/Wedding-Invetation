import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MailOpen, Heart, Music, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../types';
import { WatercolorCorner, WatercolorWreath } from './WatercolorFlorals';
import { BotanicalRoseFrameCorner } from './BotanicalRoseDecorations';

interface OpeningEnvelopeModalProps {
  config: WeddingConfig;
  guestName: string;
  isOpen: boolean;
  onOpenInvitation: () => void;
}

export const OpeningEnvelopeModal: React.FC<OpeningEnvelopeModalProps> = ({
  config,
  guestName,
  isOpen,
  onOpenInvitation,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const activeTheme =
    (config?.themes || []).find((t) => t.id === config?.activeThemeId) ||
    config?.themes?.[0] || {
      id: 'frostedRose',
      name: 'Frosted Rose & Gold',
      primaryColor: '#8C6D3B',
      accentColor: '#DFC186',
      badgeBg: '#F5EFE6',
      paperBg: '#FCFAF6',
      accentBorder: '#DFC186',
      floralTone: 'frostedRose' as const,
    };

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Fire delicate floral & gold confetti explosion
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: [activeTheme.primaryColor, activeTheme.accentColor, '#F7D6D0', '#DFC186', '#FFF'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      onOpenInvitation();
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2623]/80 backdrop-blur-md overflow-y-auto"
      >
        {/* The Invitation Card Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.05, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden border border-[#E6DCce] p-6 sm:p-8 text-center my-auto"
        >
          {/* Watercolor Floral Corners */}
          <WatercolorCorner
            tone={activeTheme.floralTone}
            position="top-left"
            className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none"
          />
          <WatercolorCorner
            tone={activeTheme.floralTone}
            position="top-right"
            className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none"
          />
          <WatercolorCorner
            tone={activeTheme.floralTone}
            position="bottom-left"
            className="absolute -bottom-4 -left-4 w-28 h-28 pointer-events-none"
          />
          <WatercolorCorner
            tone={activeTheme.floralTone}
            position="bottom-right"
            className="absolute -bottom-4 -right-4 w-28 h-28 pointer-events-none"
          />

          {/* Inner Golden Border Frame with Corner Roses */}
          <div className="relative z-10 border border-[#DFC186]/70 rounded-xl p-6 sm:p-7 bg-[#FCFAF6]/90 backdrop-blur-xs flex flex-col items-center ring-1 ring-[#DFC186]/30">
            {/* Corner Rose Florets */}
            <BotanicalRoseFrameCorner
              theme={activeTheme}
              variant="top-left"
              className="absolute -top-4 -left-4 w-16 h-16 z-20 pointer-events-none"
            />
            <BotanicalRoseFrameCorner
              theme={activeTheme}
              variant="top-right"
              className="absolute -top-4 -right-4 w-16 h-16 z-20 pointer-events-none"
            />

            {/* Top Eyebrow Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#C5A059]/60" />
              <span className="text-[11px] font-sans-body tracking-[0.25em] uppercase text-[#43657D] font-medium">
                The Wedding Celebration
              </span>
              <span className="h-px w-6 bg-[#C5A059]/60" />
            </div>

            {/* Couple Calligraphy Names */}
            <h1 className="font-script text-4xl sm:text-5xl text-[#3E322A] my-1 leading-tight tracking-wide">
              {config.couple.groom.shortName}{' '}
              <span className="text-[#C5A059] font-serif-display text-3xl">&</span>{' '}
              {config.couple.bride.shortName}
            </h1>

            {/* Watercolor Wreath Divider */}
            <WatercolorWreath tone={activeTheme.floralTone} className="w-48 my-1" />

            {/* Wedding Date Display */}
            <p className="font-serif-display text-sm tracking-wider text-[#736357] uppercase font-semibold mt-1">
              {config.weddingDate.displayDate}
            </p>

            {/* Guest Personalization Box */}
            <div className="w-full my-6 p-4 rounded-lg bg-[#F5EFE6]/80 border border-[#E3D7C7] text-center shadow-inner">
              {guestName && (
                <div className="font-serif-display text-xl sm:text-2xl font-semibold text-[#2E2723] break-words mb-2">
                  {guestName}
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs sm:text-[13px] text-[#5E4E44] font-serif-display italic leading-relaxed">
                  "With joyful hearts, we invite you to celebrate our wedding and share with us the beginning of our forever."
                </p>
                <p
                  dir="rtl"
                  className="text-xs sm:text-sm text-[#4A3B32] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                >
                  "بقلوبٍ يملؤها الفرح، ندعوكم لمشاركتنا الاحتفال بزفافنا وبدء أجمل فصول حياتنا معًا."
                </p>
              </div>
            </div>

            {/* Audio Note & Open Button */}
            <p className="text-[11px] text-[#9E8E81] mb-4 flex items-center justify-center gap-1.5 font-sans-body">
              <Music className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              <span>Background music will play upon opening</span>
            </p>

            {/* Luxury Open Invitation Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="group relative w-full py-3.5 px-6 rounded-full overflow-hidden shadow-lg transition-all duration-300 font-sans-body font-medium text-sm tracking-widest uppercase flex items-center justify-center gap-2.5 text-white cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${activeTheme.primaryColor} 0%, #3D2B24 100%)`,
              }}
            >
              {/* Button Sheen Effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />

              <MailOpen className="w-4 h-4 text-[#F3E5AB] transition-transform group-hover:rotate-12" />
              <span>{isOpening ? 'Opening Invitation...' : 'Open Invitation'}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" />
            </motion.button>

            {/* Couple Hashtag */}
            <div className="mt-4 flex items-center gap-1 text-[11px] text-[#A6988D] font-serif-display tracking-wider">
              <Heart className="w-3 h-3 text-[#C38D9E] fill-current" />
              <span>{config.couple.hashtag}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

