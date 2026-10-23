'use client';

import { useEffect, useRef, useState } from 'react';
import Words from './common/Words';
import Trace from './common/Trace';
import { SAMPLE_BALANCE_L, SAMPLE_PACKS_L } from '@/lib/content';

// Each step's drawing plays once when its card comes into view; the markup is the finished state,
// so reduced motion and no-script visitors see the result (DESIGN.md section 7).
const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

function TowerArt() {
  const floors = [38, 64, 90];
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <path d="M20 128h160" {...S} />
      <rect x="56" y="18" width="88" height="110" fill="var(--base)" {...S} />
      <rect x="52" y="12" width="96" height="8" rx="2" fill="var(--base)" {...S} />
      {floors.map((y) =>
        [66, 106].map((x) => <rect key={`${x}${y}`} x={x} y={y - 8} width="28" height="18" rx="2" fill="var(--base)" {...S} />),
      )}
      <path className="a-draw a-riser" d="M100 128V30" pathLength="1" stroke="var(--orange)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {floors.map((y, i) => (
        <g key={y}>
          <path className="a-draw a-branch" style={{ '--d': `${1.3 - i * 0.35}s` }} d={`M100 ${y + 6}H80M100 ${y + 6}H120`} pathLength="1" stroke="var(--orange)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {[80, 120].map((x) => (
            <circle key={x} className="a-pop" style={{ '--d': `${1.6 - i * 0.35}s` }} cx={x} cy={y - 2} r="3.5" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function KitchenArt() {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <rect x="128" y="18" width="44" height="58" rx="10" fill="var(--base)" {...S} />
      <rect x="138" y="30" width="24" height="10" rx="2" fill="var(--ink)" />
      <circle className="a-pop" style={{ '--d': '0.2s' }} cx="150" cy="58" r="4" fill="var(--yellow)" />
      <path d="M62 108V58a24 24 0 0 1 48 0v8" {...S} strokeWidth="3" />
      <rect className="a-pour" x="106" y="68" width="8" height="30" rx="4" fill="var(--water)" />
      {/* the glass, filling */}
      <rect className="a-fill" x="98" y="86" width="24" height="22" fill="var(--water)" />
      <path d="M96 76l3 32h22l3-32" {...S} />
      <rect x="24" y="108" width="152" height="10" rx="3" fill="var(--ink)" />
    </svg>
  );
}

function PhoneArt({ litres }) {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <rect x="62" y="6" width="76" height="128" rx="14" fill="var(--base)" {...S} />
      <rect x="88" y="12" width="24" height="4" rx="2" fill="var(--ink)" />
      <text x="74" y="36" fontFamily="var(--font-text)" fontSize="8" fill="var(--muted)">Balance</text>
      <text x="74" y="58" fontFamily="var(--font-display)" fontWeight="700" fontSize="20" fill="var(--ink)">
        {litres}
        <tspan fontSize="8" fontWeight="500" fill="var(--muted)"> L</tspan>
      </text>
      <rect x="74" y="66" width="52" height="6" rx="3" fill="var(--grey)" />
      <rect className="a-bar" x="74" y="66" width="52" height="6" rx="3" fill="var(--water)" />
      <rect x="74" y="80" width="24" height="16" rx="8" fill="none" {...S} strokeWidth="1.5" />
      <rect x="102" y="80" width="24" height="16" rx="8" fill="var(--ink)" />
      <rect className="a-press" x="74" y="106" width="52" height="16" rx="8" fill="var(--orange)" />
    </svg>
  );
}

const FROM = SAMPLE_BALANCE_L;
const TO = SAMPLE_BALANCE_L + SAMPLE_PACKS_L[1];

const STEPS = [
  {
    title: 'Built into your tower.',
    text: 'A dedicated water line is laid to every flat while the tower is built, through your builder.',
  },
  {
    title: 'Right in your kitchen.',
    text: 'Each kitchen gets a Moya1™ control unit and an extra tap, just for drinking water.',
  },
  {
    title: 'Recharged from your phone.',
    text: 'Top up litres in the Moya One app, the way you top up a mobile plan.',
  },
];

export default function Steps() {
  const list = useRef(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [litres, setLitres] = useState(TO);
  const [takes, setTakes] = useState([0, 0, 0]); // bumping a card's take remounts its drawing and replays it
  const raf = useRef(0);
  const motionOk = useRef(false);

  // the phone's balance counts up in step with its bar
  const count = (delay) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now() + delay;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1400));
      setLitres(Math.round(FROM + (TO - FROM) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    setLitres(FROM);
    raf.current = requestAnimationFrame(tick);
  };

  const replay = (i) => {
    if (!motionOk.current || !playing) return;
    setTakes((t) => t.map((n, j) => (j === i ? n + 1 : n)));
    if (i === 2) count(400);
  };

  useEffect(() => {
    const el = list.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    motionOk.current = true;
    setArmed(true); // drawings start empty only once the script can play them
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPlaying(true);
        count(1900);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const arts = [<TowerArt key="t" />, <KitchenArt key="k" />, <PhoneArt key="p" litres={litres} />];

  return (
    <section className="steps" id="how" aria-labelledby="steps-title">
      <div className="container">
        <div className="steps-head">
          <h2 id="steps-title" data-reveal="words">
            <Words>From the building to your tap.</Words>
          </h2>
          <p data-reveal="fade">Three parts, one simple routine. Nothing to carry, store or change.</p>
        </div>
        <ol ref={list} className={`steps-list${armed ? ' is-armed' : ''}${playing ? ' is-playing' : ''}`}>
          {STEPS.map(({ title, text }, i) => (
            <li
              key={title}
              className="step"
              style={{ '--card': takes[i] ? '0s' : `${i * 0.6}s` }}
              onMouseEnter={() => replay(i)}
              onClick={() => replay(i)}
            >
              <Trace />
              <div className="step-art">
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="step-art-inner" key={takes[i]}>
                  {arts[i]}
                </div>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              {i === 2 && <p className="step-note">Sample data.</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
