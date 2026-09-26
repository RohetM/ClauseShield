import { z } from "zod";

export const ClauseCategoryEnum = z.enum([
  "INTELLECTUAL_PROPERTY",
  "TERMINATION",
  "INDEMNIFICATION",
  "LIABILITY",
  "NON_COMPETE",
  "GENERAL",
]);

export const SeverityEnum = z.enum(["CRITICAL", "ELEVATED", "STANDARD"]);

export const AsymmetryEnum = z.enum(["FIRST_PARTY", "SECOND_PARTY", "MUTUAL"]);

export const ClauseAnalysisResultSchema = z.object({
  clause_id: z.string(),
  original_text: z.string(),
  category: ClauseCategoryEnum,
  severity: SeverityEnum,
  risk_score: z.number().min(1).max(10),
  asymmetry: z.object({
    favors: AsymmetryEnum,
    imbalance_explanation: z.string(),
  }),
  plain_english_consequence: z.string(),
  fair_counter_clause: z.string(),
  suggested_negotiation_script: z.string(),
});

export type ClauseAnalysisResult = z.infer<typeof ClauseAnalysisResultSchema>;

export const ContractAnalysisResponseSchema = z.object({
  is_contractual: z.boolean().default(true),
  edge_case_code: z.enum(["NON_LEGAL", "INCOMPLETE", "PROMPT_INJECTION", "NONE"]).default("NONE"),
  contract_summary: z.string().optional(),
  overall_risk_score: z.number().min(0).max(100).optional(),
  clauses: z.array(ClauseAnalysisResultSchema).optional(),
  unauthorized_practice_disclaimer: z.string().default("ClauseShield provides informational analysis and drafting assistance. It does not provide legal advice, determine enforceability, or replace a qualified attorney."),
});

export type ContractAnalysisResponse = z.infer<typeof ContractAnalysisResponseSchema>;

export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1, "No text provided").max(15000, "Payload exceeds size limit"),
});
