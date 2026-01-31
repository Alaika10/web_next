
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only initialize if the URL is a valid string and not a placeholder
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20;

export const supabase = (isValidUrl && isValidKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("Supabase configuration is missing or invalid. Check your environment variables: SUPABASE_URL and SUPABASE_ANON_KEY.");
}
