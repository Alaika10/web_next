'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { getVerifiedAdminFromCookies } from '../../lib/server-auth';

type MutableTable = 'projects' | 'blogs' | 'certifications' | 'profiles';
const MUTABLE_TABLES: MutableTable[] = ['projects', 'blogs', 'certifications', 'profiles'];

const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase server configuration is missing.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const assertTable = (table: string): MutableTable => {
  if (!MUTABLE_TABLES.includes(table as MutableTable)) {
    throw new Error('Invalid table operation.');
  }
  return table as MutableTable;
};

const assertAdminSession = async () => {
  const cookieStore = cookies();
  const { user } = await getVerifiedAdminFromCookies(cookieStore);

  if (!user) {
    throw new Error('Unauthorized action.');
  }
};

export async function deleteRecord(table: string, id: string) {
  try {
    await assertAdminSession();
    const safeTable = assertTable(table);
    const supabase = getSupabase();
    const queryId = safeTable === 'profiles' ? Number.parseInt(id, 10) : id;

    if (!queryId) {
      throw new Error('Invalid record id.');
    }

    const { error } = await supabase.from(safeTable).delete().eq('id', queryId);
    if (error) throw error;

    revalidatePath('/');
    if (safeTable === 'blogs') revalidatePath('/blog');
    if (safeTable === 'projects') revalidatePath('/projects');
    if (safeTable === 'certifications') revalidatePath('/certifications');
    if (safeTable === 'profiles') revalidatePath('/about');

    return { success: true };
  } catch (error) {
    console.error(`[Server Action] Delete Error (${table}):`, error);
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleBlogFeature(id: string, field: 'is_headline' | 'is_trending', value: boolean) {
  try {
    await assertAdminSession();
    const supabase = getSupabase();
    const { error } = await supabase.from('blogs').update({ [field]: value }).eq('id', id);
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('[Server Action] Toggle Feature Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProfile(profileData: Record<string, unknown>) {
  try {
    await assertAdminSession();
    const supabase = getSupabase();
    const { error } = await supabase.from('profiles').upsert(profileData);
    if (error) throw error;

    revalidatePath('/about');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('[Server Action] Update Profile Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
