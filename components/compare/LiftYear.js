'use client';

import { useState } from 'react';
import useCount from '@/components/common/useCount';

// A year of lifting: the visitor sets how many jugs their home uses in a week, and the page multiplies it out.
// Twenty litres of water weighs about twenty kilos, so the only arithmetic is jugs x 52 weeks x 20 kg; the jug
// itself and the empties going back out are not counted. Labelled Illustrative (CLAUDE.md non-negotiable 5).
// Each block is one tonne; the last one fills to the remainder.
const fmt = (n) => n.toLocaleString('en-IN');

export default function LiftYear() {
  const [perWeek, setPerWeek] = useState(3);
  const kg = perWeek * 52 * 20;
  const shown = useCount(kg);
  const tonnes = kg / 1000;
  const blocks = Math.ceil(tonnes);

  return (
    <div className="ly">
      <div className="ly-controls">
        <label htmlFor="ly-week" className="ly-label">
          Jugs your home uses in a week <output htmlFor="ly-week">{perWeek}</output>
        </label>
        <input id="ly-week" type="range" min="1" max="7" value={perWeek} onChange={(e) => setPerWeek(+e.target.value)} />
      </div>

      <p className="ly-total" aria-live="polite">
        <strong>{fmt(shown)} kg</strong>
        <span>of water lifted into your home in a year, before a single empty goes back out.</span>
      </p>

      <div className="ly-blocks" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, tonnes - i));
          return (
            <span key={i} className={`ly-block${i < blocks ? ' is-on' : ''}`} style={{ '--fill': fill }}>
              <span className="ly-water" />
            </span>
          );
        })}
      </div>
      <p className="ly-key">
        <span className="sample">Illustrative</span>
        Each block is one tonne. Twenty litres of water weighs about twenty kilos.
      </p>
    </div>
  );
}
