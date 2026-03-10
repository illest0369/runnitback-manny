'use client';

import { useState } from 'react';

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text || '');
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    } catch {
      setDone(false);
    }
  }

  return (
    <button className="copy-btn" onClick={onCopy} aria-label={label}>
      {done ? 'Copied' : label}
    </button>
  );
}
