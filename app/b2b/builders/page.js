import { ArrowDown, ArrowRight, Check, X } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import Sizer from '@/components/builders/Sizer';
import BuilderMotion from '@/components/builders/BuilderMotion';
import { Kitchen } from '@/components/environment/KitchenYear';
import './builders.css';

export const metadata = {
  title: 'For builders: Moya One',
  description:
    'Plan drinking water into your tower during construction: one dedicated line to every flat, a Moya1 control unit and an extra tap in each kitchen, nothing added after handover.',
};

// Where Moya One sits in a construction schedule. Each step restates CLAUDE.md "What the project is".
// PLACEHOLDER: the stage-by-stage mapping is our reading of "installed during construction, through the builder";
// Rayansh to confirm with the client before launch.
const STAGES = [
  { stage: 'Design', title: 'Planned in', text: 'Moya One is chosen at the design stage and shown in your drawings.' },
  // PLACEHOLDER: "its own plant room" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
  { stage: 'Structure', title: 'Room for the line', text: 'Space is kept for one line to rise from the plant room through the tower.' },
  { stage: 'Services', title: 'A line to every flat', text: 'The dedicated line is laid floor by floor while the tower is built.' },
  { stage: 'Finishing', title: 'Kitchens fitted', text: 'Each kitchen gets a Moya1™ control unit and an extra tap.' },
  { stage: 'Handover', title: 'Ready on day one', text: 'Residents move in and recharge litres from their phones.' },
];

// The three pillars Khan set out for builders in the review call (Nov 7). Wording follows his notes; his page-wise
// text arrives later as a PDF and replaces it.
// PLACEHOLDER: the "20-30% kitchen space" figure is left out until the Claims tab marks it OK (non-negotiable 3).
// PLACEHOLDER: "zero maintenance" and "after-installation support" are the client's own words; Rayansh to add them
// to the Claims tab as OK before launch.
const PILLARS = [
  {
    title: 'A selling point.',
    text: 'Drinking water on tap is an amenity buyers can see in every kitchen. It sets your project apart and gives it an edge at launch.',
  },
  {
    title: 'Kitchens and lifts, decluttered.',
    text: 'No jug corner in the modular kitchen, no jugs riding the lifts, and less delivery and security traffic at the gate every day.',
  },
  {
    title: 'Zero maintenance.',
    text: 'Nothing for residents to service in the flat, with after-installation support from Moya One.',
  },
];

const GOES_IN = ['Its own branch of the line', 'A Moya1™ control unit on the kitchen wall', 'An extra tap beside the sink'];
const STAYS_OUT = [
  'A corner stacked with water jugs',
  // PLACEHOLDER: "no filter" and "no retrofit" are brief points, Claims tab "To confirm". Rayansh to mark OK before launch.
  'A filter box under the sink',
  'Work in the flat after handover',
];

export default function Builders() {
  return (
    <>
      {/* ---- the first screen: dark, one photograph of a tower going up ---- */}
      <section className="bx-hero" aria-labelledby="bx-title">
        <div className="container bx-hero-grid">
          <div className="bx-hero-copy">
            {/* each line rises out of its own mask as the page opens */}
            <h1 id="bx-title" className="bx-title">
              <span className="bx-line">
                <span>Drinking water,</span>
              </span>
              <span className="bx-line">
                <span>planned in.</span>
              </span>
            </h1>
            <p className="bx-lede">
              Moya One goes into your tower while it is built, through you. Every flat gets its own line, a Moya1™
              control unit and an extra tap. Nothing is added after handover.
            </p>
            <div className="bx-actions">
              <a href="#size" className="btn btn-primary">
                Size it to your tower
                <ArrowDown size={20} aria-hidden="true" />
              </a>
              <a href="#enquire" className="text-link bx-link-light">
                Start an enquiry
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="bx-hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/builders/tower.webp" alt="A tall residential tower near completion against a soft, cloudy sky." />
          </figure>
        </div>
      </section>

      {/* ---- why plan it in: the three pillars (client review, Nov 7) ---- */}
      <section className="bx-pillars" aria-labelledby="bx-pillars-title">
        <div className="container">
          <div className="bx-plan-head">
            <h2 id="bx-pillars-title" data-reveal="words">
              <Words>Three reasons to plan it in.</Words>
            </h2>
            <p data-reveal="fade">What Moya One adds to a project, for the buyers you sell to and the building you run.</p>
          </div>
          <ul className="bx-pillar-list" data-in>
            {PILLARS.map((p, i) => (
              <li key={p.title} className="bx-pillar" style={{ '--i': i }}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- where it sits in the construction schedule ---- */}
      <section className="bx-plan" aria-labelledby="bx-plan-title">
        <div className="container">
          <div className="bx-plan-head">
            <h2 id="bx-plan-title" data-reveal="words">
              <Words>It follows your build.</Words>
            </h2>
            <p data-reveal="fade">
              One decision at the design stage, then a step at each stage after it. By handover, every flat is ready.
            </p>
          </div>
          <ol className="bx-schedule" data-in>
            {STAGES.map((s, i) => (
              <li key={s.stage} className="bx-stage" style={{ '--i': i }}>
                <p className="bx-stage-name">{s.stage}</p>
                <span className="bx-stage-bar" aria-hidden="true" />
                <h3 className="bx-stage-title">{s.title}</h3>
                <p className="bx-stage-text">{s.text}</p>
              </li>
            ))}
          </ol>
          <a href="/b2c/how-it-works" className="text-link bx-plan-link">
            See how the water reaches each flat
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ---- a rest: the skyline being built ---- */}
      <figure className="bx-band" aria-label="A tower going up above a green city, with hills behind.">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/builders/city-build.webp" alt="" loading="lazy" />
      </figure>

      {/* ---- what a flat gains, and what it never has to hold ---- */}
      <section className="bx-flat" aria-labelledby="bx-flat-title">
        <div className="container bx-flat-grid">
          <h2 id="bx-flat-title" className="bx-flat-title" data-reveal="words">
            <Words>Three things go in.</Words>
          </h2>
          <div className="bx-flat-lists" data-in>
          <div className="bx-flat-col">
            <p className="bx-flat-label">In every flat</p>
            <ul>
              {GOES_IN.map((t, i) => (
                <li key={t} style={{ '--i': i }}>
                  <Check size={24} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bx-flat-col is-out">
            <p className="bx-flat-label">Never in the flat</p>
            <ul>
              {STAYS_OUT.map((t, i) => (
                <li key={t} style={{ '--i': i + 3 }}>
                  <X size={24} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <a href="/compare" className="text-link bx-flat-link">
              Compare jugs, RO filters and Moya One
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
          </div>
          <figure className="bx-flat-photo" data-in>
            {/* the site's own drawing of a flat's kitchen: the Moya1 control unit, the extra tap and the line up the wall */}
            <div className="bx-flat-drawing">
              <Kitchen shown={0} moya q={1} />
            </div>
            <figcaption>Illustration. A flat kitchen with its Moya1™ control unit and one extra tap.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---- the live thing: size it, then send it ---- */}
      <Sizer />

      <Motion />
      <BuilderMotion />
    </>
  );
}
