'use client';

import { useEffect, useRef, useState } from 'react';
import { JugShape } from '@/components/Jug';

// The first screen's drawing: one tower, two ways to get drinking water into it.
// Today: a van brings 20-litre jugs to the gate and a jug waits in every flat. With MoyaOne: the van drives off, the
// jugs go, and one line rises from the plant room to every flat. The scroll drives it (client request): as the card
// passes the middle of the screen going down it turns to MoyaOne, and scrolling back up returns it to today. The two
// buttons still switch it by hand. Same flat 2px-ink style as the home page's step drawings.
// Reduced motion: shows the MoyaOne state, the final state, with no travel.
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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('moya');
      return;
    }
    // which side of the screen's middle the card's centre is on; the state changes only when that side changes,
    // so a choice made with the buttons holds until the visitor scrolls past the middle again
    let zone = null;
    let raf = 0;
    const check = () => {
      raf = 0;
      const r = box.current.getBoundingClientRect();
      const next = r.top + r.height * 0.5 < window.innerHeight * 0.5 ? 'moya' : 'today';
      if (next !== zone) {
        zone = next;
        setState(next);
      }
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(check));
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const pick = (s) => setState(s);

  return (
    <figure ref={box} className={`tt is-${state}`}>
      <svg
        className="tt-art"
        viewBox="14 46 388 324"
        role="img"
        aria-label={
          state === 'moya'
            ? 'A tower with one line rising from the plant room to every flat. No van, no jugs.'
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

        {/* With MoyaOne: one line from the plant room up the tower, a branch to every flat */}
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
            With MoyaOne
          </button>
        </div>
        <figcaption className="tt-caption" aria-live="polite">
          {CAPTION[state]}
        </figcaption>
      </div>
    </figure>
  );
}
