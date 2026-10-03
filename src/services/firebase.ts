import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { RsvpData, GuestWish } from '../types';

// Initialize Firebase App with safe fallbacks
let appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let dbInstance: ReturnType<typeof getFirestore>;
try {
  dbInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(appInstance, firebaseConfig.firestoreDatabaseId)
    : getFirestore(appInstance);
} catch (e) {
  console.warn('Firestore initialization fallback:', e);
  dbInstance = getFirestore(appInstance);
}

export const app = appInstance;
export const db = dbInstance;
export const auth = getAuth(appInstance);

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
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on load as per skill requirements
export async function testConnection() {
  const testPath = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    // We do not rethrow on initial test if doc is empty, just test connectivity
  }
}

// Automatically trigger connection test
testConnection();

// --- Firestore Services for Wedding RSVP, Wishes, and Config ---

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
      guestName: data.guestName.trim(),
      attendance: data.attendance,
      guestCount: Math.min(Math.max(Number(data.guestCount) || 1, 1), 10),
      eventsAttending: data.eventsAttending || [],
      dietary: (data.dietary || '').slice(0, 300),
      message: (data.message || '').slice(0, 500),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

/**
 * Subscribe to real-time Guestbook Wishes from Firestore
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
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } catch (e) {
        console.warn('Wishes sync subscription note:', e);
      }
    }
  );
}

/**
 * Post a new Wish to Firestore
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
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

/**
 * Like a wish in Firestore (increments like counter atomically)
 */
export async function likeWishInFirestore(wishId: string) {
  const docPath = `wishes/${wishId}`;
  try {
    const wishRef = doc(db, 'wishes', wishId);
    await updateDoc(wishRef, {
      likes: increment(1),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Save live wedding config to Firestore (Host / Admin feature)
 */
export async function saveWeddingConfigToFirestore(configData: {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  floralTheme?: string;
  venueName?: string;
  venueAddress?: string;
}) {
  if (!auth.currentUser || auth.currentUser.email !== 'osos11886@gmail.com') {
    return;
  }
  const docPath = 'weddingConfig/main';
  try {
    const configRef = doc(db, 'weddingConfig', 'main');
    await setDoc(
      configRef,
      {
        brideName: configData.brideName.slice(0, 80),
        groomName: configData.groomName.slice(0, 80),
        weddingDate: (configData.weddingDate || '').slice(0, 60),
        floralTheme: (configData.floralTheme || '').slice(0, 50),
        venueName: (configData.venueName || '').slice(0, 150),
        venueAddress: (configData.venueAddress || '').slice(0, 200),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
