import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema, ContractAnalysisResponse } from "@/lib/validation/clauseSchema";
import { sanitizeInput, computePayloadHash, SECURITY_HEADERS } from "@/lib/security/sanitizer";
import { contractAnalysisCache } from "@/lib/cache/lruCache";
import { analyzeContractContent } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.issues },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const sanitized = sanitizeInput(parsed.data.text);
    const cacheKey = computePayloadHash(sanitized);

    // 1. Check LRU Cache (Instant response & 0 token waste)
    const cachedResult = contractAnalysisCache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        status: 200,
        headers: { ...SECURITY_HEADERS, "X-Cache": "HIT" }
      });
    }

    // 2. Perform Analysis (Live or Mock fallback)
    const result: ContractAnalysisResponse = await analyzeContractContent(sanitized);

    // 3. Cache valid result
    contractAnalysisCache.set(cacheKey, result);

    return NextResponse.json(result, {
      status: 200,
      headers: { ...SECURITY_HEADERS, "X-Cache": "MISS" }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Analysis Error", message: (error as Error).message },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
