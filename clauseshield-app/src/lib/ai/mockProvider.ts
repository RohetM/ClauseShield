import { ClauseAnalysisResult } from "../validation/clauseSchema";
import { scrubPII } from "../../features/analyzer/piiScrubber";

export async function analyzeContractMock(text: string, onProgress: (chunk: string) => void): Promise<void> {
  const sanitizedText = scrubPII(text);
  const lowerText = sanitizedText.toLowerCase();

  // Edge Case D: Prompt Injection
  if (lowerText.includes("ignore previous instructions")) {
    throw new Error("Malicious prompt injection detected. Request blocked.");
  }

  // Edge Case A: Non-Legal
  if (lowerText.includes("recipe") || lowerText.includes("cookies") || lowerText.includes("meeting notes")) {
    throw new Error("No contractual obligations detected. Please provide an operative agreement.");
  }

  // Edge Case B: Incomplete / Truncated
  if (lowerText === "the contractor shall indemnify...") {
    throw new Error("Truncated input detected. Please provide complete clauses.");
  }

  const metadata = {
    contract_summary: "Reviewing operative clauses.",
    overall_risk_score: 8.4,
    unauthorized_practice_disclaimer: "ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney.",
  };
  
  onProgress(JSON.stringify({ type: 'metadata', data: metadata }));

  const clauses: ClauseAnalysisResult[] = [];

  // High-Attention Case
  if (lowerText.includes("or outside the contract period") || lowerText.includes("perpetual, worldwide")) {
    clauses.push({
      clause_id: "mock_1",
      original_text: "Contractor grants Client perpetual, worldwide ownership of all IP created during or outside the contract period.",
      category: "INTELLECTUAL_PROPERTY",
      severity: "CRITICAL",
      risk_score: 9.5,
      asymmetry: {
        favors: "SECOND_PARTY",
        imbalance_explanation: "The clause grants ownership of IP created even outside the scope of work."
      },
      plain_english_consequence: "You are giving away the rights to any ideas or work you create, even on your own time.",
      fair_counter_clause: "Ownership limited solely to agreed milestone deliverables.",
      suggested_negotiation_script: "I am happy to assign rights for the specific deliverables agreed upon, but I must retain ownership of IP created outside this contract."
    });
  }

  // Edge Case C: Ambiguous subjective termination
  if (lowerText.includes("when appropriate") && lowerText.includes("terminate")) {
    clauses.push({
      clause_id: "mock_2",
      original_text: "Client may terminate this agreement when appropriate.",
      category: "TERMINATION",
      severity: "ELEVATED",
      risk_score: 6.0,
      asymmetry: {
        favors: "SECOND_PARTY",
        imbalance_explanation: "Termination criteria is highly subjective and favors the client's discretion."
      },
      plain_english_consequence: "You could be fired at any point based on the client's arbitrary judgment.",
      fair_counter_clause: "Either party may terminate this agreement with 14 days written notice.",
      suggested_negotiation_script: "Let's establish a clear notice period rather than subjective criteria."
    });
  }

  // Standard Case (fallback)
  if (clauses.length === 0) {
    clauses.push({
      clause_id: "mock_3",
      original_text: sanitizedText.length > 50 ? sanitizedText.substring(0, 100) + "..." : sanitizedText,
      category: "GENERAL",
      severity: "STANDARD",
      risk_score: 2.0,
      asymmetry: {
        favors: "MUTUAL",
        imbalance_explanation: "Clause appears reasonably balanced or standard."
      },
      plain_english_consequence: "Standard operational terms.",
      fair_counter_clause: sanitizedText.length > 50 ? sanitizedText.substring(0, 100) + "..." : sanitizedText,
      suggested_negotiation_script: "This looks acceptable as-is."
    });
  }

  for (const clause of clauses) {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate latency
    onProgress(JSON.stringify({ type: 'clause', data: clause }));
  }
}
