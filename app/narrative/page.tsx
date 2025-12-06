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
  story: string;
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
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
      <div className="max-w-7xl mx-auto px-6 mt-5 mb-6">
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
          <article key={n.id} className="pb-16 border-b border-slate-100 last:border-0">

            {/* NARRATIVE HEADER */}
            <div className="mb-6">
              <div className="text-xs text-slate-500 font-bold mb-1">{n.date}</div>
              <h2 className="text-2xl font-bold text-slate-900">{n.title}</h2>
              <p className="mt-2 text-slate-700 text-[16px] leading-relaxed max-w-3xl">
                {n.summary}
              </p>
            </div>

            {/* ROWS */}
            {n.rows.map((row, ri) => (
              <section key={ri} className="mt-14 space-y-4">

                {/* ROW TITLE */}
                <h3 className="text-lg font-semibold text-slate-900 text-center">
                  {row.title}
                </h3>

                {/* STORY PARAGRAPH */}
                <p className="text-[16px] text-slate-700 leading-relaxed text-justify max-w-3xl mx-auto">
                  {row.story}
                </p>

                {/* CHART GRID */}
                <PerfectChartRow charts={row.charts} />

              </section>
            ))}

          </article>
        ))}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 text-slate-400 text-xs text-center">
          © {new Date().getFullYear()} Genesis Research
        </div>
      </footer>

    </div>
  );
}

function PerfectChartRow({ charts }: { charts: Chart[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
      {charts.map((chart, ci) => (
        <div key={ci} className="flex justify-center items-start">
          <img
            src={encodeURI(chart.path)}
            alt=""
            style={{
              height: chart.height ? chart.height + 'px' : 'auto',
              width: '100%',
              objectFit: 'contain',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      ))}
    </div>
  );
}
