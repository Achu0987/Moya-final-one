// The one 20-litre jug drawing (CLAUDE.md "Bottle drawing"). Same geometry as public/illustrations/jug.svg.
// Drawn in a 160 x 216 box: body 100 x 140, shoulder radius 25, neck 38 wide, small orange cap.
const BODY =
  'M30 86a25 25 0 0 1 25-25h50a25 25 0 0 1 25 25v104a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z';

export function JugShape({ id, water = true }) {
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
      </defs>
      <rect x="61" y="47" width="38" height="16" rx="3" fill="var(--base)" stroke="var(--ink)" strokeWidth="2" />
      <rect x="58" y="36" width="44" height="13" rx="4" fill="var(--orange)" />
      <path d={BODY} fill="var(--base)" />
      {water && (
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="28" y="92" width="104" height="110" fill="var(--water)" />
          <line x1="28" y1="92" x2="132" y2="92" stroke="var(--ink)" strokeOpacity=".35" strokeWidth="1.5" />
          <path d="M30 124h100M30 158h100" stroke="var(--ink)" strokeOpacity=".18" strokeWidth="2" />
        </g>
      )}
      <rect x="40" y="74" width="7" height="112" rx="3.5" fill="var(--base)" fillOpacity=".75" />
      <path d={BODY} fill="none" stroke="var(--ink)" strokeWidth="2" />
    </g>
  );
}

export default function Jug({ id = 'jug', title = 'A 20-litre water jug', ...props }) {
  return (
    <svg viewBox="0 0 160 216" role="img" aria-labelledby={`${id}-title`} {...props}>
      <title id={`${id}-title`}>{title}</title>
      <JugShape id={id} />
    </svg>
  );
}
