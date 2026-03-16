import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ultimate Tools — Free Online Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #6750A4 0%, #38006b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            marginBottom: 24,
            letterSpacing: '-2px',
          }}
        >
          Ultimate Tools
        </div>
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 16,
          }}
        >
          160+ Free Online Tools
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: 32,
            fontSize: 22,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          <span>Converters</span>
          <span>·</span>
          <span>Calculators</span>
          <span>·</span>
          <span>Generators</span>
          <span>·</span>
          <span>Dev Tools</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          ulti-tools.com — Free · No Registration · Works in Browser
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
