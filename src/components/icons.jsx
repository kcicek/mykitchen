import React from 'react';

export function IconCalendar({ className = 'size-5 text-gray-600', ...props }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6 2a1 1 0 012 0v1h4V2a1 1 0 112 0v1h1.5A1.5 1.5 0 0117 4.5v11A1.5 1.5 0 0115.5 17h-11A1.5 1.5 0 013 15.5v-11A1.5 1.5 0 014.5 3H6V2zm-1.5 4v9h11V6h-11z" />
    </svg>
  );
}

export function IconCart({ className = 'size-5 text-gray-600', ...props }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 4a1 1 0 100 2h1l1.1 5.7A2 2 0 007.1 13h6.4a1 1 0 100-2H7.2l-.2-1h7a2 2 0 001.9-1.4l1-3.2A1 1 0 0016 5H6.4l-.2-1H3zm4 12a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    </svg>
  );
}
