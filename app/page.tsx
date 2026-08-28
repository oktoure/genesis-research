// app/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import rawInsights from './data/insights.json';
import ChartZoom from './components/ChartZoom';

export const dynamic = 'force-static';

interface Insight {
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
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-500">
        Loading…
      </div>
    }>
      <ClientHome />
    </Suspense>
  );
}

/* ---------- Formatting helpers (unchanged) ---------- */

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

function renderInline(text?: string): React.ReactNode {
  if (!text) return null;
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(text)) !== null) {
    const [full, label, href] = m;

    if (m.index > last) out.push(...renderBold(text.slice(last, m.index)));

    out.push(
      <a key={`a${m.index}`} href={href} className="underline underline-offset-2 hover:opacity-80">
        {label}
      </a>
    );
    last = m.index + full.length;
  }

  if (last < text.length) out.push(...renderBold(text.slice(last)));

  return <>{out}</>;
}

function insightTimeValue(insight: Insight): number {
  if (insight.publishedAt) {
    const exact = Date.parse(insight.publishedAt);
    if (!Number.isNaN(exact)) return exact;
  }
  const match = insight.date?.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) return Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12);
  return 0;
}

function formatInsightTime(insight: Insight): string {
  if (!insight.publishedAt) return insight.date || '';
  const parsed = new Date(insight.publishedAt);
  if (Number.isNaN(parsed.getTime())) return insight.date || insight.publishedAt;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Toronto',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(parsed);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value || '';
  return `${part('day')}-${part('month')}-${part('year')} · ${part('hour')}:${part('minute')} ET`;
}

/* ---------------------------------------------------- */

function ClientHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCatParam = searchParams.get('cat') || 'Insights';

  // Newest-first by exact event/post time when available; legacy dates remain supported.
  const sortedInsights: Insight[] = React.useMemo(
    () => [...rawInsights].sort((a, b) => insightTimeValue(b) - insightTimeValue(a) || b.id - a.id),
    []
  );

  // Keep the recurring editorial spine visible even before a backfill post
  // exists. Remaining research categories continue to come from the data.
  const categories = React.useMemo(() => {
    const editorialSpine = [
      'Story Line',
      'Trading Ideas',
      'Trading Execution',
    ];
    const dynamic = new Set<string>();
    rawInsights.forEach(i => {
      if (i.category && !editorialSpine.includes(i.category)) dynamic.add(i.category);
    });
    return ['Insights', ...editorialSpine, ...Array.from(dynamic)];
  }, []);

  // Filter posts
  const shownInsights =
    activeCatParam === 'Insights'
      ? sortedInsights
      : sortedInsights.filter(i => i.category === activeCatParam);

  // Expand toggle
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const toggleExpand = (id: number) =>
    setExpandedId(prev => (prev === id ? null : id));

  // Category navigation
  const goToCategory = (cat: string) => {
    if (cat === 'Insights') router.push('/', { scroll: false });
    else router.push(`/?cat=${encodeURIComponent(cat)}`, { scroll: false });
  };

  const currentFilterPath =
    activeCatParam === 'Insights'
      ? '/'
      : `/?cat=${encodeURIComponent(activeCatParam)}`;

  return (
    <div className="min-h-screen bg-white">

      {/* ------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------- */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Genesis Research
            </h1>
            <p className="text-slate-400 mt-1 text-xs">
              Research, timely insights, and transparent trade ideas
            </p>
          </div>

          <div className="text-right">
            <div className="text-slate-400 text-xs">Last Updated</div>
            <div className="text-white text-sm font-bold">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------- */}
      {/* NAVIGATION: Insights */}
      {/* ------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 mt-6 mb-6">
        <nav className="flex gap-6 border-b border-slate-200 pb-2">
          <span className="py-2 text-sm font-semibold text-slate-900 border-b-2 border-blue-600">
            Insights
          </span>
        </nav>
      </div>
      {/* ------------------------------------------- */}
      {/* TITLE */}
      {/* ------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Insights
        </h2>

        {/* ------------------------------------------- */}
        {/* CATEGORY TABS */}
        {/* ------------------------------------------- */}
        <div className="mb-8 border-b border-slate-200">
          <nav className="flex flex-wrap gap-6">
            {categories.map(cat => {
              const isActive = cat === activeCatParam;

              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(cat)}
                  className={`relative py-2 text-sm font-semibold ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ------------------------------------------- */}
        {/* INSIGHTS FEED (unchanged) */}
        {/* ------------------------------------------- */}
        <div className="space-y-10">
          {shownInsights.map(insight => {
            const isExpanded = expandedId === insight.id;
            const textToShow = isExpanded
              ? insight.fullContent ?? insight.summary
              : insight.summary ?? insight.fullContent;

            const detailHref = `/i/${insight.id}?from=${encodeURIComponent(
              currentFilterPath
            )}`;

            return (
              <article
                key={insight.id}
                className="relative border-b border-slate-100 pb-8 last:border-0"
              >
                {/* Meta */}
                <div className="mb-5">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`${insight.categoryColor || 'bg-slate-700'}
                        text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}
                    >
                      {insight.category}
                    </span>

                    {(insight.date || insight.publishedAt) && (
                      <time className="text-slate-500 text-xs font-bold">
                        {formatInsightTime(insight)}
                      </time>
                    )}

                    {insight.storyType && (
                      <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider border border-slate-200 rounded px-2 py-0.5">
                        {insight.storyType}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold leading-snug">
                    <a
                      href={detailHref}
                      className="text-slate-900 hover:underline underline-offset-4"
                    >
                      {insight.title}
                    </a>
                  </h3>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Chart */}
                  <div>
                    {insight.chartPath ? (
                      <ChartZoom
                        src={insight.chartPath}
                        alt={insight.title}
                        height={insight.chartHeight}
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] border border-slate-200 rounded-lg grid place-items-center text-slate-400 text-xs">
                        Chart coming soon
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col">
                    <div className="text-slate-700 leading-relaxed text-[15px] mb-4 text-justify">
                      {renderInline(textToShow?.trim())}
                    </div>

                    <button
                      onClick={() => toggleExpand(insight.id)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          Show Less <span className="rotate-180">▾</span>
                        </>
                      ) : (
                        <>
                          Read Full Analysis <span>▾</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {shownInsights.length === 0 && (
            <div className="text-slate-500 text-sm">
              No posts in this category yet.
            </div>
          )}
        </div>
      </main>

      {/* ------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------- */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">
            © {new Date().getFullYear()} Genesis Research
          </p>
        </div>
      </footer>
    </div>
  );
}
