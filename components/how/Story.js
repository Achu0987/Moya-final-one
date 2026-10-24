'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr';

// How Moya One works, start to end, told as one drawing that changes step by step:
// the tower is planned, the line goes in, the kitchen is fitted, then the resident recharges, pours and tops up.
// Every step restates CLAUDE.md "What the project is"; nothing goes beyond it. No numbers in the drawing.
const STEPS = [
  { phase: 'Before you move in', who: 'Your builder', title: 'Plans Moya One into the tower', text: 'It is chosen at the design stage, before construction starts.' },
  { phase: 'Before you move in', who: 'Builder and Moya One', title: 'Lays one line to every flat', text: 'A dedicated water line runs from the plant room up the tower while it is built.' },
  { phase: 'Before you move in', who: 'Builder and Moya One', title: 'Fits your kitchen', text: 'Each kitchen gets a Moya1™ control unit and an extra tap.' },
  { phase: 'After you move in', who: 'You', title: 'Recharge litres on your phone', text: 'Choose a pack in the Moya One app, the way you top up a mobile plan.' },
  { phase: 'After you move in', who: 'You', title: 'Pour a glass', text: 'Drinking water comes from its own tap, whenever you want it.' },
  // PLACEHOLDER: "no filter" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
  { phase: 'After you move in', who: 'You', title: 'Top up when you run low', text: 'Recharge again from the app. No jugs to carry, no filter to service.' },
];

const FLOORS = [80, 120, 160, 200, 240, 280, 320, 360]; // top edge of each floor in the drawing
const HOME = 200; // your flat

function Art({ step }) {
  const n = step + 1;
  const cls = `tale-art s-${n}${n >= 2 ? ' is-built' : ''}${n >= 3 ? ' is-in' : ''}`;
  return (
    <svg className={cls} viewBox="0 0 640 480" role="img" aria-label={`Step ${n} of 6: ${STEPS[step].title}.`}>
      <defs>
        <pattern id="tale-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--water)" strokeWidth="1" />
        </pattern>
        <clipPath id="tale-glass">
          <path d="M450 246h32l-4 46a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4z" />
        </clipPath>
        <clipPath id="tale-meter">
          <rect x="370" y="150" width="60" height="112" rx="10" />
        </clipPath>
      </defs>

      {/* the builder's drawing board, only while it is a plan */}
      <rect className="tale-board" x="0" y="0" width="640" height="480" fill="url(#tale-grid)" />

      {/* ground and the basement */}
      <path d="M0 400H640" stroke="var(--ink)" strokeWidth="2" opacity=".25" />

      <g className="tale-tower">
        {/* the plan: a dashed outline and the planned line */}
        <g className="tale-blueprint" fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6">
          <rect x="60" y="80" width="200" height="320" rx="2" />
          {FLOORS.slice(1).map((y) => (
            <path key={y} d={`M60 ${y}H260`} opacity=".4" />
          ))}
          <rect x="60" y="406" width="200" height="50" rx="6" opacity=".5" />
          <path d="M140 431H246V92" stroke="var(--orange)" />
        </g>

        {/* the built tower */}
        <g className="tale-solid">
          <rect x="60" y="80" width="200" height="320" rx="2" fill="var(--grey)" stroke="var(--ink)" strokeWidth="2" />
          <rect x="52" y="72" width="216" height="10" rx="2" fill="var(--ink)" />
          {FLOORS.map((y) => (
            <g key={y}>
              <path d={`M60 ${y + 40}H260`} stroke="var(--line)" strokeWidth="2" />
              {[76, 120, 164].map((x) => (
                <rect key={x} x={x} y={y + 11} width="30" height="18" rx="2" fill={y === HOME ? 'var(--base)' : 'var(--line)'} />
              ))}
            </g>
          ))}
          {/* plant room under the ground */}
          <rect x="60" y="406" width="200" height="50" rx="6" fill="var(--ink)" opacity=".9" />
          <rect x="80" y="415" width="56" height="32" rx="8" fill="var(--water)" />
        </g>

        {/* your flat */}
        <rect className="tale-flat" x="60" y={HOME} width="200" height="40" fill="var(--water)" stroke="var(--orange)" strokeWidth="3" />

        {/* the line: drawn up the tower, then one branch into each flat */}
        <path className="tale-line" d="M136 431H246V92" pathLength="1" fill="none" stroke="var(--orange)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          className="tale-stubs"
          d={FLOORS.map((y) => `M246 ${y + 30}h-26`).join('')}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* a crane while the tower goes up */}
        <g className="tale-crane" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M296 400V36M210 40H380M296 36l-60 4M296 36l84 4" />
          <path d="M360 40v70" strokeWidth="2" />
          <rect x="350" y="110" width="20" height="14" rx="2" fill="var(--orange)" stroke="none" />
        </g>
      </g>

      {/* inside your flat: the kitchen */}
      <g className="tale-panel">
        <path d={`M260 ${HOME + 20}H320`} stroke="var(--orange)" strokeWidth="2" strokeDasharray="4 5" />
        <rect x="320" y="70" width="290" height="330" rx="20" fill="var(--base)" stroke="var(--line)" strokeWidth="2" />
        {/* worktop and cabinets */}
        <rect x="320" y="296" width="290" height="12" fill="var(--ink)" />
        <rect x="332" y="308" width="266" height="80" rx="4" fill="var(--grey)" />
        <path d="M465 312V384" stroke="var(--line)" strokeWidth="2" />
        {/* the sink and the everyday tap */}
        <rect x="340" y="290" width="90" height="8" rx="3" fill="var(--line)" />
        <path d="M384 290v-34q0-12 12-12h10" fill="none" stroke="var(--muted)" strokeWidth="6" strokeLinecap="round" />
        {/* the line arriving into the unit */}
        <path d="M320 360H500" stroke="var(--orange)" strokeWidth="4" />
        {/* the Moya1 unit and the extra tap */}
        <rect className="tale-unit" x="500" y="328" width="52" height="52" rx="10" fill="var(--ink)" />
        <circle cx="526" cy="354" r="6" fill="var(--orange)" />
        <path d="M521 328V300" stroke="var(--orange)" strokeWidth="3" />
        <rect x="510" y="288" width="22" height="8" rx="3" fill="var(--orange)" />
        <rect x="514" y="200" width="14" height="90" rx="7" fill="var(--ink)" />
        <path d="M521 206c0-44-26-62-52-62s-4 40-4 58" fill="none" stroke="var(--ink)" strokeWidth="10" strokeLinecap="round" />
        <rect x="458" y="198" width="14" height="8" rx="3" fill="var(--ink)" />
        {/* new in your kitchen */}
        <circle className="tale-ring" cx="526" cy="354" r="40" fill="none" stroke="var(--orange)" strokeWidth="2" />
        <circle className="tale-ring tale-ring-2" cx="500" cy="200" r="64" fill="none" stroke="var(--orange)" strokeWidth="2" />

        {/* the glass */}
        <g className="tale-glass">
          <rect className="tale-stream" x="462" y="206" width="6" height="88" rx="3" fill="var(--water)" />
          <g clipPath="url(#tale-glass)">
            <rect className="tale-glass-water" x="446" y="244" width="40" height="54" fill="var(--water)" />
          </g>
          <path d="M450 246h32l-4 46a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4z" fill="none" stroke="var(--ink)" strokeWidth="2" />
        </g>

        {/* the phone: litres going in */}
        <g className="tale-phone">
          <rect x="346" y="104" width="108" height="220" rx="18" fill="var(--ink)" />
          <rect x="354" y="116" width="92" height="196" rx="12" fill="var(--base)" />
          <rect x="384" y="124" width="32" height="5" rx="2.5" fill="var(--line)" />
          <rect x="370" y="150" width="60" height="112" rx="10" fill="var(--grey)" />
          <g clipPath="url(#tale-meter)">
            <rect className="tale-meter" x="370" y="150" width="60" height="112" fill="var(--water)" />
          </g>
          <rect x="366" y="276" width="68" height="22" rx="11" fill="var(--ink)" />
        </g>
      </g>
    </svg>
  );
}

export default function Story() {
  const box = useRef(null);
  const [step, setStep] = useState(0);
  const [part, setPart] = useState(0); // how far through the current step, 0 to 1

  // the section is tall and its view is pinned; scrolling through it moves the story one step at a time
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = box.current;
      const r = el.getBoundingClientRect();
      const run = el.offsetHeight - window.innerHeight;
      const p = Math.min(0.9999, Math.max(0, -r.top / run)) * STEPS.length;
      setStep(Math.floor(p));
      setPart(p - Math.floor(p));
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(read));
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // a step button scrolls the page to that step
  const go = (i) => {
    const el = box.current;
    const run = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (run * (i + 0.15)) / STEPS.length;
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const s = STEPS[step];

  return (
    <section ref={box} className="tale" aria-labelledby="how-title">
      <div className="tale-pin">
        <div className="container tale-inner">
          <div className="tale-stage">
            <div className="tale-top">
              <span className={`tale-phase${step >= 3 ? ' is-after' : ''}`}>{s.phase}</span>
              <span className="sample">Illustrative</span>
            </div>
            <Art step={step} />
          </div>

          <div className="tale-side">
            <h1 id="how-title" className="tale-heading">
              How it works, start to end.
            </h1>
            <p className="tale-count" aria-live="polite">
              Step {step + 1} of {STEPS.length}
              {step === 0 && (
                <span className="tale-hint">
                  <ArrowDown size={16} aria-hidden="true" /> Scroll to follow
                </span>
              )}
            </p>

            {/* phones: the current step sits right under the picture; the list below becomes a row of numbers */}
            <div className="tale-now" aria-hidden="true">
              <p className="tale-who">{s.who}</p>
              <p className="tale-title">{s.title}</p>
              <p className="tale-text">{s.text}</p>
            </div>

            <ol className="tale-steps">
              {STEPS.map((x, i) => (
                <li key={x.title} className={`tale-step${i === step ? ' is-on' : ''}${i < step ? ' is-done' : ''}`}>
                  {(i === 0 || STEPS[i - 1].phase !== x.phase) && <p className="tale-step-phase">{x.phase}</p>}
                  <button type="button" onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                    <span className="tale-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="tale-step-body">
                      <span className="tale-who">{x.who}</span>
                      <span className="tale-title">{x.title}</span>
                      <span className="tale-text">{x.text}</span>
                    </span>
                  </button>
                  {i === step && <span className="tale-bar" style={{ transform: `scaleX(${part})` }} aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
