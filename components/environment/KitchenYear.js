'use client';

import { useEffect, useRef, useState } from 'react';
import { JugShape } from '@/components/Jug';

// A year in one kitchen: the page's signature scene. The stage holds still while the visitor scrolls through it.
// For most of the scroll the weeks run from January to December, a jug comes in through the door each week and the
// stack in the corner grows, with the counts beside it. In the last stretch the stack lifts away, the orange line
// climbs the wall to the Moya1 control unit, and the extra tap fills a glass. The counts are the visitor's own
// "jugs a week" multiplied out, so the panel is labelled Illustrative (CLAUDE.md non-negotiable 5).
// Reduced motion: the stage is not held, and shows the finished state with the full year's counts.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEAR_END = 0.74; // share of the scroll spent on the year; the rest is Moya One
const COLS = 6;
const SLOTS = 24; // jugs drawn in the corner; the counts carry the real number
const FLOOR = 540;
const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const fmt = (n) => n.toLocaleString('en-IN');
const clamp = (v) => Math.min(1, Math.max(0, v));

const BEATS = [
  { at: 0, text: 'Every week, the jugs come in through the door.' },
  { at: 0.34, text: 'And every week, the empties go back out.' },
  { at: YEAR_END, text: 'With one line, the corner is yours again.' },
];

export function Kitchen({ shown, moya, q }) {
  return (
    <svg className="ky-art" viewBox="0 0 820 600" role="img" aria-label={moya ? 'A kitchen with an empty corner. An orange line rises up the wall to a control unit, and a tap fills a glass.' : `A kitchen corner with ${shown} water jugs stacked by the door.`}>
      <defs>
        <symbol id="ky-jug" viewBox="24 30 112 176">
          <JugShape id="ky-jug-shape" />
        </symbol>
      </defs>

      {/* the room */}
      <path d={`M0 ${FLOOR}H820`} {...S} />
      <rect x="28" y="246" width="104" height={FLOOR - 246} rx="3" {...S} fill="var(--base)" />
      <circle cx="116" cy="400" r="5" fill="var(--ink)" />
      <rect x="500" y="84" width="200" height="150" rx="4" {...S} fill="var(--water)" />
      <path d="M600 84v150M500 159h200" {...S} />

      {/* Moya One's line, behind the counter, up the wall to the control unit */}
      <path className="ky-line" d={`M790 ${FLOOR}V250H760`} pathLength="1" style={{ strokeDashoffset: 1 - clamp(q * 1.6) }} />

      {/* the counter, the sink and the tap the kitchen already has */}
      <rect x="476" y="396" width="320" height={FLOOR - 396} rx="3" {...S} fill="var(--base)" />
      <path d="M636 396v144" {...S} />
      <rect x="466" y="382" width="340" height="16" rx="4" fill="var(--ink)" />
      <path d="M560 382V318a26 26 0 0 1 52 0v12" {...S} strokeWidth="3" />

      {/* the corner: one jug per slot, coming in from the door */}
      {Array.from({ length: SLOTS }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        return (
          <g key={i} transform={`translate(${166 + col * 48} ${FLOOR - (row + 1) * 72})`}>
            <use
              href="#ky-jug"
              className={`ky-jug${i < shown && !moya ? ' is-in' : ''}${moya ? ' is-gone' : ''}`}
              width="44"
              height="70"
              style={{ '--i': i, '--o': SLOTS - i }}
            />
          </g>
        );
      })}

      {/* Moya One: the control unit, the extra tap and a glass */}
      <g className={`ky-unit${q > 0.45 ? ' is-on' : ''}`}>
        <rect x="704" y="214" width="56" height="78" rx="10" {...S} fill="var(--base)" />
        <rect x="714" y="226" width="36" height="14" rx="2" fill="var(--ink)" />
        <circle cx="732" cy="270" r="5" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M712 382V344a18 18 0 0 1 36 0v6" {...S} strokeWidth="3" />
      </g>
      <rect className="ky-pour" x="744" y="352" width="7" height="24" rx="3.5" fill="var(--water)" style={{ transform: `scaleY(${clamp((q - 0.6) * 5)})` }} />
      <g className={`ky-glass${q > 0.55 ? ' is-on' : ''}`}>
        <rect x="737" y={382 - 24 * clamp((q - 0.66) * 3)} width="22" height={24 * clamp((q - 0.66) * 3)} fill="var(--water)" />
        <path d="M734 352l3 30h22l3-30" {...S} />
      </g>
    </svg>
  );
}

export default function KitchenYear() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  const [perWeek, setPerWeek] = useState(3);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      setP(1);
      return;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = ref.current.getBoundingClientRect();
      setP(clamp(-r.top / (r.height - innerHeight)));
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(read));
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const year = clamp(p / YEAR_END);
  const weeks = Math.max(1, Math.ceil(year * 52));
  const moya = p >= YEAR_END;
  const q = clamp((p - YEAR_END) / (1 - YEAR_END));
  const jugs = weeks * perWeek;
  const shown = Math.round((weeks / 52) * SLOTS);
  const beat = [...BEATS].reverse().find((b) => p >= b.at);

  return (
    <section ref={ref} id="year" className={`ky${still ? ' is-still' : ''}`} aria-labelledby="ky-title">
      <div className="ky-stage">
        <div className="container ky-grid">
          <div className="ky-hud">
            <h2 id="ky-title" className="ky-title">
              A year in one kitchen.
            </h2>

            <div className="ky-months" aria-hidden="true" style={{ '--y': year }}>
              {MONTHS.map((m, i) => (
                <span key={m} className={year * 12 > i ? 'is-past' : undefined}>
                  {m}
                </span>
              ))}
            </div>

            <p className="ky-week" aria-live="off">
              {moya ? 'No jugs.' : `Week ${weeks}`}
            </p>
            <dl className="ky-counts">
              <div>
                <dt>jugs carried in</dt>
                <dd>{fmt(jugs)}</dd>
              </div>
              <div>
                <dt>empties carried out</dt>
                <dd>{fmt(jugs)}</dd>
              </div>
              <div className={`ky-none${moya ? ' is-on' : ''}`}>
                <dt>with Moya One</dt>
                <dd>0</dd>
              </div>
            </dl>

            <p className="ky-beat" key={beat.at}>
              {beat.text}
            </p>

            <div className="ky-chips" role="group" aria-label="Jugs your home uses in a week">
              <span className="ky-chips-label">Jugs a week</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-pressed={perWeek === n} onClick={() => setPerWeek(n)}>
                  {n}
                </button>
              ))}
            </div>
            <span className="sample">Illustrative</span>
          </div>

          <figure className="ky-scene">
            <Kitchen shown={shown} moya={moya} q={q} />
          </figure>
        </div>
        <div className="ky-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
    </section>
  );
}
