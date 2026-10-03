import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { StoryTimelineItem, FloralTheme } from '../types';
import { WatercolorDivider } from './WatercolorFlorals';

interface LoveStoryTimelineProps {
  timeline: StoryTimelineItem[];
  theme: FloralTheme;
}

export const LoveStoryTimeline: React.FC<LoveStoryTimelineProps> = ({ timeline, theme }) => {
  return (
    <section id="story" className="relative py-16 px-4 sm:px-6 bg-[#FAF7F2]/80 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
            Our Journey Together
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            How Forever Began
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            كيف بدأ الأبد
          </h3>
          <p className="font-sans-body text-xs sm:text-sm text-[#736357] max-w-md mx-auto mt-2 italic">
            "Every love story is beautiful, but ours is our favorite."
          </p>
          <WatercolorDivider tone={theme.floralTone} className="my-4" />
        </div>

        {/* Timeline Path & Items */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#DFC186] via-[#E8B4B8] to-[#DFC186] -translate-x-1/2 hidden sm:block opacity-60" />

          {/* Mobile Left Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#DFC186] to-[#E8B4B8] sm:hidden opacity-60" />

          <div className="space-y-8 sm:space-y-12">
            {(timeline || []).map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAF7F2] border-2 border-[#DFC186] shadow-md flex items-center justify-center z-20 text-[#C5A059]">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>

                  {/* Content Card (Left or Right on desktop, indented on mobile) */}
                  <div className="ml-14 sm:ml-0 w-full sm:w-[45%] text-left">
                    <div className="bg-[#FCFAF6] border border-[#E6DCce] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      
                      {/* Milestone Year Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] border border-[#DFC186]/50 text-xs font-serif-display font-bold text-[#8C6D3B] mb-3">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span>{item.year}</span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="font-serif-display text-xl font-bold text-[#2E2420] mb-2">
                        {item.title}
                      </h3>

                      {/* Optional Photo */}
                      {item.imageUrl && (
                        <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3 border border-[#E8DFC8]">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Milestone Description */}
                      <p className="font-sans-body text-xs sm:text-sm text-[#6E5E53] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
