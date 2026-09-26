import { NextRequest } from "next/server";
import { ClauseAnalysisResult } from "@/lib/types";

// Dummy data to stream for mock analysis
const mockClauses: ClauseAnalysisResult[] = [
  {
    clause_id: "clause_1",
    original_text: "Contractor grants Client perpetual, worldwide ownership of all IP created during or outside the contract period.",
    category: "INTELLECTUAL_PROPERTY",
    severity: "CRITICAL",
    risk_score: 9.5,
    asymmetry: {
      favors: "SECOND_PARTY",
      imbalance_explanation: "The clause grants ownership of IP created even outside the scope of work, which is highly predatory.",
    },
    plain_english_consequence: "You are giving away the rights to any ideas or work you create, even on your own time.",
    fair_counter_clause: "Ownership limited solely to agreed milestone deliverables.",
    suggested_negotiation_script: "I am happy to assign rights for the specific deliverables agreed upon, but I must retain ownership of IP created outside this contract.",
  },
  {
    clause_id: "clause_2",
    original_text: "This agreement may be terminated by Client at any time without notice. Contractor must provide 60 days notice.",
    category: "TERMINATION",
    severity: "ELEVATED",
    risk_score: 7.2,
    asymmetry: {
      favors: "SECOND_PARTY",
      imbalance_explanation: "Termination rights are not mutual. The client can terminate immediately while the contractor is locked in for 60 days.",
    },
    plain_english_consequence: "You can be fired without warning, but you cannot leave the project without a 60-day notice.",
    fair_counter_clause: "Either party may terminate this agreement with 30 days written notice.",
    suggested_negotiation_script: "Let's make the termination notice mutual at 30 days to ensure fairness for both parties.",
  }
];

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });
    }

    // Edge case handling as per PRD: "Recipe for chocolate chip cookies..."
    const lowerText = text.toLowerCase();
    if (lowerText.includes("recipe") || lowerText.includes("chocolate chip") || lowerText.length < 50) {
      return new Response(JSON.stringify({ error: "No contractual obligations or legal clauses detected. Please provide an operative agreement." }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial metadata
        const metadata = {
          contract_summary: "Reviewing independent contractor agreement.",
          overall_risk_score: 8.4,
          unauthorized_practice_disclaimer: "ClauseShield assists with comprehension and is not certified legal representation.",
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'metadata', data: metadata })}\n\n`));

        // Simulate streaming each clause
        for (const clause of mockClauses) {
          // If the user pasted the specific IP grab text, we definitely want the first clause.
          // Otherwise, we'll just stream both as mock for any valid contract.
          await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay per clause for effect
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'clause', data: clause })}\n\n`));
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
