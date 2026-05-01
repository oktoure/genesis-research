'use client';

import * as React from 'react';

type ChartZoomProps = {
  src: string;
  alt: string;
  height?: string;
};

export default function ChartZoom({ src, alt, height }: ChartZoomProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const encodedSrc = encodeURI(src);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Open larger chart: ${alt}`}
      >
        <img
          src={encodedSrc}
          alt={alt}
          className="w-full rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
          style={
            height
              ? {
                  height,
                  objectFit: 'contain',
                }
              : {}
          }
        />

        <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100">
          Click to zoom
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-5"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Larger chart: ${alt}`}
        >
          <div className="mx-auto flex h-full max-w-[1800px] flex-col">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{alt}</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Enlarged chart view
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div
              className="flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-white p-3 shadow-2xl sm:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={encodedSrc}
                alt={alt}
                className="h-auto w-full max-w-full rounded-xl object-contain"
                style={{
                  maxHeight: 'calc(100vh - 120px)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
