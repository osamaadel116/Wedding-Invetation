import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, UserCheck, Users, CalendarCheck, Sparkles, Heart, FileSpreadsheet } from 'lucide-react';
import { WeddingConfig, RsvpData, FloralTheme } from '../types';
import { WatercolorDivider } from './WatercolorFlorals';
import { getAccessToken } from '../services/googleAuth';
import { appendRsvpRow } from '../services/googleSheets';
import { submitRsvpToFirestore } from '../services/firebase';

interface RsvpSectionProps {
  config: WeddingConfig;
  defaultGuestName?: string;
  onRsvpSubmit: (data: RsvpData) => void;
  theme: FloralTheme;
  onOpenGoogleSheets?: () => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  config,
  defaultGuestName = '',
  onRsvpSubmit,
  theme,
  onOpenGoogleSheets,
}) => {
  const [formData, setFormData] = useState<RsvpData>({
    guestName: defaultGuestName,
    email: '',
    phone: '',
    attendance: 'attending',
    numberOfGuests: 1,
    eventIds: (config?.events || []).map((e) => e.id),
    dietaryNotes: (config?.rsvpConfig?.dietaryOptions || [])[0] || 'No Restrictions',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttendanceChange = (attendance: 'attending' | 'declined') => {
    setFormData((prev) => ({ ...prev, attendance }));
  };

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => {
      const exists = prev.eventIds.includes(eventId);
      return {
        ...prev,
        eventIds: exists
          ? prev.eventIds.filter((id) => id !== eventId)
          : [...prev.eventIds, eventId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName.trim()) return;

    setIsSubmitting(true);

    // Your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1m5lxcrDtgKs7zhJuPgkCpVIq9xkEsZcASnzBP8PEmhSsBFvZw6Q-48k4bPErzz8Wpw/exec';

    try {
      // 1. Save to Firebase Firestore Database
      try {
        const attendanceMap: Record<string, 'yes' | 'no' | 'maybe'> = {
          attending: 'yes',
          regrets: 'no',
          maybe: 'maybe',
        };
        await submitRsvpToFirestore({
          guestName: formData.guestName,
          attendance: attendanceMap[formData.attendance] || 'yes',
          guestCount: formData.numberOfGuests,
          eventsAttending: formData.eventIds,
          message: formData.message,
        });
      } catch (firestoreErr) {
        console.warn('Firestore RSVP save note:', firestoreErr);
      }

      // 2. If host is logged into Google Sheets and has a sheet configured, write directly via Google Sheets v4 API
      try {
        const accessToken = await getAccessToken();
        const sheetId = localStorage.getItem('wedding_google_sheet_id');
        const sheetTab = localStorage.getItem('wedding_google_sheet_tab') || 'RSVPs';

        if (accessToken && sheetId) {
          await appendRsvpRow(accessToken, sheetId, sheetTab, formData);
        }
      } catch (directSheetErr) {
        console.warn('Direct Google Sheets append notice:', directSheetErr);
      }

      // 3. Also send to Google Apps Script Web App backup
      try {
        const submitData = new URLSearchParams();
        submitData.append('guestName', formData.guestName);
        submitData.append('attendance', formData.attendance);
        submitData.append('numberOfGuests', formData.numberOfGuests.toString());
        submitData.append('events', formData.eventIds.join(', '));
        submitData.append('message', formData.message);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: submitData,
          mode: 'no-cors', // Essential to prevent CORS errors from Google
        });
      } catch (scriptErr) {
        console.warn('Google Apps Script backup note:', scriptErr);
      }

      // Fire confetti if attending
      if (formData.attendance === 'attending') {
        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.7 },
            colors: [theme.primaryColor, theme.accentColor, '#F7D6D0', '#DFC186'],
          });
        } catch {
          // safe fallback
        }
      }

      onRsvpSubmit(formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-16 px-4 sm:px-6 bg-[#FCFAF6] overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
            Will You Join Us?
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            RSVP & Attendance
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            تأكيد الحضور
          </h3>
          <p className="font-sans-body text-xs sm:text-sm text-[#736357] max-w-md mx-auto mt-2">
            Please kindly respond on or before{' '}
            <span className="font-semibold text-[#8C6D3B]">
              {config.rsvpConfig.deadlineDate}
            </span>{' '}
            to help us finalize arrangements.
          </p>
          <WatercolorDivider tone={theme.floralTone} className="my-4" />
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FAF7F2] border border-[#E6DCce] rounded-3xl p-6 sm:p-10 shadow-lg text-left relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#EAF5E9] border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420]">
                  Thank You, {formData.guestName}!
                </h3>
                <p className="font-sans-body text-sm text-[#6E5E53] max-w-md mt-2">
                  {formData.attendance === 'attending'
                    ? `Your RSVP for ${formData.numberOfGuests} guest(s) has been recorded. We cannot wait to celebrate this blessed day with you!`
                    : 'We are saddened you cannot make it, but we deeply appreciate your warm thoughts and prayers.'}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2 rounded-full border border-[#DFC186] text-xs font-sans-body text-[#8C6D3B] hover:bg-[#F5EFE6] transition-colors"
                  >
                    Edit Response
                  </button>
                  <a
                    href="#wishes"
                    className="px-5 py-2 rounded-full bg-[#3D2B24] text-white text-xs font-sans-body flex items-center gap-1.5 shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#E8B4B8] fill-current" />
                    <span>Leave a Wedding Wish</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-serif-display font-bold uppercase tracking-wider text-[#3D2B24] mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah & David Jenkins"
                      value={formData.guestName}
                      onChange={(e) =>
                        setFormData({ ...formData, guestName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD0C0] text-[#2E2420] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* 2. Attendance Status Selection */}
                <div>
                  <label className="block text-xs font-serif-display font-bold uppercase tracking-wider text-[#3D2B24] mb-2">
                    Attendance Confirmation <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange('attending')}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.attendance === 'attending'
                          ? 'border-emerald-600 bg-[#EEF7EE] shadow-sm ring-2 ring-emerald-500/30'
                          : 'border-[#DCD0C0] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <UserCheck
                        className={`w-5 h-5 ${
                          formData.attendance === 'attending'
                            ? 'text-emerald-600'
                            : 'text-[#8C7A6B]'
                        }`}
                      />
                      <span
                        className={`text-xs font-sans-body font-bold ${
                          formData.attendance === 'attending'
                            ? 'text-emerald-900'
                            : 'text-[#63554B]'
                        }`}
                      >
                        Joyfully Attending
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAttendanceChange('declined')}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.attendance === 'declined'
                          ? 'border-amber-600 bg-[#FDF4EB] shadow-sm ring-2 ring-amber-500/30'
                          : 'border-[#DCD0C0] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Users
                        className={`w-5 h-5 ${
                          formData.attendance === 'declined'
                            ? 'text-amber-700'
                            : 'text-[#8C7A6B]'
                        }`}
                      />
                      <span
                        className={`text-xs font-sans-body font-bold ${
                          formData.attendance === 'declined'
                            ? 'text-amber-900'
                            : 'text-[#63554B]'
                        }`}
                      >
                        Regretfully Decline
                      </span>
                    </button>
                  </div>
                </div>

                {/* Conditional Fields if Attending */}
                {formData.attendance === 'attending' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5 pt-2 border-t border-[#EAE0D2]"
                  >
                    {/* Number of Guests */}
                    <div>
                      <label className="block text-xs font-serif-display font-bold uppercase tracking-wider text-[#3D2B24] mb-1.5">
                        Number of Persons Attending
                      </label>
                      <select
                        value={formData.numberOfGuests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numberOfGuests: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD0C0] text-[#2E2420] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      >
                        {Array.from(
                          { length: config.rsvpConfig.maxGuestsPerInvite || 4 },
                          (_, i) => i + 1
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest (Self)' : `Guests (${num} Persons)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Attending Events Checkbox */}
                    <div>
                      <label className="block text-xs font-serif-display font-bold uppercase tracking-wider text-[#3D2B24] mb-2">
                        Sessions You Will Attend
                      </label>
                      <div className="space-y-2">
                        {(config?.events || []).map((event) => (
                          <label
                            key={event.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#DCD0C0] cursor-pointer hover:bg-[#FDFBF7]"
                          >
                            <input
                              type="checkbox"
                              checked={formData.eventIds.includes(event.id)}
                              onChange={() => handleEventToggle(event.id)}
                              className="w-4 h-4 text-[#C5A059] rounded border-gray-300 focus:ring-[#C5A059]"
                            />
                            <div className="text-xs text-[#3E322A]">
                              <span className="font-semibold font-serif-display text-sm">
                                {event.title}
                              </span>
                              <span className="text-[#8C7A6B] block">
                                {event.startTime} - {event.endTime} @ {event.venueName}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-serif-display font-bold uppercase tracking-wider text-[#3D2B24] mb-1.5">
                    Personal Note for the Bride & Groom (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a sweet message or warm blessing..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCD0C0] text-[#2E2420] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full text-white font-sans-body font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending RSVP...' : 'Submit RSVP Response'}</span>
                  <Sparkles className="w-4 h-4 text-[#F3E5AB]" />
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Host Google Sheets RSVP Sync Button */}
        {onOpenGoogleSheets && (
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenGoogleSheets}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E0D5C7] text-[#6E5E53] hover:text-[#2E2420] text-xs font-medium shadow-2xs transition-all cursor-pointer backdrop-blur-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Sheets RSVP Manager</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};