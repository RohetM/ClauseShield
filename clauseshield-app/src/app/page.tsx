"use client";

import React, { useState, useMemo } from 'react';
import AnalysisConsole from '@/components/ui/AnalysisConsole';
import RiskRadarOverview from '@/components/ui/RiskRadarOverview';
import ClauseCard from '@/components/ui/ClauseCard';
import { useContractStream } from '@/lib/hooks/useContractStream';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const LawyerDossierModal = dynamic(() => import('@/components/ui/LawyerDossierModal'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const { analyzeContract, isAnalyzing, clauses, metadata, error } = useContractStream();
  const [dossierOpen, setDossierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'ELEVATED' | 'STANDARD'>('ALL');

  const filteredClauses = useMemo(() => clauses.filter(c => {
    if (activeTab === 'ALL') return true;
    return c.severity === activeTab;
  }), [clauses, activeTab]);

  const criticalCount = useMemo(() => clauses.filter(c => c.severity === 'CRITICAL').length, [clauses]);
  const overallScore = useMemo(() => metadata?.overall_risk_score || 0, [metadata]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
      
      {/* Left Column: Input Console */}
      <div className="w-full md:w-5/12 flex flex-col h-[calc(100vh-8rem)] sticky top-20">
        <AnalysisConsole onAnalyze={analyzeContract} isAnalyzing={isAnalyzing} />
      </div>

      {/* Right Column: Analysis Results */}
      <div className="w-full md:w-7/12 flex flex-col min-h-[calc(100vh-8rem)]">
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
            <strong className="font-semibold block mb-1">Error processing contract:</strong>
            {error}
          </div>
        )}

        {!isAnalyzing && clauses.length === 0 && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl p-12">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">Ready for Analysis</h3>
            <p className="text-center max-w-md">
              Paste your contract in the console or select a preset to begin the real-time risk radar.
            </p>
          </div>
        )}

        {(clauses.length > 0 || isAnalyzing) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <RiskRadarOverview 
              score={overallScore} 
              totalClauses={clauses.length} 
              criticalCount={criticalCount} 
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {['ALL', 'CRITICAL', 'ELEVATED', 'STANDARD'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'ALL' | 'CRITICAL' | 'ELEVATED' | 'STANDARD')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setDossierOpen(true)}
                disabled={clauses.length === 0}
                className="flex items-center px-4 py-2 bg-[#2A2A2E] hover:bg-[#3f3f46] text-blue-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Dossier
              </button>
            </div>

            <div className="space-y-4">
              {filteredClauses.map((clause, idx) => (
                <ClauseCard key={`${clause.clause_id}-${idx}`} clause={clause} />
              ))}
              
              {isAnalyzing && (
                <div className="animate-pulse bg-[#1C1C1F] border border-gray-800 rounded-xl p-5 h-24 flex items-center justify-center">
                  <span className="text-gray-500 font-mono text-sm">Analyzing next clause...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <LawyerDossierModal 
        isOpen={dossierOpen} 
        onClose={() => setDossierOpen(false)} 
        clauses={clauses}
        metadata={metadata}
      />
    </div>
  );
}
