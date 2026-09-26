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

export const ContractEvaluationResponseSchema = z.object({
  contract_summary: z.string(),
  overall_risk_score: z.number().min(1).max(100),
  clauses: z.array(ClauseAnalysisResultSchema),
  unauthorized_practice_disclaimer: z.string(),
});

export type ContractEvaluationResponse = z.infer<typeof ContractEvaluationResponseSchema>;
