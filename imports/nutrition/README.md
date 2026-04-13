# Nutrition Imports

## What to drop here
CSV files exported from your food tracking app (e.g. MyFitnessPal, Cronometer, Lose It).

## How to export from common apps

### MyFitnessPal
1. Go to myfitnesspal.com on a browser (not the app)
2. Click your username → **"Export Data"**
3. Choose a date range and download the CSV
4. Drop the file here

### Cronometer
1. Go to cronometer.com on a browser
2. Click **"Export Data"** in the top menu
3. Select **"Servings"** export and download
4. Drop the file here

## What the file should contain
Each row should represent one day or one food entry with columns like:
- Date
- Calories
- Protein (g)
- Carbohydrates (g)
- Fat (g)

## What happens next
A future import script will read these CSVs and load the data into
the `nutrition_logs` table in your Supabase database.
