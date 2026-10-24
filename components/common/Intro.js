'use client';

import { useEffect, useState } from 'react';

// The opening moment on the home page, every time it loads: the idea of Moya One in about three seconds.
// A residential tower rises from the ground; one orange line climbs from the plant room carrying a drop; every flat
// fills with water as the drop passes its floor; the mark and name arrive and hold; then the screen drains away
// like water and the page is there. Pure CSS on the first paint, so it never waits for the page to load.
// A click, tap or key ends it early. Skipped for reduced motion.
const FLOORS = Array.from({ length: 11 }, (_, f) => f); // bottom to top
const ROOF = 44; // top of the tower body
const FLOOR_H = 21;
const LOBBY = ROOF + FLOOR_H * FLOORS.length; // 275, top of the lobby
const GROUND = 300;
const RISER = 168;
const BAYS = [70, 100, 130];

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const end = () => setSkip(true);
    window.addEventListener('pointerdown', end, { once: true });
    window.addEventListener('keydown', end, { once: true });
    const t = setTimeout(() => setGone(true), 3300);
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
        <svg className="intro-art" viewBox="0 0 240 342">
          {/* neighbours, faint, behind */}
          <g className="intro-city">
            <rect x="8" y="128" width="44" height={GROUND - 128} rx="2" />
            <rect x="194" y="158" width="40" height={GROUND - 158} rx="2" />
            {[146, 170, 194, 218, 242, 266].map((y) => (
              <g key={y}>
                <rect className="intro-city-win" x="16" y={y} width="10" height="7" rx="1" />
                <rect className="intro-city-win" x="32" y={y} width="10" height="7" rx="1" />
                {y > 170 && <rect className="intro-city-win" x="202" y={y} width="9" height="7" rx="1" />}
                {y > 170 && <rect className="intro-city-win" x="216" y={y} width="9" height="7" rx="1" />}
              </g>
            ))}
          </g>

          {/* the tower, rising from the ground */}
          <g className="intro-build">
            {/* roof: lift room, rooftop tank, parapet */}
            <rect className="intro-body" x="128" y={ROOF - 14} width="34" height="14" rx="2" />
            <rect className="intro-roof-tank" x="76" y={ROOF - 16} width="30" height="16" rx="4" />
            <rect className="intro-parapet" x="54" y={ROOF - 4} width="132" height="5" rx="1.5" />
            {/* body */}
            <rect className="intro-body" x="58" y={ROOF} width="124" height={GROUND - ROOF} rx="1" />
            {/* every flat: three windows with frames, a balcony slab under them */}
            {FLOORS.map((f) => {
              const y = LOBBY - FLOOR_H * (f + 1);
              return (
                <g key={f} className="intro-floor" style={{ '--f': f }}>
                  {BAYS.map((x) => (
                    <g key={x}>
                      <rect className="intro-win" x={x} y={y + 4} width="26" height="12" rx="1.5" />
                      <rect className="intro-water" x={x} y={y + 4} width="26" height="12" rx="1.5" />
                      <path className="intro-mullion" d={`M${x + 13} ${y + 4}v12`} />
                    </g>
                  ))}
                  <path className="intro-slab" d={`M54 ${y + FLOOR_H}H186`} />
                  <path className="intro-branch" d={`M${RISER} ${y + 10}H156`} />
                </g>
              );
            })}
            {/* lobby: lit glass and the entrance */}
            <rect className="intro-lobby" x="64" y={LOBBY + 4} width="112" height={GROUND - LOBBY - 4} rx="1" />
            <rect className="intro-door" x="108" y={LOBBY + 9} width="24" height={GROUND - LOBBY - 9} rx="1" />
          </g>

          {/* ground and the plant room below it */}
          <path className="intro-ground" d={`M0 ${GROUND}H240`} />
          <rect className="intro-plant" x="58" y={GROUND + 6} width="124" height="30" rx="4" />
          <rect className="intro-tank" x="70" y={GROUND + 13} width="22" height="16" rx="4" />

          {/* the one line, from the tank up to the top floor, and the drop riding it */}
          <path className="intro-line" d={`M92 ${GROUND + 21}H${RISER}V${ROOF + 10}`} pathLength="1" />
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
