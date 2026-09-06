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
  chartNote?: string;
  relatedIds?: number[];
  actionView?: {
    horizon: string;
    stance: string;
    catalyst: string;
    invalidation: string;
  };
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

function plainText(text?: string): string {
  return (text || '')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
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

  const researchFrame = React.useMemo(() => {
    const lanes = [
      {
        category: 'Story Line',
        eyebrow: 'Macro Regime',
        description: 'What changed in growth, inflation, and policy.',
        accent: 'border-emerald-500',
      },
      {
        category: 'Trading Ideas',
        eyebrow: 'Portfolio Expression',
        description: 'How the macro view transmits into an asset.',
        accent: 'border-blue-500',
      },
      {
        category: 'Trading Execution',
        eyebrow: 'Execution & Risk',
        description: 'Entry, target, invalidation, and position updates.',
        accent: 'border-cyan-500',
      },
    ];

    return lanes.map(lane => ({
      ...lane,
      insight: sortedInsights.find(insight => insight.category === lane.category),
    }));
  }, [sortedInsights]);

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
        <div className="max-w-7xl mx-auto px-6 py-7 flex items-start justify-between gap-4 sm:items-center sm:gap-8">
          <div>
            <a href="/" className="text-2xl font-bold text-white tracking-tight hover:text-slate-200">
              Genesis Research
            </a>
            <p className="text-slate-300 mt-1 text-sm">
              Global macro research translated into cross-asset positioning
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="/about" className="text-sm font-semibold text-slate-300 hover:text-white">
              About
            </a>
            <div className="hidden text-right sm:block">
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
          <nav className="flex flex-nowrap gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(cat => {
              const isActive = cat === activeCatParam;

              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(cat)}
                  className={`relative shrink-0 py-2 text-sm font-semibold ${
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

        {activeCatParam === 'Insights' && (
          <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Current Research Frame
                </p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  One view, carried from evidence to execution
                </h3>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">Daily Insight</span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">Weekly View</span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">Macro Thesis</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {researchFrame.map(({ category, eyebrow, description, accent, insight }) => (
                <article key={category} className={`rounded-xl border border-slate-200 border-t-4 ${accent} bg-white p-4 shadow-sm`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
                    {insight?.storyType && (
                      <span className="rounded border border-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                        {insight.storyType}
                      </span>
                    )}
                  </div>
                  {insight ? (
                    <>
                      <h4 className="mt-3 text-base font-bold leading-snug text-slate-900">
                        <a className="hover:underline hover:underline-offset-4" href={`/i/${insight.id}?from=%2F`}>
                          {insight.title}
                        </a>
                      </h4>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                        {plainText(insight.summary || insight.fullContent)}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <time className="text-[10px] font-semibold text-slate-400">{formatInsightTime(insight)}</time>
                        <a href={`/i/${insight.id}?from=%2F`} className="text-[10px] font-bold uppercase tracking-wide text-blue-600 hover:text-blue-700">
                          Open view →
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------- */}
        {/* INSIGHTS FEED (unchanged) */}
        {/* ------------------------------------------- */}
        <div className="space-y-6">
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
                className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
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
                <div className="grid gap-6 items-start md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
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
                    {insight.chartNote && <p className="mt-2 text-xs leading-relaxed text-slate-500">{insight.chartNote}</p>}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Investment conclusion
                    </p>
                    <div className="text-slate-700 leading-relaxed text-[15px] mb-4">
                      {renderInline(textToShow?.trim())}
                    </div>

                    {insight.actionView && (
                      <div className="mb-4 border-l-2 border-emerald-500 pl-3">
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          <span>Positioning</span>
                          <span aria-hidden="true">·</span>
                          <span>{insight.actionView.horizon}</span>
                        </div>
                        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-800">
                          {insight.actionView.stance}
                        </p>
                      </div>
                    )}

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
