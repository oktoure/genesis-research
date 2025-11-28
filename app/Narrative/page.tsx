// app/narrative/page.tsx
'use client';

import React, { Suspense } from 'react';
import narrativesData from '../data/narratives.json';

export const dynamic = 'force-static';

interface Chart {
  path: string;
  type: 'large' | 'side';
  height?: string;
}

interface Narrative {
  id: number;
  date: string;
  title: string;
  summary: string;
  charts: Chart[];
}

export default function NarrativePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
      <ClientNarrative />
    </Suspense>
  );
}

function ClientNarrative() {
  const narratives = narrativesData as Narrative[];

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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Narrative / StoryLine</h2>

        {/* Tabs */}
        <div className="mb-10 border-b border-slate-200">
          <nav className="flex gap-6">
            <a href="/" className="py-2 text-sm font-semibold text-slate-500 hover:text-slate-700">
              Insights
            </a>
            <span className="relative py-2 text-sm font-semibold text-slate-900">
              Narrative / StoryLine
              <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-blue-600" />
            </span>
          </nav>
        </div>

        {/* List */}
        <div className="space-y-16">
          {narratives.map((narrative) => (
            <article key={narrative.id} className="border-b border-slate-100 pb-12 last:border-0">
              {/* Narrative header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-bold text-slate-500">{narrative.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{narrative.title}</h3>
                <p className="mt-3 text-slate-700 text-[15px] leading-relaxed">{narrative.summary}</p>
              </div>

              {/* Charts */}
              <div className="space-y-8">
                {/** Build rows: large = solo row ; side = grouped by 2 */}
                {buildChartRows(narrative.charts).map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-8 ${row.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
                  >
                    {row.map((chart, chartIndex) => (
                      <div key={chartIndex}>
                        {chart.path ? (
                          <img
                            src={encodeURI(chart.path)}
                            alt={`Chart ${chartIndex + 1}`}
                            className="w-full h-auto rounded-lg border border-slate-200"
                            style={chart.height ? { height: chart.height, objectFit: 'contain' } : {}}
                          />
                        ) : (
                          <div className="w-full aspect-[16/9] border border-slate-200 rounded-lg grid place-items-center text-slate-400 text-xs">
                            Chart coming soon
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          ))}

          {narratives.length === 0 && (
            <div className="text-slate-500 text-sm">No narratives available yet.</div>
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

/* ---------- Utility: build chart rows (large solo / side paired) ---------- */
function buildChartRows(charts: Chart[]) {
  const rows: Chart[][] = [];
  for (const chart of charts) {
    if (chart.type === 'large') {
      rows.push([chart]);
    } else {
      const last = rows[rows.length - 1];
      if (last && last.length === 1 && last[0].type === 'side') {
        last.push(chart);
      } else {
        rows.push([chart]);
      }
    }
  }
  return rows;
}
