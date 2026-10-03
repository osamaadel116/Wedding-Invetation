import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareHeart, Heart, Send, Sparkles, User, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { GuestWish, FloralTheme } from '../types';
import { WatercolorDivider } from './WatercolorFlorals';
import { BotanicalRoseHeaderOrnament } from './BotanicalRoseDecorations';
import { getAccessToken } from '../services/googleAuth';
import { appendWishRow } from '../services/googleSheets';
import { addWishToFirestore } from '../services/firebase';

interface GuestbookSectionProps {
  wishes: GuestWish[];
  onAddWish: (wish: Omit<GuestWish, 'id' | 'timestamp' | 'likesCount'>) => void;
  onLikeWish: (wishId: string) => void;
  theme: FloralTheme;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  wishes,
  onAddWish,
  onLikeWish,
  theme,
}) => {
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showAllWishes, setShowAllWishes] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsPosting(true);

    const wishPayload = {
      senderName: senderName.trim(),
      relationship,
      message: message.trim(),
      attendance: 'attending' as const,
    };

    // 1. If connected to Firebase, save wish directly to Firestore
    try {
      await addWishToFirestore({
        senderName: wishPayload.senderName,
        relationship: wishPayload.relationship,
        message: wishPayload.message,
      });
    } catch (firestoreErr) {
      console.warn('Firestore wish save notice:', firestoreErr);
    }

    // 2. If connected to Google Sheets, append to Wishes tab
    try {
      const accessToken = await getAccessToken();
      const sheetId = localStorage.getItem('wedding_google_sheet_id');
      if (accessToken && sheetId) {
        await appendWishRow(accessToken, sheetId, 'Wishes', wishPayload);
      }
    } catch (sheetErr) {
      console.warn('Google Sheets wish sync notice:', sheetErr);
    }

    setTimeout(() => {
      onAddWish(wishPayload);
      setMessage('');
      setIsPosting(false);
    }, 300);
  };

  const relationshipOptions = [
    'Friend',
    'Close Family',
    'Colleague',
    'University Friend',
    'High School Mate',
    'Relative',
    'Neighbor',
  ];

  const INITIAL_VISIBLE_COUNT = 3;
  const displayedWishes = showAllWishes ? wishes : (wishes || []).slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(0, (wishes?.length || 0) - INITIAL_VISIBLE_COUNT);

  return (
    <section id="wishes" className="relative py-16 px-4 sm:px-6 bg-[#FAF7F2]/80 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Header with reveal on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#43657D] font-semibold">
            Warmest Wishes
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            Wedding Guestbook & Blessings
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            دفتر الزوار والأمنيات
          </h3>
          <BotanicalRoseHeaderOrnament theme={theme} className="my-2" />
          <p className="font-sans-body text-xs sm:text-sm text-[#5D6F7C] max-w-md mx-auto italic">
            "Your presence and prayers are the greatest gift to our new journey."
          </p>
        </motion.div>

        {/* Input Form Card with reveal on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FCFAF6] border border-[#DFC186]/60 rounded-3xl p-6 sm:p-8 shadow-md text-left mb-10 max-w-2xl mx-auto"
        >
          <h3 className="font-serif-display text-lg font-bold text-[#2E2420] mb-4 flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-[#C5A059]" />
            <span>Send a Wedding Blessing</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-serif-display font-semibold uppercase tracking-wider text-[#3D2B24] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Williams"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD0C0] text-sm text-[#2E2420] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-serif-display font-semibold uppercase tracking-wider text-[#3D2B24] mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD0C0] text-sm text-[#2E2420] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  {relationshipOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-serif-display font-semibold uppercase tracking-wider text-[#3D2B24] mb-1">
                Your Prayers & Warm Wishes
              </label>
              <textarea
                required
                rows={3}
                placeholder="Wishing you a lifetime of endless love, laughter, and happiness together..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD0C0] text-sm text-[#2E2420] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              disabled={isPosting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-white font-sans-body font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-95"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPosting ? 'Posting Blessing...' : 'Post Blessing'}</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes List (Scrollable Board) with reveal on scroll and subtle fade effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {(displayedWishes || []).map((wish, index) => {
                const isThirdCollapsedItem = !showAllWishes && index === INITIAL_VISIBLE_COUNT - 1 && (wishes?.length || 0) > INITIAL_VISIBLE_COUNT;
                return (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: isThirdCollapsedItem ? 0.75 : 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`bg-[#FCFAF6] border border-[#E6DCce] rounded-2xl p-4 sm:p-5 shadow-xs text-left flex flex-col sm:flex-row items-start justify-between gap-3 hover:border-[#D4C3B2] transition-all ${
                      isThirdCollapsedItem ? 'mask-gradient-bottom border-b-transparent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar Initials Circle */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-serif-display font-bold text-white shrink-0 shadow-xs text-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {wish.senderName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif-display font-bold text-base text-[#2E2420]">
                            {wish.senderName}
                          </span>
                          <span className="text-[10px] font-sans-body px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8C6D3B] border border-[#E3D7C7]">
                            {wish.relationship}
                          </span>
                          <span className="text-[11px] text-[#A6988D] font-sans-body">
                            {wish.timestamp}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-sans-body text-[#5E4E44] mt-2 leading-relaxed whitespace-pre-wrap">
                          {wish.message}
                        </p>
                      </div>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => onLikeWish(wish.id)}
                      className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DECf] text-xs text-[#8C7A6B] hover:text-[#C38D9E] transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#C38D9E] fill-current" />
                      <span>{wish.likesCount}</span>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Elegant Gradient Fade Overlay when collapsed */}
          {!showAllWishes && wishes && wishes.length > INITIAL_VISIBLE_COUNT && (
            <div className="pointer-events-none absolute bottom-12 inset-x-0 h-28 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-10" />
          )}

          {/* View More / Show Less Toggle Button */}
          {wishes && wishes.length > INITIAL_VISIBLE_COUNT && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex justify-center ${!showAllWishes ? 'relative z-20 -mt-5' : 'pt-4'}`}
            >
              <button
                type="button"
                onClick={() => setShowAllWishes((prev) => !prev)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white border border-[#DFC186] text-[#3D2B24] text-xs font-serif-display font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer group backdrop-blur-xs"
              >
                <span>
                  {showAllWishes
                    ? 'Show Less'
                    : `View More Wishes (${remainingCount} more)`}
                </span>
                {showAllWishes ? (
                  <ChevronUp className="w-4 h-4 text-[#C5A059] group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#C5A059] group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
