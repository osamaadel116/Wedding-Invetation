import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, ChevronDown, Heart } from 'lucide-react';
import { WeddingConfig } from '../types';
import { WatercolorCorner, WatercolorWreath, WatercolorDivider } from './WatercolorFlorals';
import { BotanicalRoseFrameCorner, BotanicalRoseArchCrown, GoldenRococoOvalFrame } from './BotanicalRoseDecorations';

interface HeroSectionProps {
  config: WeddingConfig;
  onScrollToNext?: () => void;
}

// Safe date parsing helper to prevent Invalid Time Value crashes
const getSafeDate = (isoStr?: string): Date => {
  if (!isoStr) return new Date(2026, 9, 24, 18, 30);
  const parsed = new Date(isoStr);
  if (!isNaN(parsed.getTime())) return parsed;
  const sanitized = isoStr.trim().replace(' ', 'T');
  const retry = new Date(sanitized);
  if (!isNaN(retry.getTime())) return retry;
  return new Date(2026, 9, 24, 18, 30);
};

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onScrollToNext }) => {
  const activeTheme = config.themes.find((t) => t.id === config.activeThemeId) || config.themes[0];

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const targetDateObj = getSafeDate(config.weddingDate?.targetIso);
    const targetTime = targetDateObj.getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0 || isNaN(difference)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate?.targetIso]);

  // Generate Google Calendar Link safely
  const getGoogleCalendarUrl = () => {
    const primaryEvent = config.events[0] || {
      title: `${config.couple.groom.shortName} & ${config.couple.bride.shortName}'s Wedding`,
      venueName: 'Wedding Venue',
      venueAddress: '',
    };
    const title = encodeURIComponent(`${config.couple.groom.shortName} & ${config.couple.bride.shortName}'s Wedding`);
    const details = encodeURIComponent(`We are excited to celebrate our wedding with you! ${config.couple.hashtag}`);
    const location = encodeURIComponent(`${primaryEvent.venueName}, ${primaryEvent.venueAddress}`);

    try {
      const startDate = getSafeDate(config.weddingDate?.targetIso);
      const startStr = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
      const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    } catch {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center pt-12 pb-16 px-4 text-center overflow-hidden">
      {/* Delicate Watercolor Floral Corners */}
      <WatercolorCorner
        tone={activeTheme.floralTone}
        position="top-left"
        className="absolute top-0 left-0 w-36 sm:w-56 h-36 sm:h-56"
      />
      <WatercolorCorner
        tone={activeTheme.floralTone}
        position="top-right"
        className="absolute top-0 right-0 w-36 sm:w-56 h-36 sm:h-56"
      />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center"
      >
        {/* Top Pre-title Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DFC186]/60 bg-[#FAF7F2]/90 backdrop-blur-xs shadow-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-xs font-sans-body tracking-[0.2em] uppercase text-[#736357] font-medium">
            Save The Date
          </span>
        </div>

        {/* Ornate Oval Image Frame */}
        <div className="relative my-8 group w-full flex justify-center items-center">
          <div className="relative w-64 sm:w-80 h-[22rem] sm:h-[28rem] flex items-center justify-center">
            {/* The SVG Ornate Frame */}
            <GoldenRococoOvalFrame 
              className="absolute inset-0 z-20 w-[100%] h-[100%] left-0 top-0 transition-transform duration-700 group-hover:scale-105" 
              strokeColor="#CBA153" 
            />
            
            {/* Oval Masked Image */}
            <div 
              className="relative w-[75%] h-[80%] overflow-hidden bg-[#FAF7F2] z-10 shadow-lg"
              style={{ borderRadius: '50% / 50%' }}
            >
              <img
                src={config.gallery[0]?.url || config.couple.groom.photoUrl}
                alt="The Happy Couple"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div 
                className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] pointer-events-none" 
                style={{ borderRadius: '50% / 50%' }}
              />
            </div>
          </div>

          {/* Golden Ring Frame Badge */}
          <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white border border-[#DFC186] shadow-xl flex items-center gap-2 text-xs font-serif-display tracking-widest uppercase font-semibold text-[#8C6D3B] z-30">
            <Heart className="w-3 h-3 text-[#B69A5E] fill-[#DFC186]" />
            <span>{config.couple.hashtag}</span>
          </div>
        </div>

        {/* Couple Calligraphy Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3"
        >
          <p className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#8C7A6B] mb-1">
            The Wedding Of
          </p>
          <h1 className="font-script text-5xl sm:text-7xl text-[#2E2420] my-1 leading-tight tracking-wide">
            {config.couple.groom.shortName} <span className="font-serif-display text-4xl sm:text-5xl text-[#C5A059]">&</span> {config.couple.bride.shortName}
          </h1>
          <p className="font-serif-display text-base sm:text-lg text-[#6E5D52] tracking-wide mt-1 font-medium">
            {config.weddingDate.displayDate}
          </p>
        </motion.div>

        {/* Watercolor Wreath Accent */}
        <WatercolorWreath tone={activeTheme.floralTone} className="w-56 my-2" />

        {/* Romantic Scripture / Quote */}
        {config.couple.quote && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto px-4 my-3"
          >
            {config.couple.quote.arabicText && (
              <p
                dir="rtl"
                className="font-serif-display text-lg sm:text-xl md:text-2xl text-[#2E2420] font-semibold leading-relaxed tracking-wide mb-2"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                "{config.couple.quote.arabicText}"
              </p>
            )}
            {config.couple.quote.text ? (
              <p className="font-serif-display italic text-sm sm:text-base text-[#6E5D52] leading-relaxed">
                "{config.couple.quote.text}"
              </p>
            ) : null}
            {config.couple.quote.source && (
              <span className="text-xs font-sans-body font-medium uppercase tracking-widest text-[#9E8E81] mt-1.5 block">
                — {config.couple.quote.source}
              </span>
            )}
          </motion.div>
        )}

        <WatercolorDivider tone={activeTheme.floralTone} className="my-4" />

        {/* Live Countdown Timer Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md my-2"
        >
          <p className="text-[11px] uppercase font-sans-body tracking-[0.2em] text-[#8C7A6B] mb-3 font-semibold">
            Counting Down To Our Forever
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FCFAF6] border border-[#E6DCce] rounded-xl p-2.5 sm:p-3 shadow-xs flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#DFC186] to-transparent opacity-60" />
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420]">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-sans-body uppercase tracking-wider text-[#8C7A6B] mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Add to Calendar Action Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C5A059] text-[#73572C] hover:bg-[#F2EADB] transition-colors text-xs uppercase tracking-wider font-medium shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </motion.div>

        {/* Smooth Scroll Indicator */}
        {onScrollToNext && (
          <button
            onClick={onScrollToNext}
            className="mt-8 text-[#A6988D] hover:text-[#5E4C41] transition-colors flex flex-col items-center gap-1 cursor-pointer animate-bounce"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </section>
  );
};
