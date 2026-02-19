import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function resolveImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/')) return imageUrl;
  return `/${imageUrl}`;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseClient();

  let title = 'DataLabs by Alaika Izatul Ilmi';
  let imageUrl: string | null = null;

  if (supabase && params.id !== 'default') {
    const { data: post } = await supabase
      .from('blogs')
      .select('title, image_url')
      .eq('id', params.id)
      .single();

    if (post?.title) title = post.title;
    imageUrl = resolveImageUrl(post?.image_url);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          color: 'white',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.52)',
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: '54px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.85) 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              opacity: 0.95,
            }}
          >
            <div style={{ width: '16px', height: '16px', borderRadius: '999px', background: '#a5b4fc' }} />
            DataLabs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '58px', lineHeight: 1.05, fontWeight: 800, maxWidth: '95%' }}>{title}</div>
            <div style={{ fontSize: '24px', opacity: 0.88 }}>Insight Data Science • Machine Learning • AI</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'cache-control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
