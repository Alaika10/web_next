import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ONE_MB = 1024 * 1024;
const TARGET_WIDTH = 1200;
const RESIZE_QUALITIES = [80, 70, 60, 50];

function withSearchParams(input: string, params: Record<string, string>) {
  const url = new URL(input);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function getResizeCandidates(imageUrl: string): string[] {
  const candidates = [imageUrl];

  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    return candidates;
  }

  try {
    const parsed = new URL(imageUrl);

    if (parsed.hostname.includes('supabase.co') && parsed.pathname.includes('/storage/v1/object/public/')) {
      const renderPath = parsed.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const baseRenderUrl = `${parsed.origin}${renderPath}`;
      RESIZE_QUALITIES.forEach((quality) => {
        candidates.push(
          withSearchParams(baseRenderUrl, {
            width: String(TARGET_WIDTH),
            quality: String(quality),
            resize: 'contain',
          })
        );
      });
    }

    if (parsed.hostname.includes('images.unsplash.com')) {
      RESIZE_QUALITIES.forEach((quality) => {
        candidates.push(
          withSearchParams(imageUrl, {
            w: String(TARGET_WIDTH),
            q: String(quality),
            fit: 'max',
            auto: 'format',
          })
        );
      });
    }
  } catch {
    return candidates;
  }

  return candidates;
}

async function fetchOptimizedImage(imageUrl: string) {
  const tried: { url: string; size?: number; ok: boolean }[] = [];

  for (const candidate of getResizeCandidates(imageUrl)) {
    try {
      const response = await fetch(candidate, {
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        tried.push({ url: candidate, ok: false });
        continue;
      }

      const imageBlob = await response.blob();
      tried.push({ url: candidate, size: imageBlob.size, ok: true });

      if (imageBlob.size <= ONE_MB) {
        return {
          blob: imageBlob,
          contentType: response.headers.get('content-type') || 'image/jpeg',
          finalUrl: candidate,
          attempts: tried,
        };
      }
    } catch {
      tried.push({ url: candidate, ok: false });
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const { type, id } = params;

  if (type !== 'blog' && type !== 'project') {
    return NextResponse.json({ error: 'Invalid OG type' }, { status: 400 });
  }

  const table = type === 'blog' ? 'blogs' : 'projects';
  const fallbackImageUrl = new URL('/og-main.png', request.url);

  try {
    const { data, error } = await supabase
      .from(table)
      .select('image_url')
      .eq('id', id)
      .single();

    if (error || !data || !data.image_url) {
      return NextResponse.redirect(fallbackImageUrl);
    }

    const optimizedImage = await fetchOptimizedImage(data.image_url);
    if (!optimizedImage) {
      return NextResponse.redirect(fallbackImageUrl);
    }

    const finalSizeKb = Math.round(optimizedImage.blob.size / 1024);
    if (optimizedImage.blob.size > ONE_MB) {
      console.warn(`OG Proxy: image remains ${finalSizeKb}KB after optimization for ${type}/${id}.`);
    }

    return new NextResponse(optimizedImage.blob, {
      status: 200,
      headers: {
        'Content-Type': optimizedImage.contentType,
        'Cache-Control': 'public, max-age=604800, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('OG Image Proxy Fatal Error:', err);
    return NextResponse.redirect(fallbackImageUrl);
  }
}
