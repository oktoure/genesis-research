// app/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import rawInsights from './data/insights.json';

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

/* helpers unchanged */

function ClientHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCatParam = searchParams.get('cat') || 'Insights';

  const sortedInsights = React.useMemo(
    () => [...rawInsights].sort((a, b) => b.id - a.id),
    []
  );

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    rawInsights.forEach(i => i.category && set.add(i.category));
    return Array.from(set);
  }, []);

  const shownInsights =
    activeCatParam === 'Insights'
      ? sortedInsights
      : sortedInsights.filter(i => i.category === activeCatParam);

  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const goToCategory = (cat: string) => {
    if (cat === 'Insights') router.push('/', { scroll: false });
    else router.push(`/?cat=${encodeURIComponent(cat)}`, { scroll: false });
  };

  const currentFilterPath =
    activeCatParam === 'Insights' ? '/' : `/?cat=${encodeURIComponent(activeCatParam)}`;

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
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
      </header>

      {/* Navigation (Insights / Narrative) */}
      <div className="max-w-7xl mx-auto px-6 mt-6 mb-6">
        <nav className="flex gap-6 border-b border-slate-200 pb-2">
          {/* Insights main button */}
          <a
            href="/"
            className={`py-2 text-sm font-semibold ${
              true ? "text-slate-900 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Insights
          </a>

          {/* Narrative button */}
          <a
            href="/narrative"
            className="py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Narrative / StoryLine
          </a>
        </nav>
      </div>

      {/* Category tabs (only real categories) */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <nav className="flex flex-wrap gap-6">
          {categories.map(cat => {
            const isActive = cat === activeCatParam;
            return (
              <button
                key={cat}
                onClick={() => goToCategory(cat)}
                className={`relative py-2 text-sm font-semibold ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {cat}
                {isActive && <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-blue-600" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ---- The rest is 100% unchanged ---- */}
      {/* Feed, Cards, Footer — identical to your working version */}

      {/* ... (existing working content is unchanged) ... */}

    </div>
  );
}
