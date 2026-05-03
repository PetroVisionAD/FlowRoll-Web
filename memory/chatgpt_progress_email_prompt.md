# ChatGPT Prompt — FlowRoll Web Customer Progress Email

Copy everything below the divider into ChatGPT. It's a single self-contained prompt — just paste and send.

---

You are a senior product marketer helping me write a **customer-facing progress email** for **FlowRoll Web**, a jiu-jitsu training platform I'm building. Below is the full context on the product and where we are in development. After reading it, produce the email (see DELIVERABLE at the end). Do not give me analysis or notes — just the email.

## The product

**FlowRoll Web** is a structured jiu-jitsu training platform. It's not a mobile logger, and it's not a generic social network. The core loop is:

> Study a position → watch a lesson → drill it → log real rolling rounds → see your weakest spot → go back and drill again.

Tech: React + Tailwind on the front end. Supabase planned for auth and database. Today we're running a fully functional client preview build populated with realistic sample data.

## What's live in the preview right now

**The training loop (fully working):**
- **Dashboard** — Today's Focus, Weakness Alert, streak tracking (current + all-time best), weakness-improvement feedback, stat snapshot, quick access to every position.
- **Training Library** — 6 core positions: Closed Guard, Open Guard, Half Guard, Mount, Side Control, Back Control.
- **Scenario view** — realistic situations inside each position (e.g. "Opponent standing in your guard", "Posture broken, opponent stuck low").
- **Lesson pages** — video player, key steps, when to use, common mistakes, three-stage drill progression (static reps → progressive resistance → live goal), plus Mark as Learned and Save for Later buttons.
- **Round Logger** — log each roll with opponent belt, starting position, result, and optional submission. Tracks sessions and all-time history.
- **Progress page** — total rounds, wins/losses, win rate, weakest position banner, loss-rate bar chart, per-position breakdown.

**Performance feedback system:**
- **Training Streak** — consecutive training days with current and best streak.
- **Weakness Alert** — auto-flags the position you're losing most in.
- **Improvement detection** — after a session: "Mount improved" toast when loss rate drops meaningfully. Persistent: "You are improving in Mount — 90% → 57%" when a flagged weakness trends down over time.

**Multi-user foundation (UI live, backend placeholder):**
- Sign-in / register pages with belt selector.
- Profile page (avatar, belt, home gym, editable).
- Saved Progress (Learned + Saved tabs).
- Training History (rounds grouped by day).
- Community (scenario-based threads — *not* a generic feed).
- Coaching (1-on-1 coach directory, "Book via Google Meet" buttons).
- Schools (find gyms near you by ZIP or location).
- Merch store preview.

**Demo Mode (for client previews):**
- Visible "DEMO MODE" badge always on screen.
- Auto-seeded sample user: Alex Reyes, Blue Belt, Gracie Barra Downtown.
- 14 rounds of realistic data across 12 days, deliberately showing a Mount improvement arc (90% loss rate → 57%) so every feedback feature is visible immediately.
- 5-step guided tour that auto-starts on first load: Dashboard → Library → Lesson → Logger → Progress.
- Reset Demo Data and Restart Tour buttons in the badge popover.

## What's mocked / still coming

- Real authentication (Google sign-in is a placeholder button for now).
- Real instructor video content (using a sample clip today).
- Community posting, replies, coaching bookings, real academy database, and the store are preview only.
- All data is local to the browser — no cloud sync yet.

## What's planned next

1. Supabase auth + database for real cloud sync across devices.
2. Google sign-in.
3. Real instructor video library.
4. Community backend (threads, replies, realtime).
5. Real coaching bookings via Google Calendar + Meet.
6. Academy database with Google Maps on the Schools page.
7. Store launch with real catalog and checkout.

## Tone & constraints for the email

- **Audience**: Non-technical customers, clients, early supporters.
- **Tone**: Confident, plain-language, no corporate jargon. Jiu-jitsu people — direct, matty, a little gritty. Avoid buzzwords like "leveraging" or "ecosystem".
- **Length**: ~300–450 words.
- **Structure**: Short intro, what's live to try now, what's coming, one clear call to action (open the preview + run the guided tour).
- **Emphasise**: the preview is pre-loaded with realistic data, so they can see the full loop and the improvement detection within a minute. Mention the guided tour and the DEMO MODE badge so they understand it's a preview, not their own account.
- **Avoid**: Over-promising dates or calling things "launching soon" unless I explicitly include timing.

## DELIVERABLE

Give me, in this exact order, and nothing else:

1. **3 subject line options** (punchy, under 55 characters each).
2. **1 preheader line** (under 90 characters).
3. **The full email body** in plain text, ready to paste into Gmail.
4. **A short version** of the email under 120 words, for clients I've already updated before.

No preamble, no explanation, no markdown headings — just label each of the 4 sections with `---` dividers so I can scan them.
