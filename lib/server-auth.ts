import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';

const getSupabaseUrl = () => {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return value;
};

const getSupabaseAnonKey = () => {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return value;
};

export const createServerSupabase = () =>
  createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const setAuthCookies = (session: { access_token: string; refresh_token: string; expires_in: number }, cookieStore: ReturnType<typeof cookies>) => {
  cookieStore.set(ACCESS_COOKIE, session.access_token, {
    ...authCookieOptions,
    maxAge: session.expires_in,
  });

  cookieStore.set(REFRESH_COOKIE, session.refresh_token, {
    ...authCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearAuthCookies = (cookieStore: ReturnType<typeof cookies>) => {
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
};

export const getAccessTokenFromCookies = (cookieStore: ReturnType<typeof cookies>) => cookieStore.get(ACCESS_COOKIE)?.value;

export const getAllowedAdminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAuthorizedAdminEmail = (email?: string | null) => {
  if (!email) return false;
  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.length) return false;
  return allowedEmails.includes(email.toLowerCase());
};
