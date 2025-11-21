import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase ANON KEY:", SUPABASE_ANON_KEY.slice(0, 10) + "...");
