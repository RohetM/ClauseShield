import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import LegalDisclaimerBar from "@/components/ui/LegalDisclaimerBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClauseShield | AI Contract Risk Radar",
  description: "Real-time negotiation copilot for freelancers, tenants, and consumers facing dense agreements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0B] text-gray-100 min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white">
          Skip to content
        </a>
        <LegalDisclaimerBar />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <div id="a11y-announcer-container" className="sr-only" aria-live="polite" aria-atomic="true" />
      </body>
    </html>
  );
}
