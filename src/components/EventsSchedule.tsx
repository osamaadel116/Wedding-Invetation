import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Copy, Check, ExternalLink, Map, AlertCircle } from 'lucide-react';
import { WeddingEvent, FloralTheme } from '../types';
import { WatercolorDivider, WatercolorCorner } from './WatercolorFlorals';
import { BotanicalRoseHeaderOrnament } from './BotanicalRoseDecorations';

interface EventsScheduleProps {
  events: WeddingEvent[];
  theme: FloralTheme;
}

export const EventsSchedule: React.FC<EventsScheduleProps> = ({ events, theme }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="events" className="relative py-16 px-4 sm:px-6 bg-[#FCFAF6] overflow-hidden">
      {/* Background watercolor corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 pointer-events-none"
      >
        <WatercolorCorner
          tone={theme.floralTone}
          position="bottom-left"
          className="w-36 sm:w-52 h-36 sm:h-52"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
        className="absolute bottom-0 right-0 pointer-events-none"
      >
        <WatercolorCorner
          tone={theme.floralTone}
          position="bottom-right"
          className="w-36 sm:w-52 h-36 sm:h-52"
        />
      </motion.div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Header with reveal on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#43657D] font-semibold">
            Save The Timings
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            Wedding Itinerary & Venue
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            تفاصيل الزفاف والمكان
          </h3>
          <BotanicalRoseHeaderOrnament theme={theme} className="my-2" />
          <p className="font-sans-body text-xs sm:text-sm text-[#5D6F7C] max-w-md mx-auto">
            We are honored to have you witness and share the joy of our holy union and celebration.
          </p>
        </motion.div>

        {/* Event Cards Grid */}
        <div className={`grid gap-8 items-stretch ${(events || []).length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {(events || []).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.75, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#FAF7F2] border border-[#E6DCce] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between text-left relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: theme.primaryColor }}
              />

              <div>
                {/* Event Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-sans-body uppercase tracking-wider font-semibold text-[#8C6D3B] bg-[#EFE8DD] px-3 py-1 rounded-full">
                    {event.subtitle || `Session ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#8C7A6B]">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{event.timezone}</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="font-serif-display text-2xl font-bold text-[#2E2420] mb-2">
                  {event.title}
                </h3>

                {/* Date & Time Info */}
                <div className="space-y-2 my-4 text-xs sm:text-sm text-[#5C4C41] font-sans-body">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>
                      {event.startTime} – {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#2E2420] font-serif-display text-base">
                        {event.venueName}
                      </p>
                      <p className="text-xs text-[#7A6B60] mt-0.5 leading-relaxed">
                        {event.venueAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Event Notes */}
                {event.notes && (
                  <div className="p-3 bg-[#F2EAE0] rounded-xl border border-[#E0D4C5] my-4 flex items-start gap-2 text-xs text-[#6E5E53]">
                    <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <p className="italic leading-snug">{event.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Copy Address & Google Maps */}
              <div className="pt-4 border-t border-[#EAE0D2] space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {/* Copy Address Button */}
                  <button
                    onClick={() =>
                      handleCopyAddress(event.id, `${event.venueName}, ${event.venueAddress}`)
                    }
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FCFAF6] border border-[#DFC186] text-[#73572C] hover:bg-[#F2EADB] transition-colors text-xs font-sans-body font-medium"
                  >
                    {copiedId === event.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  {/* Open in Google Maps */}
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white transition-opacity hover:opacity-90 text-xs font-sans-body font-medium shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Maps</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
