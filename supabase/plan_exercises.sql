-- Sullivan Fit — Plan exercises table
-- Stores which exercises are assigned to each day of the 5-day split,
-- and in what order. Run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS plan_exercises (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_key     text NOT NULL,        -- e.g. "D1 – Push"
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Index for fast lookups by day
CREATE INDEX IF NOT EXISTS plan_exercises_day_key_idx
  ON plan_exercises (day_key, sort_order);
