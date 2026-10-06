import { WeddingConfig } from './types';
import bridePhoto from './assets/images/regenerated_image_1788213800123.png';
import groomPhoto from './assets/images/regenerated_image_1788214059017.jpg';
import heroPhoto from './assets/images/regenerated_image_1788214150346.jpg';
import customWeddingData from './weddingData.json';

/**
 * =========================================================================
 * WEDDING INVITATION CONFIGURATION FILE
 * =========================================================================
 * You can customize names, dates, quotes, venue locations, dress code,
 * background songs, gift/bank accounts, photo gallery, and themes here.
 * 
 * All changes will automatically reflect across the entire digital invitation!
 */

const baseWeddingConfig: WeddingConfig = {
  meta: {
    siteTitle: 'The Wedding of Omar & Aya',
    welcomeGreeting: 'Together with their families, joyfully invite you to celebrate their wedding',
  },

  // 1. THE COUPLE DETAILS
  couple: {
    hashtag: '#OmarFoundHisAya',
    quote: {
      arabicText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      text: '',
      source: 'Surah Ar-Rum (30:21)',
    },
    groom: {
      name: 'Omar Emad',
      shortName: 'Omar',
      role: 'Groom',
      fullNameWithTitle: 'Omar Emad',
      fatherName: 'Mr. Emad',
      motherName: 'Mrs. Emad',
      bio: 'An architectural designer with an obsession for classic jazz, morning pour-overs, and Aya’s laughter.',
      photoUrl: groomPhoto,
    },
    bride: {
      name: 'Aya Salah',
      shortName: 'Aya',
      role: 'Bride',
      fullNameWithTitle: 'Aya Salah',
      fatherName: 'Mr. Salah',
      motherName: 'Mrs. Salah',
      bio: 'A botanical illustrator with a heart for vintage novels, tea ceremonies, and traveling the world with Omar.',
      photoUrl: bridePhoto,
    },
  },

  // 2. WEDDING DATE & COUNTDOWN TARGET
  weddingDate: {
    targetIso: '2026-11-20T18:30:00', // Format: YYYY-MM-DDTHH:mm:ss
    displayDate: 'Friday, 20 November 2026',
    dayOfWeek: 'Friday',
  },

  // 3. EVENT AGENDAS & VENUES (Wedding Reception)
  events: [
    {
      id: 'reception',
      title: 'Wedding Reception',
      subtitle: 'Celebration, Dining & Toast',
      date: 'Friday, 20 November 2026',
      dateIso: '2026-11-20T18:30:00',
      startTime: '06:30 PM',
      endTime: '09:30 PM',
      timezone: 'GMT+2',
      venueName: 'New Land Resort منتجع نيو لاند',
      venueAddress: 'Saqqara Tourist Road, Mariouteya, Giza, Egypt (طريق سقارة السياحي - المريوطية)',
      mapUrl: 'https://maps.google.com/?q=New+Land+Resort+Mariouteya+Giza',
      mapEmbedQuery: 'New Land Resort Mariouteya Giza',
      notes: '',
      iconType: 'celebration',
    },
  ],

  // 4. LOVE STORY TIMELINE
  timeline: [
    {
      year: '2019',
      title: 'First Encounter',
      description: 'Met by serendipity at an indie bookstore café on a rainy Sunday afternoon in Kyoto.',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      year: '2021',
      title: 'The First Adventure',
      description: 'Taking our first road trip together along the coast, discovering a mutual love for sunsets and road playlists.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    },
    {
      year: '2024',
      title: 'She Said Yes! 💍',
      description: 'Under a canopy of fairy lights and blooming wisteria in Florence, Alexander asked the question that changed forever.',
      imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
    },
    {
      year: '2026',
      title: 'Our New Beginning',
      description: 'Surrounded by our dearest loved ones, we step into a lifetime of adventure, devotion, and joy.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    },
  ],

  // 5. DRESS CODE & COLOR PALETTE (Cooler / Early Winter Romantic Palette)
  dressCode: {
    title: 'Winter Elegance & Black Tie Optional',
    description: 'We kindly invite our beloved guests to dress in our early winter romantic palette featuring frosted rose, ice slate, silver mist, deep evergreen, and winter champagne.',
    colorPalette: [
      { name: 'Frosted Rose', hex: '#D8A4B0' },
      { name: 'Ice Silver', hex: '#D8E2E8' },
      { name: 'Slate Blue', hex: '#587B99' },
      { name: 'Deep Evergreen', hex: '#2C4A42' },
      { name: 'Winter Pearl', hex: '#F2F6F8' },
    ],
    guidelines: [
      'Ladies: Floor-length evening gown, velvet cocktail dress, or tailored winter formal attire with elegant wraps or stoles.',
      'Gentlemen: Classic tuxedo, dark charcoal, midnight blue, or crisp lounge suit with a silk tie or bow tie.',
      'Please refrain from wearing solid white or bright summer neon colors.',
    ],
  },

  // 6. BACKGROUND MUSIC PLAYLIST (Royalty-free high quality wedding piano)
  musicTracks: [
    {
      id: 'canon-piano',
      title: 'Canon in D (Romantic Piano)',
      artist: 'Johann Pachelbel (Acoustic)',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
    },
  ],
  defaultTrackIndex: 0,

  // 7. DIGITAL WEDDING ENVELOPE / BANK ACCOUNTS / QRIS
  giftAccounts: [
    {
      id: 'bank-bca',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8830192837',
      accountHolder: 'Alexander Christian',
      badge: 'Groom Account',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BCA-8830192837-AlexanderChristian',
    },
    {
      id: 'bank-mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '1370018294821',
      accountHolder: 'Vivienne Claire D',
      badge: 'Bride Account',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Mandiri-1370018294821-VivienneClaire',
    },
  ],

  giftRegistries: [
    {
      title: 'Amazon Wedding Registry',
      description: 'Curated home essentials and kitchenware for our new home.',
      link: 'https://www.amazon.com/wedding',
      iconName: 'gift',
    },
    {
      title: 'Honeymoon Wish Fund',
      description: 'Help us make memories on our dream trip to Amalfi Coast.',
      link: 'https://paypal.me',
      iconName: 'plane',
    },
  ],

  // 8. PHOTO GALLERY (High resolution curated engagement photoshoot)
  gallery: [
    {
      id: 'g1',
      url: heroPhoto,
      caption: 'Golden hour sunset stroll by the countryside.',
      featured: true,
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      caption: 'The moment forever began.',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
      caption: 'Laughter, whispers, and endless coffee dates.',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
      caption: 'Whispering promises under the olive trees.',
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
      caption: 'Hand in hand towards our next chapter.',
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
      caption: 'Every love story is beautiful, but ours is our favorite.',
    },
  ],

  // 9. RSVP SETTINGS
  rsvpConfig: {
    deadlineDate: '10 October 2026',
    maxGuestsPerInvite: 4,
    allowPlusOne: true,
    dietaryOptions: ['No Restrictions', 'Vegetarian / Vegan', 'Halal Only', 'Gluten Free', 'Nut Allergies'],
  },

  // 10. ACTIVE THEME & THEME PRESETS
  activeThemeId: 'burgundy-velvet',
  themes: [
    {
      id: 'burgundy-velvet',
      name: 'Deep Burgundy & Rosewood',
      primaryColor: '#722F37',
      accentColor: '#C5A059',
      badgeBg: '#F7EBEF',
      paperBg: '#FCF8F9',
      accentBorder: '#9E3D48',
      floralTone: 'burgundy',
    },
  ],
};

const rawCustom = customWeddingData as any;

export const weddingConfig: WeddingConfig = {
  ...baseWeddingConfig,
  ...(rawCustom || {}),
  meta: {
    ...baseWeddingConfig.meta,
    ...(rawCustom?.meta || {}),
  },
  couple: {
    ...baseWeddingConfig.couple,
    ...(rawCustom?.couple || {}),
    quote: {
      ...baseWeddingConfig.couple.quote,
      ...(rawCustom?.couple?.quote || {}),
    },
    groom: {
      ...baseWeddingConfig.couple.groom,
      ...(rawCustom?.couple?.groom || {}),
      photoUrl:
        rawCustom?.couple?.groom?.photoUrl && !rawCustom.couple.groom.photoUrl.startsWith('/src/')
          ? rawCustom.couple.groom.photoUrl
          : groomPhoto,
    },
    bride: {
      ...baseWeddingConfig.couple.bride,
      ...(rawCustom?.couple?.bride || {}),
      photoUrl:
        rawCustom?.couple?.bride?.photoUrl && !rawCustom.couple.bride.photoUrl.startsWith('/src/')
          ? rawCustom.couple.bride.photoUrl
          : bridePhoto,
    },
  },
  weddingDate: {
    ...baseWeddingConfig.weddingDate,
    ...(rawCustom?.weddingDate || {}),
  },
  events:
    Array.isArray(rawCustom?.events) && rawCustom.events.length > 0
      ? rawCustom.events
      : baseWeddingConfig.events,
  timeline:
    Array.isArray(rawCustom?.timeline) && rawCustom.timeline.length > 0
      ? rawCustom.timeline
      : baseWeddingConfig.timeline,
  dressCode: {
    ...baseWeddingConfig.dressCode,
    ...(rawCustom?.dressCode || {}),
  },
  rsvpConfig: {
    ...baseWeddingConfig.rsvpConfig,
    ...(rawCustom?.rsvpConfig || {}),
  },
  musicTracks:
    Array.isArray(rawCustom?.musicTracks) && rawCustom.musicTracks.length > 0
      ? rawCustom.musicTracks
      : baseWeddingConfig.musicTracks,
};

