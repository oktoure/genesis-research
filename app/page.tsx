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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Premium Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Genesis Research</h1>
              <p className="text-slate-400 mt-2 text-sm">Research, timely insights, and transparent trade ideas</p>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm">Last Updated</div>
              <div className="text-white font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Daily Insights</h2>
          <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
        </div>

        {/* Insights Grid - 2x2 Pattern */}
        <div className="space-y-12">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className={`${insight.categoryColor} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {insight.category}
                  </span>
                  <time className="text-slate-500 text-sm font-medium">
                    {insight.date}
                  </time>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  {insight.title}
                </h3>
              </div>

              {/* 2x2 Grid: Chart Left | Text Right */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* LEFT: Chart */}
                <div className="bg-slate-50 p-8 flex items-center justify-center border-r border-slate-200">
                  <div className="w-full">
                    <div 
                      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center"
                      style={{ height: `${insight.chartHeight}px` }}
                    >
                      <img 
                        src={insight.chartPath} 
                        alt={insight.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-3 text-center">Source: Genesis Research</p>
                  </div>
                </div>

                {/* RIGHT: Text Content */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-700 leading-relaxed text-base">
                      {expandedInsight === insight.id ? insight.fullContent : insight.summary}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <button 
                      onClick={() => toggleExpand(insight.id)}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center group"
                    >
                      {expandedInsight === insight.id ? 'Show Less' : 'Read Full Analysis'}
                      <ChevronDown 
                        className={`w-4 h-4 ml-2 transition-transform ${expandedInsight === insight.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Want More Insights?</h3>
          <p className="text-slate-400 mb-6">Subscribe to receive daily market analysis and trade alerts</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Subscribe Now
          </button>
        </div>
      </main>
    </div>
  );
}