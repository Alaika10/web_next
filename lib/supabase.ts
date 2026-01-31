
import { createClient } from '@supabase/supabase-js';

// Di Next.js, variabel yang diakses di client-side WAJIB diawali dengan NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20;

export const supabase = (isValidUrl && isValidKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("Supabase configuration is missing or invalid. Pastikan variabel NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diatur di .env.local");
}
