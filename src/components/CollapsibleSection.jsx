import React, { useEffect, useId, useState } from 'react';

/**
 * CollapsibleSection
 * - Renders a titled section whose content is hidden until tapped/clicked
 * - Accessible: button controls a region with aria attributes
 * - Optional persistence via localStorage with `persistKey`
 */
export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  persistKey,
  className = '',
}) {
  const reactId = useId();
  const contentId = `collapsible-${reactId}`;
  const [open, setOpen] = useState(defaultOpen);

  // Load persisted state if a key is provided
  useEffect(() => {
    if (!persistKey) return;
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved !== null) setOpen(saved === '1');
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  // Persist on change
  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, open ? '1' : '0');
    } catch {}
  }, [open, persistKey]);

  const headerBase = 'w-full flex items-center justify-between gap-3 text-left';
  const headerPad = open ? 'px-3 py-3 md:px-4 md:py-3' : 'px-3 py-2 md:px-4 md:py-3';
  const titleSize = open ? 'text-lg md:text-xl' : 'text-base md:text-xl';

  return (
    <section className={`bg-white rounded-xl overflow-hidden transition-opacity ${open ? 'opacity-100 shadow mb-4 md:mb-6' : 'opacity-70 hover:opacity-100 shadow-none mb-2 md:mb-3'} ${className}`}>
      <button
        type="button"
        className={`${headerBase} ${headerPad}`}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(o => !o)}
      >
        <span className={`${titleSize} font-semibold select-none`}>{title}</span>
        <svg
          className={`transition-transform ${open ? 'rotate-180 size-5 md:size-6' : 'rotate-0 size-4 md:size-6'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open ? (
        <div id={contentId} className="px-3 pb-3 md:px-4 md:pb-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}
