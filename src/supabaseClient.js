import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzopbexdrfzxyhetmsrt.supabase.co";

const supabaseAnonKey = "sb_publishable_e88m2FmDuPmg0BiSNOjWQQ_DkZGilNq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
