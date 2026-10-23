'use client';

import { useEffect, useRef, useState } from 'react';
import KitchenScene from '../KitchenScene';
import TowerScene from '../TowerScene';

// Five steps, from the plant room to the glass. The text scrolls past one sticky 3D stage:
// steps 1 and 2 play in the tower, steps 3 to 5 in the kitchen (DESIGN.md: one pinned sequence per screen).
const STEPS = [
  {
    title: 'It starts in the basement.',
    // PLACEHOLDER: "its own plant room" follows CLIENT_CONTEXT.md (control room in the basement); add to the Claims tab as OK.
    text: 'Every tower with Moya One has its own plant room below ground. That is where your water line begins.',
  },
  {
    title: 'One line runs up to your flat.',
    text: 'A dedicated line is laid up through the tower while it is being built, with a branch to every flat. Nothing is opened up after you move in.',
  },
  {
    title: 'Your kitchen gets a Moya1™ control unit.',
    // PLACEHOLDER: "nothing for you to service" follows CLIENT_CONTEXT.md (no servicing for residents); add to the Claims tab as OK.
    text: 'It sits on the wall beside an extra tap. There is one in every kitchen, and nothing for you to service.',
  },
  {
    title: 'You recharge litres from your phone.',
    text: 'In the Moya One app, choose a pack of litres and recharge, the way you top up a mobile plan.',
    note: 'The phone on screen shows sample data.',
  },
  {
    title: 'Then you pour a glass.',
    text: 'Drinking water comes from its own tap. Your usual tap stays as it is, for everything else.',
  },
];

// `intro` (the page title and lede) sits beside the stage on the first screen.
export default function Journey({ intro }) {
  const list = useRef(null);
  const [active, setActive] = useState(0);

  // the step whose text crosses the reading line drives the stage
  useEffect(() => {
    const items = [...list.current.querySelectorAll('[data-step]')];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.step))),
      { rootMargin: '-58% 0px -38% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const inKitchen = active >= 2;

  return (
    <section className="journey">
      <div className="container journey-grid">
        <div className="journey-intro">{intro}</div>
        <figure className="journey-stage">
          <div className={`journey-layer${inKitchen ? '' : ' is-on'}`} aria-hidden={inKitchen}>
            <TowerScene stage={Math.min(active, 1)} />
          </div>
          <div className={`journey-layer${inKitchen ? ' is-on' : ''}`} aria-hidden={!inKitchen}>
            <KitchenScene stage={Math.max(1, active - 1)} />
          </div>
          <figcaption>
            <span>
              Step {active + 1} of {STEPS.length}
            </span>
            3D illustration, not a real project.
          </figcaption>
        </figure>

        <ol className="journey-steps" ref={list} aria-label="The five steps, from the building to your glass">
          {STEPS.map((s, i) => (
            <li key={s.title} data-step={i} className={i === active ? 'is-active' : undefined}>
              <span className="journey-num" aria-hidden="true">
                {i + 1}
              </span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              {s.note && <p className="journey-note">{s.note}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
