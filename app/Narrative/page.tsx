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
    Loading…}>
      
    
  );
}

function ClientNarrative() {
  const narratives = narrativesData as Narrative[];

  return (
    
      {/* Header */}
      
        
          
            
              Genesis Research
              Research, timely insights, and transparent trade ideas
            
            
              Last Updated
              
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              
            
          
        
      

      {/* Main */}
      
        
          Narrative / StoryLine
        

        {/* Tabs */}
        
          
            
              Insights
              
            
            
              Narrative / StoryLine
              
            
          
        

        {/* Narratives List */}
        
          {narratives.map((narrative) => (
            
              {/* Header */}
              
                {narrative.date && (
                  
                    {narrative.date}
                  
                )}
                
                  {narrative.title}
                
                
                {/* Summary */}
                
                  
                    {narrative.summary}
                  
                
              

              {/* Charts Grid - Auto layout: large = full width, side = 2 per row */}
              
                {narrative.charts.reduce((rows, chart) => {
                  if (chart.type === 'large') {
                    // Large chart = nouvelle rangée solo
                    rows.push([chart]);
                  } else {
                    // Side chart = essayer de grouper par 2
                    const lastRow = rows[rows.length - 1];
                    if (lastRow && lastRow.length === 1 && lastRow[0].type === 'side') {
                      // Ajouter au dernier side chart
                      lastRow.push(chart);
                    } else {
                      // Créer nouvelle rangée
                      rows.push([chart]);
                    }
                  }
                  return rows;
                }, []).map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-6 ${
                      row.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                    }`}
                  >
                    {row.map((chart, chartIndex) => (
                      
                        {chart.path ? (
                          
                        ) : (
                          
                            Chart coming soon
                          
                        )}
                      
                    ))}
                  
                ))}
              
            
          ))}

          {narratives.length === 0 && (
            No narratives available yet.
          )}
        
      

      {/* Footer */}
      
        
          
            © {new Date().getFullYear()} Genesis Research
          
        
      
    
  );
}