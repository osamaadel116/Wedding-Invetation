import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  X,
  Palette,
  Music,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Smartphone,
  Monitor,
  Eye,
  Trash2,
  Plus,
  FileSpreadsheet,
  ExternalLink,
  Save,
} from 'lucide-react';
import { WeddingConfig } from '../types';

interface LiveConfigEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onUpdateConfig: (newConfig: WeddingConfig) => void;
  onResetToDefaults: () => void;
  onReopenInvitation: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  showFallingPetals: boolean;
  onToggleFallingPetals: () => void;
  onOpenGoogleSheets?: () => void;
}

export const LiveConfigEditorModal: React.FC<LiveConfigEditorModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetToDefaults,
  onReopenInvitation,
  isMobilePreview,
  onToggleMobilePreview,
  showFallingPetals,
  onToggleFallingPetals,
  onOpenGoogleSheets,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'couple' | 'events' | 'music' | 'theme' | 'sheets' | 'export'>('general');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [customAudioInput, setCustomAudioInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [customArtistInput, setCustomArtistInput] = useState('');

  const handleUpdate = (updater: (prev: WeddingConfig) => WeddingConfig) => {
    onUpdateConfig(updater(config));
  };

  const handlePublishToProduction = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/save-wedding-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setPublishedSuccess(true);
        setTimeout(() => setPublishedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to save to production codebase:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyTS = () => {
    const tsContent = `export const weddingConfig = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(tsContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'wedding-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAddCustomTrack = () => {
    if (!customAudioInput.trim()) return;
    const newTrack = {
      id: `custom-${Date.now()}`,
      title: customTitleInput.trim() || 'Custom Wedding Song',
      artist: customArtistInput.trim() || 'Custom Audio',
      audioUrl: customAudioInput.trim(),
    };
    handleUpdate((prev) => ({
      ...prev,
      musicTracks: [...(prev.musicTracks || []), newTrack],
      defaultTrackIndex: (prev.musicTracks || []).length,
    }));
    setCustomAudioInput('');
    setCustomTitleInput('');
    setCustomArtistInput('');
  };

  const handleRemoveTrack = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    handleUpdate((prev) => {
      const tracks = prev.musicTracks || [];
      if (tracks.length <= 1) {
        return prev;
      }
      const targetIndex = tracks.findIndex((t) => t.id === trackId);
      if (targetIndex === -1) return prev;
      const updatedTracks = tracks.filter((t) => t.id !== trackId);
      let newDefaultIndex = prev.defaultTrackIndex;
      if (targetIndex === prev.defaultTrackIndex) {
        newDefaultIndex = Math.min(targetIndex, updatedTracks.length - 1);
      } else if (targetIndex < prev.defaultTrackIndex) {
        newDefaultIndex = Math.max(0, prev.defaultTrackIndex - 1);
      }
      return {
        ...prev,
        musicTracks: updatedTracks,
        defaultTrackIndex: Math.max(0, newDefaultIndex),
      };
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg h-full bg-[#FAF7F2] border-l border-[#E6DCce] shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DECf] bg-[#FCFAF6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#F2EADB] text-[#8C6D3B]">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#2E2420]">
                  Wedding Customizer
                </h3>
                <p className="text-[11px] text-[#8C7A6B] font-sans-body">
                  Edit names, dates, music & live theme instantly
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8C7A6B] hover:bg-[#F2EADB] hover:text-[#2E2420] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick View Controls Bar */}
          <div className="px-4 py-2.5 bg-[#F5EFE6] border-b border-[#E8DECf] flex items-center justify-between text-xs font-sans-body">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMobilePreview}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                  isMobilePreview
                    ? 'bg-[#3D2B24] text-white border-[#3D2B24]'
                    : 'bg-white text-[#63554B] border-[#DCD0C0]'
                }`}
                title="Toggle Mobile Mockup Frame"
              >
                {isMobilePreview ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                <span>{isMobilePreview ? 'Mobile Frame: ON' : 'Fluid PC View'}</span>
              </button>

              <button
                onClick={onToggleFallingPetals}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                  showFallingPetals
                    ? 'bg-[#C38D9E] text-white border-[#C38D9E]'
                    : 'bg-white text-[#63554B] border-[#DCD0C0]'
                }`}
                title="Toggle Floating Petals Animation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showFallingPetals ? 'Petals: ON' : 'Petals: OFF'}</span>
              </button>
            </div>

            <button
              onClick={onReopenInvitation}
              className="flex items-center gap-1 text-[#8C6D3B] hover:underline font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Test Envelope</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E8DECf] bg-[#FAF7F2] overflow-x-auto text-xs font-sans-body">
            {[
              { id: 'theme', label: 'Theme & Colors', icon: Palette },
              { id: 'couple', label: 'Couple Names', icon: Users },
              { id: 'events', label: 'Dates & Venue', icon: Calendar },
              { id: 'music', label: 'Music Songs', icon: Music },
              { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet },
              { id: 'export', label: 'Export Code', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 whitespace-nowrap border-b-2 font-medium transition-colors ${
                    isActive
                      ? 'border-[#C5A059] text-[#2E2420] bg-white'
                      : 'border-transparent text-[#8C7A6B] hover:text-[#2E2420]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* 1. THEME SELECTION */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <p className="text-xs text-[#7A6B60] font-sans-body leading-relaxed">
                  Choose your watercolor floral tone and luxury palette. The entire UI will re-skin dynamically:
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {(config.themes || []).map((theme) => {
                    const isSelected = config.activeThemeId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() =>
                          handleUpdate((prev) => ({ ...prev, activeThemeId: theme.id }))
                        }
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#C5A059] bg-white shadow-md ring-2 ring-[#C5A059]/20'
                            : 'border-[#E6DCce] bg-white hover:border-[#D4C3B2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full shadow-inner border border-white flex items-center justify-center text-white"
                            style={{ backgroundColor: theme.primaryColor }}
                          >
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-serif-display font-bold text-sm text-[#2E2420]">
                              {theme.name}
                            </h4>
                            <p className="text-[11px] text-[#8C7A6B] uppercase font-sans-body">
                              Tone: {theme.floralTone}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.accentBorder }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. COUPLE NAMES */}
            {activeTab === 'couple' && (
              <div className="space-y-4 text-xs font-sans-body">
                <div className="p-3 bg-white rounded-xl border border-[#E6DCce]">
                  <h4 className="font-serif-display font-bold text-sm text-[#2E2420] mb-2">
                    Groom Info
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[#8C7A6B] mb-0.5">Short / Display Name</label>
                      <input
                        type="text"
                        value={config.couple.groom.shortName}
                        onChange={(e) =>
                          handleUpdate((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: { ...prev.couple.groom, shortName: e.target.value, name: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8C7A6B] mb-0.5">Full Name with Title</label>
                      <input
                        type="text"
                        value={config.couple.groom.fullNameWithTitle}
                        onChange={(e) =>
                          handleUpdate((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: { ...prev.couple.groom, fullNameWithTitle: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E6DCce]">
                  <h4 className="font-serif-display font-bold text-sm text-[#2E2420] mb-2">
                    Bride Info
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[#8C7A6B] mb-0.5">Short / Display Name</label>
                      <input
                        type="text"
                        value={config.couple.bride.shortName}
                        onChange={(e) =>
                          handleUpdate((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              bride: { ...prev.couple.bride, shortName: e.target.value, name: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8C7A6B] mb-0.5">Full Name with Title</label>
                      <input
                        type="text"
                        value={config.couple.bride.fullNameWithTitle}
                        onChange={(e) =>
                          handleUpdate((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              bride: { ...prev.couple.bride, fullNameWithTitle: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#8C7A6B] mb-0.5">Wedding Hashtag</label>
                  <input
                    type="text"
                    value={config.couple.hashtag}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        couple: { ...prev.couple, hashtag: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-white"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E6DCce] space-y-2">
                  <h4 className="font-serif-display font-bold text-sm text-[#2E2420]">
                    Scripture / Wedding Quote
                  </h4>
                  <div>
                    <label className="block text-[#8C7A6B] mb-0.5">Arabic Verse (Optional)</label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={config.couple.quote?.arabicText || ''}
                      onChange={(e) =>
                        handleUpdate((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            quote: { ...prev.couple.quote, arabicText: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2] font-serif-display"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8C7A6B] mb-0.5">Quote / Translation Text</label>
                    <textarea
                      rows={2}
                      value={config.couple.quote?.text || ''}
                      onChange={(e) =>
                        handleUpdate((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            quote: { ...prev.couple.quote, text: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8C7A6B] mb-0.5">Source / Reference</label>
                    <input
                      type="text"
                      value={config.couple.quote?.source || ''}
                      onChange={(e) =>
                        handleUpdate((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            quote: { ...prev.couple.quote, source: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. DATES & VENUES */}
            {activeTab === 'events' && (
              <div className="space-y-4 text-xs font-sans-body">
                <div>
                  <label className="block text-[#8C7A6B] mb-0.5">Countdown Target (ISO Format)</label>
                  <input
                    type="text"
                    value={config.weddingDate.targetIso}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        weddingDate: { ...prev.weddingDate, targetIso: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-white"
                  />
                  <span className="text-[10px] text-gray-500">e.g. 2026-10-24T10:00:00</span>
                </div>

                <div>
                  <label className="block text-[#8C7A6B] mb-0.5">Display Date Text</label>
                  <input
                    type="text"
                    value={config.weddingDate.displayDate}
                    onChange={(e) =>
                      handleUpdate((prev) => ({
                        ...prev,
                        weddingDate: { ...prev.weddingDate, displayDate: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-white"
                  />
                </div>

                {(config.events || []).map((event, idx) => (
                  <div key={event.id} className="p-3 bg-white rounded-xl border border-[#E6DCce]">
                    <h4 className="font-serif-display font-bold text-sm text-[#2E2420] mb-2">
                      Event #{idx + 1}: {event.title}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[#8C7A6B] mb-0.5">Event Title</label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => {
                            const newEvents = (config.events || []).map((ev, i) =>
                              i === idx ? { ...ev, title: e.target.value } : ev
                            );
                            handleUpdate((prev) => ({ ...prev, events: newEvents }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[#8C7A6B] mb-0.5">Start Time</label>
                          <input
                            type="text"
                            value={event.startTime}
                            onChange={(e) => {
                              const newEvents = (config.events || []).map((ev, i) =>
                                i === idx ? { ...ev, startTime: e.target.value } : ev
                              );
                              handleUpdate((prev) => ({ ...prev, events: newEvents }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8C7A6B] mb-0.5">End Time</label>
                          <input
                            type="text"
                            value={event.endTime}
                            onChange={(e) => {
                              const newEvents = (config.events || []).map((ev, i) =>
                                i === idx ? { ...ev, endTime: e.target.value } : ev
                              );
                              handleUpdate((prev) => ({ ...prev, events: newEvents }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#8C7A6B] mb-0.5">Venue Name</label>
                        <input
                          type="text"
                          value={event.venueName}
                          onChange={(e) => {
                            const newEvents = (config.events || []).map((ev, i) =>
                              i === idx ? { ...ev, venueName: e.target.value } : ev
                            );
                            handleUpdate((prev) => ({ ...prev, events: newEvents }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8C7A6B] mb-0.5">Venue Address</label>
                        <textarea
                          rows={2}
                          value={event.venueAddress}
                          onChange={(e) => {
                            const newEvents = (config.events || []).map((ev, i) =>
                              i === idx ? { ...ev, venueAddress: e.target.value } : ev
                            );
                            handleUpdate((prev) => ({ ...prev, events: newEvents }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DCD0C0] bg-[#FAF7F2]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. BACKGROUND MUSIC */}
            {activeTab === 'music' && (
              <div className="space-y-4 text-xs font-sans-body">
                <div className="flex items-center justify-between">
                  <p className="text-[#7A6B60]">
                    Select the active wedding track or remove unwanted songs:
                  </p>
                  <span className="text-[11px] text-[#A6988D]">
                    {config.musicTracks?.length || 0} song{(config.musicTracks?.length || 0) === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(config.musicTracks || []).map((track, idx) => {
                    const isActive = config.defaultTrackIndex === idx;
                    const canDelete = (config.musicTracks || []).length > 1;

                    return (
                      <div
                        key={track.id || `track-${idx}`}
                        onClick={() =>
                          handleUpdate((prev) => ({ ...prev, defaultTrackIndex: idx }))
                        }
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                          isActive
                            ? 'border-[#C5A059] bg-white shadow-xs font-semibold ring-1 ring-[#C5A059]/30'
                            : 'border-[#E6DCce] bg-[#FCFAF6] hover:border-[#D4C3B2] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                              isActive
                                ? 'bg-[#C5A059] text-white'
                                : 'bg-[#EAE1D3] text-[#7A6A5E]'
                            }`}
                          >
                            <Music className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-serif-display text-[#2E2420] truncate">
                                {track.title}
                              </p>
                              {isActive && (
                                <span className="text-[10px] uppercase font-sans-body font-semibold px-2 py-0.5 rounded-full bg-[#FAF3E5] text-[#9E782F] border border-[#E9D6AF]">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8C7A6B] truncate font-normal">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        {/* Remove Song Action Button */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTrack(e, track.id)}
                            disabled={!canDelete}
                            title={
                              canDelete
                                ? `Remove "${track.title}"`
                                : 'At least one background song is required'
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              canDelete
                                ? 'text-[#A6988D] hover:text-red-600 hover:bg-red-50 cursor-pointer'
                                : 'text-gray-300 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#E8DECf] space-y-2 bg-white/70 p-3 rounded-xl border border-[#E8DECf]/80">
                  <div className="flex items-center gap-1.5 font-serif-display font-bold text-xs text-[#2E2420]">
                    <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Add Custom Song</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#8C7A6B] mb-0.5">Song Title (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. A Thousand Years"
                        value={customTitleInput}
                        onChange={(e) => setCustomTitleInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DCD0C0] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#8C7A6B] mb-0.5">Artist (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Christina Perri"
                        value={customArtistInput}
                        onChange={(e) => setCustomArtistInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DCD0C0] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#8C7A6B] mb-0.5">MP3 Audio URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/mysong.mp3"
                        value={customAudioInput}
                        onChange={(e) => setCustomAudioInput(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#DCD0C0] bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTrack}
                        disabled={!customAudioInput.trim()}
                        className="px-4 py-1.5 bg-[#3D2B24] text-white rounded-lg hover:bg-black font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. GOOGLE SHEETS TAB */}
            {activeTab === 'sheets' && (
              <div className="space-y-4 text-xs font-sans-body">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h4 className="font-semibold text-sm text-[#2E2420]">
                      Google Sheets Live RSVP & Wishes Sync
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Connect your Google account to automatically store incoming guest RSVPs, guest counts, event selections, and guestbook wishes straight into your Google Drive spreadsheet.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E6DCce] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2E2420]">Google Sheets RSVP Manager</p>
                      <p className="text-[11px] text-[#8C7A6B]">
                        Sign in, create a dedicated Wedding spreadsheet, or switch between tabs.
                      </p>
                    </div>
                    {onOpenGoogleSheets && (
                      <button
                        type="button"
                        onClick={onOpenGoogleSheets}
                        className="px-4 py-2 rounded-xl bg-[#2E2420] text-[#F3E5AB] font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#43352F] transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>Open Sheets Manager</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-[11px] text-[#736357]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Direct Drive Spreadsheet Storage</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Real-time Guest Attendance Stats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Official Google Identity Auth</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. EXPORT & PUBLISH CODE */}
            {activeTab === 'export' && (
              <div className="space-y-4 text-xs font-sans-body">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Save & Publish to Production Codebase</p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                      Permanent Sync
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Click the button below to write your current customizations directly into the codebase. All guests and visitors on the production site will see your updated wedding details immediately.
                  </p>
                  <button
                    type="button"
                    onClick={handlePublishToProduction}
                    disabled={isPublishing}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {publishedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Published to Production Codebase!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isPublishing ? 'Publishing...' : 'Publish to Production Now'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyTS}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#3D2B24] text-white font-medium flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJSON}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#C5A059] text-[#8C6D3B] font-medium flex items-center justify-center gap-1.5 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-[#8C7A6B] mb-1 font-medium">Config Code Preview</label>
                  <pre className="p-3 bg-[#241F1C] text-amber-200 rounded-xl text-[10px] font-mono max-h-48 overflow-y-auto">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer Reset & Close */}
          <div className="p-4 bg-[#FCFAF6] border-t border-[#E8DECf] flex items-center justify-between">
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-1 text-xs text-[#8C7A6B] hover:text-red-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePublishToProduction}
                disabled={isPublishing}
                className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-emerald-600" />
                <span>{publishedSuccess ? 'Saved!' : 'Save to Production'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#3D2B24] text-white text-xs font-medium uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
