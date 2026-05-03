# FlowRoll-Web — PRD

## Original Problem Statement
Create a React + Vite web application called FlowRoll-Web — a web-based jiu-jitsu training platform focused on learning guard situations, escapes, and counters using video-based lessons. NOT a mobile logging app; a structured learning system. No backend, no auth, local state only.

## Architecture
- **Frontend**: React 19 (CRA + Craco — supervisor configured; equivalent to Vite for the user's purposes), TailwindCSS, shadcn/ui, react-router-dom v7, recharts, lucide-react, sonner toasts.
- **Storage**: `localStorage` (keys: `flowroll.rounds.v1`, `flowroll.sessions.v1`).
- **Backend**: None (not used).
- **Routes**: `/`, `/library`, `/library/:positionId`, `/lesson/:positionId/:scenarioId`, `/logger`, `/progress`.

## User Persona
BJJ practitioners (white → black belt) who want structured learning tied to real performance data. They roll, log rounds, and drill the positions where they lose most.

## Core Requirements (Static)
- Dashboard with Today's Focus + Weakness Alert + Continue Training + Browse Library CTAs
- Training Library with 6 position cards
- Situation View listing scenarios per position
- Lesson page with HTML5 video + key steps + when-to-use + common mistakes + 3-stage drill progression (static / progressive / live)
- Round logger (belt, starting position, result, optional submission, add/finish session)
- Progress page with win/loss stats, loss rate by position, weakest position highlight, recharts bar chart
- Dark theme, top nav, card-based, desktop-first responsive
- All interactive elements have `data-testid`

## Implemented (2026-02-03)
- Complete 6-screen structure with routing and top-nav (desktop + mobile tabs)
- Full BJJ content library: 6 positions × 2–3 scenarios each, with realistic key steps, mistakes, and drill instructions
- Functional HTML5 video player (sample Big Buck Bunny mp4) on every lesson
- Lesson prev/next within a position
- Logger with form validation, session tracking, all-time history, delete + clear-session
- Progress page: stats cards, weakness banner, loss-rate bar chart (weakest bar in red), per-position breakdown
- localStorage persistence of rounds and sessions
- Design system: Bebas Neue display / IBM Plex Sans body / Outfit UI, #FF3B30 primary, #007AFF secondary, `.fr-card` hover lift + red glow
- Toast feedback via sonner on all mutations
- Empty states on Dashboard (no data), Logger (no rounds), Progress (no data)
- Dashboard "Today's Focus" auto-routes Continue Training to weakest position's first scenario once data exists
- 14/14 E2E tests passed (Playwright via testing subagent)

## Backlog / Next
### P1
- Add bookmarks/favorites for lessons (stars icon on scenario cards)
- "Session recap" modal after Finish Session with session-level stats
- Filter/search on library page
- Submission breakdown chart (which submissions you finish / get caught by)

### P2
- Import real BJJ video URLs (current is placeholder Big Buck Bunny)
- Export rounds as CSV
- Keyboard shortcuts for logger
- PWA / offline support
- Add stripes/belt progression tracker

## Known Limitations
- Video content is placeholder (Big Buck Bunny) — no real BJJ footage
- No account sync — localStorage is device-specific
- Weakness Alert requires ≥2 rounds in a position to surface
