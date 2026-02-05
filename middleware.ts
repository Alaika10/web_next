import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const isAdmin = (email?: string | null) => !!email && adminEmails.includes(email.toLowerCase());

const createMiddlewareClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;

  if (!accessToken && !refreshToken) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const supabase = createMiddlewareClient();
  if (!supabase) return NextResponse.next();

  let authenticated = false;
  let updatedSession: { access_token: string; refresh_token: string; expires_in: number } | null = null;

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    authenticated = !error && !!data.user && isAdmin(data.user.email);
  }

  if (!authenticated && refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (!error && data.user && data.session && isAdmin(data.user.email)) {
      authenticated = true;
      updatedSession = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      };
    }
  }

  if (pathname.startsWith('/admin') && !authenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  }

  if (pathname === '/login' && authenticated) {
    const response = NextResponse.redirect(new URL('/admin', request.url));
    if (updatedSession) {
      response.cookies.set('sb-access-token', updatedSession.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: updatedSession.expires_in,
      });
      response.cookies.set('sb-refresh-token', updatedSession.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  }

  const response = NextResponse.next();
  if (updatedSession) {
    response.cookies.set('sb-access-token', updatedSession.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: updatedSession.expires_in,
    });
    response.cookies.set('sb-refresh-token', updatedSession.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
