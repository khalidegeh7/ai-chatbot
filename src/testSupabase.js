import { supabase } from './supabaseClient';

async function testFetch() {
 
  const { data, error } = await supabase.from("messages").select("*");
if (error) console.error("Supabase fetch error:", error);
else console.log("Supabase data:", data);
}

testFetch();

