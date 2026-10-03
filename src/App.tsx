/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { weddingConfig as initialWeddingConfig } from './weddingConfig';
import { WeddingConfig, GuestWish } from './types';
import { OpeningEnvelopeModal } from './components/OpeningEnvelopeModal';
import { MusicPlayer } from './components/MusicPlayer';
import { HeroSection } from './components/HeroSection';
import { CoupleSection } from './components/CoupleSection';
import { EventsSchedule } from './components/EventsSchedule';
import { GuestbookSection } from './components/GuestbookSection';
import { FooterSection } from './components/FooterSection';
import { LiveConfigEditorModal } from './components/LiveConfigEditorModal';
import { GoogleSheetsManager } from './components/GoogleSheetsManager';
import { FallingPetals } from './components/WatercolorFlorals';
import { SlidersHorizontal, FileSpreadsheet } from 'lucide-react';
import {
  subscribeToWishes,
  likeWishInFirestore,
  saveWeddingConfigToFirestore,
} from './services/firebase';

const INITIAL_WISHES: GuestWish[] = [];

const SECTIONS_ORDER = [
  { id: 'hero', label: 'Cover' },
  { id: 'couple', label: 'Couple' },
  { id: 'events', label: 'Events' },
  { id: 'wishes', label: 'Guestbook' },
];

export default function App() {
  // Configuration state with safe fallback
  const [config, setConfig] = useState<WeddingConfig>(() => {
    const saved = localStorage.getItem('wedding_custom_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialWeddingConfig,
          ...parsed,
          couple: {
            ...initialWeddingConfig.couple,
            ...(parsed.couple || {}),
            groom: {
              ...initialWeddingConfig.couple.groom,
              ...(parsed.couple?.groom || {}),
              photoUrl:
                parsed.couple?.groom?.photoUrl &&
                !parsed.couple.groom.photoUrl.includes('photo-1507003211169') &&
                !parsed.couple.groom.photoUrl.includes('photo-1506794778202')
                  ? parsed.couple.groom.photoUrl
                  : initialWeddingConfig.couple.groom.photoUrl,
            },
            bride: { ...initialWeddingConfig.couple.bride, ...(parsed.couple?.bride || {}) },
            quote:
              parsed.couple?.quote?.source === 'Colossians 3:14' || !parsed.couple?.quote?.arabicText || parsed.couple?.quote?.text?.includes('tranquility in them')
                ? initialWeddingConfig.couple.quote
                : { ...initialWeddingConfig.couple.quote, ...(parsed.couple?.quote || {}) },
          },
          weddingDate: {
            ...initialWeddingConfig.weddingDate,
            targetIso: '2026-11-20T18:30:00',
            displayDate: 'Friday, 20 November 2026',
            dayOfWeek: 'Friday',
          },
          events:
            Array.isArray(parsed.events) && parsed.events.length > 0
              ? parsed.events.map((ev: any) => ({
                  ...ev,
                  date: 'Friday, 20 November 2026',
                  dateIso: '2026-11-20T18:30:00',
                  venueName:
                    !ev.venueName || ev.venueName.includes('Glasshouse') || ev.venueName.includes('Ayana')
                      ? initialWeddingConfig.events[0]?.venueName
                      : ev.venueName,
                  venueAddress:
                    !ev.venueAddress || ev.venueAddress.includes('Glasshouse') || ev.venueAddress.includes('Ayana')
                      ? initialWeddingConfig.events[0]?.venueAddress
                      : ev.venueAddress,
                  mapUrl: initialWeddingConfig.events[0]?.mapUrl,
                  timezone: initialWeddingConfig.events[0]?.timezone,
                }))
              : initialWeddingConfig.events,
          themes: Array.isArray(parsed.themes) && parsed.themes.length > 0 ? parsed.themes : initialWeddingConfig.themes,
          gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0
            ? parsed.gallery.map((g: any, i: number) =>
                i === 0 && (g.url?.includes('photo-1519741497674') || g.url?.includes('hero.jpg'))
                  ? { ...g, url: initialWeddingConfig.gallery[0]?.url }
                  : g
              )
            : initialWeddingConfig.gallery,
          musicTracks:
            Array.isArray(parsed.musicTracks) && parsed.musicTracks.length > 0
              ? parsed.musicTracks.filter((t: any) => t.title?.includes('Canon in D') || t.id === 'canon-piano').length > 0
                ? parsed.musicTracks.filter((t: any) => t.title?.includes('Canon in D') || t.id === 'canon-piano')
                : initialWeddingConfig.musicTracks
              : initialWeddingConfig.musicTracks,
          timeline: Array.isArray(parsed.timeline) && parsed.timeline.length > 0 ? parsed.timeline : initialWeddingConfig.timeline,
          giftAccounts: Array.isArray(parsed.giftAccounts) && parsed.giftAccounts.length > 0 ? parsed.giftAccounts : initialWeddingConfig.giftAccounts,
          giftRegistries: Array.isArray(parsed.giftRegistries) && parsed.giftRegistries.length > 0 ? parsed.giftRegistries : initialWeddingConfig.giftRegistries,
          dressCode: {
            ...initialWeddingConfig.dressCode,
            ...(parsed.dressCode || {}),
            colorPalette: Array.isArray(parsed.dressCode?.colorPalette) ? parsed.dressCode.colorPalette : initialWeddingConfig.dressCode.colorPalette,
            guidelines: Array.isArray(parsed.dressCode?.guidelines) ? parsed.dressCode.guidelines : initialWeddingConfig.dressCode.guidelines,
          },
          rsvpConfig: {
            ...initialWeddingConfig.rsvpConfig,
            ...(parsed.rsvpConfig || {}),
            dietaryOptions: Array.isArray(parsed.rsvpConfig?.dietaryOptions) ? parsed.rsvpConfig.dietaryOptions : initialWeddingConfig.rsvpConfig.dietaryOptions,
          },
        };
      } catch {
        return initialWeddingConfig;
      }
    }
    return initialWeddingConfig;
  });

  // Guest name extracted from URL query ?to=Name
  const [guestName, setGuestName] = useState('Distinguished Guest');

  // Invitation open gate state
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

  // Audio player state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(config.defaultTrackIndex || 0);

  // Active section for navigation and story progress tracking
  const [activeSection, setActiveSection] = useState('hero');

  // Canva Video-Style Auto-Play Mode


  // Interactive Guestbook wishes & RSVPs
  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    const saved = localStorage.getItem('wedding_guest_wishes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WISHES;
      }
    }
    return INITIAL_WISHES;
  });

  // Modal customizer state (hidden by default)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [showFallingPetals, setShowFallingPetals] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);

  // Parse URL query parameter for personalized greeting and admin/edit visibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('guest') || params.get('name');
      if (toParam) {
        setGuestName(decodeURIComponent(toParam));
      }
      if (params.get('edit') === 'true' || params.get('admin') === 'true') {
        setShowEditButton(true);
      }
      if (params.get('sheets') === 'true') {
        setIsGoogleSheetsOpen(true);
      }
    }
  }, []);

  // Guarantee Friday 20 November 2026 across active session and local storage
  useEffect(() => {
    setConfig((prev) => {
      const isDateOutdated =
        prev.weddingDate?.displayDate !== 'Friday, 20 November 2026' ||
        prev.events?.[0]?.date !== 'Friday, 20 November 2026';
      if (!isDateOutdated) return prev;

      const updated = {
        ...prev,
        weddingDate: {
          ...prev.weddingDate,
          targetIso: '2026-11-20T18:30:00',
          displayDate: 'Friday, 20 November 2026',
          dayOfWeek: 'Friday',
        },
        events: (prev.events || []).map((ev) => ({
          ...ev,
          date: 'Friday, 20 November 2026',
          dateIso: '2026-11-20T18:30:00',
        })),
      };
      try {
        localStorage.setItem('wedding_custom_config_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Save wishes to localStorage
  useEffect(() => {
    localStorage.setItem('wedding_guest_wishes_v2', JSON.stringify(wishes));
  }, [wishes]);

  // Subscribe to real-time Guestbook Wishes from Firebase Firestore
  useEffect(() => {
    try {
      const unsubscribe = subscribeToWishes((remoteWishes) => {
        if (remoteWishes && remoteWishes.length > 0) {
          setWishes(remoteWishes);
        }
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (err) {
      console.warn('Wishes subscription note:', err);
    }
  }, []);

  // Automatically sync local browser customization to codebase so production gets it
  useEffect(() => {
    const saved = localStorage.getItem('wedding_custom_config');
    if (saved) {
      try {
        fetch('/api/save-wedding-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: saved,
        }).catch(() => {});
      } catch {}
    }
  }, []);

  // Track active section via IntersectionObserver for Canva story progress bar
  useEffect(() => {
    if (!isInvitationOpen) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS_ORDER.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isInvitationOpen, config]);

  // Save config changes
  const handleUpdateConfig = (newConfig: WeddingConfig) => {
    setConfig(newConfig);
    localStorage.setItem('wedding_custom_config', JSON.stringify(newConfig));
    fetch('/api/save-wedding-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    }).catch(() => {});

    // Save live configuration to Firestore
    saveWeddingConfigToFirestore({
      brideName: newConfig.couple.bride.name,
      groomName: newConfig.couple.groom.name,
      weddingDate: newConfig.weddingDate.displayDate,
      floralTheme: newConfig.activeThemeId,
      venueName: newConfig.events[0]?.venueName,
      venueAddress: newConfig.events[0]?.venueAddress,
    }).catch(() => {});

    if (newConfig.musicTracks && newConfig.musicTracks.length > 0) {
      if (newConfig.defaultTrackIndex !== undefined && newConfig.defaultTrackIndex >= 0 && newConfig.defaultTrackIndex < newConfig.musicTracks.length) {
        setCurrentTrackIndex(newConfig.defaultTrackIndex);
      } else {
        setCurrentTrackIndex((prev) => Math.min(prev, newConfig.musicTracks.length - 1));
      }
    }
  };

  const handleResetToDefaults = () => {
    setConfig(initialWeddingConfig);
    localStorage.removeItem('wedding_custom_config');
    fetch('/api/save-wedding-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }).catch(() => {});
    setCurrentTrackIndex(initialWeddingConfig.defaultTrackIndex || 0);
  };

  // Trigger when user opens the invitation envelope
  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
    setIsPlayingMusic(true);
  };

  const handleAddWish = (newWishData: Omit<GuestWish, 'id' | 'timestamp' | 'likesCount'>) => {
    const newWish: GuestWish = {
      ...newWishData,
      id: `wish-${Date.now()}`,
      timestamp: 'Just now',
      likesCount: 1,
    };
    setWishes((prev) => [newWish, ...prev]);
  };

  const handleLikeWish = (wishId: string) => {
    // Increment in Firestore if it is a Firestore document ID
    if (!wishId.startsWith('wish-')) {
      likeWishInFirestore(wishId).catch((err) => {
        console.warn('Firestore like notice:', err);
      });
    }
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w))
    );
  };


  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find active theme colors
  const activeTheme = config.themes.find((t) => t.id === config.activeThemeId) || config.themes[0];

  return (
    <div
      className="min-h-screen relative font-sans-body transition-colors duration-500 overflow-x-hidden"
      style={{ backgroundColor: activeTheme.paperBg }}
    >
      {/* Falling Watercolor Petals */}
      {showFallingPetals && <FallingPetals tone={activeTheme.floralTone} />}

      {/* Opening Envelope Gate Modal (TikTok / Luxury 3D Envelope Opening) */}
      <OpeningEnvelopeModal
        config={config}
        guestName={guestName}
        isOpen={!isInvitationOpen}
        onOpenInvitation={handleOpenInvitation}
      />

      {/* Background Floating Music Player */}
      <MusicPlayer
        tracks={config.musicTracks}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlayingMusic}
        onTrackChange={(idx) => setCurrentTrackIndex(idx)}
        onTogglePlay={(playing) => setIsPlayingMusic(playing)}
        accentColor={activeTheme.primaryColor}
      />

      {/* Top Quick Bar for Google Sheets & Customizer */}
      {showEditButton && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="fixed top-5 right-4 z-50 flex items-center gap-2"
        >
          {/* Google Sheets RSVP Sync Button */}
          <button
            onClick={() => setIsGoogleSheetsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C2420]/90 backdrop-blur-md border border-emerald-500/70 text-emerald-300 hover:text-white text-xs font-semibold shadow-md hover:bg-[#3D2B24] transition-all cursor-pointer"
            title="Google Sheets RSVP & Attendance"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Google Sheets</span>
          </button>

          {/* Live Edit Details Button */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C2420]/90 backdrop-blur-md border border-[#DFC186] text-[#F3E5AB] text-xs font-semibold shadow-md hover:bg-[#3D2B24] transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#DFC186]" />
            <span>Edit</span>
          </button>
        </motion.div>
      )}

      {/* Main Content Layout with optional Smartphone Bezel for PC testing */}
      <main
        className={`mx-auto transition-all duration-300 ${
          isMobilePreview
            ? 'max-w-sm sm:max-w-md my-8 rounded-[40px] shadow-2xl border-8 border-[#2E2420] overflow-hidden bg-[#FAF7F2] relative'
            : 'w-full max-w-5xl px-0 sm:px-4'
        }`}
      >
        {/* If in Mobile Preview Mode, show phone top notch */}
        {isMobilePreview && (
          <div className="sticky top-0 z-30 bg-[#2E2420] text-white py-1 px-6 flex items-center justify-between text-[10px]">
            <span>9:41</span>
            <div className="w-20 h-3.5 bg-black rounded-full" />
            <span>5G 100%</span>
          </div>
        )}

        {/* 1. Hero Cover & Countdown Scene */}
        <HeroSection config={config} onScrollToNext={() => handleNavigate('couple')} />

        {/* 2. The Beloved Couple Scene (Groom & Bride) */}
        <CoupleSection couple={config.couple} theme={activeTheme} />

        {/* 3. Event Schedules & Venues Scene */}
        <EventsSchedule events={config.events} theme={activeTheme} />


        {/* 5. Wedding Guestbook & Warmest Wishes Scene */}
        <GuestbookSection
          wishes={wishes}
          onAddWish={handleAddWish}
          onLikeWish={handleLikeWish}
          theme={activeTheme}
        />

        {/* 6. Footer Scene */}
        <FooterSection config={config} />
      </main>



      {/* Live Customizer Slide-over Panel */}
      <LiveConfigEditorModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onResetToDefaults={handleResetToDefaults}
        onReopenInvitation={() => {
          setIsInvitationOpen(false);
          setIsCustomizerOpen(false);
        }}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        showFallingPetals={showFallingPetals}
        onToggleFallingPetals={() => setShowFallingPetals(!showFallingPetals)}
        onOpenGoogleSheets={() => {
          setIsCustomizerOpen(false);
          setIsGoogleSheetsOpen(true);
        }}
      />

      {/* Google Sheets RSVP & Attendance Manager Modal */}
      <GoogleSheetsManager
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
      />
    </div>
  );
}

