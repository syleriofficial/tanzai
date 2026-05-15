import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzopbexdrfzxyhetmsrt.supabase.co";

// Paste your Supabase Publishable key here. Do NOT paste Secret key.
const supabaseAnonKey = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
