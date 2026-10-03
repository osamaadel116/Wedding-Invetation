# Security Specification: Wedding Invitation Firebase Rules

## 1. Data Invariants
1. **RSVP Submissions**: Any guest (or visitor) can create an RSVP, but must provide a valid `guestName` (1-100 chars), valid `attendance` ('yes' | 'no' | 'maybe'), `guestCount` integer (1-10), and server timestamp `createdAt == request.time`. RSVPs cannot be read or listed by unauthenticated public visitors; only the wedding host/admin (`osos11886@gmail.com` or authenticated admin) can read or list all guest RSVPs.
2. **Guestbook Wishes**: Anyone can read wishes (`/wishes/{wishId}`). Visitors can create a wish with `senderName` (1-80 chars), `message` (1-600 chars), `likes == 0`, and server timestamp `createdAt == request.time`. Updates to wishes are strictly constrained to incrementing `likes` by 1. Deletions are restricted to the wedding host/admin.
3. **Wedding Configuration**: Anyone can read the live invitation config (`/weddingConfig/{configId}`). Only the verified wedding host/admin (`osos11886@gmail.com`) can create or update wedding configuration details.
4. **Document IDs**: Document IDs must satisfy `isValidId(id)` (alphanumeric, underscores, hyphens, <= 128 chars).
5. **No Orphaned or Spoofed Writes**: No unauthorized arbitrary fields ("ghost fields") can be written (enforced via `hasOnly()` key allowlisting).

## 2. The "Dirty Dozen" Payloads
1. **Payload 1: Unverified Admin Spoofing** - Attempt to write weddingConfig with unverified email or spoofed claim.
2. **Payload 2: Negative/Excessive Guest Count** - RSVP with `guestCount: -5` or `guestCount: 9999`.
3. **Payload 3: Giant String Denial of Wallet** - Wish submission with 10MB `message` string.
4. **Payload 4: Ghost Field Injection** - RSVP submission containing unauthorized field `isAdmin: true` or `verified: true`.
5. **Payload 5: Invalid Attendance State** - RSVP submission with `attendance: "attending_for_free"`.
6. **Payload 6: Client Timestamp Manipulation** - RSVP or Wish with arbitrary client timestamp instead of `request.time`.
7. **Payload 7: Wish Like Tampering** - Wish update attempting to set `likes: 1000000` or change `message` text.
8. **Payload 8: Public RSVP Snooping** - Unauthenticated list query on `/rsvps` to scrape private guest phone/names/attendance.
9. **Payload 9: Path Traversal / Poisoned ID** - Attempting to create a document with path `../../secrets`.
10. **Payload 10: Unauthorized Config Mutation** - Non-host user attempting to rewrite the bride/groom names or wedding date in `/weddingConfig/default`.
11. **Payload 11: Malicious Delete Attack** - Public guest trying to delete another guest's wish or RSVP.
12. **Payload 12: Empty Required Fields** - Wish creation with empty string senderName `""` or missing required fields.

## 3. Test Runner
See `firestore.rules.test.ts` for automated test suites verifying all 12 payloads trigger `PERMISSION_DENIED`.
