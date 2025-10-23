'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function BackLink({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || fallback;

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(from);
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
    >
      ← Back
    </button>
  );
}
