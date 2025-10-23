'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type Variant = 'light' | 'solidOnDark';

export default function BackLink({
  fallback = '/',
  variant = 'light',
}: {
  fallback?: string;
  variant?: Variant;
}) {
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

  const base =
    variant === 'solidOnDark'
      ? // Always-visible on dark header
        'bg-white text-slate-900 border border-white rounded-lg shadow-sm hover:bg-white'
      : // For light surfaces (not used on the header)
        'text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white';

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`text-xs font-semibold px-3 py-1.5 ${base}`}
    >
      ← Back
    </button>
  );
}
