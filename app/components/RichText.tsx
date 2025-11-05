// components/RichText.tsx
import React from 'react';

function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`b${idx}`} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`t${idx}`}>{part}</span>
    )
  );
}

export function renderInline(text: string): React.ReactNode[] {
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(text)) !== null) {
    const [full, label, href] = m;
    if (m.index > last) out.push(...renderBold(text.slice(last, m.index)));
    out.push(
      <a
        key={`a${m.index}`}
        href={href}
        className="underline underline-offset-2 hover:opacity-80"
      >
        {label}
      </a>
    );
    last = m.index + full.length;
  }
  if (last < text.length) out.push(...renderBold(text.slice(last)));
  return out;
}

export default function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <span className={className}>{renderInline(text)}</span>;
}
