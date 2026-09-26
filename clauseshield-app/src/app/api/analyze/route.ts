import { NextRequest } from "next/server";
import { analyzeContractMock } from "@/lib/ai/mockProvider";

const MAX_PAYLOAD_CHARS = 15000;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });
    }

    if (text.length > MAX_PAYLOAD_CHARS) {
      return new Response(JSON.stringify({ error: "Payload exceeds size limit" }), { status: 413 });
    }

    // Defensive isolation
    const isolatedPayload = `<CONTRACT_PAYLOAD>\n${text}\n</CONTRACT_PAYLOAD>`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await analyzeContractMock(isolatedPayload, (chunk) => {
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          });
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: err.message })}\n\n`));
          controller.close();
        }
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
