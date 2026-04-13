// lib/supabase.js
// Creates and exports a single Supabase client instance for use across the app.
// Reads credentials from .env.local — never hardcode these values here.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
