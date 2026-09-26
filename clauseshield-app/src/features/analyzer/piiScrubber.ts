/**
 * Masks sensitive PII from text before sending to LLMs.
 * Masks emails, phone numbers, and SSN/National IDs.
 */
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;

export function scrubPII(text: string): string {
  if (!text) return text;

  let sanitized = text;
  sanitized = sanitized.replace(emailRegex, "[REDACTED_EMAIL]");
  sanitized = sanitized.replace(phoneRegex, "[REDACTED_PHONE]");
  sanitized = sanitized.replace(ssnRegex, "[REDACTED_ID]");
  
  return sanitized;
}
