'use client';

import { useEffect, useState } from 'react';

// The opening moment on the home page, every time it loads: "the first drop".
// One drop falls through the dark and lands; ripples open; the name rises out of them; then the water rises,
// filling the name as it passes, until the screen is water and dissolves into the hero (the same pale water).
// Pure CSS from the first paint, so it never waits for the page. Any click, tap or key ends it early.
// Skipped for reduced motion.
const WAVE = 'M0 18 Q 60 0 120 18 T 240 18 T 360 18 T 480 18 T 600 18 T 720 18 T 840 18 T 960 18 V 60 H 0 Z';

function Word({ className }) {
  return (
    <div className={`intro-word ${className}`}>
      <p className="intro-name">Moya One</p>
      <p className="intro-tag">Drinking water, on tap in every flat.</p>
    </div>
  );
}

export default function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const end = () => setSkip(true);
    window.addEventListener('pointerdown', end, { once: true });
    window.addEventListener('keydown', end, { once: true });
    const t = setTimeout(() => setGone(true), 2900);
    return () => {
      clearTimeout(t);
      window.removeEventListener('pointerdown', end);
      window.removeEventListener('keydown', end);
    };
  }, []);

  useEffect(() => {
    if (!skip) return;
    const t = setTimeout(() => setGone(true), 350);
    return () => clearTimeout(t);
  }, [skip]);

  if (gone) return null;

  return (
    <div className={`intro${skip ? ' is-skip' : ''}`} aria-hidden="true">
      {/* the drop, falling */}
      <svg className="intro-drop" viewBox="0 0 40 56">
        <path d="M20 2C20 2 4 22 4 36a16 16 0 0 0 32 0C36 22 20 2 20 2z" fill="var(--water)" />
        <path d="M12 34a9 9 0 0 0 5 9" fill="none" stroke="var(--base)" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      </svg>

      {/* where it lands */}
      <span className="intro-ripple" />
      <span className="intro-ripple" />
      <span className="intro-ripple" />

      {/* the name, light on the dark */}
      <Word className="is-dry" />

      {/* the water rising; inside it the same name in ink, so the letters fill as the level passes */}
      <div className="intro-water">
        <svg className="intro-wave" viewBox="0 0 960 60" preserveAspectRatio="none">
          <path d={WAVE} fill="var(--water)" />
        </svg>
        <div className="intro-still">
          <Word className="is-wet" />
        </div>
      </div>
    </div>
  );
}
