'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import insightsData from './data/insights.json';

interface Insight {
  id: number;
  date: string;
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  fullContent: string;
  chartPath: string;
  chartHeight: string;
}

export default function Home() {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const insights: Insight[] = insightsData;

  const toggleExpand = (id: number) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Genesis Research</h1>
              <p className="text-slate-400 mt-2 text-sm">Research, timely insights, and transparent trade ideas</p>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm">Last Updated</div>
              <div className="text-white font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-3">Daily Insights</h2>
          <div className="h-0.5 w-20 bg-blue-600"></div>
        </div>

        {/* Insights - Super Clean Layout */}
        <div className="space-y-16">
          {insights.map((insight) => (
            <article key={insight.id} className="border-b border-slate-100 pb-16 last:border-0">
              {/* Metadata */}
              <div className="flex items-center gap-4 mb-4">
                <span className={`${insight.categoryColor} text-white px-3 py-1 rounded text-xs font-medium uppercase tracking-wide`}>
                  {insight.category}
                </span>
                <time className="text-slate-400 text-sm">{insight.date}</time>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-slate-900 mb-8 leading-tight">
                {insight.title}
              </h3>

              {/* Grid: Chart Left | Text Right */}
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* LEFT: Chart - Clean White Background */}
                <div className="w-full">
                  <div className="bg-white">
                    <img 
                      src={insight.chartPath} 
                      alt={insight.title}
                      className="w-full h-auto"
                      style={{ display: 'block' }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Source: Genesis Research</p>
                </div>

                {/* RIGHT: Text Content */}
                <div className="flex flex-col justify-start">
                  <p className="text-slate-700 leading-relaxed text-base mb-6">
                    {expandedInsight === insight.id ? insight.fullContent : insight.summary}
                  </p>
                  
                  <button 
                    onClick={() => toggleExpand(insight.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium self-start flex items-center gap-2 group"
                  >
                    {expandedInsight === insight.id ? 'Show Less' : 'Read Full Analysis'}
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${expandedInsight === insight.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-100 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <p className="text-slate-400 text-sm text-center">© 2025 Genesis Research</p>
        </div>
      </footer>
    </div>
  );
}