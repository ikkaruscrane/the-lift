# Manual Imports

## What to drop here
JSON files exported from your old fitness tracker or any other tool
that doesn't have a standard CSV export.

## Expected format
Each file should be a JSON array of records. Example for workouts:

```json
[
  {
    "date": "2024-01-15",
    "exercise": "Squat",
    "sets": 4,
    "reps": 6,
    "load": 120,
    "rpe": 8,
    "notes": "Felt strong"
  }
]
```

## Supported data types
You can drop JSON files for any of these:
- **workouts** — sets, reps, load, RPE
- **wellness** — mood, sleep, soreness, HRV
- **nutrition** — calories, protein, carbs, fats
- **intake** — supplements, medications and doses

## What happens next
A future import script will read these files and load the records
into the correct tables in your Supabase database.

## Naming tip
Name your files clearly so you know what's in them, e.g.:
- `workouts-2024.json`
- `wellness-jan-2025.json`
