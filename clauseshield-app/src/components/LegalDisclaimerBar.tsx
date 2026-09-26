import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function LegalDisclaimerBar() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-200 px-4 py-2 flex items-center justify-center text-sm font-medium sticky top-0 z-50">
      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
      <p>
        <strong>Assistive Intelligence Only:</strong> ClauseShield assists with legal comprehension and does not practice law or provide certified legal representation.
      </p>
    </div>
  );
}
