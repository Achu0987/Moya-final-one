'use client';

import { useEffect, useRef, useState } from 'react';

// The opening moment on the home page, every time it loads: the idea of Moya One in about two seconds.
// A tower is drawn, one orange line rises from the plant room, every flat lights up as the line reaches it,
// the name arrives, then the screen drains away like water and the page is there.
// It is pure CSS on the first paint, so it never waits for the page to load. A click, tap or key ends it early.
// Skipped for reduced motion.
const FLOORS = [0, 1, 2, 3, 4, 5, 6, 7]; // bottom to top
const TOP = 44;
const FLOOR_H = 22;

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const end = () => setSkip(true);
    window.addEventListener('pointerdown', end, { once: true });
    window.addEventListener('keydown', end, { once: true });
    const t = setTimeout(() => setGone(true), 2600);
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
    <div ref={box} className={`intro${skip ? ' is-skip' : ''}`} aria-hidden="true">
      <div className="intro-inner">
        <svg className="intro-art" viewBox="0 0 200 262">
          {/* the tower */}
          <rect className="intro-tower" x="60" y={TOP} width="80" height={FLOOR_H * 8} rx="2" pathLength="1" />
          <path className="intro-ground" d="M20 220H180" pathLength="1" />
          <rect className="intro-plant" x="60" y="226" width="80" height="26" rx="4" pathLength="1" />
          {/* every flat, lit as the line reaches it */}
          {FLOORS.map((f) => {
            const y = TOP + FLOOR_H * (7 - f);
            return (
              <g key={f} className="intro-floor" style={{ '--f': f }}>
                <rect className="intro-win" x="68" y={y + 6} width="40" height="10" rx="2" />
                <rect className="intro-water" x="68" y={y + 6} width="40" height="10" rx="2" />
                <path d={`M128 ${y + 11}H110`} />
              </g>
            );
          })}
          {/* the one line, from the plant room to the top floor */}
          <path className="intro-line" d="M76 240H128V50" pathLength="1" />
        </svg>
        <p className="intro-name">Moya One</p>
        <p className="intro-line-text">One line. Every flat.</p>
      </div>
    </div>
  );
}
