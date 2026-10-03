export interface PersonInfo {
  name: string;
  shortName: string;
  role: 'Groom' | 'Bride';
  fullNameWithTitle: string;
  fatherName: string;
  motherName: string;
  bio: string;
  photoUrl: string;
}

export interface CoupleDetails {
  groom: PersonInfo;
  bride: PersonInfo;
  hashtag: string;
  quote: {
    arabicText?: string;
    text: string;
    source: string;
  };
}

export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string; // e.g. "Saturday, 24 October 2026"
  dateIso: string; // e.g. "2026-10-24T10:00:00"
  startTime: string; // "10:00 AM"
  endTime: string; // "12:00 PM"
  timezone: string; // "GMT+7" or "EST"
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  mapEmbedQuery: string;
  notes?: string;
  iconType: 'ring' | 'celebration' | 'party' | 'church' | 'garden';
}

export interface StoryTimelineItem {
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
  badge?: string;
}

export interface GiftRegistryItem {
  title: string;
  description: string;
  link: string;
  iconName: string;
}

export interface DressCode {
  title: string;
  description: string;
  colorPalette: {
    name: string;
    hex: string;
  }[];
  guidelines?: string[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  featured?: boolean;
}

export interface FloralTheme {
  id: string;
  name: string;
  primaryColor: string; // Tailwind or Hex
  accentColor: string;
  badgeBg: string;
  paperBg: string;
  accentBorder: string;
  floralTone: 'blush' | 'sage' | 'dustyBlue' | 'emerald' | 'burgundy' | 'champagne' | 'frostyWinter' | 'frostedRose' | 'icySlate';
}

export interface GuestWish {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  timestamp: string;
  attendance: 'attending' | 'declined' | 'uncertain';
  likesCount: number;
}

export interface RsvpData {
  guestName: string;
  email?: string;
  phone?: string;
  attendance: 'attending' | 'declined';
  numberOfGuests: number;
  eventIds: string[];
  dietaryNotes?: string;
  message?: string;
}

export interface WeddingConfig {
  meta: {
    siteTitle: string;
    welcomeGreeting: string;
  };
  couple: CoupleDetails;
  weddingDate: {
    targetIso: string; // For countdown e.g. "2026-10-24T09:00:00"
    displayDate: string; // "October 24, 2026"
    dayOfWeek: string; // "Saturday"
  };
  events: WeddingEvent[];
  timeline: StoryTimelineItem[];
  dressCode: DressCode;
  musicTracks: MusicTrack[];
  defaultTrackIndex: number;
  giftAccounts: BankAccount[];
  giftRegistries: GiftRegistryItem[];
  gallery: GalleryPhoto[];
  rsvpConfig: {
    deadlineDate: string;
    maxGuestsPerInvite: number;
    allowPlusOne: boolean;
    dietaryOptions: string[];
  };
  activeThemeId: string;
  themes: FloralTheme[];
}
