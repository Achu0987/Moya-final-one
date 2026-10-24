import Words from '@/components/common/Words';

// What happens after you send: three numbered cards in the home page's step-card style (the number is information
// here, the order things happen in). Flat 2px-ink drawings; each plays once as the list comes into view.
// PLACEHOLDER: the steps are our reading of the brief, not a confirmed process or response time
// (PAGE_BRIEFS.md #12: no response-time or service promise). Replace with the client's "How we work" document.
const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

function LetterArt() {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <rect x="44" y="36" width="112" height="76" rx="6" {...S} fill="var(--base)" />
      <path className="nx-draw" d="M46 40l54 40 54-40" pathLength="1" {...S} />
      <circle className="nx-pop" cx="150" cy="40" r="9" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  );
}

function ReplyArt() {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <rect x="66" y="8" width="68" height="124" rx="13" {...S} fill="var(--base)" />
      <rect x="90" y="14" width="20" height="4" rx="2" fill="var(--ink)" />
      <rect className="nx-pop" style={{ '--d': '0.2s' }} x="76" y="34" width="40" height="16" rx="8" fill="var(--grey)" stroke="var(--ink)" strokeWidth="1.5" />
      <rect className="nx-pop" style={{ '--d': '0.6s' }} x="86" y="58" width="38" height="16" rx="8" fill="var(--water)" stroke="var(--ink)" strokeWidth="1.5" />
      <rect className="nx-pop" style={{ '--d': '1s' }} x="86" y="80" width="28" height="16" rx="8" fill="var(--water)" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  );
}

function PlanArt() {
  const floors = [38, 64, 90];
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <path d="M20 128h160" {...S} />
      <rect x="56" y="18" width="88" height="110" {...S} fill="var(--base)" />
      <rect x="52" y="12" width="96" height="8" rx="2" {...S} fill="var(--base)" />
      {floors.map((y) =>
        [66, 106].map((x) => <rect key={`${x}${y}`} x={x} y={y - 8} width="28" height="18" rx="2" {...S} fill="var(--base)" />),
      )}
      <path className="nx-draw" d="M100 128V30" pathLength="1" stroke="var(--orange)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {floors.map((y, i) => (
        <path
          key={y}
          className="nx-draw"
          style={{ '--d': `${0.9 - i * 0.25}s` }}
          d={`M100 ${y + 6}H80M100 ${y + 6}H120`}
          pathLength="1"
          stroke="var(--orange)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

const STEPS = [
  { Art: LetterArt, title: 'We read your message.', text: 'It comes straight to the Moya One team.' },
  { Art: ReplyArt, title: 'We reply your way.', text: 'By phone or by email, whichever you gave us.' },
  {
    Art: PlanArt,
    title: 'We talk about your tower.',
    text: 'Builders: where Moya One fits into your build. Residents: if your tower is going up now, how to ask your builder for it.',
  },
];

export default function NextSteps() {
  return (
    <section className="nx" aria-labelledby="nx-title">
      <div className="container">
        <div className="steps-head">
          <h2 id="nx-title" data-reveal="words">
            <Words>What happens next.</Words>
          </h2>
          <p data-reveal="fade">Three simple steps from your message to a conversation about your tower.</p>
        </div>
        <ol className="nx-list" data-in>
          {STEPS.map(({ Art, title, text }, i) => (
            <li key={title} className="step nx-card" style={{ '--i': i }}>
              <div className="step-art">
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="step-art-inner">
                  <Art />
                </div>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
