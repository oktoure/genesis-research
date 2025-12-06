'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import narrativesData from '../data/narratives.json';

export const dynamic = 'force-static';

interface Chart {
  path: string;
  type: 'side' | 'large';
  height?: string;
}

interface NarrativeRow {
  title: string;
  bullets: string[];
  charts: Chart[];
}

interface Narrative {
  id: number;
  date: string;
  title: string;
  summary: string;
  rows: NarrativeRow[];
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

      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          
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
                year: 'numeric'
              })}
            </div>
          </div>

        </div>
      </header>

      {/* NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 mt-6 mb-10">
        <nav className="flex gap-6 border-b border-slate-200 pb-2">

          <Link
            href="/"
            className="py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Insights
          </Link>

          <Link
            href="/narrative"
            className="py-2 text-sm font-semibold text-slate-900 border-b-2 border-blue-600"
          >
            Narrative / StoryLine
          </Link>

        </nav>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 space-y-20">

        {narratives.map(n => (
          <article key={n.id} className="pb-20 border-b border-slate-100 last:border-0">

            {/* TITLE + DATE */}
            <div className="mb-5">
              <div className="text-xs text-slate-500 font-bold mb-1">{n.date}</div>
              <h2 className="text-2xl font-bold text-slate-900">{n.title}</h2>
              <p className="mt-2 text-slate-700 text-[15px] leading-relaxed">{n.summary}</p>
            </div>

            {/* ROWS */}
            {n.rows.map((row, ri) => (
              <section key={ri} className="mt-12 space-y-6">

                {/* ROW TITLE */}
                <h3 className="text-lg font-semibold text-slate-900">
                  {row.title}
                </h3>

                {/* BULLETS */}
                <ul className="list-disc list-inside text-slate-700 text-[15px] space-y-1">
                  {row.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>

                {/* CHART GRID */}
                <div className={`grid gap-10 md:grid-cols-2 grid-cols-1`}>
                  {row.charts.map((chart, ci) => (
                    <div key={ci} className="flex justify-center">
                      <img
                        src={encodeURI(chart.path)}
                        alt=""
                        className="rounded-lg"
                        style={{
                          height: chart.height ? chart.height + 'px' : 'auto',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ))}
                </div>

              </section>
            ))}

          </article>
        ))}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-6 text-slate-400 text-xs text-center">
          © {new Date().getFullYear()} Genesis Research
        </div>
      </footer>

    </div>
  );
}
