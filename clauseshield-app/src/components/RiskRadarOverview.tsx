"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface RiskRadarOverviewProps {
  score: number;
  totalClauses: number;
  criticalCount: number;
}

export default function RiskRadarOverview({ score, totalClauses, criticalCount }: RiskRadarOverviewProps) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-[#F87171]'; // Red
    if (s >= 5) return 'text-[#FBBF24]'; // Amber
    return 'text-[#34D399]'; // Emerald
  };

  const getScoreBg = (s: number) => {
    if (s >= 8) return 'bg-[#450A0A] border-[#991B1B]';
    if (s >= 5) return 'bg-[#451A03] border-[#92400E]';
    return 'bg-[#064E3B] border-[#065F46]';
  };

  return (
    <div className="bg-[#121214] border border-gray-800 rounded-xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center">
            <ShieldAlert className="w-6 h-6 mr-2 text-blue-500" />
            Risk Radar Overview
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Analyzed {totalClauses} clauses • {criticalCount} critical risks found
          </p>
        </div>

        <div className={`flex flex-col items-center justify-center rounded-full w-24 h-24 border-4 ${getScoreBg(score)} relative`}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className={`text-3xl font-black ${getScoreColor(score)}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              / 10.0
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
