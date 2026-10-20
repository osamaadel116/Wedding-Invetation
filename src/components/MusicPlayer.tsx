import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music, Disc3, Upload, Check } from 'lucide-react';
import { MusicTrack } from '../types';

interface MusicPlayerProps {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onTogglePlay: (playing: boolean) => void;
  onUploadSong?: (track: MusicTrack) => void;
  accentColor?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackChange,
  onTogglePlay,
  onUploadSong,
  accentColor = '#C38D9E',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').slice(0, 40);
      const newTrack: MusicTrack = {
        id: 'uploaded-' + Date.now(),
        title: cleanTitle || 'My Wedding Song',
        artist: 'Custom Upload',
        audioUrl: dataUrl,
      };

      if (onUploadSong) {
        onUploadSong(newTrack);
      }

      try {
        await fetch('/api/upload-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: dataUrl, fileName: 'wedding_song.mp3' }),
        });
      } catch (err) {
        console.warn('Backend audio save notice:', err);
      }

      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const currentTrack = (tracks && tracks.length > 0) ? (tracks[currentTrackIndex] || tracks[0]) : null;

  // Synchronize audio playback with isPlaying prop
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioUrl) return;

    if (isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setAudioError(false);
        })
        .catch((err) => {
          console.warn('Audio autoplay blocked or failed:', err);
          // Don't error out hard, wait for user interaction
        });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex, currentTrack?.audioUrl]);

  // Volume & Mute handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      onTogglePlay(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          onTogglePlay(true);
          setAudioError(false);
        })
        .catch(() => {
          setAudioError(true);
        });
    }
  };

  const handleNextTrack = () => {
    if (!tracks.length) return;
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    onTrackChange(nextIdx);
  };

  const handlePrevTrack = () => {
    if (!tracks.length) return;
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    onTrackChange(prevIdx);
  };

  return (
    <>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        loop
        preload="auto"
        onEnded={handleNextTrack}
        onError={() => setAudioError(true)}
      />

      {/* Floating Widget Container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
        {/* Expanded Track Details Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-3 w-72 bg-[#FCFAF6]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#E6DCce] p-4 text-[#2E2723]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EADFCF] mb-3">
                <div className="flex items-center gap-1.5 text-xs font-serif-display font-semibold tracking-wider uppercase text-[#8C7A6B]">
                  <Music className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span>Wedding Melody</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-[#9E8E81] hover:text-[#3E322A] p-1"
                >
                  ✕
                </button>
              </div>

              {/* Track Title & Artist */}
              <div className="text-center my-2">
                <p className="font-serif-display font-semibold text-sm text-[#2E2723] line-clamp-1">
                  {currentTrack ? currentTrack.title : 'No Song Selected'}
                </p>
                <p className="text-xs text-[#8C7A6B] italic font-sans-body">
                  {currentTrack ? currentTrack.artist : 'Upload your custom wedding MP3 below'}
                </p>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center gap-4 my-3">
                <button
                  onClick={handlePrevTrack}
                  disabled={!currentTrack || tracks.length <= 1}
                  title="Previous Song"
                  className="p-2 text-[#7B6E65] hover:text-[#2E2723] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  disabled={!currentTrack}
                  className="p-3 rounded-full text-white shadow-md transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accentColor }}
                >
                  {isPlaying && currentTrack ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  disabled={!currentTrack || tracks.length <= 1}
                  title="Next Song"
                  className="p-2 text-[#7B6E65] hover:text-[#2E2723] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume & Mute Row */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#EADFCF]/60 px-1">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-[#8C7A6B] hover:text-[#2E2723]"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500/80" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1.5 bg-[#E6DCce] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
              </div>

              {/* Track Playlist Selector */}
              {(tracks || []).length > 1 && (
                <div className="mt-3 pt-2 border-t border-[#EADFCF]/60">
                  <p className="text-[10px] uppercase tracking-wider text-[#9E8E81] mb-1 font-medium">
                    Playlist ({(tracks || []).length} Songs)
                  </p>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {(tracks || []).map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => onTrackChange(idx)}
                        className={`w-full text-left px-2 py-1 rounded text-xs truncate transition-colors flex items-center justify-between ${
                          idx === currentTrackIndex
                            ? 'bg-[#EFE8DD] font-semibold text-[#2E2723]'
                            : 'text-[#7B6E65] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        {idx === currentTrackIndex && isPlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping ml-1 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Upload / Replace Song Button */}
              <div className="mt-3 pt-2.5 border-t border-[#EADFCF]/60 flex justify-center">
                <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE0] border border-[#DFC186] text-[#8C6D3B] text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02] shadow-xs">
                  {uploadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Song Updated & Playing!</span>
                    </>
                  ) : isUploading ? (
                    <span className="animate-pulse">Loading Audio...</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Upload My Own Song (MP3)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {audioError && (
                <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-1.5 mt-2 text-center">
                  Audio streaming error. Click Play or upload an MP3 file.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Mini Disc Trigger Button */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#2C2420] text-[#F3E5AB] shadow-xl border-2 border-[#DFC186] cursor-pointer"
            title={isPlaying ? 'Music playing (Click to configure)' : 'Music paused (Click to play)'}
          >
            {/* Spinning Disc Effect */}
            <Disc3
              className={`w-7 h-7 text-[#DFC186] ${isPlaying ? 'animate-spin-slow' : 'opacity-80'}`}
            />

            {/* Central Play/Pause Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2C2420] border border-[#DFC186]" />
            </div>

            {/* Pulsing Sound Ring when Playing */}
            {isPlaying && (
              <span className="absolute -inset-1 rounded-full border border-[#C5A059]/60 animate-ping pointer-events-none" />
            )}
          </motion.button>

          {/* Quick Play/Pause Mini Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md text-[10px] hover:scale-110 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
          </button>
        </div>
      </div>
    </>
  );
};
