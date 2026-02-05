import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabase, isAuthorizedAdminEmail, setAuthCookies } from '../../../../lib/server-auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    if (!isAuthorizedAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'Account is not authorized as admin.' }, { status: 403 });
    }

    setAuthCookies(data.session, cookies());
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to login.' }, { status: 500 });
  }
}
