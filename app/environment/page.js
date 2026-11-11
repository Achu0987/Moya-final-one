import { ArrowDown, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import TowerToggle from '@/components/environment/TowerToggle';
import ForestFilm from '@/components/environment/ForestFilm';
import PlasticClock from '@/components/environment/PlasticClock';
import KitchenYear from '@/components/environment/KitchenYear';
import DeliveryCard from '@/components/environment/DeliveryCard';
import './environment.css';

export const metadata = {
  title: 'Environment: MoyaOne',
  description:
    'With one line to every flat, drinking water comes up through the tower. No jugs to deliver, carry, store or send back.',
};

// PLACEHOLDER: each figure is a slot until the client confirms it in writing (tracker C3, Claims tab).
// Publish a number here only when the Claims tab marks it "OK" or "Verified", and name its source.
// PLACEHOLDER: the real-life photographs (where used plastic ends up, and the forest band) are hidden until the client
// sends its own pictures (client, Nov 11). The sections and their credits stay in the code; set this to true to show them.
const SHOW_PHOTOS = false;

const PENDING = [
  { title: 'Plastic kept out of a tower', text: 'How much jug plastic a MoyaOne tower no longer handles in a year.' },
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
          <div className="ev-film-main">
          {/* PLACEHOLDER: "less plastic" is the brief's essence (PAGE_BRIEFS.md #10), qualitative only; Rayansh to add it to the Claims tab.
              The words follow the forest film (client brief, Nov 11): no figures, no claim beyond the jugs that stop coming. */}
          <h1 id="ev-title" className="ev-film-title">
            Less plastic,
            <br /> more green.
          </h1>
          <p className="ev-film-lede">
            Plastic that is thrown away ends up in rivers, on beaches and in places like this. With MoyaOne, drinking
            water comes up the tower on its own line, so no 20-litre jugs come to the door.
          </p>
          <div className="hero-actions">
            <a href="#year" className="btn btn-primary">
              See a year of jugs
              <ArrowDown weight="bold" size={20} aria-hidden="true" />
            </a>
            <a href="/b2c/how-it-works" className="text-link">
              See how it works
              <ArrowRight weight="bold" size={20} aria-hidden="true" />
            </a>
          </div>
          </div>
        </div>
        <PlasticClock />
      </section>

      {/* ---- second: the tower, today and with MoyaOne (moved down from the first screen, client review) ---- */}
      <section className="ev-hero" aria-labelledby="ev-today-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h2 id="ev-today-title" className="ev-today-title" data-reveal="words">
              <Words>Today, and with MoyaOne.</Words>
            </h2>
            <p className="hero-lede" data-reveal="fade">
              Today a van brings the jugs to the gate and every flat stores them. With MoyaOne the van stays away, and
              one line rises to every flat in the tower.
            </p>
            {/* note removed: client change list (Nov 7), item 1: no illustrative or sample-data labels. This overrides CLAUDE.md non-negotiable 5 on the agency's instruction; Rayansh to confirm */}
          </div>
          <TowerToggle />
        </div>
      </section>

      {SHOW_PHOTOS && (
        <>
          {/* ---- real photographs: where used plastic ends up (client brief, Nov 11). Captions describe the pictures only. ---- */}
          <section className="ev-photos" aria-labelledby="ev-photos-title">
            <div className="container ev-photos-grid">
              <div className="ev-photos-head">
                <h2 id="ev-photos-title" data-reveal="words">
                  <Words>Where the plastic goes.</Words>
                </h2>
                <p data-reveal="fade">
                  Every bottle and jug has to go somewhere once it is empty. These are real photographs of where used plastic
                  ends up.
                </p>
              </div>
              <figure className="ev-photo ev-photo-beach" data-in>
                <img
                  src="/environment/beach-1600.webp"
                  srcSet="/environment/beach-800.webp 800w, /environment/beach-1600.webp 1600w"
                  sizes="(min-width: 900px) 66vw, 100vw"
                  width="1600"
                  height="778"
                  alt="A sandy beach covered from end to end with discarded plastic bottles."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Plastic bottles on a beach in Accra, Ghana.</figcaption>
              </figure>
              <figure className="ev-photo ev-photo-stream" data-in>
                <img
                  src="/environment/stream-900.webp"
                  srcSet="/environment/stream-600.webp 600w, /environment/stream-900.webp 900w"
                  sizes="(min-width: 900px) 33vw, 100vw"
                  width="900"
                  height="1200"
                  alt="Two empty plastic bottles lying in a shallow stream among fallen autumn leaves."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Bottles left in a stream.</figcaption>
              </figure>
              <figure className="ev-photo ev-photo-bales" data-in>
                <img
                  src="/environment/bales-1000.webp"
                  srcSet="/environment/bales-600.webp 600w, /environment/bales-1000.webp 1000w"
                  sizes="(min-width: 900px) 33vw, 100vw"
                  width="1000"
                  height="750"
                  alt="Thousands of used plastic bottles crushed and pressed together into a bale."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Used bottles pressed into a bale.</figcaption>
              </figure>
              <p className="ev-photos-note" data-reveal="fade">
                In a MoyaOne tower, drinking water reaches each kitchen through a pipe. There is no jug to deliver, store,
                or send back.
              </p>
            </div>
          </section>

          {/* ---- a quiet return to the forest of the opening film ---- */}
          {/* PLACEHOLDER: qualitative line only; no environmental figure until the Claims tab marks it OK. */}
          <section className="ev-forest" aria-labelledby="ev-forest-title">
            <div className="container">
              <figure className="ev-forest-band" data-in>
                <img
                  src="/environment/forest-1024.webp"
                  srcSet="/environment/forest-640.webp 640w, /environment/forest-1024.webp 1024w"
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  width="1024"
                  height="670"
                  alt="Morning sun falling through tall trees onto a mossy forest floor."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="ev-forest-copy">
                  <h2 id="ev-forest-title">Keep the green the way it is.</h2>
                  <p>Fewer jugs to fill, carry and throw away. That is the part MoyaOne can change.</p>
                </figcaption>
              </figure>
            </div>
          </section>
        </>
      )}

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
            MoyaOne goes into a tower while it is built. Building one, or buying into one? Tell us about it.
          </p>
          <div className="ev-close-actions" data-reveal="fade">
            <a href="/contact" className="btn btn-primary">
              Talk to us
              <ArrowRight weight="bold" size={20} aria-hidden="true" />
            </a>
            <a href="/b2b/builders" className="text-link">
              For builders
              <ArrowRight weight="bold" size={20} aria-hidden="true" />
            </a>
            <a href="/compare" className="text-link">
              Compare the options
              <ArrowRight weight="bold" size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="container ev-credits">
          Opening photograph: “Sunlight in a dense forest 01” by Jonny White,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Sunlight_in_a_dense_forest_01.jpg">CC BY 2.0</a>. Film: “From
          the mountain high, the forest stretches like a green ocean” by Mathanprasath K,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:From_the_mountain_high,_the_forest_stretches_like_a_green_ocean,_kissed_by_mist_and_rain_%E2%80%94_a_silent_breath_of_nature,_and_continue_with_move_on.webm">
            CC BY 4.0
          </a>
          , via Wikimedia Commons.
          {SHOW_PHOTOS && (
            <>
              {' '}Photographs: “Plastic Pollution in Ghana” by Muntaka Chasant,{' '}
              <a href="https://commons.wikimedia.org/w/index.php?curid=75041713">CC BY-SA 4.0</a>; “Waste plastic bottles in
              a stream surrounded by autumn leaves” by Shixart1985,{' '}
              <a href="https://commons.wikimedia.org/wiki/File:Waste_plastic_bottles_in_a_stream_surrounded_by_autumn_leaves.jpg">CC BY 2.0</a>; “Bales of
              PET bottles closeup” by Grendelkhan,{' '}
              <a href="https://commons.wikimedia.org/wiki/File:Bales_of_PET_bottles_closeup.jpg">CC BY-SA 4.0</a>, all via
              Wikimedia Commons; “Rays of sun”, <a href="https://www.rawpixel.com/image/5939726/rays-sun">CC0</a>, via
              rawpixel.
            </>
          )}
        </p>
      </section>

      <Motion />
      <InView />
    </>
  );
}
