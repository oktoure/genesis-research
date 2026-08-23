// app/i/[id]/page.tsx
import { notFound } from 'next/navigation';
import insights from '../../data/insights.json';
import type { Metadata, ResolvingMetadata } from 'next';
import { absoluteUrl } from '../../lib/site';
import BackLink from '../../components/BackLink';
import ChartZoom from '../../components/ChartZoom';
import React from 'react';

type Insight = {
  id: number;
  date?: string;
  publishedAt?: string;
  category: string;
  categoryColor?: string;
  storyType?: string;
  title: string;
  summary?: string;
  fullContent?: string;
  chartPath?: string;
  chartHeight?: string;
};

export const dynamic = 'force-static';

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

function normalizeSrc(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

function formatInsightTime(post: Insight): string {
  if (!post.publishedAt) return post.date || '';
  const parsed = new Date(post.publishedAt);
  if (Number.isNaN(parsed.getTime())) return post.date || post.publishedAt;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Toronto',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(parsed);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value || '';
  return `${part('day')}-${part('month')}-${part('year')} · ${part('hour')}:${part('minute')} ET`;
}

/** Keep **bold** behavior */
function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`b${idx}`} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`t${idx}`}>{part}</span>
    )
  );
}

/** Minimal inline links + bold: supports [label](url) (absolute or root-relative) */
function renderInline(text: string): React.ReactNode[] {
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(text)) !== null) {
    const [full, label, href] = m;
    if (m.index > last) out.push(...renderBold(text.slice(last, m.index)));
    out.push(
      <a
        key={`a${m.index}`}
        href={href}
        className="underline underline-offset-2 hover:opacity-80"
      >
        {label}
      </a>
    );
    last = m.index + full.length;
  }
  if (last < text.length) out.push(...renderBold(text.slice(last)));
  return out;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;  // ✅ On attend la Promise ICI
  const post = findPost(id);
  if (!post) return {};

  const title = post.title;
  const description = summarize(post);
  const normalized = normalizeSrc(post.chartPath);
  const ogImage = normalized
    ? absoluteUrl(normalized)
    : absoluteUrl(`/i/${id}/opengraph-image`);  // ✅ Utilise 'id' ici, pas 'params.id'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: absoluteUrl(`/i/${id}`),  // ✅ Et ici aussi
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
// APRÈS
export default async function InsightPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const post = findPost(id);
  if (!post) return notFound();

  const chartSrc = normalizeSrc(post.chartPath);

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="w-full bg-slate-900 border-b border-slate-800">
        <div className="w-full max-w-3xl mx-auto px-6 py-6">
          {/* Single Back button, always visible on dark header */}
          <BackLink fallback="/" variant="solidOnDark" />

          <h1 className="text-2xl font-bold text-white tracking-tight mt-3">{post.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`${post.categoryColor || 'bg-slate-700'} text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}
            >
              {post.category}
            </span>
            {(post.date || post.publishedAt) && (
              <time className="text-slate-400 text-xs font-bold">{formatInsightTime(post)}</time>
            )}
            {post.storyType && (
              <span className="text-slate-300 text-[10px] font-semibold uppercase tracking-wider border border-slate-600 rounded px-2 py-0.5">
                {post.storyType}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-8">
        {/* Chart */}
        <div className="mb-6">
          {chartSrc ? (
            <ChartZoom
              src={chartSrc}
              alt={post.title}
              height={post.chartHeight}
            />
          ) : (
            <div className="w-full aspect-[16/9] border border-slate-200 rounded-lg grid place-items-center text-slate-400 text-xs">
              Chart coming soon
            </div>
          )}
        </div>

        {/* Body */}
        <article className="prose prose-slate max-w-none">
          <p className="text-[15px] leading-relaxed text-slate-800 text-justify">
            {renderInline((post.fullContent || post.summary || '').trim())}
          </p>
        </article>
      </main>

      <footer className="w-full border-t border-slate-100 mt-12">
        <div className="w-full max-w-3xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">
            © {new Date().getFullYear()} Genesis Research
          </p>
        </div>
      </footer>
    </div>
  );
}
