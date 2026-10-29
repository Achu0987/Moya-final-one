'use client';

import { useEffect, useRef, useState } from 'react';
import { JugShape } from '@/components/Jug';

// The weekly jug routine drawn as what it is: a loop. A jug travels round six stops while the matching step lights
// up in the list beside it; it starts when the loop comes into view and pauses when it leaves. The loop repeats
// because the routine does. Reduced motion: no travel, every step shown evenly.
const STEPS = [
  'Order more before you run out.',
  'Wait in for the delivery.',
  'Carry each jug to the kitchen.',
  'Lift it onto the dispenser.',
  'Stack the empties by the door.',
  'Hand them back, and start again.',
];
const C = 180;
const R = 128;
const at = (i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)];
};

export default function Routine() {
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    let id = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        clearInterval(id);
        if (e.isIntersecting) id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1700);
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, []);

  return (
    <div ref={ref} className={`rt${still ? ' is-still' : ''}`}>
      <svg className="rt-ring" viewBox="0 0 360 360" role="img" aria-label="The jug routine as a loop of six steps that starts again every week.">
        <defs>
          <symbol id="rt-jug" viewBox="24 30 112 176">
            <JugShape id="rt-jug-shape" />
          </symbol>
        </defs>
        <circle className="rt-loop" cx={C} cy={C} r={R} />
        {STEPS.map((_, i) => {
          const [x, y] = at(i);
          return <circle key={i} className={`rt-stop${i === active ? ' is-on' : ''}`} cx={x} cy={y} r="9" />;
        })}
        <text className="rt-centre" x={C} y={C - 4} textAnchor="middle">
          Every
        </text>
        <text className="rt-centre" x={C} y={C + 30} textAnchor="middle">
          week
        </text>
        <g className="rt-mover" style={{ transform: `rotate(${active * 60}deg)` }}>
          <g className="rt-jug" style={{ transform: `rotate(${-active * 60}deg)` }}>
            <use href="#rt-jug" x={C - 17} y={C - R - 27} width="34" height="54" />
          </g>
        </g>
      </svg>
      <ol className="rt-list">
        {STEPS.map((s, i) => (
          <li key={s} className={i === active ? 'is-on' : undefined}>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
