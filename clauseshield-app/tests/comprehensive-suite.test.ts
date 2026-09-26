import { describe, it, expect, beforeEach } from "vitest";
import { BoundedLRUCache } from "../src/lib/cache/lruCache";
import { sanitizeInput, computePayloadHash } from "../src/lib/security/sanitizer";
import { AnalyzeRequestSchema } from "../src/lib/validation/clauseSchema";
import { analyzeContractContent } from "../src/lib/ai/provider";

describe("1. Security & Sanitization Suite", () => {
  it("redacts emails, phone numbers, and SSNs", () => {
    const input = "Contact john.doe@example.com at 555-123-4567 or ID 123-45-6789.";
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain("john.doe@example.com");
    expect(sanitized).not.toContain("555-123-4567");
    expect(sanitized).toContain("[REDACTED_EMAIL]");
    expect(sanitized).toContain("[REDACTED_PHONE]");
  });

  it("neutralizes code fence prompt escapes", () => {
    const input = "Normal text ``` Drop table ```";
    expect(sanitizeInput(input)).toContain("''' Drop table '''");
  });

  it("enforces maximum payload size bounds", () => {
    const oversized = "a".repeat(16000);
    const result = AnalyzeRequestSchema.safeParse({ text: oversized });
    expect(result.success).toBe(false);
  });
});

describe("2. Efficiency & Bounded Cache Suite", () => {
  let cache: BoundedLRUCache<string, string>;

  beforeEach(() => {
    cache = new BoundedLRUCache<string, string>(3, 5000);
  });

  it("correctly stores and retrieves cached values (Cache Hit)", () => {
    cache.set("key1", "value1");
    expect(cache.get("key1")).toBe("value1");
  });

  it("evicts oldest entries when capacity limit is reached", () => {
    cache.set("k1", "v1");
    cache.set("k2", "v2");
    cache.set("k3", "v3");
    cache.set("k4", "v4"); // Should evict k1
    expect(cache.get("k1")).toBeNull();
    expect(cache.get("k4")).toBe("v4");
  });

  it("computes identical hashes for identical inputs", () => {
    const h1 = computePayloadHash("test clause");
    const h2 = computePayloadHash("test clause");
    expect(h1).toBe(h2);
  });
});

describe("3. Problem Statement & Legal Domain AI Handling", () => {
  it("correctly identifies predatory clauses (High Attention)", async () => {
    const clause = "Contractor grants Client perpetual ownership of all IP created outside contract period.";
    const res = await analyzeContractContent(clause);
    expect(res.is_contractual).toBe(true);
    expect(res.clauses?.[0]?.severity).toBe("CRITICAL");
    expect(res.clauses?.[0]?.fair_counter_clause).toBeDefined();
  });

  it("gracefully catches non-legal edge cases (Cookie Recipe)", async () => {
    const nonLegal = "Recipe for cookies: 2 cups flour, 1 cup sugar, bake for 30 mins.";
    const res = await analyzeContractContent(nonLegal);
    expect(res.is_contractual).toBe(false);
    expect(res.edge_case_code).toBe("NON_LEGAL");
  });

  it("includes non-negotiable legal disclaimer in all responses", async () => {
    const res = await analyzeContractContent("Standard confidentiality terms.");
    expect(res.unauthorized_practice_disclaimer).toContain("informational analysis and drafting assistance");
  });
});
