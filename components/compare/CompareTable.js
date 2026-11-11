'use client';

import { useState } from 'react';
import { OPTIONS, PHOTO_CREDITS, ROWS } from '@/lib/compare';

// The comparison as a real table. On a desktop all the options sit side by side with MoyaOne tinted (DESIGN.md
// section 8). On a phone the table shows MoyaOne against one other option, chosen with the switch above it, so
// it never scrolls sideways at 390px (PAGE_BRIEFS.md #6). `only` limits the columns (the bottled water page shows
// jugs against MoyaOne); `rows` limits the questions.
function Cell({ row, id }) {
  return (
    <>
      {row[id]}
      {row[`${id}Pending`] && <span className="ct-pending">Being confirmed</span>}
    </>
  );
}

export default function CompareTable({ only, rows, caption }) {
  const cols = OPTIONS.filter((o) => !only || only.includes(o.id));
  const others = cols.filter((o) => o.id !== 'moya');
  const [other, setOther] = useState(others[0].id);
  const list = ROWS.filter((r) => !rows || rows.includes(r.id));

  return (
    <div className={`cmp cols-${cols.length}`} data-other={other}>
      {others.length > 1 && (
        <div className="cmp-pick" role="group" aria-label="Compare MoyaOne with">
          <span>Compare with</span>
          {others.map((o) => (
            <button key={o.id} type="button" aria-pressed={other === o.id} onClick={() => setOther(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      )}
      <table className="cmp-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="cmp-q">
              <span className="sr-only">Question</span>
            </th>
            {cols.map((o) => (
              <th key={o.id} scope="col" className={`cmp-col is-${o.id}`}>
                <span className="cmp-pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.img} alt={o.alt} width="600" height="600" loading="lazy" decoding="async" />
                </span>
                {o.long}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="cmp-q">
                {row.q}
              </th>
              {cols.map((o) => (
                <td key={o.id} className={`cmp-col is-${o.id}`}>
                  <Cell row={row} id={o.id} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cmp-credit">
        Photographs:{' '}
        {PHOTO_CREDITS.filter((c) => cols.some((o) => o.id === c.id)).map((c, i) => (
          <span key={c.url}>
            {i > 0 && '; '}“{c.title}” by {c.by}, <a href={c.url}>{c.lic}</a>
            {c.note}
          </span>
        ))}
        , via Wikimedia Commons.
      </p>
    </div>
  );
}
