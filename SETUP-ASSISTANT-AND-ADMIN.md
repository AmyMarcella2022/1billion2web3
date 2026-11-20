# Setup — assistant, admin page, AI

## 0. Module NFT minting fix (function-source-updated.zip) — do this first
Root causes found: (1) backend called `batchMint()` which does not exist on NineModulesSBNFT; (2) it sent module ids
0-8 but the contract uses 1-9, so `hasUserMinted(wallet, 0)` reverted before any tx was sent; (3) a failed attempt left
the job "pending" forever (no trigger retried it). Fixed in `mintingService.js`, `constants.js`, `mintQueueTrigger.js`.
Deploy functions, then in Admin → **Minting & LOTUS** press **Restart stalled jobs** to re-run the jobs from your last trial.
Also confirm the `MINTER_PRIVATE_KEY` secret is the wallet that OWNS the contract (the code now checks this and says so).

## 1. Backend (function-source-updated.zip)
Copy `src/triggers/platformAdminFunctions.js` and the updated `src/index.js` into your functions project, then
`firebase deploy --only functions`. This adds `onAdminAdded`, `onAdminRemoved` (keep the `admin` custom claim your
existing callables require in sync with the Admin list) and `adminSetWallet`.

## 2. Rules — ADD, don't replace
Paste the blocks in `firestore.rules.ADDITIONS.txt` into your existing `firestore.rules` (inside the
`documents` match), publish. Your existing blocks and `test/firestoreRules.test.js` are unaffected.

## 3. First admin
Firestore → collection `admins` → document ID = your login email in lowercase (any field). The function grants the
claim; **log out and back in once**, then open `/admin`. After that, add/remove admins from the Admins tab.

## 4. AI (OpenAI)
Vercel → Settings → Environment Variables: `OPENAI_API_KEY` (optional `OPENAI_MODEL`, default gpt-4o-mini; no `VITE_`
prefix). Redeploy. Add knowledge in Admin → AI knowledge and test it there. `/api/chat` only exists on Vercel / `vercel dev`.

## Notes
- Admin progress view is read-only on purpose: progress is written only by quiz → scoreboard → minting pipeline
  (a hand edit would trigger the progress bridge, credit the *admin's* email, and could create LOTUS entitlements).
- Mint / LOTUS actions call your existing admin callables; "Manually trigger mint" really queues on-chain mints.
- Not build-tested here (no network): run `yarn build` and deploy to a test project first.

## Light / dark mode & mobile
Theme toggle: bottom-left on public pages, in the header on dashboard/quiz/admin. Choice is saved; default follows the device.
Chatbot, admin, popups and all pages use theme tokens (`--qa-*` in index.css / daisyUI). Phones get a bottom-sheet chatbot,
44px touch targets, 16px inputs (no iOS zoom), `100dvh` layouts and safe-area padding for notches.
