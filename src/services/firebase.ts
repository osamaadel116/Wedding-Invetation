import { GuestWish } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// In-memory + LocalStorage wishes store
const WISHES_STORAGE_KEY = 'wedding_wishes_db_v1';
const RSVPS_STORAGE_KEY = 'wedding_rsvps_db_v1';

function getStoredWishes(): GuestWish[] {
  try {
    const raw = localStorage.getItem(WISHES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredWishes(wishes: GuestWish[]) {
  try {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
  } catch {}
}

const listeners: Array<(wishes: GuestWish[]) => void> = [];

function notifyListeners() {
  const current = getStoredWishes();
  listeners.forEach((listener) => {
    try {
      listener(current);
    } catch {}
  });
}

/**
 * Submit an RSVP to storage
 */
export async function submitRsvpToFirestore(data: {
  guestName: string;
  attendance: 'yes' | 'no' | 'maybe';
  guestCount: number;
  eventsAttending: string[];
  dietary?: string;
  message?: string;
}) {
  try {
    const rsvps = JSON.parse(localStorage.getItem(RSVPS_STORAGE_KEY) || '[]');
    const newRsvp = {
      id: 'rsvp-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    rsvps.push(newRsvp);
    localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(rsvps));
    return newRsvp.id;
  } catch (error) {
    console.warn('Local RSVP save note:', error);
    return 'local-' + Date.now();
  }
}

/**
 * Subscribe to real-time Guestbook Wishes
 */
export function subscribeToWishes(onUpdate: (wishes: GuestWish[]) => void) {
  listeners.push(onUpdate);
  onUpdate(getStoredWishes());

  return () => {
    const idx = listeners.indexOf(onUpdate);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

/**
 * Post a new Wish
 */
export async function addWishToFirestore(data: {
  senderName: string;
  relationship: string;
  message: string;
}) {
  const wishes = getStoredWishes();
  const dateStr = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const newWish: GuestWish = {
    id: 'wish-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    senderName: data.senderName.trim().slice(0, 80),
    relationship: (data.relationship || 'Guest').trim().slice(0, 50),
    message: data.message.trim().slice(0, 600),
    timestamp: dateStr,
    attendance: 'attending',
    likesCount: 0,
  };
  wishes.unshift(newWish);
  saveStoredWishes(wishes);
  notifyListeners();
  return newWish.id;
}

/**
 * Like a wish
 */
export async function likeWishInFirestore(wishId: string) {
  const wishes = getStoredWishes();
  const target = wishes.find((w) => w.id === wishId);
  if (target) {
    target.likesCount = (target.likesCount || 0) + 1;
    saveStoredWishes(wishes);
    notifyListeners();
  }
}

/**
 * Save live wedding config
 */
export async function saveWeddingConfigToFirestore(configData: {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  floralTheme?: string;
  venueName?: string;
  venueAddress?: string;
}) {
  try {
    localStorage.setItem('wedding_custom_config_v2', JSON.stringify(configData));
  } catch {}
}
