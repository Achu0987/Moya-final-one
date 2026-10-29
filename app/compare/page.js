import { ArrowDown, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import Jug from '@/components/Jug';
import KitchenSwitch from '@/components/compare/KitchenSwitch';
import CompareTable from '@/components/compare/CompareTable';
import './compare.css';

export const metadata = {
  title: 'Compare: Moya One',
  description:
    'Jugs, an RO filter or Moya One: what each way of getting drinking water asks of your home, side by side, in plain words.',
};

const S = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// the cupboard under the sink with its RO unit, for the RO door
function FilterArt() {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <path d="M86 50V26a14 14 0 0 1 28 0v4" {...S} strokeWidth="3" />
      <rect x="24" y="50" width="152" height="10" rx="3" fill="var(--ink)" />
      <rect x="32" y="60" width="136" height="88" rx="4" {...S} fill="var(--base)" />
      <rect x="40" y="68" width="120" height="72" rx="3" fill="var(--grey)" />
      <rect x="52" y="80" width="96" height="48" rx="6" {...S} fill="var(--base)" />
      {[62, 90, 118].map((x) => (
        <rect key={x} x={x} y="88" width="20" height="32" rx="6" {...S} fill="var(--water)" />
      ))}
    </svg>
  );
}

export default function Compare() {
  return (
    <>
      {/* ---- the first screen: dark ink as on the builders page; one kitchen, three ways ---- */}
      <section className="cp-hero" aria-labelledby="cp-title">
        <div className="container cp-hero-grid">
          <div className="cp-hero-copy">
            <h1 id="cp-title" className="cp-title">
              Three ways to
              <br /> drinking water.
            </h1>
            <p className="cp-lede">
              Jugs at the door, a filter under the sink, or a line built into the tower. Here is what each one asks of
              your home, in plain words.
            </p>
            <div className="cp-actions">
              <a href="#side-by-side" className="btn btn-primary">
                See them side by side
                <ArrowDown size={20} aria-hidden="true" />
              </a>
              <a href="/contact" className="text-link">
                Talk to us
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <KitchenSwitch id="cp-ks" />
        </div>
      </section>

      {/* ---- the comparison ---- */}
      <section id="side-by-side" className="cp-table" aria-labelledby="cp-table-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="cp-table-title" data-reveal="words">
              <Words>Side by side.</Words>
            </h2>
            <p data-reveal="fade">
              Seven plain questions, answered for each option. Where a figure is not confirmed yet, we say so.
            </p>
          </div>
          <div data-reveal="card">
            <CompareTable caption="Jugs, an RO filter and Moya One, compared on seven questions." />
          </div>
        </div>
      </section>

      {/* ---- the two comparisons in full ---- */}
      <section className="cp-doors" aria-labelledby="cp-doors-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="cp-doors-title" data-reveal="words">
              <Words>Look closer.</Words>
            </h2>
            <p data-reveal="fade">Each option has its own page, against Moya One.</p>
          </div>
          <div className="cp-door-list" data-in>
            <a href="/compare/bottled-water" className="cp-door is-jugs" style={{ '--i': 0 }}>
              <span className="cp-door-art">
                <Jug id="cp-door-jug" title="A 20-litre water jug" />
              </span>
              <span className="cp-door-text">
                <span className="cp-door-title">Moya One and bottled water</span>
                <span className="cp-door-sub">Twenty kilos at a time, every week: the jug routine, against one line.</span>
                <span className="cp-door-go">
                  Read the comparison
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
              </span>
            </a>
            <a href="/compare/ro-filters" className="cp-door is-ro" style={{ '--i': 1 }}>
              <span className="cp-door-art">
                <FilterArt />
              </span>
              <span className="cp-door-text">
                <span className="cp-door-title">Moya One and RO filters</span>
                <span className="cp-door-sub">Water, servicing and space: what a filter under the sink asks for.</span>
                <span className="cp-door-go">
                  Read the comparison
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ---- the honest part: it has to be built in ---- */}
      <section className="cp-note" aria-labelledby="cp-note-title">
        <div className="container cp-note-grid">
          <h2 id="cp-note-title" className="cp-note-title" data-reveal="words">
            <Words>One thing to know.</Words>
          </h2>
          <div className="cp-note-body">
            {/* PLACEHOLDER: follows "installed during construction, through the builder"; confirm wording with Rayansh. */}
            <p className="cp-statement" data-reveal="fade">
              Moya One goes in while a tower is built, so it cannot be added to a flat later.
            </p>
            <p className="cp-note-text" data-reveal="fade">
              Jugs and filters work in any home. Moya One works where it is planned in, so the time to ask for it is
              before the tower goes up.
            </p>
            <div className="cp-actions" data-reveal="fade">
              <a href="/contact" className="btn btn-primary">
                Talk to us
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="/b2b/builders" className="text-link">
                For builders
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Motion />
      <InView />
    </>
  );
}
