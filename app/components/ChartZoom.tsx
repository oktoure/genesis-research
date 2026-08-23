'use client';

import * as React from 'react';

type ChartZoomProps = {
  src: string;
  alt: string;
  height?: string;
};

export default function ChartZoom({ src, alt, height }: ChartZoomProps) {
  const [open, setOpen] = React.useState(false);
  const [mobileFill, setMobileFill] = React.useState(false);

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

  React.useEffect(() => {
    if (!open) setMobileFill(false);
  }, [open]);

  const encodedSrc = encodeURI(src);
  // chartHeight is legacy publishing metadata, not a fixed CSS height. Most
  // stored values are bare strings such as "700" or "350"; treating them as
  // pixels letterboxes the SVG and makes it appear vertically displaced.
  // Preserve the SVG's intrinsic aspect ratio and center it in its slot.
  void height;

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
          className="block h-auto w-full mx-auto rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
        />

        <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100">
          Click to zoom
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm sm:px-5 sm:py-5"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Larger chart: ${alt}`}
        >
          <div className="mx-auto flex h-[100dvh] max-w-[1800px] flex-col sm:h-full">
            <div className="flex items-center justify-between gap-3 px-3 py-2 sm:mb-3 sm:px-0 sm:py-0">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">{alt}</p>
                <p className="mt-0.5 text-[11px] text-slate-300 sm:text-xs">
                  {mobileFill ? 'Fill mode: drag sideways to inspect details' : 'Fit mode: full chart visible'}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMobileFill((value) => !value);
                  }}
                  className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/30 hover:bg-white/25 sm:hidden"
                >
                  {mobileFill ? 'Fit' : 'Bigger'}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900 hover:bg-slate-100 sm:text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            <div
              className={`min-h-0 flex-1 bg-white shadow-2xl sm:rounded-2xl sm:p-5 ${
                mobileFill ? 'overflow-auto' : 'overflow-hidden'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`flex h-full items-center justify-center ${
                  mobileFill ? 'min-w-[155vw] p-3' : 'w-full p-2'
                } sm:min-w-0 sm:p-0`}
              >
                <img
                  src={encodedSrc}
                  alt={alt}
                  className="rounded-xl object-contain"
                  style={{
                    width: mobileFill ? '155vw' : '100%',
                    maxWidth: mobileFill ? 'none' : '100%',
                    height: 'auto',
                    maxHeight: 'calc(100dvh - 64px)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
