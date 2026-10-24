'use client';

import { useEffect, useRef, useState } from 'react';
import { Drop } from '@phosphor-icons/react/dist/ssr';
import Words from '../common/Words';
import { SAMPLE_BALANCE_L, SAMPLE_PACKS_L } from '@/lib/content';

// Try it yourself: recharge litres on the phone, then press and hold the tap to pour a glass.
// The balance goes down as you pour. Every number is sample data (CLAUDE.md non-negotiable 5); litres only.
const GLASS_L = 0.25; // SAMPLE: one glass
const POUR_S = 1.6; // seconds to fill a glass (DESIGN.md: 1.2 to 2.4s for pours)
const fmt = (n, d = 0) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function TryIt() {
  const [pack, setPack] = useState(SAMPLE_PACKS_L[1]);
  const [balance, setBalance] = useState(SAMPLE_BALANCE_L);
  const [fill, setFill] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [glasses, setGlasses] = useState(0);
  const [recharged, setRecharged] = useState(false);
  const raf = useRef(0);
  const reduce = useRef(false);
  const holding = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // the recharge counts up to the new balance
  const recharge = () => {
    const from = balance;
    const to = balance + pack;
    setRecharged(true);
    if (reduce.current) return setBalance(to);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1200);
      setBalance(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  };

  // pouring: while the tap is held the glass fills and the balance goes down; a full glass is counted and emptied
  const startPour = () => {
    if (holding.current) return;
    holding.current = true;
    setPouring(true);
    if (reduce.current) {
      finishGlass();
      return;
    }
    let last = performance.now();
    const step = (now) => {
      if (!holding.current) return;
      const dt = (now - last) / 1000;
      last = now;
      let full = false;
      setFill((f) => {
        const next = Math.min(1, f + dt / POUR_S);
        if (next >= 1) full = true;
        return next;
      });
      setBalance((b) => Math.max(0, b - (GLASS_L * dt) / POUR_S));
      if (full) return finishGlass();
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  const stopPour = () => {
    holding.current = false;
    setPouring(false);
    cancelAnimationFrame(raf.current);
  };
  const finishGlass = () => {
    holding.current = false;
    setPouring(false);
    setFill(1);
    if (reduce.current) setBalance((b) => Math.max(0, b - GLASS_L));
    setGlasses((g) => g + 1);
    setTimeout(() => setFill(0), reduce.current ? 900 : 1100);
  };
  const onKey = (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (e.type === 'keydown' && !e.repeat) startPour();
    if (e.type === 'keyup') stopPour();
  };

  // glass geometry in the drawing: water rises from the base to the brim
  const waterTop = 352 - 118 * fill;

  return (
    <section className="try" aria-labelledby="try-title">
      <div className="container">
        <div className="try-head">
          <h2 id="try-title" data-reveal="words">
            <Words>Try it: recharge, then pour.</Words>
          </h2>
          <p data-reveal="fade">
            Top up litres on the phone, then press and hold the tap. Your balance goes down as you pour. Everything
            here is sample data.
          </p>
        </div>

        <div className="try-stage">
          {/* the phone: balance and recharge */}
          <div className="phone try-phone" data-ui>
            <div className="phone-screen">
              <div className="phone-top">
                <span className="phone-brand">Moya One</span>
                <span className="sample">Sample data</span>
              </div>
              <p className="phone-hello">Your water</p>
              <div className="phone-card">
                <p className="phone-label">Available balance</p>
                <p className="phone-balance" aria-live="polite">
                  {fmt(balance, 2)} <span>litres</span>
                </p>
                <p className="try-glasses">
                  Glasses poured here: <strong>{glasses}</strong>
                </p>
              </div>
              <fieldset className="phone-packs">
                <legend>Choose a pack</legend>
                <div className="phone-packs-row">
                  {SAMPLE_PACKS_L.map((l) => (
                    <label key={l} className="pack">
                      <input type="radio" name="try-pack" value={l} checked={pack === l} onChange={() => setPack(l)} />
                      <span>{fmt(l)} L</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="button" className="btn btn-primary phone-btn" onClick={recharge}>
                Recharge {fmt(pack)} litres
              </button>
              {recharged && <p className="try-done">Recharged. Now pour a glass.</p>}
            </div>
          </div>

          {/* the tap and the glass */}
          <div className="try-tap">
            <svg viewBox="0 0 360 420" role="img" aria-label={`The Moya One tap above a glass, ${Math.round(fill * 100)}% full.`}>
              <defs>
                <clipPath id="try-glass">
                  <path d="M92 230h96l-10 124a8 8 0 0 1-8 7h-60a8 8 0 0 1-8-7z" />
                </clipPath>
              </defs>
              {/* worktop */}
              <rect x="20" y="362" width="320" height="22" rx="4" fill="var(--grey)" />
              <rect x="20" y="384" width="320" height="10" rx="2" fill="var(--line)" />
              {/* the Moya One tap: matte ink column, orange ring, gooseneck */}
              <rect x="252" y="352" width="40" height="10" rx="3" fill="var(--ink)" />
              <rect x="252" y="346" width="40" height="6" rx="3" fill="var(--orange)" />
              <rect x="262" y="160" width="20" height="188" rx="10" fill="var(--ink)" />
              <path d="M272 168c0-78-48-104-96-104s-36 68-36 98" fill="none" stroke="var(--ink)" strokeWidth="16" strokeLinecap="round" />
              <rect x="128" y="156" width="24" height="12" rx="4" fill="var(--ink)" />
              {/* the stream, while pouring */}
              <rect
                className={`try-stream${pouring ? ' is-on' : ''}`}
                x="135"
                y="168"
                width="10"
                height={Math.max(0, waterTop - 168)}
                rx="5"
                fill="var(--water)"
              />
              {/* the glass and its water */}
              <g clipPath="url(#try-glass)">
                <rect x="80" y={waterTop} width="120" height="140" fill="var(--water)" />
              </g>
              <path d="M92 230h96l-10 124a8 8 0 0 1-8 7h-60a8 8 0 0 1-8-7z" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
              <path d="M104 244v96" stroke="var(--base)" strokeWidth="4" strokeLinecap="round" opacity=".7" />
            </svg>

            <button
              type="button"
              className="try-pour"
              aria-pressed={pouring}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture?.(e.pointerId);
                startPour();
              }}
              onPointerUp={stopPour}
              onPointerCancel={stopPour}
              onKeyDown={onKey}
              onKeyUp={onKey}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Drop size={22} aria-hidden="true" />
              {pouring ? 'Pouring…' : 'Press and hold to pour'}
            </button>
            <p className="try-note">One glass here is {fmt(GLASS_L, 2)} litres. Sample data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
