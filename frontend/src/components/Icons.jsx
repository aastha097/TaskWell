const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Chevron = (p) => <svg {...base} {...p}><path d="M4 6l4 4 4-4" /></svg>
export const Close = (p) => <svg {...base} {...p}><path d="M4 4l8 8M12 4l-8 8" /></svg>
export const Plus = (p) => <svg {...base} {...p}><path d="M8 3v10M3 8h10" /></svg>
export const Check = (p) => <svg {...base} {...p}><path d="M3 8.5l3.2 3L13 4.5" /></svg>
export const Back = (p) => <svg {...base} {...p}><path d="M10 3L5 8l5 5" /></svg>
export const Lines = (p) => <svg {...base} {...p}><path d="M2.5 4h11M2.5 8h11M2.5 12h7" /></svg>
