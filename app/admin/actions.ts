
'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Helper untuk inisialisasi Supabase client secara aman di sisi server
const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseKey);
};

export async function deleteRecord(table: string, id: string) {
  try {
    const supabase = getSupabase();
    
    // Konversi ID ke angka jika tabelnya adalah profiles (menggunakan SERIAL)
    const queryId = table === 'profiles' ? parseInt(id) : id;
    
    const { error } = await supabase.from(table).delete().eq('id', queryId);
    if (error) throw error;

    // Revalidasi halaman yang terpengaruh
    revalidatePath('/');
    if (table === 'blogs') revalidatePath('/blog');
    if (table === 'projects') revalidatePath('/projects');
    if (table === 'certifications') revalidatePath('/certifications');
    if (table === 'profiles') revalidatePath('/about');

    return { success: true };
  } catch (error) {
    console.error(`[Server Action] Delete Error (${table}):`, error);
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleBlogFeature(id: string, field: 'is_headline' | 'is_trending', value: boolean) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('blogs').update({ [field]: value }).eq('id', id);
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error(`[Server Action] Toggle Feature Error:`, error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProfile(profileData: any) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('profiles').upsert(profileData);
    if (error) throw error;

    revalidatePath('/about');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error(`[Server Action] Update Profile Error:`, error);
    return { success: false, error: (error as Error).message };
  }
}
