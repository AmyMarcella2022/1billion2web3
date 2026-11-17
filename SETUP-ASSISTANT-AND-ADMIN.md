# New features – setup

## 1. Make yourself the first admin (required, one time)
Firebase Console → Firestore → **Start collection** `admins` → Document ID = **your login email in lowercase**
(e.g. `you@gmail.com`), add any field (e.g. `email` = same). Then open `/admin` while logged in.
More admins can be added from the Admins tab.

## 2. Publish the security rules
Merge `firestore.rules` into your existing rules (Firestore → Rules). The admin page is only a UI;
these rules are what actually stop non-admins reading users/requests.

## 3. (Optional) email alerts to admins
See `functions-optional/notifyAdmin.js`. Without it, admins are alerted in-app (live red badge on the
Support tab, a popup while the admin page is open, and the browser tab title shows the count).

## What was added
- `DisclaimerModal` – shown when the platform is opened (once per browser session).
- `ChatAssistant` – only on `/dashboard` and `/success`; never on `/module/:id` quiz screens.
  Welcomes first-timers (with a tip), welcomes returners, asks for a review after Module 9,
  refuses quiz questions, and sends unanswerable questions to admins via a form.
- `AdminPage` at `/admin` – overview, users (search/filter/edit/progress/reset/password-reset/delete/CSV),
  support inbox with replies, feedback, chatbot answers, admin management.
- Wallet modal + global light theme: the page now declares `data-theme="light"` / `color-scheme: light`.

Not build-tested in the sandbox (no network) – run `yarn && yarn dev` and `yarn build` first.

## Real AI (OpenAI) setup
1. Vercel → Project → Settings → Environment Variables: add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, default `gpt-4o-mini`). Keep them server-side — no `VITE_` prefix. Redeploy.
2. Re-publish `firestore.rules` (new `botKnowledge` and `botSettings` rules).
3. Admin → **AI knowledge** → add entries about the initiative/platform, then test in “Try the AI”.
4. `/api/chat` only exists on Vercel (or `vercel dev`), not plain `yarn dev`. If it is unreachable the chatbot falls back to its basic built-in answers.
5. `vercel.json` was changed from legacy `routes` to `rewrites` so `/api/*` is not swallowed by the SPA fallback.

Safeguards: login required (Firebase ID token verified server-side), 20 messages / 10 min per learner (soft limit),
replies capped at 400 tokens, knowledge capped at 40k characters, an “AI enabled” kill switch in the admin tab.
The AI is instructed never to help with quiz answers and the app also pre-screens quiz-like questions, but model
instructions are not bulletproof — keep quiz answers out of the knowledge entries.
