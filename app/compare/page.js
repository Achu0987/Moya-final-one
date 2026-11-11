import { ArrowDown, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import CompareTable from '@/components/compare/CompareTable';
import './compare.css';

export const metadata = {
  title: 'Compare: MoyaOne',
  description:
    'Jugs, an RO filter or MoyaOne: what each way of getting drinking water asks of your home, side by side, in plain words.',
};

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
                <ArrowDown weight="bold" size={20} aria-hidden="true" />
              </a>
              <a href="/contact" className="text-link">
                Talk to us
                <ArrowRight weight="bold" size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          {/* PLACEHOLDER: a found photograph (credited below); swap in the client's own people photography when it arrives */}
          <figure className="cp-photo">
            <img
              src="/compare/drinking-1600.webp"
              srcSet="/compare/drinking-800.webp 800w, /compare/drinking-1600.webp 1600w"
              sizes="(min-width: 900px) 40vw, 100vw"
              width="1600"
              height="1067"
              alt="A woman drinking a glass of water in her kitchen."
              fetchPriority="high"
            />
          </figure>
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
            <CompareTable caption="Jugs, an RO filter and MoyaOne, compared on seven questions." />
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
            <p data-reveal="fade">Each option has its own page, against MoyaOne.</p>
          </div>
          <div className="cp-door-list" data-in>
            <a href="/compare/bottled-water" className="cp-door is-jugs" style={{ '--i': 0 }}>
              <span className="cp-door-art">
                <img src="/compare/jug.webp" alt="" width="600" height="600" loading="lazy" />
              </span>
              <span className="cp-door-text">
                <span className="cp-door-title">MoyaOne and bottled water</span>
                <span className="cp-door-sub">Twenty kilos at a time, every week: the jug routine, against one line.</span>
                <span className="cp-door-go">
                  Read the comparison
                  <ArrowRight weight="bold" size={20} aria-hidden="true" />
                </span>
              </span>
            </a>
            <a href="/compare/ro-filters" className="cp-door is-ro" style={{ '--i': 1 }}>
              <span className="cp-door-art">
                <img src="/compare/ro-filter.webp" alt="" width="600" height="600" loading="lazy" />
              </span>
              <span className="cp-door-text">
                <span className="cp-door-title">MoyaOne and RO filters</span>
                <span className="cp-door-sub">Water, servicing and space: what a filter under the sink asks for.</span>
                <span className="cp-door-go">
                  Read the comparison
                  <ArrowRight weight="bold" size={20} aria-hidden="true" />
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
              MoyaOne goes in while a tower is built, so it cannot be added to a flat later.
            </p>
            <p className="cp-note-text" data-reveal="fade">
              Jugs and filters work in any home. MoyaOne works where it is planned in, so the time to ask for it is
              before the tower goes up.
            </p>
            <div className="cp-actions" data-reveal="fade">
              <a href="/contact" className="btn btn-primary">
                Talk to us
                <ArrowRight weight="bold" size={20} aria-hidden="true" />
              </a>
              <a href="/b2b/builders" className="text-link">
                For builders
                <ArrowRight weight="bold" size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <p className="container cp-credits">
        First photograph: “Woman drinks water from a glass in a modern kitchen” by Shixart1985,{' '}
        <a href="https://commons.wikimedia.org/wiki/File:Woman_drinks_water_from_a_glass_in_a_modern_kitchen.jpg">
          CC BY 2.0
        </a>
        , via Wikimedia Commons.
      </p>

      <Motion />
      <InView />
    </>
  );
}
