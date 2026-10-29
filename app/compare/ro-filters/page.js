import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import KitchenSwitch from '@/components/compare/KitchenSwitch';
import FlatCount from '@/components/compare/FlatCount';
import CompareTable from '@/components/compare/CompareTable';
import '../compare.css';

export const metadata = {
  title: 'Moya One and RO filters',
  description:
    'An RO filter asks three things of a household: water, servicing and space. A plain comparison with Moya One, for residents and builders.',
};

// The three things an RO filter asks for, each answered for Moya One. No ratio or percentage (PAGE_BRIEFS.md #8).
const ASKS = [
  {
    word: 'Water.',
    ro: 'An RO unit sends part of the water it takes to the drain as it filters.',
    // PLACEHOLDER: the RO wastage ratio and Moya One's own figure are published only once confirmed in writing (tracker C3).
    moya: 'How much water Moya One uses for each litre you drink is being confirmed, and will be published here.',
  },
  {
    word: 'Servicing.',
    ro: 'Filters and membranes are replaced on a schedule, and someone has to arrange each visit.',
    // PLACEHOLDER: "nothing to service in the flat" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
    moya: 'Nothing to service inside your flat: no filter box, no visits to arrange.',
  },
  {
    word: 'Space.',
    ro: 'The unit takes the cupboard under the sink, or a patch of kitchen wall.',
    moya: 'A Moya1™ control unit on the wall and one extra tap. The cupboard stays a cupboard.',
  },
];

export default function RoFilters() {
  return (
    <>
      {/* ---- the first screen: the cupboard under the sink, each way ---- */}
      <section className="cp-hero" aria-labelledby="ro-title">
        <div className="container cp-hero-grid">
          <div className="cp-hero-copy">
            <h1 id="ro-title" className="cp-title">
              A filter under
              <br /> every sink.
            </h1>
            <p className="cp-lede">
              An RO unit asks three things of a household: water, servicing and space. Moya One asks for none of them
              inside your flat.
            </p>
            <div className="cp-actions">
              <a href="/contact" className="btn btn-primary">
                Talk to us
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="#asks" className="text-link">
                See the three things
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <KitchenSwitch id="ro-ks" states={['ro', 'moya']} />
        </div>
      </section>

      {/* ---- water, servicing, space ---- */}
      <section id="asks" className="ro-asks" aria-labelledby="ro-asks-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="ro-asks-title" data-reveal="words">
              <Words>Three things it asks for.</Words>
            </h2>
            <p data-reveal="fade">A fair comparison: what an RO filter needs, and what Moya One needs instead.</p>
          </div>
          <ul className="ro-ask-list" data-in>
            <li className="ro-ask-key" aria-hidden="true">
              <span />
              <span>With an RO filter</span>
              <span>With Moya One</span>
            </li>
            {ASKS.map((a, i) => (
              <li key={a.word} className="ro-ask" style={{ '--i': i }}>
                <h3 className="ro-word">{a.word}</h3>
                <p className="ro-them">
                  <span className="ro-who">With an RO filter</span>
                  {a.ro}
                </p>
                <p className="ro-us">
                  <span className="ro-who">With Moya One</span>
                  {a.moya}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- for builders: one unit per flat, or one system ---- */}
      <section className="ro-build" aria-labelledby="ro-build-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="ro-build-title" data-reveal="words">
              <Words>One system, not one per flat.</Words>
            </h2>
            <p data-reveal="fade">
              For builders: a filter in every kitchen means a unit to buy, fit and look after in every flat you hand over.
            </p>
          </div>
          <FlatCount />
        </div>
      </section>

      {/* ---- the whole comparison ---- */}
      <section className="cp-table" aria-labelledby="ro-table-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="ro-table-title" data-reveal="words">
              <Words>RO filters and Moya One.</Words>
            </h2>
            <p data-reveal="fade">The same questions, answered for both.</p>
          </div>
          <div data-reveal="card">
            <CompareTable only={['ro', 'moya']} caption="An RO filter and Moya One compared." />
          </div>
        </div>
      </section>

      {/* ---- close ---- */}
      <section className="closing" aria-labelledby="ro-close-title">
        <div className="container closing-inner">
          <h2 id="ro-close-title" data-reveal="words">
            <Words>Talk to us about your tower.</Words>
          </h2>
          <p data-reveal="fade">Building one, or living in one that is going up? Tell us what you need.</p>
          <div className="cp-close-actions" data-reveal="fade">
            <a href="/contact" className="btn btn-primary">
              Talk to us
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/compare/bottled-water" className="text-link">
              Moya One and bottled water
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/compare" className="text-link">
              All three side by side
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <Motion />
      <InView />
    </>
  );
}
