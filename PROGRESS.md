# The Lift — Session Progress Log

---

## Session 1 — Sunday, April 12 2026 @ 22:04 CDT

### What Was Built

#### Infrastructure
- GitHub repo: `ikkaruscrane/the-lift` (public)
- Live deploy: https://the-lift.vercel.app (Vercel, auto-deploys on `git push`)
- Local dev: `npm run dev` → http://localhost:3000
- Supabase project: `xfrmdyjeoqsxkluoizxd.supabase.co`
- `.env.local` holds Supabase credentials (git-ignored, never committed)

#### Database (Supabase)
All tables created and live:
- `exercises` — master exercise library (seeded with 105 exercises from Sullivan_Exercise_Library.xlsx)
- `workouts` — individual logged sets
- `nutrition_logs` — daily calorie/macro summaries
- `intake_logs` — supplements and medications
- `wellness_logs` — mood, sleep, soreness, HRV
- `health_metrics` — general numeric health data (Apple Health etc.)
- `plan_exercises` — links exercises to a day slot with a sort order (the 5-day plan)

#### Exercise Library
- Source: `~/Desktop/Training/Sullivan_Exercise_Library.xlsx`
- 105 exercises extracted and seeded into Supabase
- Columns used: name (combined with variant), day, category
- Seed file: `supabase/seed_exercises.sql` (safe to re-run, deletes and re-inserts)

#### App Pages / Components
- `app/layout.js` — elevator shell layout (floor indicator + button panel + content area)
- `app/FloorIndicator.js` — top bar: "THE LIFT" wordmark + current floor name in amber
- `app/ElevatorPanel.js` — left sidebar: circular steel nav buttons, bottom-to-top order
- `app/workout/page.js` — 5-day split planner (Day 1–5 tabs, edit mode, drag-to-reorder)
- `app/page.js` — redirects root to /workout
- `lib/supabase.js` — shared Supabase client

#### Design System
Fully implemented from `DESIGN_NOTES.md`:
- CSS variables (backgrounds, steel tones, amber accent, typography, shadows)
- Elevator button panel with radial gradient + amber glow on active floor
- Glass-surface floor cards (`floor-card` class)
- Fonts: Bebas Neue (display), DM Sans (UI), JetBrains Mono (data)
- Floor transition animation (`floorIn`, 250ms)
- All styles in `app/globals.css` using CSS variables throughout

---

### What Did NOT Work

#### Turbopack CSS Caching Bug
**Problem:** After writing the full design system CSS into `globals.css`, the browser
showed plain white-text-on-black — no layout structure, no sidebar, no styled buttons.

**Root cause:** Turbopack (Next.js 16's default dev bundler) had cached the OLD compiled
CSS and was never recompiling it. The custom CSS classes existed in the source file but
were completely absent from the compiled output served to the browser.

**How to diagnose:**
1. Run `curl -s http://localhost:3000/workout | grep -o 'href="[^"]*\.css[^"]*"'` to find the CSS chunk URL
2. Curl that URL and grep for one of your custom class names
3. If 0 matches → Turbopack is serving stale cache

**Fix — run this whenever styles aren't applying:**
```bash
cd ~/Desktop/Training/the-lift
pkill -f "next dev"
rm -rf .next
npm run dev
```
Then hard-refresh the browser: **Cmd + Shift + R**

**Important:** This can also be triggered by leaving a dev server running while making
structural changes to globals.css. Always restart after significant CSS changes.

---

### Imports Folder
Three drop zones created for future data imports:
- `imports/apple-health/` — for iPhone Health export.zip (Apple Health)
- `imports/nutrition/` — for CSV exports from MyFitnessPal / Cronometer
- `imports/manual/` — for JSON exports from old trackers

Each folder has a plain-English README explaining exactly what to drop there and why.
No import scripts built yet — these are placeholders for a future session.

---

### Key Design Decisions Made

- **Day tabs are generic (Day 1–5)** — not named by split type, so you can freely
  rearrange your training without renaming anything in the app
- **Exercise library is the full 105-exercise xlsx** — all variants included.
  The plan_exercises table is a separate layer on top (library vs. plan is separated)
- **CSS variables everywhere** — never hardcoded colors anywhere in components.
  All styling decisions trace back to `globals.css` `:root` block

---

### Backlog — Features Still to Build

#### High Priority
- [ ] **Workout logger** — once exercises are in the plan, log actual sets/reps/load/RPE
  per session. Needs a date-aware session view ("today's workout") and a logging form
- [ ] **Today view** — show today's planned exercises with input fields to log the session
- [ ] **History** — Floor 2. View past logged sessions by date, filterable by exercise
- [ ] **Nutrition log** — Floor 3. Daily calorie/macro entry form + history

#### Medium Priority
- [ ] **Apple Health import** — parse export.zip, extract HRV/resting HR/weight/steps,
  write to `health_metrics` table
- [ ] **Wellness check-in** — daily form for mood (1–10), sleep hours, soreness, HRV
- [ ] **Trends / Charts** — Floor 4. Weight over time, volume per session, load progression
  per exercise. Consider using Recharts or Chart.js

#### Lower Priority / Nice to Have
- [ ] **Geraldine's view (TRAINER floor)** — coach-facing summary of recent sessions,
  wellness trends, notes
- [ ] **SYNC button** — trigger Apple Health import from within the app
- [ ] **Nutrition CSV import** — parse MyFitnessPal/Cronometer CSV, write to nutrition_logs
- [ ] **Floor transition animations** — sliding up/down between floors based on floor number
  (currently uses a simple fade-in)
- [ ] **Mobile layout** — the elevator panel collapses to a bottom nav on small screens
- [ ] **Authentication** — currently no auth; data is open via anon key. Add Supabase Auth
  if the app is ever shared or made private per-user

---

### Files Worth Knowing

| File | What it does |
|---|---|
| `DESIGN_NOTES.md` | Full design system bible — reference at the start of every session |
| `PROGRESS.md` | This file — session log and backlog |
| `supabase/schema.sql` | Original table definitions |
| `supabase/seed_exercises.sql` | Seeds all 105 exercises — safe to re-run |
| `supabase/plan_exercises.sql` | Creates the plan_exercises table |
| `lib/supabase.js` | Supabase client — import from here, not directly from the package |
| `app/globals.css` | All CSS variables and component classes |
| `app/ElevatorPanel.js` | Left nav — add new floors here when new pages are built |
| `app/FloorIndicator.js` | Top bar — add new path → floor name mappings here |

---

### Prompt to Resume Next Session

Paste this at the start of the next Claude Code session:

```
We're working on The Lift — a personal fitness tracking web app for Jeff Sullivan.
Reference DESIGN_NOTES.md for all styling decisions (elevator metaphor, CSS variables,
Bebas Neue/DM Sans/JetBrains Mono fonts, amber accent, no hardcoded colors).
Reference PROGRESS.md for where we left off and the full backlog.

The app is live at https://the-lift.vercel.app
Local dev: cd ~/Desktop/Training/the-lift && npm run dev

If styles aren't applying after CSS changes: pkill -f "next dev" && rm -rf .next && npm run dev
Then hard-refresh the browser with Cmd+Shift+R.

Today I want to build: [INSERT FEATURE HERE — e.g. "the workout logger / TODAY floor"]
```
```
