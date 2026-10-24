'use client';

import { useEffect, useState } from 'react';

// The opening moment on the home page, every time it loads: the idea of Moya One in about two and a half seconds.
// A tower is drawn, one orange line rises from the plant room carrying a drop, every flat fills with water as
// the drop passes its floor, the mark and name arrive, then the screen drains away like water and the page is there.
// Pure CSS on the first paint, so it never waits for the page to load. A click, tap or key ends it early.
// Skipped for reduced motion.
const FLOORS = Array.from({ length: 12 }, (_, f) => f); // bottom to top
const TOP = 40;
const FLOOR_H = 22;
const GROUND = TOP + FLOOR_H * FLOORS.length; // 304
const RISER = 146;

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const end = () => setSkip(true);
    window.addEventListener('pointerdown', end, { once: true });
    window.addEventListener('keydown', end, { once: true });
    const t = setTimeout(() => setGone(true), 2750);
    return () => {
      clearTimeout(t);
      window.removeEventListener('pointerdown', end);
      window.removeEventListener('keydown', end);
    };
  }, []);

  useEffect(() => {
    if (!skip) return;
    const t = setTimeout(() => setGone(true), 400);
    return () => clearTimeout(t);
  }, [skip]);

  if (gone) return null;

  return (
    <div className={`intro${skip ? ' is-skip' : ''}`} aria-hidden="true">
      <div className="intro-inner">
        <svg className="intro-art" viewBox="0 0 220 342">
          {/* the tower, its roof and the ground */}
          <rect className="intro-tower" x="60" y={TOP} width="100" height={GROUND - TOP} rx="2" pathLength="1" />
          <path className="intro-roof" d={`M54 ${TOP}H166`} pathLength="1" />
          <path className="intro-ground" d={`M10 ${GROUND}H210`} pathLength="1" />
          {/* the plant room below ground */}
          <rect className="intro-plant" x="60" y={GROUND + 6} width="100" height="30" rx="4" pathLength="1" />
          <rect className="intro-tank" x="70" y={GROUND + 14} width="22" height="14" rx="4" />

          {/* every flat: two windows that fill with water as the drop passes its floor */}
          {FLOORS.map((f) => {
            const y = GROUND - FLOOR_H * (f + 1);
            return (
              <g key={f} className="intro-floor" style={{ '--f': f }}>
                {[70, 104].map((x) => (
                  <g key={x}>
                    <rect className="intro-win" x={x} y={y + 6} width="28" height="10" rx="2" />
                    <rect className="intro-water" x={x} y={y + 6} width="28" height="10" rx="2" />
                  </g>
                ))}
                <path d={`M${RISER} ${y + 11}H134`} />
              </g>
            );
          })}

          {/* the one line, from the tank up to the top floor, and the drop riding it */}
          <path className="intro-line" d={`M92 ${GROUND + 21}H${RISER}V${TOP + 6}`} pathLength="1" />
          <g className="intro-drop">
            <circle r="10" className="intro-drop-halo" />
            <circle r="4.5" className="intro-drop-core" />
          </g>
        </svg>

        <div className="intro-brand">
          <svg className="intro-mark" viewBox="0 0 28 32">
            <path d="M14 1.5C14 1.5 3 13.6 3 20.2a11 11 0 0 0 22 0C25 13.6 14 1.5 14 1.5z" fill="var(--base)" />
            <path d="M7.5 21q1.6-2 3.25 0t3.25 0t3.25 0t3.25 0" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="intro-name">Moya One</p>
        </div>
        <p className="intro-tag">One line. Every flat.</p>
      </div>
    </div>
  );
}
