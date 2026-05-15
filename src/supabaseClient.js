import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzopbexdrfzxyhetmsrt.supabase.co";

const supabaseAnonKey =
  "YAHAN_APNA_PUBLISHABLE_KEY_DALO";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
