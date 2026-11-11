'use client';

import { useEffect, useState } from 'react';

// How much plastic the world throws away, told over the forest film (client brief: the film "shows how much plastic is
// used every year"). The yearly figure is Our World in Data's, citing the OECD Global Plastics Outlook (2022): "The
// world produces around 350 million tonnes of plastic waste each year." The live count is that rate, nothing more:
// 350 million tonnes over a year's seconds is about 11 tonnes a second, counted from the moment the page opened.
// PLACEHOLDER: Rayansh to add this figure and its source to the Claims tab (CLAUDE.md non-negotiable 3).
// Reduced motion: no ticking number; the rate is stated in words instead.
const PER_YEAR = 350e6; // tonnes
const PER_SECOND = PER_YEAR / (365.25 * 24 * 60 * 60); // about 11.1

export default function PlasticClock() {
  const [tonnes, setTonnes] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    const start = performance.now();
    const id = setInterval(() => setTonnes(((performance.now() - start) / 1000) * PER_SECOND), 120);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="ev-clock" aria-label="Plastic waste around the world">
      <div className="container ev-clock-grid">
        <div className="ev-clock-year">
          <p className="ev-clock-big">350 million tonnes</p>
          <p className="ev-clock-text">of plastic waste is thrown away around the world, every year.</p>
          <p className="ev-clock-src">
            Source: OECD, Global Plastics Outlook (2022), via{' '}
            <a href="https://ourworldindata.org/plastic-pollution">Our World in Data</a>.
          </p>
        </div>
        <div className="ev-clock-panel">
          {still ? (
            <p className="ev-clock-live">
              <span className="ev-clock-big ev-clock-num">11 tonnes</span>
              <span className="ev-clock-unit">thrown away every second, around the world</span>
            </p>
          ) : (
            <p className="ev-clock-live">
              <span className="ev-clock-big ev-clock-num">{Math.floor(tonnes).toLocaleString('en-IN')}</span>
              <span className="ev-clock-unit">tonnes thrown away since you opened this page</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
