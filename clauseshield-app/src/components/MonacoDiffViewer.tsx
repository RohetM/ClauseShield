"use client";

import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface MonacoDiffViewerProps {
  original: string;
  modified: string;
}

export default function MonacoDiffViewer({ original, modified }: MonacoDiffViewerProps) {
  return (
    <DiffEditor
      height="100%"
      language="plaintext"
      original={original}
      modified={modified}
      theme="vs-dark"
      options={{
        readOnly: true,
        renderSideBySide: true,
        minimap: { enabled: false },
        wordWrap: "on",
        lineNumbers: "off",
        scrollBeyondLastLine: false,
        renderOverviewRuler: false,
        fontFamily: "'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'",
        fontSize: 13,
      }}
    />
  );
}
