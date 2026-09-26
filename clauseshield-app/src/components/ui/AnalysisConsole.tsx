"use client";

import React, { useState } from 'react';
import { Send, FileText, AlertCircle } from 'lucide-react';
import { announce } from '@/lib/a11y-announcer';

interface AnalysisConsoleProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const PRESETS = [
  { label: "Select a Demo Preset...", value: "" },
  { label: "Freelance IP Grab", value: "Contractor grants Client perpetual, worldwide ownership of all IP created during or outside the contract period." },
  { label: "Predatory 48-Hour Eviction", value: "Landlord reserves the right to evict Tenant with 48 hours notice for any noise complaint, without refund of deposit." },
  { label: "Malformed/Gibberish Edge Case", value: "Recipe for chocolate chip cookies: 2 cups flour, 1 cup sugar, bake at 350." }
];

const MAX_CHARS = 15000;

export default function AnalysisConsole({ onAnalyze, isAnalyzing }: AnalysisConsoleProps) {
  const [text, setText] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    announce("Contract analysis started");
    onAnalyze(text);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setText(e.target.value);
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="flex flex-col h-full bg-[#121214] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-[#1C1C1F] p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-300 font-medium">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Active Input Console</span>
        </div>
        <select 
          onChange={handlePresetChange} 
          className="bg-[#2A2A2E] border border-gray-700 text-sm text-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PRESETS.map((preset, i) => (
            <option key={i} value={preset.value}>{preset.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 relative p-4">
        <textarea
          className="w-full h-full bg-transparent resize-none outline-none text-gray-200 placeholder-gray-600 font-mono text-sm leading-relaxed"
          placeholder="Paste contractual text here or select a preset..."
          value={text}
          onChange={handleTextChange}
          disabled={isAnalyzing}
          aria-label="Contractual text input"
        />
      </div>

      <div className="bg-[#1C1C1F] p-4 border-t border-gray-800 flex justify-between items-center">
        <div className={`text-xs font-mono flex items-center ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
          {isOverLimit && <AlertCircle className="w-4 h-4 mr-1" />}
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim() || isOverLimit}
          className={`flex items-center px-6 py-2.5 rounded-md font-medium text-sm transition-all
            ${isAnalyzing || !text.trim() || isOverLimit
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Analyze Contract
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
