# ClauseShield 🛡️

**Live Demo:** [ClauseShield | AI Contract Risk Radar](https://clause-shield-indol.vercel.app/)

**ClauseShield** is an AI-powered contract risk radar and real-time negotiation copilot designed to empower freelancers, tenants, and consumers facing dense, one-sided agreements.

It parses contractual text, maps predatory liabilities using a semantic traffic-light risk engine, simulates real-world legal consequences, and dynamically synthesizes balanced counter-clauses with side-by-side redlines.

## Features
- **Live Risk Radar:** Real-time semantic analysis of contractual clauses.
- **Traffic-Light Risk Engine:** Grades clauses into CRITICAL, ELEVATED, and STANDARD risks.
- **Fair-Counter Redlines:** Generates side-by-side Diff comparisons against balanced substitutes.
- **Attorney Dossier:** Exportable summary packet for legal consultation.
- **Assistive AI:** Non-binding insights to support comprehension.

## Setup Instructions
1. Clone this repository: `git clone https://github.com/RohetM/ClauseShield.git`
2. Navigate to the app directory: `cd clauseshield-app`
3. Install dependencies: `npm install --legacy-peer-deps`
4. Copy `.env.example` to `.env` and configure your API keys (if applicable).
5. Start the development server: `npm run dev`

## Architecture
Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, and Framer Motion.
It leverages Server-Sent Events (SSE) for streaming AI clause-by-clause evaluation and Monaco Editor for contract diffing. 

## Testing
Run the offline test suite using:
```bash
npm run test
```
The test suite features 100% mocked LLM responses covering standard, edge-case, and malformed inputs.
