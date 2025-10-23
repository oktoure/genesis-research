// app/i/[id]/page.tsx
import { notFound } from 'next/navigation';
import insights from '../../data/insights.json';
import type { Metadata, ResolvingMetadata } from 'next';
import { absoluteUrl } from '../../lib/site';
import BackLink from '../../components/BackLink';

type Insight = {
  id: number;
  date?: string;
  category: string;
  categoryColor?: string;
  title: string;
  summary?: string;
  fullContent?: string;
  chartPath?: string;
  chartHeight?: string;
};

export const dynamic = 'force-static';

// Build static params from JSON (SEO + speed)
export function generateStaticParams() {
  return (insights as Insight[]).map((i) => ({ id: String(i.id) }));
}

function findPost(id: string): Insight | undefined {
  const num = Number(id);
  if (Number.isNaN(num)) return undefined;
  return (insights as Insight[]).find((p) => p.id === num);
}

function summarize(i: Insight, max = 160): string {
  const text = i.summary || i.fullContent || '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

// Normalize chart/image src to absolute-from-root if it was written as "charts/..."
// This fixes your Commodities entries where some paths lack a leading "/".
function normalizeSrc(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

// Convert **bold** segments into <strong> nodes (no external deps)
function renderWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={idx} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

// Per-post metadata (Open Graph + Twitter)
export async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const post = findPost(params.id);
  if (!post) return {};

  const title = post.title;
  const description = summarize(post);
  const normalized = normalizeSrc(post.chartPath);
  const ogImage = normalized ? absoluteUrl(normalized) : absoluteUrl(`/i/${params.id}/opengraph-image`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: absoluteUrl(`/i/${params.id}`),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function InsightPage({ params }: { params: { id: string } }) {
  const post = findPost(params.id);
  if (!post) return notFound();

  const chartSrc = normalizeSrc(post.chartPath);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <BackLink fallback="/" />
            <div />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mt-3">{post.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`${post.categoryColor || 'bg-slate-700'} text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>
              {post.category}
            </span>
            {post.date && <time className="text-slate-400 text-xs font-bold">{post.date}</time>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Hero image / chart */}
        <div className="mb-6">
          {chartSrc ? (
            <img
              src={encodeURI(chartSrc)}
              alt={post.title}
              className="w-full h-auto"
              style={post.chartHeight ? { height: post.chartHeight, objectFit: 'contain' } : {}}
            />
          ) : (
            <div className="w-full aspect-[16/9] border border-slate-200 rounded-lg grid place-items-center text-slate-400 text-xs">
              Chart coming soon
            </div>
          )}
        </div>

        {/* Body with **bold** parsing */}
        <article className="prose prose-slate max-w-none">
          <p className="text-[15px] leading-relaxed text-slate-800 text-justify">
            {renderWithBold((post.fullContent || post.summary || '').trim())}
          </p>
        </article>

        {/* Minimal footer actions (no copy-link button) */}
        <div className="mt-8">
          <BackLink fallback="/" />
        </div>
      </main>

      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">© {new Date().getFullYear()} Genesis Research</p>
        </div>
      </footer>
    </div>
  );
}
