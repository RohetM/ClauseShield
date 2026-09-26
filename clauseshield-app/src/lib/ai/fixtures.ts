import { ContractAnalysisResponse } from "../validation/clauseSchema";

export const mockStandardContract: ContractAnalysisResponse = {
  is_contractual: true,
  edge_case_code: "NONE",
  contract_summary: "Reviewing independent contractor agreement.",
  overall_risk_score: 8.4,
  unauthorized_practice_disclaimer: "ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney.",
  clauses: [
    {
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
    },
    {
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
    },
    {
      clause_id: "mock_3",
      original_text: "Both parties agree to keep all proprietary information confidential for a period of 2 years.",
      category: "GENERAL",
      severity: "STANDARD",
      risk_score: 2.0,
      asymmetry: {
        favors: "MUTUAL",
        imbalance_explanation: "Clause appears reasonably balanced or standard."
      },
      plain_english_consequence: "Standard operational terms.",
      fair_counter_clause: "Both parties agree to keep all proprietary information confidential for a period of 2 years.",
      suggested_negotiation_script: "This looks acceptable as-is."
    }
  ]
};

export const mockNonLegal: ContractAnalysisResponse = {
  is_contractual: false,
  edge_case_code: "NON_LEGAL",
  unauthorized_practice_disclaimer: "ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney.",
};

export const mockIncomplete: ContractAnalysisResponse = {
  is_contractual: false,
  edge_case_code: "INCOMPLETE",
  unauthorized_practice_disclaimer: "ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney.",
};

export const mockPromptInjection: ContractAnalysisResponse = {
  is_contractual: false,
  edge_case_code: "PROMPT_INJECTION",
  unauthorized_practice_disclaimer: "ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney.",
};
