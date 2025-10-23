// app/lib/site.ts
export function getBaseUrl(): string {
  // Client-side
  if (typeof window !== 'undefined') return window.location.origin;

  // Server-side (Vercel/Node)
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL || // e.g. https://genesis-research.vercel.app
    process.env.VERCEL_URL;             // e.g. genesis-research.vercel.app

  if (!fromEnv) return 'http://localhost:3000';

  // Ensure protocol
  const url = fromEnv.startsWith('http') ? fromEnv : `https://${fromEnv}`;
  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const base = getBaseUrl();
  if (!path.startsWith('/')) return path; // already absolute, or external
  return `${base}${path}`;
}
