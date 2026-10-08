import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GuestWish } from '../types';

// Initialize Firebase App
const appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const dbInstance = firebaseConfig.firestoreDatabaseId
  ? getFirestore(appInstance, firebaseConfig.firestoreDatabaseId)
  : getFirestore(appInstance);

export const app = appInstance;
export const db = dbInstance;

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

// Local storage backup keys for offline resilience
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

// Test Connection on load
export async function testConnection() {
  const testPath = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Offline cache enabled.');
    }
  }
}

testConnection();

/**
 * Subscribe to real-time Guestbook Wishes from Firestore
 * Updates automatically whenever ANY guest posts a new blessing or likes a wish.
 */
export function subscribeToWishes(onUpdate: (wishes: GuestWish[]) => void) {
  const collectionPath = 'wishes';
  const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: GuestWish[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        let formattedDate = 'Just now';
        if (d.createdAt && typeof d.createdAt.toDate === 'function') {
          const dateObj = d.createdAt.toDate();
          formattedDate = dateObj.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
        return {
          id: docSnap.id,
          senderName: d.senderName || 'Anonymous',
          relationship: d.relationship || 'Guest',
          message: d.message || '',
          timestamp: formattedDate,
          attendance: (d.attendance as 'attending' | 'declined' | 'uncertain') || 'attending',
          likesCount: d.likes || 0,
        };
      });

      // Update local storage backup
      saveStoredWishes(items);
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore wishes subscription notice:', error);
      // Fallback to local storage if network or permissions fail
      onUpdate(getStoredWishes());
    }
  );
}

/**
 * Post a new Wish to Firestore (syncs live to all connected devices)
 */
export async function addWishToFirestore(data: {
  senderName: string;
  relationship: string;
  message: string;
}) {
  const collectionPath = 'wishes';
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      senderName: data.senderName.trim().slice(0, 80),
      relationship: (data.relationship || 'Guest').trim().slice(0, 50),
      message: data.message.trim().slice(0, 600),
      likes: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore save fallback to local storage:', error);
    const wishes = getStoredWishes();
    const newWish: GuestWish = {
      id: 'local-' + Date.now(),
      senderName: data.senderName.trim().slice(0, 80),
      relationship: (data.relationship || 'Guest').trim().slice(0, 50),
      message: data.message.trim().slice(0, 600),
      timestamp: 'Just now',
      attendance: 'attending',
      likesCount: 0,
    };
    wishes.unshift(newWish);
    saveStoredWishes(wishes);
    return newWish.id;
  }
}

/**
 * Like a wish in Firestore (increments like counter atomically across all screens)
 */
export async function likeWishInFirestore(wishId: string) {
  if (wishId.startsWith('local-') || wishId.startsWith('wish-')) {
    const wishes = getStoredWishes();
    const target = wishes.find((w) => w.id === wishId);
    if (target) {
      target.likesCount = (target.likesCount || 0) + 1;
      saveStoredWishes(wishes);
    }
    return;
  }

  const docPath = `wishes/${wishId}`;
  try {
    const wishRef = doc(db, 'wishes', wishId);
    await updateDoc(wishRef, {
      likes: increment(1),
    });
  } catch (error) {
    console.warn('Firestore like fallback:', error);
    const wishes = getStoredWishes();
    const target = wishes.find((w) => w.id === wishId);
    if (target) {
      target.likesCount = (target.likesCount || 0) + 1;
      saveStoredWishes(wishes);
    }
  }
}

/**
 * Submit an RSVP to Firestore
 */
export async function submitRsvpToFirestore(data: {
  guestName: string;
  attendance: 'yes' | 'no' | 'maybe';
  guestCount: number;
  eventsAttending: string[];
  dietary?: string;
  message?: string;
}) {
  const collectionPath = 'rsvps';
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      guestName: data.guestName.trim().slice(0, 80),
      attendance: data.attendance,
      guestCount: Math.min(Math.max(Math.floor(Number(data.guestCount)) || 1, 1), 10),
      eventsAttending: data.eventsAttending || [],
      dietary: (data.dietary || '').slice(0, 300),
      message: (data.message || '').slice(0, 500),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore RSVP save fallback to local storage:', error);
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
    } catch {
      return 'local-' + Date.now();
    }
  }
}

/**
 * Save live wedding config to local storage
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
