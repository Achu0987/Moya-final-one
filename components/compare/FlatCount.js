'use client';

import { useState } from 'react';
import useCount from '@/components/common/useCount';

// For builders: one RO unit per kitchen means one unit to buy, fit and service per flat. The visitor sets the
// number of flats and sees a unit drawn for every one, then switches to Moya One: one system for the tower, the
// units gone from the flats. Simple counting on the visitor's own number, labelled Illustrative.
const fmt = (n) => n.toLocaleString('en-IN');
const MAX = 400;
const COLS = 25;
const P = 18; // pitch of one unit
const ROWS = Math.ceil(MAX / COLS);

export default function FlatCount() {
  const [flats, setFlats] = useState(120);
  const [moya, setMoya] = useState(false);
  const shown = useCount(moya ? 0 : flats);

  return (
    <div className={`fc${moya ? ' is-moya' : ''}`}>
      <div className="fc-copy">
        <label htmlFor="fc-flats" className="ly-label">
          Flats in the tower <output htmlFor="fc-flats">{flats}</output>
        </label>
        <input id="fc-flats" type="range" min="20" max={MAX} step="10" value={flats} onChange={(e) => setFlats(+e.target.value)} />
        <p className="fc-total" aria-live="polite">
          <strong>{fmt(shown)}</strong>
          <span>{moya ? 'filter units in the flats. One system serves the tower.' : 'filter units to buy, fit and service, one in every kitchen.'}</span>
        </p>
        <div className="ks-switch" role="group" aria-label="Show the tower with">
          <button type="button" aria-pressed={!moya} onClick={() => setMoya(false)}>
            RO filters
          </button>
          <button type="button" aria-pressed={moya} onClick={() => setMoya(true)}>
            Moya One
          </button>
        </div>
        <p className="ly-key">
          <span className="sample">Illustrative</span>
          One square for each flat&rsquo;s unit.
        </p>
      </div>
      <figure className="fc-art">
        <svg viewBox={`0 0 ${COLS * P} ${ROWS * P + 20}`} role="img" aria-label={moya ? 'No filter units in the flats; one line serves the tower.' : `${flats} filter units, one for each flat.`}>
          {Array.from({ length: MAX }, (_, i) => (
            <rect
              key={i}
              className={`fc-unit${i < flats ? ' is-on' : ''}`}
              x={(i % COLS) * P + 2}
              y={Math.floor(i / COLS) * P + 2}
              width={P - 4}
              height={P - 4}
              rx="3"
              style={{ '--d': `${(i % COLS) * 0.012 + Math.floor(i / COLS) * 0.02}s` }}
            />
          ))}
          <path className="fc-line" d={`M4 ${ROWS * P + 12}H${COLS * P - 4}`} pathLength="1" />
        </svg>
      </figure>
    </div>
  );
}
