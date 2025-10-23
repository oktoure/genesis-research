// app/i/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import insights from '../../data/insights.json';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Insight = {
  id: number;
  date?: string;
  category: string;
  categoryColor?: string;
  title: string;
  summary?: string;
  fullContent?: string;
};

export default async function OGImage({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  const post = (insights as Insight[]).find((p) => p.id === idNum);

  const title = post?.title ?? 'Genesis Research';
  const category = post?.category?.toUpperCase() ?? 'INSIGHT';
  const date = post?.date ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #0b1220 100%)',
          color: 'white',
          padding: '48px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
          {/* Top: brand */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 0.5}}>GENESIS RESEARCH</div>
            <div style={{fontSize: 18, opacity: 0.8}}>{date}</div>
          </div>

          {/* Middle: title */}
          <div style={{marginTop: 24, marginBottom: 24}}>
            <div
              style={{
                display: 'inline-block',
                fontSize: 16,
                fontWeight: 800,
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                letterSpacing: 1.5,
              }}
            >
              {category}
            </div>
            <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginTop: 18, maxWidth: 980}}>
              {title}
            </div>
          </div>

          {/* Bottom: footer */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9}}>
            <div style={{fontSize: 20}}>Research • Timely insights • Transparent trade ideas</div>
            <div style={{fontSize: 18}}>genesis-research.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
