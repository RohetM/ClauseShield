import { useState, useCallback } from 'react';
import { ClauseAnalysisResult, ContractAnalysisResponse } from '../validation/clauseSchema';

export function useContractStream() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clauses, setClauses] = useState<ClauseAnalysisResult[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeContract = useCallback(async (text: string) => {
    setIsAnalyzing(true);
    setClauses([]);
    setMetadata(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data: ContractAnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || 'Failed to analyze contract');
      }

      if (!data.is_contractual) {
        if (data.edge_case_code === 'PROMPT_INJECTION') {
          throw new Error('Malicious prompt injection detected. Request blocked.');
        }
        if (data.edge_case_code === 'NON_LEGAL') {
          throw new Error('No contractual obligations detected. Please provide an operative agreement.');
        }
        if (data.edge_case_code === 'INCOMPLETE') {
          throw new Error('Truncated input detected. Please provide complete clauses.');
        }
        throw new Error('Invalid or non-contractual payload.');
      }

      setMetadata({
        contract_summary: data.contract_summary,
        overall_risk_score: data.overall_risk_score,
        unauthorized_practice_disclaimer: data.unauthorized_practice_disclaimer
      });
      
      // Simulate streaming for UX
      if (data.clauses) {
        for (let i = 0; i < data.clauses.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setClauses(prev => [...prev, data.clauses![i]]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzeContract, isAnalyzing, clauses, metadata, error };
}
