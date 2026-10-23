'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import Words from './common/Words';
import { SAMPLE_BALANCE_L, SAMPLE_PACKS_L } from '@/lib/content';

const fmt = (n) => n.toLocaleString('en-IN');
const MAX = SAMPLE_BALANCE_L + Math.max(...SAMPLE_PACKS_L);

// Counts a number to its new value. Jumps straight there with reduced motion.
function useCount(target) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target;
      setValue(target);
      return;
    }
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1400);
      const v = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
      setValue(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

// The live thing: a sample recharge in an illustrative app screen. Litres only, no prices.
export default function AppDemo() {
  const [pack, setPack] = useState(SAMPLE_PACKS_L[1]);
  const [balance, setBalance] = useState(SAMPLE_BALANCE_L);
  const shown = useCount(balance);
  const done = balance !== SAMPLE_BALANCE_L;

  return (
    <section className="app" id="water" aria-labelledby="app-title">
      <div className="container">
        <div className="app-panel">
          <div className="app-copy">
            <h2 id="app-title" data-reveal="words">
              <Words>Know your balance. Top up in litres.</Words>
            </h2>
            <p className="app-lede" data-reveal="fade">
              The Moya One app shows how many litres you have left. When you need more, choose a pack and recharge.
              Try it on the screen.
            </p>
            <p className="app-note" data-reveal="fade">
              Illustrative app concept. Sample data; screens and packs are not final.
            </p>
          </div>

          <div className="phone" data-ui data-reveal="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <span className="phone-brand">Moya One</span>
                <span className="sample">Sample data</span>
              </div>
              <p className="phone-hello">Your water</p>

              <div className="phone-card">
                <p className="phone-label">Available balance</p>
                <p className="phone-balance" aria-live="polite">
                  {fmt(shown)} <span>litres</span>
                </p>
                <div className="phone-tank" aria-hidden="true">
                  <div className="phone-tank-fill" style={{ transform: `scaleX(${balance / MAX})` }} />
                </div>
              </div>

              <fieldset className="phone-packs" disabled={done}>
                <legend>Choose a pack</legend>
                <div className="phone-packs-row">
                  {SAMPLE_PACKS_L.map((l) => (
                    <label key={l} className="pack">
                      <input type="radio" name="pack" value={l} checked={pack === l} onChange={() => setPack(l)} />
                      <span>{fmt(l)} L</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {done ? (
                <button type="button" className="btn btn-secondary phone-btn" onClick={() => setBalance(SAMPLE_BALANCE_L)}>
                  <ArrowCounterClockwise size={20} aria-hidden="true" />
                  Reset the demo
                </button>
              ) : (
                <button type="button" className="btn btn-primary phone-btn" onClick={() => setBalance(SAMPLE_BALANCE_L + pack)}>
                  Recharge {fmt(pack)} litres
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
