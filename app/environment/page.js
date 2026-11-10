import { ArrowDown, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import TowerToggle from '@/components/environment/TowerToggle';
import ForestFilm from '@/components/environment/ForestFilm';
import KitchenYear from '@/components/environment/KitchenYear';
import DeliveryCard from '@/components/environment/DeliveryCard';
import './environment.css';

export const metadata = {
  title: 'Environment: Moya One',
  description:
    'With one line to every flat, drinking water comes up through the tower. No jugs to deliver, carry, store or send back.',
};

// PLACEHOLDER: each figure is a slot until the client confirms it in writing (tracker C3, Claims tab).
// Publish a number here only when the Claims tab marks it "OK" or "Verified", and name its source.
const PENDING = [
  { title: 'Plastic kept out of a tower', text: 'How much jug plastic a Moya One tower no longer handles in a year.' },
  { title: 'Trips taken off the road', text: 'How many delivery runs a tower no longer needs once the line is in.' },
  { title: 'Water used, against an RO filter', text: 'How much water each way uses to give you one litre to drink.' },
];

export default function Environment() {
  return (
    <>
      {/* ---- the first screen: a quiet forest film, the promise over it (client review, Nov 7) ---- */}
      {/* PLACEHOLDER: the client asked the film to show how much plastic is used every year; no figure is published
          until the Claims tab marks it OK (CLAUDE.md non-negotiable 3). */}
      <section className="ev-film" aria-labelledby="ev-title">
        <ForestFilm />
        <div className="container ev-film-copy">
          {/* PLACEHOLDER: "less plastic" is the brief's essence (PAGE_BRIEFS.md #10), qualitative only; Rayansh to add it to the Claims tab. */}
          <h1 id="ev-title" className="ev-film-title">
            Less plastic,
            <br /> in every home.
          </h1>
          <p className="ev-film-lede">
            With Moya One, drinking water comes up the tower on its own line. No 20-litre jugs to deliver, carry, store
            or send back.
          </p>
          <div className="hero-actions">
            <a href="#year" className="btn btn-primary">
              See a year of jugs
              <ArrowDown size={20} aria-hidden="true" />
            </a>
            <a href="/b2c/how-it-works" className="text-link">
              See how it works
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ---- second: the tower, today and with Moya One (moved down from the first screen, client review) ---- */}
      <section className="ev-hero" aria-labelledby="ev-today-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h2 id="ev-today-title" className="ev-today-title" data-reveal="words">
              <Words>Today, and with Moya One.</Words>
            </h2>
            <p className="hero-lede" data-reveal="fade">
              Today a van brings the jugs to the gate and every flat stores them. With Moya One the van stays away, and
              one line rises to every flat in the tower.
            </p>
            <p className="hero-note">Illustration. Figures follow once they are confirmed.</p>
          </div>
          <TowerToggle />
        </div>
      </section>

      {/* ---- the signature: a year of jugs in one kitchen, then the line, held while the visitor scrolls ---- */}
      <KitchenYear />

      {/* ---- the card that counts the jugs, washed clean ---- */}
      <DeliveryCard />

      {/* ---- the figures wait for proof ---- */}
      <section className="ev-proof" aria-labelledby="ev-proof-title">
        <div className="container ev-proof-grid">
          <div className="ev-proof-head">
            <h2 id="ev-proof-title" data-reveal="words">
              <Words>Proof before numbers.</Words>
            </h2>
            <p data-reveal="fade">
              A claim about the environment should be measured, not guessed. Each of these figures appears here once it
              has been checked and confirmed.
            </p>
          </div>
          <ul className="ev-proof-list" data-in>
            {PENDING.map((p, i) => (
              <li key={p.title} style={{ '--i': i }}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="ev-pending">Being confirmed</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- close: the home page's centred moment ---- */}
      <section className="closing" aria-labelledby="ev-close-title">
        <div className="container closing-inner">
          <h2 id="ev-close-title" data-reveal="words">
            <Words>Leave the jug run behind.</Words>
          </h2>
          <p data-reveal="fade">
            Moya One goes into a tower while it is built. Building one, or buying into one? Tell us about it.
          </p>
          <div className="ev-close-actions" data-reveal="fade">
            <a href="/contact" className="btn btn-primary">
              Talk to us
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/b2b/builders" className="text-link">
              For builders
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/compare" className="text-link">
              Compare the options
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="container ev-credits">
          Film: “From the mountain high, the forest stretches like a green ocean” by Mathanprasath K,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:From_the_mountain_high,_the_forest_stretches_like_a_green_ocean,_kissed_by_mist_and_rain_%E2%80%94_a_silent_breath_of_nature,_and_continue_with_move_on.webm">
            CC BY 4.0
          </a>
          , via Wikimedia Commons.
        </p>
      </section>

      <Motion />
      <InView />
    </>
  );
}
