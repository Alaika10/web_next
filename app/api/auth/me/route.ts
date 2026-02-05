import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearAuthCookies, getVerifiedAdminFromCookies } from '../../../../lib/server-auth';

export async function GET() {
  const cookieStore = cookies();
  const { user } = await getVerifiedAdminFromCookies(cookieStore);

  if (!user) {
    clearAuthCookies(cookieStore);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email: user.email });
}
