'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import rawInsights from './data/insights.json'; // keep this file at app/data/insights.json

// (Optional) Keep route static; filtering happens client-side via query string
export const dynamic = 'force-static';

// --- Types aligned to your JSON structure ---
interface Insight {
  id: number;
  date?: string;               // "DD-MM-YYYY"
  category: string;            // "Economics", "Equities", etc.
  categoryColor?: string;      // Tailwind bg-* class
  title: string;
  summary?: string;
  fullContent?: string;
  chartPath?: string;          // relative path to image/svg
  chartHeight?: string;        // e.g., "420px"
}

export default function Page() {
  // Local Suspense wrapper so this page also independently satisfies Next 15 requirement
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-500">Loading…</div>}>
      <ClientHome />
    </Suspense>
  );
}

function ClientHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // "Insights" is the default (unfiltered) view
  const activeCatParam = searchParams.get('cat') || 'Insights';

  // Ensure newest-first (higher id first), consistent with your current behavior
  const sortedInsights: Insight[] = React.useMemo(
    () => [...(rawInsights as Insight[])].sort((a, b) => b.id - a.id),
    []
  );

  // Build category tabs dynamically from JSON, prefixed with "Insights"
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    (rawInsights as Insight[]).forEach(i => i.category && set.add(i.category));
    return ['Insights', ...Array.from(set)];
  }, []);

  // Filter by category unless "Insights" (unfiltered)
  const shownInsights: Insight[] =
    activeCatParam === 'Insights'
      ? sortedInsights
      : sortedInsights.filter(i => i.category === activeCatParam);

  // Expand/collapse long content per card
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  // Lightweight markdown-ish bold handling for **text**
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Genesis Research</h1>
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
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Title */}
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

            return (
              <article key={insight.id} className="border-b border-slate-100 pb-8 last:border-0">
                {/* Meta */}
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`${
                        insight.categoryColor || 'bg-slate-700'
                      } text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}
                    >
                      {insight.category}
                    </span>
                    {insight.date && (
                      <time className="text-slate-500 text-xs font-bold">{insight.date}</time>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{insight.title}</h3>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Chart / Placeholder */}
                  <div className="w-full">
                    {insight.chartPath ? (
                      <img
                        src={encodeURI(insight.chartPath)}
                        alt={insight.title}
                        className="w-full h-auto"
                        style={
                          insight.chartHeight ? { height: insight.chartHeight, objectFit: 'contain' } : {}
                        }
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

                    <button
                      onClick={() => toggleExpand(insight.id)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold self-start flex items-center gap-1 mt-2"
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
