"use client";

import React from 'react';
import { Printer, X } from 'lucide-react';
import { ClauseAnalysisResult, ContractAnalysisResponse } from '@/lib/validation/clauseSchema';

interface LawyerDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  clauses: ClauseAnalysisResult[];
  metadata: Partial<ContractAnalysisResponse> | null;
}

export default function LawyerDossierModal({ isOpen, onClose, clauses, metadata }: LawyerDossierModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const criticalClauses = clauses.filter(c => c.severity === 'CRITICAL');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        className="bg-[#1C1C1F] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-700 flex flex-col"
      >
        <div className="sticky top-0 bg-[#1C1C1F] p-6 border-b border-gray-800 flex justify-between items-center z-10">
          <h2 id="modal-title" className="text-2xl font-bold text-white">Attorney Consultation Dossier</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 print:p-0 print:bg-white print:text-black space-y-8 flex-1">
          <div className="border-b border-gray-800 print:border-gray-300 pb-6">
            <h3 className="text-lg font-semibold text-gray-300 print:text-gray-700 mb-2">Executive Summary</h3>
            <p className="text-gray-400 print:text-gray-800 leading-relaxed">
              {metadata?.contract_summary || "Contract analysis summary."}
            </p>
            <div className="mt-4 flex space-x-6">
              <div>
                <span className="block text-sm text-gray-500">Overall Risk Score</span>
                <span className="text-xl font-bold text-white print:text-black">{metadata?.overall_risk_score || "N/A"} / 10</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Critical Risks</span>
                <span className="text-xl font-bold text-red-500">{criticalClauses.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-300 print:text-gray-700 mb-4">Top Risks for Attorney Review</h3>
            {criticalClauses.length === 0 ? (
              <p className="text-gray-500 italic">No critical risks identified.</p>
            ) : (
              <div className="space-y-6">
                {criticalClauses.map((clause, i) => (
                  <div key={i} className="bg-[#121214] print:bg-gray-50 p-5 rounded-lg border border-red-900/30 print:border-red-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-red-400 print:text-red-700">{clause.category.replace('_', ' ')}</h4>
                      <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 print:bg-red-100 print:text-red-800 rounded">
                        Score: {clause.risk_score}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Original Clause</span>
                      <p className="text-sm font-mono text-gray-300 print:text-gray-700">{clause.original_text}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Issue</span>
                        <p className="text-sm text-gray-300 print:text-gray-800">{clause.plain_english_consequence}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-400 print:text-blue-700">&quot;Does this {clause.category.toLowerCase()} clause legally bind me under local jurisdiction, and should we push for our counter-offer?&quot;</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-800 print:border-gray-300">
            <h3 className="text-lg font-semibold text-gray-300 print:text-gray-700 mb-4">4 Key Questions for Formal Intake</h3>
            <ol className="list-decimal pl-5 space-y-3 text-gray-300 print:text-gray-800">
              <li>What are my worst-case liabilities under the identified critical clauses?</li>
              <li>Are there any missing standard protections (e.g., mutual indemnification) that I should insert?</li>
              <li>How enforceable are these specific restrictive covenants in my state/country?</li>
              <li>What is your estimated fee to formally draft the final counter-proposal based on this dossier?</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
