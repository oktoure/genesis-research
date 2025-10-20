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
      {/* Header - Matching Webflow */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Genesis Research</h1>
              <p className="text-slate-400 mt-1 text-xs">Research, timely insights, and transparent trade ideas</p>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs">Last Updated</div>
              <div className="text-white text-sm font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Daily Insights</h2>
          <div className="h-0.5 w-16 bg-blue-600"></div>
        </div>

        {/* Insights - Tight, Premium Layout */}
        <div className="space-y-10">
          {insights.map((insight) => (
            <article key={insight.id} className="border-b border-slate-100 pb-8 last:border-0">
              {/* Compact Metadata */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`${insight.categoryColor} text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>
                  {insight.category}
                </span>
                <time className="text-slate-400 text-xs">{insight.date}</time>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-5 leading-snug">
                {insight.title}
              </h3>

              {/* Grid: Chart Left | Text Right - Tighter */}
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* LEFT: Chart - No extra padding */}
                <div className="w-full">
                  <img 
                    src={insight.chartPath} 
                    alt={insight.title}
                    className="w-full h-auto"
                    style={{ display: 'block' }}
                  />
                </div>

                {/* RIGHT: Text Content - Mixed formatting */}
                <div className="flex flex-col justify-start">
                  <div className="text-slate-700 leading-relaxed text-[15px] mb-4 space-y-3">
                    {expandedInsight === insight.id ? (
                      // Parse full content for bold text
                      insight.fullContent.split('.').map((sentence, idx) => {
                        if (sentence.trim()) {
                          // First sentence bold
                          if (idx === 0) {
                            return <p key={idx} className="font-semibold">{sentence.trim()}.</p>;
                          }
                          return <span key={idx}>{sentence.trim()}. </span>;
                        }
                        return null;
                      })
                    ) : (
                      <p className="font-semibold">{insight.summary}</p>
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

      {/* Minimal Footer */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-slate-400 text-xs text-center">© 2025 Genesis Research</p>
        </div>
      </footer>
    </div>
  );
}