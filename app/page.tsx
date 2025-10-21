'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import rawInsights from './data/insights.json';

interface Insight {
  id: number;
  date: string; // dd-mm-YYYY
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  fullContent: string;
  chartPath: string;
  chartHeight: string;
}

function parseDDMMYYYY(d: string): number {
  // returns a sortable timestamp
  // expects "dd-mm-YYYY"
  const [dd, mm, yyyy] = d.split('-').map(Number);
  return new Date(yyyy, (mm || 1) - 1, dd || 1).getTime();
}

export default function Home() {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  // 1) sort newest-first. Choose ONE of these:

  // A) by id (if id always increases with time)
  const insights: Insight[] = [...(rawInsights as Insight[])].sort((a, b) => b.id - a.id);

  // OR B) by date (if you prefer date)
  // const insights: Insight[] = [...(rawInsights as Insight[])].sort(
  //   (a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date)
  // );

  const toggleExpand = (id: number) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  const parseContentWithMarkdown = (text: string, isExpanded: boolean) => {
    if (!text) return null;
    const hasCustomBold = text.includes('**');

    if (hasCustomBold) {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return (
        <div className="text-justify">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return <strong key={idx} className="font-bold">{boldText}</strong>;
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      );
    }

    if (!isExpanded) return <p className="font-bold text-justify">{text}</p>;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return (
      <div className="text-justify">
        {sentences.map((sentence, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === sentences.length - 1;
          return (
            <span key={idx} className={isFirst || isLast ? 'font-bold' : ''}>
              {sentence}{' '}
            </span>
          );
        })}
      </div>
    );
  };

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Insights</h2>
          <div className="h-0.5 w-16 bg-blue-600"></div>
        </div>

        <div className="space-y-10">
          {insights.map((insight) => (
            <article key={insight.id} className="border-b border-slate-100 pb-8 last:border-0">
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${insight.categoryColor} text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>
                    {insight.category}
                  </span>
                  <time className="text-slate-500 text-xs font-bold">{insight.date}</time>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">{insight.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="w-full">
                  {/* 2) Encode URL to handle spaces/emdashes */}
                  <img
                    src={encodeURI(insight.chartPath)}
                    alt={insight.title}
                    className="w-full h-auto"
                    style={{ display: 'block' }}
                  />
                </div>

                <div className="flex flex-col justify-start">
                  <div className="text-slate-700 leading-relaxed text-[15px] mb-4">
                    {parseContentWithMarkdown(
                      expandedInsight === insight.id ? insight.fullContent : insight.summary,
                      expandedInsight === insight.id
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(insight.id)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-semibold self-start flex items-center gap-1.5 group mt-2"
                  >
                    {expandedInsight === insight.id ? 'Show Less' : 'Read Full Analysis'}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${expandedInsight === insight.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">© 2025 Genesis Research</p>
        </div>
      </footer>
    </div>
  );
}
