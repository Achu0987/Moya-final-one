'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';

// The delivery card: on jugs, someone keeps count, a tick for every delivery, week after week. When the card comes
// into view the ticks go in across the whole year, then a wave of water sweeps across and washes them off: with
// Moya One there is nothing to count. Each step stays under 3 seconds (CLAUDE.md). Replay runs it again.
// Reduced motion: the clean card, the final state.
const QUARTERS = ['Jan to Mar', 'Apr to Jun', 'Jul to Sep', 'Oct to Dec'];
const X0 = 176; // first week cell
const PITCH = 42;
const Y0 = 128;
const ROW = 66;
const W = 760;
const H = 420;

export default function DeliveryCard() {
  const ref = useRef(null);
  const [run, setRun] = useState(0); // 0: not started; each replay bumps it, remounting the drawing
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setRun(1);
      },
      { threshold: 0.45 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dc" aria-labelledby="dc-title">
      <div className="container dc-grid">
        <div className="dc-copy">
          <h2 id="dc-title" className="dc-title">
            Nothing left to tick.
          </h2>
          <p>
            On jugs, someone keeps count: a tick on a card for every delivery, week after week, all year.
          </p>
          <p>
            With Moya One there is no card. You see your water in litres in the app, and recharge when you need more.
          </p>
          {!still && (
            <button type="button" className="dc-replay" onClick={() => setRun((r) => r + 1)} disabled={run === 0}>
              <ArrowCounterClockwise size={20} aria-hidden="true" />
              Watch it again
            </button>
          )}
        </div>

        <figure ref={ref} className={`dc-card${still ? ' is-still' : ''}${run ? ' is-run' : ''}`}>
          <svg
            key={run}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="A water delivery card with a tick for every week of the year, washed clean by a wave of water."
          >
            <defs>
              <clipPath id="dc-clip">
                <rect width={W} height={H} rx="16" />
              </clipPath>
            </defs>
            <rect className="dc-paper" width={W} height={H} rx="16" />
            <text className="dc-head" x="40" y="64">
              Water delivery card
            </text>
            <text className="dc-small" x={W - 40} y="64" textAnchor="end">
              20-litre cans
            </text>

            {QUARTERS.map((q, r) => (
              <g key={q}>
                <text className="dc-small" x="40" y={Y0 + r * ROW + 26}>
                  {q}
                </text>
                {Array.from({ length: 13 }, (_, c) => {
                  const x = X0 + c * PITCH;
                  const y = Y0 + r * ROW;
                  const i = r * 13 + c;
                  return (
                    <g key={c}>
                      <rect className="dc-cell" x={x} y={y} width="34" height="40" rx="5" />
                      <path
                        className="dc-tick"
                        d={`M${x + 8} ${y + 21}l7 8l12-17`}
                        pathLength="1"
                        style={{ '--t': `${i * 0.032}s`, '--w': `${2.5 + ((x + 17) / (W + 260)) * 1.5}s` }}
                      />
                    </g>
                  );
                })}
              </g>
            ))}

            {/* the wave that washes the card clean */}
            <g clipPath="url(#dc-clip)">
              <path
                className="dc-wave"
                d={`M-260 0H-40q-30 35 0 70t0 70t0 70t0 70t0 70t0 70V${H}H-260z`}
              />
            </g>
          </svg>
          <figcaption className="dc-cap">Illustration.</figcaption>
        </figure>
      </div>
    </section>
  );
}
