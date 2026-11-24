const s = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconClose = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" {...s} strokeWidth="2.2" /></svg>
);
export const IconDine = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 8.5h11V13a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" {...s} strokeWidth="2" />
    <path d="M16 10h1.3a2.4 2.4 0 0 1 0 4.8H15.5M3.5 21h15" {...s} strokeWidth="2" />
  </svg>
);
export const IconBag = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5.5 8h13l-1 12.5h-11z" {...s} strokeWidth="2" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" {...s} strokeWidth="2" />
  </svg>
);
export const IconWa = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.4 19.6l1.2-3.9a8 8 0 1 1 3 2.9z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path fill="currentColor" d="M9.2 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5 0 .6-.3 1.3-.9 1.6-.8.4-1.9.4-3.4-.3-1.9-.9-3.3-2.5-4-4.2-.4-1-.4-2 .2-2.9z" />
  </svg>
);
export const IconCheck = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4 4 9-9" {...s} strokeWidth="2.8" /></svg>
);
export const IconPin = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="10" r="2.4" fill="currentColor" />
  </svg>
);
export const IconGlobe = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const IconChevron = ({ dir = 'right' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} {...s} strokeWidth="2.6" />
  </svg>
);

export const Tofu = ({ label }) => (
  <svg viewBox="0 0 120 120" role="img" aria-label={label}>
    <rect width="120" height="120" fill="#f6efe0" />
    <g stroke="#4e402b" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 26c-3 4 3 6 0 10M64 22c-3 4 3 6 0 10M78 26c-3 4 3 6 0 10" fill="none" stroke="#a88d69" />
      <rect x="33" y="44" width="21" height="18" rx="4" fill="#f0cf8f" />
      <rect x="55" y="38" width="21" height="18" rx="4" fill="#e9bf73" transform="rotate(8 65 47)" />
      <rect x="70" y="47" width="19" height="16" rx="4" fill="#f0cf8f" transform="rotate(-7 79 55)" />
      <path d="M20 64h80c0 19-18 32-40 32S20 83 20 64z" fill="#fffdf8" />
      <path d="M42 96h36" fill="none" />
    </g>
  </svg>
);
