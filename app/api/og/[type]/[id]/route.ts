import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Gunakan service role atau anon key, pastikan RLS mengizinkan select pada tabel blogs/projects
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;
  const table = type === 'blog' ? 'blogs' : 'projects';
  
  // URL Gambar Fallback (Ganti dengan logo brand Anda di folder /public)
  const fallbackImageUrl = new URL('/og-main.png', request.url);

  try {
    // 1. Ambil data dari Supabase
    const { data, error } = await supabase
      .from(table)
      .select('image_url')
      .eq('id', id)
      .single();

    if (error || !data || !data.image_url) {
      console.warn(`OG Proxy: Record ${id} not found or missing image_url in ${table}. Returning fallback.`);
      return NextResponse.redirect(fallbackImageUrl);
    }

    // 2. Fetch gambar asli (mendukung URL HTTP maupun Data URL/Base64)
    const imageResponse = await fetch(data.image_url);
    
    if (!imageResponse.ok) {
      console.error(`OG Proxy: Failed to fetch source image at ${data.image_url}`);
      return NextResponse.redirect(fallbackImageUrl);
    }

    const imageBlob = await imageResponse.blob();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Periksa apakah ukuran file terlalu besar (Crawler seperti WhatsApp membatasi < 1MB atau < 300KB)
    const sizeInBytes = imageBlob.size;
    if (sizeInBytes > 1024 * 1024) {
      console.warn(`OG Proxy: Image for ${id} is ${Math.round(sizeInBytes/1024)}KB. Previews might not show on some platforms.`);
    }

    // 3. Kembalikan Response Gambar
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('OG Image Proxy Fatal Error:', err);
    return NextResponse.redirect(fallbackImageUrl);
  }
}