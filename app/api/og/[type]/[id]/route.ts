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

    let uint8Array: Uint8Array;
    let contentType = 'image/jpeg';

    // 2. Cek apakah ini Base64 atau URL
    if (data.image_url.startsWith('data:image')) {
      // Handling Base64
      const parts = data.image_url.split(',');
      const base64Data = parts[1];
      const mimeMatch = parts[0].match(/data:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      
      // Konversi ke Uint8Array (Lebih kompatibel dengan Web Response daripada Buffer Node)
      const binaryString = atob(base64Data);
      uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      // Handling External URL
      const response = await fetch(data.image_url);
      const arrayBuffer = await response.arrayBuffer();
      uint8Array = new Uint8Array(arrayBuffer);
      contentType = response.headers.get('content-type') || 'image/jpeg';
    }

    // Fungsi Validasi Ukuran (Optional: Memberikan peringatan jika > 1MB)
    // Crawler WhatsApp biasanya menolak file > 1MB
    const sizeInMB = uint8Array.length / (1024 * 1024);
    if (sizeInMB > 1) {
      console.warn(`OG Image for ${id} is too large: ${sizeInMB.toFixed(2)}MB. Social previews might fail.`);
    }

    // 3. Response dengan Header yang tepat untuk Crawler
    // MENGGUNAKAN BLOB: Ini adalah cara paling standar untuk mengirim binary data dalam Response
    // dan secara otomatis menyelesaikan error TypeScript "BodyInit"
    const imageBlob = new Blob([uint8Array], { type: contentType });

    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': uint8Array.length.toString(),
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (err) {
    console.error('OG Image Proxy Error:', err);
    return NextResponse.redirect(new URL('/og-main.png', request.url));
  }
}
