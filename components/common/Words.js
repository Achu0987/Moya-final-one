import { Fragment } from 'react';

// Splits a heading into words so the motion layer can reveal it word by word (DESIGN.md section 7).
// Words render in place; without script they are simply the heading. Spaces sit between the
// word boxes, never inside them, so they never collapse.
export default function Words({ children }) {
  const parts = String(children).split(' ');
  return parts.map((word, i) => (
    <Fragment key={i}>
      <span className="w">
        <span>{word}</span>
      </span>
      {i < parts.length - 1 ? ' ' : null}
    </Fragment>
  ));
}
