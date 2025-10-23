'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import rawInsights from './data/insights.json';
import ShareButton from './components/ShareButton';
import { absoluteUrl } from './lib/site';

// Keep route static; filtering happens client-side via query string
export const dynamic = 'force-static';

interface Insight {
  id: number;
  date?: string;
  category: string;
  categoryColor?: string;
  title: string;
  summary?: string;
  fullContent?: string;
  chartPath?: string;
  chartHeight?: string;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-500">Loading…</div>}>
      <ClientHome />
    </Suspense>
  );
}

function ClientHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCatParam = searchParams.get('cat') || 'Insights';

  const sortedInsights: Insight[] = React.useMemo(
    () => [...(rawInsights as Insight[])].sort((a, b) => b.id - a.id),
    []
  );

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    (rawInsights as Insight[]).forEach(i => i.category && set.add(i.category));
    return ['Insights', ...Array.from(set)];
  }, []);

  const shownInsights: Insight[] =
    activeCatParam === 'Insights'
      ? sortedInsights
      : sortedInsights.filter(i => i.category === activeCatParam);

  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const renderText = (text?: string) => {
    if (!text) return null;
    if (text.includes('**')) {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return (
        <>
          {parts.map((part, idx) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={idx} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </>
      );
    }
    return <>{text}</>;
  };

  const goToCategory = (cat: string) => {
    if (cat === 'Insights') {
      router.push('/', { scroll: false });
    } else {
      router.push(`/?cat=${encodeURIComponent(cat)}`, { scroll: false });
    }
  };

  // Build a “from” param so /i/[id] knows where to send the user back
  const currentFilterPath = activeCatParam === 'Insights' ? '/' : `/?cat=${encodeURIComponent(activeCatParam)}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Genesis Research</h1>
              <p className="text-slate-400 mt-1 text-xs">Research, timely insights, and transparent trade ideas</p>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs">Last Updated</div>
              <div className="text-white text-sm font-bold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Insights</h2>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <nav className="flex flex-wrap gap-6">
            {categories.map((cat) => {
              const isActive = cat === activeCatParam;
              return (
                <button
                  key={cat}
                  onClick={() => goToCategory(cat)}
                  className={`relative py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat}
                  <span
                    className={`absolute left-0 right-0 -bottom-[1px] h-0.5 ${
                      isActive ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feed */}
        <div className="space-y-10">
          {shownInsights.map((insight) => {
            const isExpanded = expandedId === insight.id;
            const textToShow = isExpanded
              ? (insight.fullContent ?? insight.summary ?? '')
              : (insight.summary ?? insight.fullContent ?? '');

            const detailHref = `/i/${insight.id}?from=${encodeURIComponent(currentFilterPath)}`;
            const shareUrl = absoluteUrl(`/i/${insight.id}`);

            return (
              <article key={insight.id} className="border-b border-slate-100 pb-8 last:border-0">
                <div className="mb-5">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`${
                        insight.categoryColor || 'bg-slate-700'
                      } text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}
                    >
                      {insight.category}
                    </span>
                    {insight.date && <time className="text-slate-500 text-xs font-bold">{insight.date}</time>}

                    {/* Actions */}
                    <div className="ml-auto flex items-center gap-2">
                      <a
                        href={detailHref}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                      >
                        Open post ↗
                      </a>
                      <ShareButton url={shareUrl} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{insight.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Chart / Placeholder */}
                  <div className="w-full">
                    {insight.chartPath ? (
                      <img
                        src={encodeURI(insight.chartPath)}
                        alt={insight.title}
                        className="w-full h-auto"
                        style={insight.chartHeight ? { height: insight.chartHeight, objectFit: 'contain' } : {}}
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] border border-slate-200 rounded-lg grid place-items-center text-slate-400 text-xs">
                        Chart coming soon
                      </div>
                    )}
                  </div>

                  {/* Text + Toggle */}
                  <div className="flex flex-col justify-start">
                    <div className="text-slate-700 leading-relaxed text-[15px] mb-4 text-justify">
                      {renderText(textToShow)}
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={detailHref}
                        className="text-slate-500 hover:text-slate-700 text-xs mt-2 underline"
                      >
                        Open full view →
                      </a>
                      <button
                        onClick={() => toggleExpand(insight.id)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold self-start inline-flex items-center gap-1 mt-2"
                      >
                        {isExpanded ? (
                          <>
                            Show Less <span className="inline-block rotate-180">▾</span>
                          </>
                        ) : (
                          <>
                            Read Full Analysis <span className="inline-block">▾</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {shownInsights.length === 0 && (
            <div className="text-slate-500 text-sm">No posts in this category yet.</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">© {new Date().getFullYear()} Genesis Research</p>
        </div>
      </footer>
    </div>
  );
}
