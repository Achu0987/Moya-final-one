'use client';

import { useEffect, useState } from 'react';
import { Buildings, DeviceMobile, Drop } from '@phosphor-icons/react/dist/ssr';

const FACTS = [
  { Icon: Drop, title: 'Its own tap', text: 'Drinking water in your kitchen' },
  { Icon: Buildings, title: 'Built into the tower', text: 'Piped to every flat during construction' },
  { Icon: DeviceMobile, title: 'Recharge from your phone', text: 'Litres, like a mobile plan' },
];

// The three facts light up in turn: the active icon fills with water and its text comes forward.
// Hover or focus picks one; reduced motion shows all three evenly and never cycles.
export default function Facts() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    if (paused) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % FACTS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <ul className={`facts${still ? ' is-still' : ''}`} onMouseLeave={() => setPaused(false)}>
      {FACTS.map(({ Icon, title, text }, i) => (
        <li
          key={title}
          className={i === active ? 'is-active' : undefined}
          tabIndex={0}
          onMouseEnter={() => {
            setPaused(true);
            setActive(i);
          }}
          onFocus={() => {
            setPaused(true);
            setActive(i);
          }}
          onBlur={() => setPaused(false)}
        >
          <span className="facts-icon">
            <span className="facts-water" aria-hidden="true">
              <svg viewBox="0 0 120 12" preserveAspectRatio="none">
                <path d="M0 6q7.5-6 15 0t15 0t15 0t15 0t15 0t15 0t15 0t15 0V12H0z" />
              </svg>
            </span>
            <Icon size={24} aria-hidden="true" />
          </span>
          <span className="facts-text">
            <strong>{title}</strong>
            <span>{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
