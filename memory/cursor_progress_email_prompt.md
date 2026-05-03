# Cursor Prompt — FlowRoll Web Customer Progress Email

Copy everything below this line into Cursor (or any LLM chat). It has full project context and a concrete deliverable.

---

## CONTEXT — Hand this to Cursor

You are helping me draft a **customer-facing progress email** for **FlowRoll Web**, a jiu-jitsu training platform currently in active development as a client preview build. I will paste the current project status below. Your job is to produce the email — see DELIVERABLE at the bottom.

## PROJECT SUMMARY

**Product**: FlowRoll Web — a structured, scenario-based jiu-jitsu training platform. Not a mobile logger. Not a social network. The core loop is:

> **Study a position → watch a lesson → drill it → log real rolling rounds → see your weakest spot → go back and drill again.**

**Tech stack**: React + TailwindCSS + shadcn/ui. Frontend-only for the preview; Supabase (auth + postgres) and real integrations planned.

**Current build**: Client preview, fully functional, pre-seeded with realistic sample data. Hosted via a preview URL.

## WHAT'S LIVE IN THE PREVIEW RIGHT NOW

### Core training loop (fully working)
- **Dashboard** — "Today's Focus", "Weakness Alert", streak tracking (current + best), weakness-improvement feedback, stat snapshot, quick access to all 6 positions.
- **Training Library** — 6 positions (Closed Guard, Open Guard, Half Guard, Mount, Side Control, Back Control), each opening to a scenario list.
- **Situation View** — realistic scenarios per position (e.g. "Opponent standing in your guard", "Posture broken, opponent stuck low", etc.).
- **Lesson Page** — HTML5 video player, key steps, "when to use", common mistakes, 3-stage drill progression (static reps → progressive resistance → live goal), plus **Mark as Learned** and **Save for Later** buttons.
- **Round Logger** — log each roll (opponent belt, starting position, result, optional submission), session tracking, all-time history, session-improvement detection ("Mount improved" toast on Finish Session).
- **Progress Page** — total rounds, win/loss, win rate, weakest position banner, loss-rate-by-position bar chart, per-position breakdown.

### Performance feedback system
- **Training Streak** — counts consecutive training days, stores current + all-time best, resets cleanly after a gap >1 day.
- **Weakness Alert** — auto-flags the position with highest loss rate.
- **Improvement detection** — two independent signals:
  - After a session: "Mount improved" when loss rate drops ≥15pp vs prior baseline.
  - Persistent: "You are improving in Mount — 90% → 57%" when a flagged weak position's loss rate drops ≥10pp over time.

### Multi-user foundation (UI only, placeholder)
- **Auth UI** — clean sign-in / register pages with belt selector and Google sign-in placeholder.
- **Profile page** — avatar, belt, home gym (editable), stat overview.
- **Saved Progress** — "Learned" and "Saved" tabs showing lessons the user has marked.
- **Training History** — rounds grouped by day, streak chips.
- **Community** — training-scoped thread list (Closed Guard, Mount, Meetups, etc.). Read-only preview; no generic social feed.
- **Coaching** — coach directory with credentials, hourly rate, availability, "Book via Google Meet" button (mock link).
- **Schools** — find nearby gyms by ZIP or location, affiliation, schedule, distance, directions button.
- **Store** — merch preview (rash guards, gis, shorts, tees, patches, journals) with "Notify Me" placeholder.

### Demo Mode (for client previews)
- Visible **DEMO MODE** badge (fixed bottom-left, always on screen).
- Auto-seeded sample user **Alex Reyes** (Blue Belt · 2 stripes · Gracie Barra Downtown).
- 14 rounds of realistic training data seeded across 12 days, engineered to tell a story: Mount was a weakness (90% loss rate), then recent rounds show a turnaround (57% loss rate → improvement banner fires).
- **Guided tour** auto-starts on first load: 5 steps walking through Dashboard → Library → Lesson → Logger → Progress.
- **Reset Demo Data** and **Restart Guided Tour** buttons in the badge popover.
- Clear "preview build" messaging throughout.

## WHAT'S MOCKED / NOT YET REAL

- Authentication (Google sign-in button is disabled; mock login for now).
- Video content (lesson video placeholder using a public sample mp4).
- Community posts (preview threads only — no ability to post).
- Coaching bookings (generates mock Google Meet link on click).
- School listings (seed data, not a real academy database).
- Store products (preview only, no checkout).
- All user data is local to the browser (localStorage); no cloud sync yet.

## WHAT'S PLANNED NEXT

1. **Supabase integration** — real auth, cloud sync for rounds / streak / lesson progress, multi-device support.
2. **Google auth** — replace the placeholder sign-in button.
3. **Real video content** — swap placeholder mp4 for instructor-recorded lessons.
4. **Community backend** — Supabase + realtime for threads, replies.
5. **Real coaching bookings** — Google Calendar + Meet link generation.
6. **Academy database + Google Maps** — on the Schools page.
7. **Store launch** — real catalog + Stripe checkout.

## EMAIL TONE & CONSTRAINTS

- **Audience**: Non-technical customers / clients / stakeholders.
- **Tone**: Confident, plain-language, no jargon. Friendly but focused. This is a jiu-jitsu product — stay on-brand (direct, matty, not corporate).
- **Length**: ~300–450 words.
- **Structure**: Short intro → what's live to try now → what's coming → a single clear CTA (open the preview link + run the guided tour).
- **Don't**: Overclaim. Don't say things are "launching soon" without qualifying. Don't promise dates unless I include them.
- **Do**: Emphasise that the preview is loaded with realistic data so they can see the full loop immediately. Mention the guided tour. Mention the DEMO MODE badge so they know it's a preview, not their own account.

## DELIVERABLE

Produce **one customer-facing progress email** with:

1. **Subject line** (3 variations to choose from).
2. **Preheader** (one line).
3. **Email body** in plain text, ready to paste into Gmail / a mail tool.

Then optionally: a **short version** (under 120 words) for clients I've already updated once before.

Do not add any code, markdown formatting, or analysis around the email — just the deliverable.
