# FlowRoll-Web — PRD

## Original Problem Statement
Web-based jiu-jitsu training platform focused on learning guard situations, escapes, and counters using video-based lessons. Structured learning system — not a logging app, not a generic social network.

## Architecture
- **Frontend**: React 19 (CRA + Craco), TailwindCSS, shadcn/ui, react-router-dom v7, recharts, lucide-react, sonner toasts.
- **Storage**: `localStorage` only.
  - `flowroll.rounds.v1` — round log
  - `flowroll.sessions.v1` — completed sessions
  - `flowroll.weakness_history.v1` — weakness snapshots
  - `flowroll.streak.v1` — `{streak, bestStreak, lastLogDate}`
  - `flowroll.lesson_progress.v1` — `{positionId:scenarioId: {learned, saved, viewedAt}}`
  - `flowroll.mock_user.v1` — mock auth user
- **Backend**: None yet. Mocked auth and mock data designed to be swapped for Supabase (auth + postgres) with zero UI changes.
- **Auth**: `AuthContext` mirrors Supabase API shape (`signIn`, `signUp`, `signOut`, `user`, `ready`, `updateProfile`). Swap implementation → real cloud sync.

## Routes
- `/` Dashboard · `/library` · `/library/:positionId` · `/lesson/:positionId/:scenarioId` · `/logger` · `/progress`
- `/auth/login` · `/auth/register`
- `/profile` · `/saved` · `/history`
- `/community` · `/coaching` · `/schools` · `/store`

## User Persona
BJJ practitioners (white → black belt) who want structured learning tied to real performance data. Over time: athletes who also want community, private coaching, and local gym discovery.

## Core Requirements
- Dashboard (Today's Focus, Weakness Alert, Continue Training, Browse Library, streak banner, weakness-improvement banner)
- Library (6 positions) → Scenario list → Lesson (HTML5 video, key steps, when-to-use, mistakes, 3-stage drills, Mark as Learned, Save)
- Round Logger with session feedback
- Progress page (stats, weakest banner, loss-rate chart, per-position breakdown)
- Streak tracking (current + best)
- Multi-user placeholder surface: auth, profile, saved progress, training history
- Discover surface: community, coaching (Google Meet), schools, store
- Dark theme, top nav + mobile tabs, card-based, large tap targets, all `data-testid`s

## Implemented
### MVP (2026-02-03)
- 6-screen structure, full BJJ library, HTML5 video, localStorage rounds, design system (Bebas Neue / IBM Plex / Outfit, #FF3B30 / #007AFF on pure black), 14/14 E2E tests

### Streak + Feedback (2026-02-03)
- Persisted streak state (`{streak, bestStreak, lastLogDate}`) updated in `addRound`
- Session improvement toast ("X improved") on Finish Session when loss-rate drops ≥15pp
- Weakness improvement banner ("You are improving in X") when a prior weakness drops ≥10pp

### Multi-user Foundation (2026-02-03)
- `AuthContext` with Supabase-shaped API (mock for now)
- Login / Register pages with belt selector + Google sign-in placeholder
- Profile page (avatar, belt, home gym, editable) with stat overview & links
- Saved Progress page (Learned / Saved tabs, grid of lesson cards)
- Training History page (rounds grouped by day, streak chips)
- Community page (mock threads, category filter, search, sign-in nudge) — training-scoped only
- Coaching page (mock coach cards, Google Meet booking placeholder)
- Schools page (mock gym list, ZIP search, Use My Location, map placeholder)
- Store page (mock product grid, Notify Me placeholder)
- Navbar: primary links + Discover dropdown + UserMenu (avatar-aware)
- Lesson page: Mark as Learned / Save for Later buttons wired to `lessonProgress` module
- `markViewed` called on lesson mount — groundwork for lesson-viewed analytics

### Demo Mode (2026-02-03)
- Fixed bottom-left **DEMO MODE** badge with popover (sample user info, Restart Tour, Reset Demo Data)
- Auto-seeded sample data on first visit: Alex Reyes (Blue Belt), 14 rounds across 12 days with a Mount-improvement arc, streak 4/best 9, weakness history seeded so the improvement banner fires, 3 lessons learned + 2 saved, 2 session recaps
- 5-step guided tour auto-starts on first load: Dashboard → Library → Lesson → Logger → Progress — with progress bar, Next/Back/Skip, and "Take me there" fallback
- All demo state persisted in localStorage under `flowroll.demo_mode.v1` + `flowroll.demo_tour.v1` — tour state survives reloads; once dismissed stays dismissed until manually restarted
- Clear client-preview messaging throughout popover copy

### Performance Module (2026-02-03)
- New **Performance** primary nav item (5th primary link), route `/performance`
- 5 sections on one page, dark/red/grayscale visual language matching the rest of the app:
  1. **Weight Tracker** — quick-add input, current weight + 7-day trend chart (Recharts LineChart), optional target weight + weight class
  2. **Macros** — 4 inline-editable cards (Protein/Carbs/Fats/Calories) with progress bars vs targets and live coaching chips ("Protein target missed", "Good fuel day", "Recovery intake low")
  3. **Hydration** — water counter with quick-add 250/500/750 ml + undo, electrolytes toggle, sauna/heavy-sweat toggle, feedback chip ("Hydration low" / "Good recovery hydration")
  4. **Recovery** — sleep hours input, soreness (1–5) and energy (1–5) rating rows; computes weighted score → status (High/Moderate/Low Recovery) with mat-focused guidance ("Good day for hard rounds" / "Consider drilling-focused training")
  5. **Performance Insights** — deterministic correlation logic (`lib/insights.js`): position loss-rate on low vs high recovery days, protein-hit days vs win rate, low-hydration days vs next-day energy, sleep ≥7h vs win rate. No AI, no LLM.
- Edit-targets dialog for weight class + macro/hydration goals
- All data in localStorage (`flowroll.perf.*` keys); cleared/reseeded by Demo Mode reset
- Demo seed: 8 days of weight trending down 78.4→77.0, 7 days of macros (with hit/miss split that drives the protein insight), 8 days of hydration (with 2 low days), 8 days of recovery (low → high arc lining up with the Mount win streak). Insights fire immediately on demo load.

## Backlog / Next
### P1
- Real Supabase auth swap (replace `AuthContext` internals, keep surface identical)
- Persist rounds / sessions / progress / streak / weakness history per-user in Supabase tables
- Real threads + replies backend (Supabase + realtime)
- Coach availability + Google Calendar booking → real Meet link
- Academy DB + Google Maps on Schools page
- Store: real catalog + Stripe checkout
### P2
- Admin tooling for verified coaches/schools
- Profile avatar upload + home-gym autocomplete (using schools DB)
- Real BJJ video content CMS
- Export data (CSV)
- PWA / offline support

## Known Limitations
- Multi-user features are **mocked locally only** — no real sync between devices
- Google sign-in button is placeholder / disabled
- Google Meet booking toast shows a generated dummy link
- School listings, coach listings, and store products are seed data
- Community threads are read-only preview; new thread click shows informational toast
