import { NextRequest, NextResponse } from "next/server";
import { analyzeContractContent } from "@/lib/ai/provider";
import { scrubPII } from "@/features/analyzer/piiScrubber";
import { AnalyzeRequestSchema, ContractAnalysisResponse } from "@/lib/validation/clauseSchema";
import crypto from "crypto";

class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private max: number) {}
  get(key: K) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  set(key: K, val: V) {
    this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.max) {
      this.map.delete(this.map.keys().next().value!);
    }
  }
}

const analysisCache = new LRUCache<string, { result: ContractAnalysisResponse; expiresAt: number }>(100);
const TTL = 60 * 60 * 1000; // 1 hour

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
    
    // Hash Memoization
    const payloadHash = crypto.createHash("sha256").update(sanitizedText).digest("hex");
    const cached = analysisCache.get(payloadHash);
    
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.result, { status: 200, headers: { 'X-Cache': 'HIT' } });
    }

    // Call unified AI provider
    const analysisResult = await analyzeContractContent(sanitizedText);
    
    analysisCache.set(payloadHash, { result: analysisResult, expiresAt: Date.now() + TTL });

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (err: unknown) {
    console.error("Analysis route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
