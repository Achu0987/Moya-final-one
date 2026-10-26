'use client';

import { useState } from 'react';
import { ArrowRight, CaretDown } from '@phosphor-icons/react/dist/ssr';
import Words from './common/Words';
import TowerScene from './TowerScene';

// Every line restates CLAUDE.md "What the project is" and CLIENT_CONTEXT.md.
// PLACEHOLDER: "No retrofit" and "No lost space" are brief points, not yet Claims-tab entries. Add them there as OK before launch.
const POINTS = [
  ['Installed during construction', 'The line goes in while the tower is being built, through you, the builder.'],
  ['No retrofit', 'Nothing has to be opened up after residents move in.'],
  ['No lost space', 'No jug corner and no filter box in the flats you sell.'],
  ['A dedicated line to every flat', 'One water line runs up the tower and reaches each kitchen.'],
];

export default function Builders() {
  const [open, setOpen] = useState(0);

  return (
    <section className="builders" id="builders" aria-labelledby="builders-title">
      <div className="container builders-grid">
        <div className="builders-copy">
          <h2 id="builders-title" data-reveal="words">
            <Words>Built in, not added on.</Words>
          </h2>
          <p className="builders-lede" data-reveal="fade">
            For builders and developers: Moya One goes into your project during construction, so every flat has
            drinking water on tap from its own line.
          </p>

          <ul className="points" data-reveal="fade">
            {POINTS.map(([name, text], i) => {
              const isOpen = open === i;
              return (
                <li key={name}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`point-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{name}</span>
                    <CaretDown size={20} aria-hidden="true" />
                  </button>
                  <p id={`point-${i}`} hidden={!isOpen}>
                    {text}
                  </p>
                </li>
              );
            })}
          </ul>

          <a href="/contact?as=builder" className="btn btn-primary" data-reveal="fade">
            Talk to us about a project
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>

        <figure className="builders-visual" data-reveal="fade">
          <TowerScene />
          <figcaption>One line, from the basement plant room to every kitchen. 3D illustration, not a real project. Drag to turn.</figcaption>
        </figure>
      </div>
    </section>
  );
}
