# Real-Time Cloud Guestbook & RSVP Sync

Enable real-time, cross-device message synchronization for the wedding guestbook and digital RSVP by connecting Firebase Firestore so wishes written by any guest immediately appear for all visitors.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed enabling Firebase Firestore live synchronization. This will transition the guestbook from isolated single-device `localStorage` to a centralized, real-time shared database.

- **Confirmed Decision**: Set up Firebase Firestore so wishes and RSVP submissions sync live across all phones, tablets, and computers.
- **Access Model**: Public read and write for guestbook wishes and RSVPs with validation limits (rate limiting, character caps, and content hygiene) to keep the invitation frictionless without requiring guests to sign in.
- **Offline / Stale Fallback**: Maintain seamless `localStorage` fallback so that if a guest has a flaky internet connection, their submitted wish still renders immediately in their UI.

---

## 1. Overview & Core Concept

- **What It Does**: Connects a persistent cloud database (Firebase Firestore) to the digital wedding invitation. When any guest submits a blessing, warm note, or RSVP, the data is saved in real time and automatically distributed to every visitor currently viewing or opening the invitation.
- **Target Audience / Persona**: Wedding guests, family members, friends, and the bride & groom viewing the invitation from different phones and browsers worldwide.
- **Key Value**: Replaces local-only device storage with a shared real-time guestbook, creating a lively, collective celebration space where family and friends can see each other's warm wishes.

---

## 2. User Experience & Visual Design

- **Guestbook Flow**:
  1. Guest scrolls to `#wishes` (or clicks "Leave a Wish" from the cover or RSVP confirmation).
  2. Guest enters their name, relationship (e.g., Friend, Family, Colleague), and a heartfelt message.
  3. Upon clicking "Send Warm Blessing", the button displays a brief sending state, the card animates smoothly into the feed, and other active visitors see the new card appear via real-time snapshot listeners.
  4. Guests can tap the heart icon to like existing wishes, updating the live counter across all connected screens.
- **Visual Harmony**:
  - Maintains the botanical watercolor and gilded border aesthetic (`#FAF7F2` parchment backgrounds, Cormorant Garamond / Playfair Display serif typography, gold accents `#C5A059`).
  - Empty state gently encourages visitors to be the first to leave a blessing.
  - Loading skeleton matches the card layout to prevent layout shift during initial snapshot retrieval.

---

## 3. Key Product Decisions & Trade-Offs

- **Public Anonymous Submission vs. Mandatory Login**:
  - *Chosen Approach*: Allow guests to post without requiring an account login.
  - *Why*: Frictionless wedding UX. Guests receiving an invitation link should not be forced into an OAuth login just to leave a quick congratulatory note.
  - *Security*: Security rules will enforce payload validation (string lengths, required fields, and non-empty messages).
- **Real-Time Snapshots (`onSnapshot`) vs. Polling**:
  - *Chosen Approach*: Firestore `onSnapshot` listener with a query limit of 50 recent wishes.
  - *Why*: Instant multi-user updates without battery-draining polling intervals.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      Client App                        │
│                                                        │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │ GuestbookSection.tsx  │   │   RsvpSection.tsx    │  │
│  └───────────┬───────────┘   └──────────┬───────────┘  │
│              │                          │              │
│              ▼                          ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │              src/services/firebase.ts            │  │
│  │   - subscribeToWishes() (onSnapshot)             │  │
│  │   - addWishToFirestore()                         │  │
│  │   - likeWishInFirestore()                        │  │
│  │   - submitRsvpToFirestore()                      │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │
                              ▼
            ┌───────────────────────────────────┐
            │        Firebase Firestore         │
            │                                   │
            │  Collections:                     │
            │  - /wishes (public read/create)   │
            │  - /rsvps  (public create)        │
            └───────────────────────────────────┘
```

- **Firestore Collections & Schema**:
  - `wishes/{wishId}`:
    - `senderName`: string (1-80 chars)
    - `relationship`: string (1-50 chars)
    - `message`: string (1-600 chars)
    - `likes`: number
    - `createdAt`: serverTimestamp
  - `rsvps/{rsvpId}`:
    - `guestName`: string
    - `attendance`: 'yes' | 'no' | 'maybe'
    - `guestCount`: number (1-10)
    - `eventsAttending`: string[]
    - `message`: string
    - `createdAt`: serverTimestamp
- **Execution Plan**:
  1. Present the standard Firebase setup dialog to provision the Firestore database for this applet.
  2. Create `firebase-blueprint.json` and secure `firestore.rules`.
  3. Deploy the rules using `DeployRules`.
  4. Initialize the Firebase Web SDK in `src/services/firebase.ts` and bind live snapshot subscriptions in `App.tsx` and `GuestbookSection.tsx`.
