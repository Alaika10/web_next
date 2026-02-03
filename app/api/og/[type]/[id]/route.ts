import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Admin (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;
  const table = type === 'blog' ? 'blogs' : 'projects';

  try {
    // 1. Ambil data dari Supabase
    const { data, error } = await supabase
      .from(table)
      .select('image_url')
      .eq('id', id)
      .single();

    if (error || !data || !data.image_url) {
      return NextResponse.redirect(new URL('/og-main.png', request.url));
    }

    // 2. Ambil data gambar menggunakan fetch
    // fetch() di modern Node.js/Next.js mendukung 'http' dan 'data:' (Base64)
    const imageResponse = await fetch(data.image_url);
    
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image data');
    }

    const imageBlob = await imageResponse.blob();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const contentLength = imageResponse.headers.get('content-length');

    // 3. Response dengan Header yang tepat untuk Crawler
    // Menggunakan objek Blob langsung ke NextResponse adalah cara paling aman secara tipe data (Type-safe)
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentLength && { 'Content-Length': contentLength }),
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (err) {
    console.error('OG Image Proxy Error:', err);
    // Jika terjadi error, kirim gambar default
    return NextResponse.redirect(new URL('/og-main.png', request.url));
  }
}
