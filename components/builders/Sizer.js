'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { CONTACT_EMAIL } from '@/lib/content';

// Size it to your tower: set the floors and flats per floor, and the tower section redraws with one line
// branching to every flat. The counts are simple arithmetic on what the builder types; nothing is a quote,
// a price or a claim, and the whole panel is labelled Illustrative (CLAUDE.md non-negotiables 1 and 5).
// The enquiry below carries the same tower into a pre-written email.
const STAGES = ['Design', 'Structure', 'Services', 'Finishing'];
const fmt = (n) => n.toLocaleString('en-IN');

// a count that runs up or down to its new value instead of jumping (reduced motion: it jumps)
function useCount(to) {
  const [shown, setShown] = useState(to);
  const from = useRef(to);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(to);
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 500);
      const v = Math.round(start + (to - start) * (1 - Math.pow(1 - p, 3)));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return shown;
}

function Tower({ floors, perFloor }) {
  const top = 30;
  const ground = 380;
  const fh = (ground - top) / floors;
  const left = 92;
  const inner = 136; // width the windows share
  const gap = perFloor > 8 ? 2 : 4;
  const ww = (inner - gap * (perFloor - 1)) / perFloor;
  const wh = Math.max(1.5, Math.min(12, fh - (fh > 8 ? 6 : 2)));
  const riser = 244;
  return (
    <svg className="bx-tower" viewBox="0 0 320 424" role="img" aria-label={`A tower of ${floors} floors with ${perFloor} flats on each, one line branching to every flat.`}>
      <rect className="bx-tower-body" x="84" y={top} width="172" height={ground - top} rx="2" />
      <rect className="bx-tower-roof" x="78" y={top - 5} width="184" height="6" rx="2" />
      {Array.from({ length: floors }, (_, f) => {
        const y = top + fh * f;
        return (
          <g key={f} className="bx-tower-floor" style={{ '--f': floors - 1 - f, '--n': floors }}>
            {Array.from({ length: perFloor }, (_, k) => (
              <rect key={k} className="bx-tower-flat" x={left + k * (ww + gap)} y={y + (fh - wh) / 2} width={ww} height={wh} rx={Math.min(2, wh / 3)} />
            ))}
            <path className="bx-tower-branch" d={`M${riser} ${y + fh / 2}H${left + inner + 2}`} />
          </g>
        );
      })}
      <path className="bx-tower-ground" d={`M20 ${ground}H300`} />
      <rect className="bx-tower-plant" x="84" y={ground + 8} width="172" height="32" rx="4" />
      <rect className="bx-tower-tank" x="100" y={ground + 16} width="26" height="16" rx="4" />
      <path className="bx-tower-line" d={`M126 ${ground + 24}H${riser}V${top + 4}`} pathLength="1" />
    </svg>
  );
}

export default function Sizer() {
  const [floors, setFloors] = useState(24);
  const [perFloor, setPerFloor] = useState(4);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [stage, setStage] = useState(STAGES[0]);
  const flats = floors * perFloor;
  const shown = useCount(flats);

  const body = [
    'Hello Moya One,',
    '',
    `Project: ${name || '(project name)'}`,
    `City: ${city || '(city)'}`,
    `Construction stage: ${stage}`,
    `Floors: ${floors}`,
    `Flats per floor: ${perFloor}`,
    `Flats in total: ${flats}`,
    '',
    'Please get in touch about planning Moya One into this tower.',
  ].join('\n');
  // PLACEHOLDER: the enquiry goes to the placeholder address in lib/content.js until the client's address exists.
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Moya One for ${name || 'our project'}`)}&body=${encodeURIComponent(body)}`;

  return (
    <>
      <section id="size" className="bx-size" aria-labelledby="bx-size-title">
        <div className="container bx-size-grid">
          <div className="bx-size-copy">
            <h2 id="bx-size-title">Size it to your tower.</h2>
            <p className="bx-size-lede">Set your floors and flats. One line still reaches every one of them.</p>

            <div className="bx-range">
              <label htmlFor="bx-floors">
                Floors <output htmlFor="bx-floors">{floors}</output>
              </label>
              <input id="bx-floors" type="range" min="4" max="60" value={floors} onChange={(e) => setFloors(+e.target.value)} />
            </div>
            <div className="bx-range">
              <label htmlFor="bx-per">
                Flats per floor <output htmlFor="bx-per">{perFloor}</output>
              </label>
              <input id="bx-per" type="range" min="1" max="12" value={perFloor} onChange={(e) => setPerFloor(+e.target.value)} />
            </div>

            <dl className="bx-count" aria-live="polite">
              <div className="is-lead">
                <dt>Flats on one line</dt>
                <dd>{fmt(shown)}</dd>
              </div>
              <div>
                <dt>Moya1™ control units</dt>
                <dd>{fmt(shown)}</dd>
              </div>
              <div>
                <dt>Extra taps</dt>
                <dd>{fmt(shown)}</dd>
              </div>
            </dl>
            <span className="sample">Illustrative</span>
          </div>
          <figure className="bx-size-visual" data-in>
            <Tower floors={floors} perFloor={perFloor} />
          </figure>
        </div>
      </section>

      <section id="enquire" className="bx-enquire" aria-labelledby="bx-enquire-title">
        <div className="container bx-enquire-grid">
          <div>
            <h2 id="bx-enquire-title" className="bx-enquire-title">
              Your next tower.
            </h2>
            <p className="bx-enquire-lede">
              Your tower of {floors} floors and {fmt(flats)} flats goes into the email for you. Add a name, a city and
              where the build is.
            </p>
            <figure className="bx-enquire-photo" data-in>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/builders/city.webp" alt="Residential towers and cranes over Byculla, Mumbai." loading="lazy" />
              <figcaption>Byculla, Mumbai.</figcaption>
            </figure>
          </div>
          <form
            className="bx-form"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
          >
            <label>
              Project name
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" />
            </label>
            <label>
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
            </label>
            <label>
              Construction stage
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary">
              Send the enquiry
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <p className="bx-form-note">This opens your email app with the details filled in.</p>
          </form>
        </div>
        <p className="container bx-credits">
          Photographs on Unsplash: James Sullivan, EJ Yao, Filip Baotić and Zoshua Colah.
        </p>
      </section>
    </>
  );
}
