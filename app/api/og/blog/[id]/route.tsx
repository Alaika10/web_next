import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const title = params.id === 'default' ? 'DataLabs by Alaika Izatul Ilmi' : 'Artikel DataLabs';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          color: 'white',
          padding: '56px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Inter, sans-serif',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '58px', lineHeight: 1.05, fontWeight: 800, maxWidth: '95%' }}>{title}</div>
          <div style={{ fontSize: '26px', opacity: 0.86 }}>Insight Data Science • Machine Learning • AI</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
