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
      
      {/* ---------------- HEADER ---------------- */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Genesis Research</h1>
            <p className="text-slate-400 mt-1 text-xs">Research, timely insights, and transparent trade ideas</p>
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

      {/* --------------- NAVIGATION BAR --------------- */}
      <div className="max-w-7xl mx-auto px-6 mt-6 mb-10">
        <nav className="flex gap-6 border-b border-slate-200 pb-2">
          
          <a
            href="/"
            className="py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Insights
          </a>

          <span className="py-2 text-sm font-semibold text-slate-900 border-b-2 border-blue-600">
            Narrative / StoryLine
          </span>

        </nav>
      </div>

      {/* --------------- CONTENT --------------- */}
      <main className="max-w-7xl mx-auto px-6 space-y-16">
        
        {narratives.map(n => (
          <article
            key={n.id}
            className="border-b border-slate-200 pb-16 last:border-0"
          >

            {/* ---- Narrative header ---- */}
            <div className="mb-6">
              <div className="text-xs text-slate-500 font-bold mb-2">{n.date}</div>
              <h3 className="text-xl font-bold text-slate-900">{n.title}</h3>
              <p className="mt-3 text-slate-700 text-[15px] leading-relaxed">
                {n.summary}
              </p>
            </div>

            {/* ---- Narrative charts ---- */}
            {buildRows(n.charts).map((row, i) => (
              <div
                key={i}
                className={`grid gap-8 ${
                  row.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {row.map((chart, j) => (
                  <div key={j}>
                    {chart.path ? (
                      <img
                        src={encodeURI(chart.path)}
                        alt=""
                        className="w-full h-auto rounded-lg border border-slate-200"
                        style={
                          chart.height
                            ? { height: chart.height, objectFit: 'contain' }
                            : {}
                        }
                      />
                    ) : (
                      <div className="aspect-[16/9] w-full border border-slate-300 rounded grid place-items-center text-slate-400 text-xs">
                        Chart coming soon
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

          </article>
        ))}

        {narratives.length === 0 && (
          <div className="text-slate-500 text-sm">No narratives available yet.</div>
        )}

      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-slate-100 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-slate-400 text-xs text-center">
          © {new Date().getFullYear()} Genesis Research
        </div>
      </footer>

    </div>
  );
}

/* -------- Utility: group side charts -------- */
function buildRows(charts: Chart[]) {
  const rows: Chart[][] = [];

  for (const c of charts) {
    if (c.type === 'large') {
      rows.push([c]);
    } else {
      const last = rows[rows.length - 1];
      if (last && last.length === 1 && last[0].type === 'side') {
        last.push(c);
      } else {
        rows.push([c]);
      }
    }
  }
  return rows;
}
