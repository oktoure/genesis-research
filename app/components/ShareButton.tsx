// app/components/ShareButton.tsx
'use client';

import * as React from 'react';

export default function ShareButton({ url, label = 'Share' }: { url: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function onShare() {
    // Prefer native share (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // fall through to copy
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  return (
    <button
      onClick={onShare}
      className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
      aria-label={label}
      title={label}
      type="button"
    >
      {/* tiny inline icon */}
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 8a3 3 0 0 0-2.816 1.983l-6.23-3.115a3 3 0 1 0-.708 1.416l6.23 3.115a3.002 3.002 0 0 0 0 1.202l-6.23 3.115a3 3 0 1 0 .708 1.416l6.23-3.115A3 3 0 1 0 18 8z" fill="currentColor"/>
      </svg>
      {copied ? 'Copied!' : label}
    </button>
  );
}
