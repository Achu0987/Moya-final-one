'use client';

import { useEffect, useRef, useState } from 'react';
import { JugShape } from '@/components/Jug';

// The first screen's drawing: one tower, two ways to get drinking water into it.
// Today: a van brings 20-litre jugs to the gate and a jug waits in every flat. With Moya One: the van drives off, the
// jugs go, and one orange line rises from the plant room to every flat. It plays once when it comes into view, then
// the visitor switches between the two. Same flat 2px-ink style as the home page's step drawings.
// Reduced motion: shows the Moya One state, the final state, with no travel.
const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const GROUND = 318;
const FLOORS = [86, 132, 178, 224]; // top of each floor, top to bottom
const WINDOWS = [252, 320];
const RISER = 306;

const CAPTION = {
  today: 'Jugs come by van, go up in the lift, and come back down empty.',
  moya: 'Water rises up one line to every flat. Nothing comes in, nothing goes back.',
};

export default function TowerToggle() {
  const [state, setState] = useState('today');
  const box = useRef(null);
  const touched = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('moya');
      return;
    }
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = setTimeout(() => touched.current || setState('moya'), 1600);
      },
      { threshold: 0.5 },
    );
    io.observe(box.current);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  const pick = (s) => {
    touched.current = true;
    setState(s);
  };

  return (
    <figure ref={box} className={`tt is-${state}`}>
      <svg
        className="tt-art"
        viewBox="14 46 388 324"
        role="img"
        aria-label={
          state === 'moya'
            ? 'A tower with one orange line rising from the plant room to every flat. No van, no jugs.'
            : 'A van with water jugs at the gate of a tower, and a jug in every flat.'
        }
      >
        <defs>
          <symbol id="tt-jug" viewBox="24 30 112 176">
            <JugShape id="tt-jug-shape" />
          </symbol>
        </defs>

        {/* the tower */}
        <path d={`M16 ${GROUND}H464`} {...S} />
        <rect x="228" y="66" width="156" height={GROUND - 66} {...S} fill="var(--base)" />
        <rect x="222" y="58" width="168" height="10" rx="2" {...S} fill="var(--base)" />
        {FLOORS.map((y) =>
          WINDOWS.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="40" height="30" rx="3" {...S} fill="var(--base)" />),
        )}
        <rect x="290" y="276" width="32" height={GROUND - 276} rx="2" {...S} fill="var(--base)" />

        {/* the plant room below ground */}
        <rect className="tt-plant" x="252" y="328" width="108" height="32" rx="6" />
        <rect x="266" y="336" width="26" height="16" rx="5" fill="var(--water)" stroke="var(--ink)" strokeWidth="1.5" />

        {/* Today: a jug in every flat */}
        <g className="tt-jugs">
          {FLOORS.map((y, f) =>
            WINDOWS.map((x, k) => (
              <use key={`${x}-${y}`} href="#tt-jug" x={x + 12} y={y + 3} width="16" height="25" style={{ '--k': f * 2 + k }} />
            )),
          )}
        </g>

        {/* Today: the van at the gate, and the jugs' trip to the door */}
        <path className="tt-trip" d={`M178 ${GROUND - 8}H288`} />
        <g className="tt-van">
          <rect x="28" y="252" width="104" height="54" rx="5" {...S} fill="var(--base)" />
          {[44, 72, 100].map((x) => (
            <use key={x} href="#tt-jug" x={x} y="262" width="22" height="36" />
          ))}
          <path d="M132 272h26l16 18v16h-42z" {...S} fill="var(--base)" />
          <path d="M140 278h16l9 11h-25z" fill="var(--water)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="60" cy="308" r="10" {...S} fill="var(--base)" />
          <circle cx="150" cy="308" r="10" {...S} fill="var(--base)" />
        </g>

        {/* With Moya One: one line from the plant room up the tower, a branch to every flat */}
        <path className="tt-riser" d={`M292 344H${RISER}V${FLOORS[0] + 16}`} pathLength="1" />
        {FLOORS.map((y, f) => (
          <g key={y}>
            <path
              className="tt-branch"
              style={{ '--f': FLOORS.length - 1 - f }}
              d={`M${RISER} ${y + 16}H${WINDOWS[0] + 40}M${RISER} ${y + 16}H${WINDOWS[1]}`}
              pathLength="1"
            />
            {WINDOWS.map((x) => (
              <circle
                key={x}
                className="tt-dot"
                style={{ '--f': FLOORS.length - 1 - f }}
                cx={x + 20}
                cy={y + 15}
                r="5"
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="tt-bar">
        <div className="tt-switch" role="group" aria-label="Show the tower">
          <button type="button" aria-pressed={state === 'today'} onClick={() => pick('today')}>
            Today
          </button>
          <button type="button" aria-pressed={state === 'moya'} onClick={() => pick('moya')}>
            With Moya One
          </button>
        </div>
        <figcaption className="tt-caption" aria-live="polite">
          {CAPTION[state]}
        </figcaption>
      </div>
    </figure>
  );
}
