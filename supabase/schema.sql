-- Sullivan Fit — Supabase database schema
-- Run this in the Supabase dashboard SQL editor to create all tables.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS throughout.


-- ─────────────────────────────────────────────
-- 1. exercises
--    Master list of exercises (e.g. "Squat", "Bench Press").
--    Each exercise belongs to a day (e.g. "Monday") and a category
--    (e.g. "Strength", "Cardio").
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercises (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  day        text,               -- e.g. "Monday", "Push Day"
  category   text,               -- e.g. "Strength", "Cardio", "Mobility"
  created_at timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 2. workouts
--    Individual sets logged during a workout session.
--    Links to an exercise via exercise_id.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  sets        integer,
  reps        integer,
  load        numeric,            -- weight in kg or lbs
  rpe         numeric,            -- Rate of Perceived Exertion (1–10)
  notes       text,
  created_at  timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 3. nutrition_logs
--    Daily nutrition summary — calories and macros.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date       date NOT NULL,
  calories   numeric,
  protein    numeric,             -- grams
  carbs      numeric,             -- grams
  fats       numeric,             -- grams
  notes      text,
  created_at timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 4. intake_logs
--    Supplements, medications, or any other intake.
--    "type" is free text (e.g. "Creatine", "Vitamin D").
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS intake_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date       date NOT NULL,
  type       text NOT NULL,       -- e.g. "Creatine", "Caffeine", "Melatonin"
  dose       text,                -- e.g. "5g", "200mg"
  notes      text,
  created_at timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 5. wellness_logs
--    Daily subjective and objective wellness check-in.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wellness_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date NOT NULL,
  mood        integer,            -- scale 1–10
  sleep_hours numeric,
  soreness    integer,            -- scale 1–10
  hrv         numeric,            -- Heart Rate Variability in ms
  notes       text,
  created_at  timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 6. health_metrics
--    General-purpose table for any numeric health data point.
--    "metric_type" identifies what was measured (e.g. "weight", "resting_hr").
--    "source" tracks where the data came from (e.g. "Apple Health", "manual").
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_metrics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date NOT NULL,
  metric_type text NOT NULL,      -- e.g. "weight", "body_fat", "resting_hr"
  value       numeric NOT NULL,
  source      text,               -- e.g. "Apple Health", "Withings", "manual"
  created_at  timestamptz DEFAULT now()
);
