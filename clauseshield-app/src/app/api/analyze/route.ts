import { NextRequest, NextResponse } from "next/server";
import { analyzeContractContent } from "@/lib/ai/provider";
import { scrubPII } from "@/features/analyzer/piiScrubber";
import { AnalyzeRequestSchema } from "@/lib/validation/clauseSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate Input
    const parseResult = AnalyzeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { text } = parseResult.data;

    // Scrub PII
    const sanitizedText = scrubPII(text);

    // Call unified AI provider
    const analysisResult = await analyzeContractContent(sanitizedText);

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (err: unknown) {
    console.error("Analysis route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
