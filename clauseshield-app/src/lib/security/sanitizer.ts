import crypto from "crypto";

// Hoisted Module-Level Regex Patterns (Optimal AST performance & static security)
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;

/**
 * Scrubs personally identifiable information prior to analysis.
 */
export function sanitizeInput(rawText: string): string {
  return rawText
    .replace(EMAIL_REGEX, "[REDACTED_EMAIL]")
    .replace(PHONE_REGEX, "[REDACTED_PHONE]")
    .replace(SSN_REGEX, "[REDACTED_ID]")
    .replace(/```/g, "'''") // Neutralize markdown code-fence escapes
    .trim();
}

/**
 * Computes deterministic SHA-256 hash for cache keys.
 */
export function computePayloadHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Returns standard protective HTTP security headers.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
};
