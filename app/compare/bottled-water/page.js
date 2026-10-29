import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import { JugShape } from '@/components/Jug';
import Routine from '@/components/compare/Routine';
import LiftYear from '@/components/compare/LiftYear';
import CompareTable from '@/components/compare/CompareTable';
import '../compare.css';

export const metadata = {
  title: 'Moya One and bottled water',
  description:
    'A full 20-litre jug weighs about twenty kilos. See the weekly jug routine against one line to your kitchen, and work out what your home lifts in a year.',
};

export default function BottledWater() {
  return (
    <>
      {/* ---- the first screen: the jug itself, and what it weighs ---- */}
      <section className="cp-hero" aria-labelledby="bw-title">
        <div className="container cp-hero-grid">
          <div className="cp-hero-copy">
            <h1 id="bw-title" className="cp-title">
              Twenty kilos
              <br /> at a time.
            </h1>
            <p className="cp-lede">
              A full 20-litre jug of water weighs about twenty kilos. Someone carries it in, lifts it up, and carries
              the empty back out. Moya One brings the water up the tower instead.
            </p>
            <div className="cp-actions">
              <a href="/b2c/how-it-works" className="btn btn-primary">
                See how it works
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="#year" className="text-link">
                Work out your year
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="bw-jug">
            <svg viewBox="0 0 300 300" role="img" aria-labelledby="bw-jug-t">
              <title id="bw-jug-t">A 20-litre water jug with a luggage tag that reads 20 kg.</title>
              <g className="bw-jug-lift">
                <g transform="translate(46 32) scale(1.15)">
                  <JugShape id="bw-hero-jug" />
                </g>
                {/* the tag, tied to the neck */}
                <path className="bw-string" d="M150 92C190 92 200 110 214 128" />
                <g className="bw-tag">
                  <path d="M204 126h64a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6h-64l-14-26z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="206" cy="152" r="4" fill="var(--base)" stroke="var(--ink)" strokeWidth="2" />
                  <text x="241" y="160" textAnchor="middle" className="bw-tag-text">
                    20 kg
                  </text>
                </g>
              </g>
              <path d="M40 286h220" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <figcaption>Illustration. About 20 kg of water, plus the jug.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---- the routine, as a loop ---- */}
      <section className="bw-routine" aria-labelledby="bw-routine-title">
        <div className="container bw-routine-grid">
          <div className="cp-head">
            <h2 id="bw-routine-title" data-reveal="words">
              <Words>The weekly routine.</Words>
            </h2>
            <p data-reveal="fade">
              Six small jobs that come round every week. With Moya One the loop is gone: the water is already in the
              tower, and you recharge litres from your phone.
            </p>
          </div>
          <Routine />
        </div>
      </section>

      {/* ---- the live thing: a year of lifting ---- */}
      <section id="year" className="bw-year" aria-labelledby="bw-year-title">
        <div className="container bw-year-grid">
          <div className="cp-head">
            <h2 id="bw-year-title" data-reveal="words">
              <Words>Your year of lifting.</Words>
            </h2>
            <p data-reveal="fade">Move the slider to your home. The weight is only the water you carry in.</p>
          </div>
          <LiftYear />
        </div>
      </section>

      {/* ---- jugs against Moya One, plainly ---- */}
      <section className="cp-table" aria-labelledby="bw-table-title">
        <div className="container">
          <div className="cp-head">
            <h2 id="bw-table-title" data-reveal="words">
              <Words>Jugs and Moya One.</Words>
            </h2>
            <p data-reveal="fade">The same questions, answered for both.</p>
          </div>
          <div data-reveal="card">
            <CompareTable only={['jugs', 'moya']} rows={['source', 'carry', 'kitchen', 'care', 'track', 'where']} caption="Jugs and Moya One compared." />
          </div>
        </div>
      </section>

      {/* ---- close ---- */}
      <section className="closing" aria-labelledby="bw-close-title">
        <div className="container closing-inner">
          <h2 id="bw-close-title" data-reveal="words">
            <Words>Put the jugs down.</Words>
          </h2>
          <p data-reveal="fade">See how one line brings drinking water to every flat, without a single delivery.</p>
          <div className="cp-close-actions" data-reveal="fade">
            <a href="/b2c/how-it-works" className="btn btn-primary">
              See how it works
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/compare/ro-filters" className="text-link">
              Moya One and RO filters
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
