// app/i/[id]/page.tsx
import { notFound } from 'next/navigation';
import insights from '../../data/insights.json';
import type { Metadata, ResolvingMetadata } from 'next';
import { absoluteUrl } from '../../lib/site';

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

// Small util to pick the post
function findPost(id: string): Insight | undefined {
  const num = Number(id);
  if (Number.isNaN(num)) return undefined;
  return (insights as Insight[]).find((p) => p.id === num);
}

// Trim description safely
function summarize(i: Insight, max = 160): string {
  const text = i.summary || i.fullContent || '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
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

  // Prefer the chart as OG image if available, otherwise our OG route
  const ogImage = post.chartPath
    ? absoluteUrl(post.chartPath)
    : absoluteUrl(`/i/${params.id}/opengraph-image`);

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

  const detailHref = `/i/${post.id}`;
  const shareUrl = absoluteUrl(detailHref);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <a href="/" className="text-slate-300 text-xs underline">← Back to Insights</a>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">{post.title}</h1>
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
          {post.chartPath ? (
            <img
              src={encodeURI(post.chartPath)}
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

        {/* Body */}
        <article className="prose prose-slate max-w-none">
          <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {(post.fullContent || post.summary || '').trim()}
          </p>
        </article>

        {/* Share */}
        <div className="mt-8 flex items-center gap-3">
          <a
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Back
          </a>
          {/* Use a tiny inline client share button to avoid adding a global client boundary here */}
          {/* This can also be a normal <a> if you don't want client JS. */}
          <span className="text-slate-400 text-xs">Share:</span>
          <a
            href={shareUrl}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Copy link in your app
          </a>
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
