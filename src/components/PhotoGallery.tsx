import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Heart } from 'lucide-react';
import { GalleryPhoto, FloralTheme } from '../types';
import { WatercolorDivider, WatercolorCorner } from './WatercolorFlorals';
import { BotanicalRoseHeaderOrnament, BotanicalRoseFrameCorner, OrnateMiniRoseCorner } from './BotanicalRoseDecorations';

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  theme: FloralTheme;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, theme }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section id="gallery" className="relative py-16 px-4 sm:px-6 bg-[#FAF7F2]/90 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Section Header with reveal on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#43657D] font-semibold">
            Captured Moments
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            Our Gallery & Memories
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            معرض الصور والذكريات
          </h3>
          <BotanicalRoseHeaderOrnament theme={theme} className="my-2" />
          <p className="font-sans-body text-xs sm:text-sm text-[#5D6F7C] max-w-md mx-auto italic">
            "A photograph is the pause button of life, capturing fleeting moments of love forever."
          </p>
        </motion.div>

        {/* Gallery Grid with Ornate Picture Frames */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {(photos || []).map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              initial={{ opacity: 0, y: 35, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: (idx % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleOpenLightbox(idx)}
              className={`relative bg-white p-2 sm:p-2.5 rounded-sm shadow-[0_8px_20px_rgba(140,109,59,0.1)] hover:shadow-[0_15px_30px_rgba(140,109,59,0.15)] ring-1 ring-[#DFC186]/20 transition-all duration-500 group cursor-pointer hover:-translate-y-1 z-10 hover:z-20 ${
                photo.featured ? 'col-span-2 row-span-2 aspect-4/3' : 'aspect-square'
              }`}
            >
              {/* Inner Picture Matting and Canvas */}
              <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#FAF7F2]">
                <img
                  src={photo.url}
                  alt={photo.caption || `Wedding Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Subtle Inner Gilded Edge Trim */}
                <div className="absolute inset-1 sm:inset-1.5 border border-[#DFC186]/40 pointer-events-none mix-blend-overlay" />
                
                {/* Inner Shadow for Matting effect */}
                <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.06)] pointer-events-none" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#2C3E50]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-[10px] uppercase tracking-wider text-[#DFC186] border border-[#DFC186]/50">
                      <Sparkles className="w-3 h-3 text-[#DFC186]" />
                      <span>View</span>
                    </span>
                    <span className="p-2 rounded-full bg-black/50 backdrop-blur-xs text-[#DFC186] border border-[#DFC186]/40">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  {photo.caption && (
                    <div className="bg-black/40 backdrop-blur-xs p-2.5 rounded-lg border border-white/20">
                      <p className="text-xs sm:text-sm font-serif-display italic line-clamp-2 drop-shadow-sm text-white">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with Luxury Rose Frame Corners */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image Card with Museum Frame */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center relative"
            >
              <div className="relative p-3 sm:p-4 rounded-sm bg-white shadow-2xl ring-1 ring-white/20">
                {/* Thin Inner Matting Line */}
                <div className="absolute inset-1.5 sm:inset-2 border border-[#DFC186]/50 pointer-events-none" />
                
                <img
                  src={photos[selectedPhotoIndex]?.url}
                  alt="Enlarged gallery view"
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-auto object-contain shadow-inner relative z-10"
                />
              </div>

              {photos[selectedPhotoIndex]?.caption && (
                <p className="text-white text-sm sm:text-base font-serif-display italic mt-3 text-center px-4">
                  {photos[selectedPhotoIndex]?.caption}
                </p>
              )}
              <span className="text-white/60 text-xs mt-1 font-sans-body">
                {selectedPhotoIndex + 1} of {photos.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
