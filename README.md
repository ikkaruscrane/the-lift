# Sullivan Fit — The Lift

A personal fitness tracking web app for logging workouts, nutrition,
wellness, supplements, and health metrics.

---

## What each folder is for

| Folder | Purpose |
|---|---|
| `app/` | The web pages and UI of the app |
| `supabase/` | The database schema (table definitions) |
| `imports/apple-health/` | Drop your Apple Health export.zip here |
| `imports/nutrition/` | Drop CSV food logs from MyFitnessPal etc. here |
| `imports/manual/` | Drop JSON exports from old trackers here |
| `public/` | Images and static files served by the app |

---

## Local setup — step by step

These instructions assume you have already cloned the project.
If you haven't, open Terminal and run:

```
git clone https://github.com/ikkaruscrane/the-lift.git
cd the-lift
```

### 1. Install dependencies

```
npm install
```

### 2. Add your environment variables

Create a file called `.env.local` in the project root (if it doesn't exist)
and add these two lines:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find both values in your Supabase dashboard under
Project Settings → API.

### 3. Run the app locally

```
npm run dev
```

Then open your browser and go to: http://localhost:3000

The app will update automatically as you make changes to the code.

---

## How to deploy updates

Any time you push code to GitHub, Vercel will automatically rebuild
and redeploy the app. No extra steps needed.

```
git add .
git commit -m "describe what you changed"
git push
```

Your live app will be updated at https://the-lift.vercel.app within
about 30 seconds of pushing.

---

## Database

The app uses Supabase (a hosted database) to store all your data.
The table structure is defined in `supabase/schema.sql`.

If you ever need to reset or recreate the database tables, open the
Supabase dashboard, go to SQL Editor, and paste in the contents of
that file.

---

## Need help?

If something isn't working, check:
1. That `.env.local` exists and has both values filled in
2. That you ran `npm install` after cloning
3. That your Supabase project is active (free projects pause after inactivity)
