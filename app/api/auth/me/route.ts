import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabase, getAccessTokenFromCookies, isAuthorizedAdminEmail } from '../../../../lib/server-auth';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = getAccessTokenFromCookies(cookieStore);

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user || !isAuthorizedAdminEmail(data.user.email)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email: data.user.email });
}
