
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20;

if (!isValidUrl || !isValidKey) {
  console.error("❌ Supabase Config Error: Variabel lingkungan NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY tidak valid atau belum diset.");
}

export const supabase = (isValidUrl && isValidKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
