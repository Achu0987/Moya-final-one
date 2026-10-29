'use client';

import { useEffect, useRef, useState } from 'react';
import { JugShape } from '@/components/Jug';

// One kitchen, shown each way: a stack of jugs in the corner, an RO unit under the sink with its line to the drain,
// or the Moya1 control unit, one extra tap and the line up the wall. Same flat 2px-ink style as the rest of the site.
// When it comes into view it steps through the states once and stops on Moya One; then the visitor switches.
// Reduced motion: no stepping, it opens on Moya One, the final state.
const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const FLOOR = 520;

const CAPTION = {
  jugs: 'Jugs: delivered, carried in, stacked in the corner, carried back out.',
  ro: 'An RO filter: a unit under the sink, filters to change, and water sent to the drain as it works.',
  moya: 'Moya One: a control unit on the wall, one extra tap, and a line up the tower. Nothing else.',
};
const LABEL = { jugs: 'Jugs', ro: 'RO filter', moya: 'Moya One' };

export default function KitchenSwitch({ states = ['jugs', 'ro', 'moya'], id = 'ks' }) {
  const [state, setState] = useState(states[0]);
  const box = useRef(null);
  const touched = useRef(false);

  useEffect(() => {
    const last = states[states.length - 1];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(last);
      return;
    }
    const timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        states.slice(1).forEach((s, i) => timers.push(setTimeout(() => touched.current || setState(s), 1800 * (i + 1))));
      },
      { threshold: 0.5 },
    );
    io.observe(box.current);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [states]);

  const pick = (s) => {
    touched.current = true;
    setState(s);
  };

  return (
    <figure ref={box} className={`ks is-${state}`}>
      <svg
        className="ks-art"
        viewBox="0 30 820 520"
        role="img"
        aria-label={`A kitchen. ${CAPTION[state]}`}
      >
        <defs>
          <symbol id={`${id}-jug`} viewBox="24 30 112 176">
            <JugShape id={`${id}-jug-shape`} />
          </symbol>
        </defs>

        {/* the room */}
        <path d={`M0 ${FLOOR}H820`} {...S} />
        <rect x="470" y="70" width="200" height="140" rx="4" {...S} fill="var(--water)" />
        <path d="M570 70v140M470 140h200" {...S} />

        {/* Moya One's line, behind the counter, up the wall */}
        <path className="ks-line" d={`M790 ${FLOOR}V250H760`} pathLength="1" />

        {/* the counter, the cupboard under the sink and the kitchen's own tap */}
        <rect x="440" y="380" width="360" height={FLOOR - 380} rx="3" {...S} fill="var(--base)" />
        <g className="ks-closed">
          <path d="M620 380v140" {...S} />
          <circle cx="606" cy="452" r="4" fill="var(--ink)" />
          <circle cx="634" cy="452" r="4" fill="var(--ink)" />
        </g>
        <rect x="430" y="366" width="380" height="16" rx="4" fill="var(--ink)" />
        <path d="M540 366V302a26 26 0 0 1 52 0v12" {...S} strokeWidth="3" />

        {/* Jugs: a stack in the corner */}
        <g className="ks-jugs">
          {[
            [70, FLOOR - 96],
            [140, FLOOR - 96],
            [210, FLOOR - 96],
            [105, FLOOR - 192],
            [175, FLOOR - 192],
            [280, FLOOR - 96],
          ].map(([x, y], i) => (
            <use key={i} href={`#${id}-jug`} x={x} y={y} width="62" height="96" style={{ '--i': i }} />
          ))}
        </g>

        {/* RO filter: the cupboard open, the unit inside, its own spout, and a line to the drain */}
        <g className="ks-ro">
          <rect x="452" y="392" width="336" height="116" rx="3" fill="var(--grey)" />
          <rect x="476" y="408" width="150" height="86" rx="8" {...S} fill="var(--base)" />
          {[492, 528, 564].map((x) => (
            <rect key={x} x={x} y="420" width="24" height="62" rx="8" {...S} fill="var(--water)" />
          ))}
          <path d="M626 430H700V366" {...S} />
          <path d="M700 366V322h-20v8" {...S} strokeWidth="3" />
          <path className="ks-drain" d="M550 494V506H760" />
        </g>

        {/* Moya One: the control unit, the extra tap and a glass */}
        <g className="ks-moya">
          <rect x="704" y="214" width="56" height="78" rx="10" {...S} fill="var(--base)" />
          <rect x="714" y="226" width="36" height="14" rx="2" fill="var(--ink)" />
          <circle cx="732" cy="270" r="5" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M712 366V328a18 18 0 0 1 36 0v6" {...S} strokeWidth="3" />
          <rect x="737" y="346" width="22" height="20" fill="var(--water)" />
          <path d="M734 336l3 30h22l3-30" {...S} />
        </g>
      </svg>

      <div className="ks-bar">
        <div className="ks-switch" role="group" aria-label="Show the kitchen with">
          {states.map((s) => (
            <button key={s} type="button" aria-pressed={state === s} onClick={() => pick(s)}>
              {LABEL[s]}
            </button>
          ))}
        </div>
        <figcaption className="ks-caption" aria-live="polite">
          {CAPTION[state]}
        </figcaption>
      </div>
    </figure>
  );
}
