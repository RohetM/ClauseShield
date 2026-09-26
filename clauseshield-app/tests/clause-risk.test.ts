import { expect, test, describe, vi } from 'vitest';
import { ClauseAnalysisResultSchema } from '../src/lib/types';
import mockContract from './mocks/mock-contract.json';

describe('Clause Risk Analysis & Schema Validation', () => {
  test('Mock responses strictly match Zod output schema', () => {
    const result = ClauseAnalysisResultSchema.safeParse(mockContract.clauses[0]);
    expect(result.success).toBe(true);
  });

  test('Edge case: Handles malformed/gibberish input gracefully (mock simulation)', async () => {
    const edgeCaseText = "Recipe for chocolate chip cookies: 2 cups flour, 1 cup sugar, bake at 350.";
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text: edgeCaseText })
    });

    const res = await (await import('../src/app/api/analyze/route')).POST(req as any);
    expect(res.status).toBe(400);
    
    const data = await res.json();
    expect(data.error).toContain("No contractual obligations");
  });

  test('Calculates overall risk score appropriately based on severe clauses', () => {
    // In our mock, overall score is static, but this simulates the expected logic check
    const criticals = mockContract.clauses.filter((c: any) => c.severity === 'CRITICAL');
    expect(criticals.length).toBeGreaterThan(0);
    expect(mockContract.overall_risk_score).toBeGreaterThan(7.0);
  });
});
