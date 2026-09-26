import { useState, useCallback } from 'react';
import { ClauseAnalysisResult } from '../types';

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze contract');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        
        buffer = lines.pop() || ''; // keep incomplete chunk in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              setIsAnalyzing(false);
              return;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'metadata') {
                setMetadata(parsed.data);
              } else if (parsed.type === 'clause') {
                setClauses(prev => [...prev, parsed.data]);
              }
            } catch (e) {
              console.error('Error parsing SSE data', e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  }, []);

  return { analyzeContract, isAnalyzing, clauses, metadata, error };
}
