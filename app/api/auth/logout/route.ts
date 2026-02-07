import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearAuthCookies } from '../../../../lib/server-auth';

export async function POST() {
  clearAuthCookies(cookies());
  return NextResponse.json({ success: true });
}
