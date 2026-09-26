"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle, Copy, Scale } from 'lucide-react';
import { ClauseAnalysisResult } from '@/lib/types';
import MonacoDiffViewer from './MonacoDiffViewer';
import { announce } from '@/lib/a11y-announcer';

interface ClauseCardProps {
  clause: ClauseAnalysisResult;
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#450A0A] text-[#F87171] border-[#991B1B]';
      case 'ELEVATED':
        return 'bg-[#451A03] text-[#FBBF24] border-[#92400E]';
      case 'STANDARD':
        return 'bg-[#064E3B] text-[#34D399] border-[#065F46]';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    announce("Counter-clause copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1C1C1F] border border-gray-800 rounded-xl overflow-hidden mb-4 shadow-sm transition-colors hover:border-gray-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:bg-[#252529]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-4">
          <span className={`px-2.5 py-1 text-xs font-bold rounded border ${getSeverityStyles(clause.severity)}`}>
            {clause.severity}
          </span>
          <span className="text-sm font-semibold text-gray-400 tracking-wider">
            {clause.category.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center text-gray-400">
          <span className="text-sm mr-4 font-mono font-bold bg-[#121214] px-2 py-1 rounded">Score: {clause.risk_score}</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-800"
          >
            <div className="p-5 space-y-6">
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Plain English Consequence
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed bg-[#121214] p-3 rounded-md border border-gray-800">
                  {clause.plain_english_consequence}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Asymmetry ({clause.asymmetry.favors.replace('_', ' ')})
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {clause.asymmetry.imbalance_explanation}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Redline Diff vs Fair Counter-Clause</h4>
                <div className="border border-gray-700 rounded-md overflow-hidden h-64">
                  <MonacoDiffViewer 
                    original={clause.original_text} 
                    modified={clause.fair_counter_clause} 
                  />
                </div>
              </div>

              <div className="bg-[#121214] border border-gray-800 p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-blue-400">Suggested Negotiation Script</h4>
                  <button 
                    onClick={() => handleCopy(clause.suggested_negotiation_script)}
                    className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <span className="text-green-400">Copied!</span> : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Script
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "{clause.suggested_negotiation_script}"
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
