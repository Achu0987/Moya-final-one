import { ArrowRight, Buildings, MapPin } from '@phosphor-icons/react/dist/ssr';
import TowerScene from '@/components/TowerScene';
import KitchenScene from '@/components/KitchenScene';
import VideoSlot from '@/components/common/VideoSlot';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import { BUILDER_MAILTO, BUILDER_VIDEO } from '@/lib/content';
import './builders.css';

export const metadata = {
  title: 'For builders: Moya One',
  description:
    'Plan drinking water into your tower at construction stage: a dedicated line to every flat, a Moya1 control unit and an extra tap in each kitchen, and no retrofit after handover.',
};

// What the system asks of a project. Every line restates CLAUDE.md and CLIENT_CONTEXT.md.
const ASKS = [
  { name: 'Installed during construction', text: 'The line is laid while the tower is built, through you. Nothing is added after handover.' },
  // PLACEHOLDER: "No retrofit" is a brief point, Claims tab "To confirm". Rayansh to mark OK before launch.
  { name: 'No retrofit', text: 'Residents move into a finished system. Nothing is opened up after they arrive.' },
  // PLACEHOLDER: "No lost space" is a brief point, Claims tab "To confirm". Rayansh to mark OK before launch.
  { name: 'No lost space in the flat', text: 'No jug corner and no filter box under the sink. One control unit on the wall and an extra tap.' },
  // PLACEHOLDER: "its own plant room" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
  { name: 'Its own plant room', text: 'The line starts in the tower’s own plant room below ground and rises to every flat.' },
];

// PLACEHOLDER: reference projects. Claims tab: "Deployed in India" and the Hyderabad community are "To confirm";
// no project is named until the developer gives written permission (PAGE_BRIEFS.md, Builders).
const REFERENCES = [
  { name: 'Residential community', place: 'India', status: 'To confirm' },
  { name: 'Residential tower', place: 'India', status: 'To confirm' },
];

export default function Builders() {
  return (
    <>
      {/* ---- the tower builds itself, the line rises with it ---- */}
      <section className="b-hero" aria-labelledby="b-hero-title">
        <div className="container b-hero-grid">
          <div className="b-hero-copy">
            <h1 id="b-hero-title" className="b-title">
              Drinking water,
              <br /> planned in.
            </h1>
            <p className="b-lede">
              Moya One goes into your project during construction, through you. Every flat gets its own line, a
              Moya1™ control unit and an extra tap in the kitchen.
            </p>
            <div className="b-actions">
              {/* PLACEHOLDER: enquiries go to the placeholder email until /contact and the client's address exist. */}
              <a href={BUILDER_MAILTO} className="btn btn-primary">
                Start an enquiry
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="/b2c/how-it-works" className="text-link b-link-light">
                How it works for residents
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="b-hero-visual">
            <TowerScene mode="construct" />
            <figcaption>3D illustration, not a real project. Drag to turn.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---- what it asks of the project ---- */}
      <section className="b-asks" aria-labelledby="b-asks-title">
        <div className="container b-asks-grid">
          <div className="b-asks-copy">
            <h2 id="b-asks-title" data-reveal="words">
              <Words>What it asks of your project.</Words>
            </h2>
            <dl className="b-ledger">
              {ASKS.map((a) => (
                <div key={a.name} className="b-ledger-row" data-reveal="fade">
                  <dt>{a.name}</dt>
                  <dd>{a.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="b-asks-visual">
            <KitchenScene stage={3} />
            <figcaption>All a flat gives up: one control unit and an extra tap. 3D illustration.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---- the explainer film ---- */}
      <section className="b-film" aria-labelledby="b-film-title">
        <div className="container b-film-grid">
          <div className="b-film-copy">
            <h2 id="b-film-title" data-reveal="words">
              <Words>The whole system, on film.</Words>
            </h2>
            <p data-reveal="fade">A short film follows the line from the plant room, up the tower, into the kitchen.</p>
          </div>
          <div className="b-film-slot" data-reveal="fade">
            <VideoSlot src={BUILDER_VIDEO.src} poster={BUILDER_VIDEO.poster} title="Moya One explainer film" />
          </div>
        </div>
      </section>

      {/* ---- reference projects, placeholders until approved ---- */}
      <section className="b-refs" aria-labelledby="b-refs-title">
        <div className="container b-refs-grid">
          <div className="b-refs-copy">
            <h2 id="b-refs-title" data-reveal="words">
              <Words>Where Moya One is going in.</Words>
            </h2>
            <p data-reveal="fade">
              Reference projects appear here once each developer has given written permission to be named.
            </p>
          </div>
          <ul className="b-refs-list">
            {REFERENCES.map((r, i) => (
              <li key={i} className="b-ref" data-reveal="fade">
                <Buildings size={44} aria-hidden="true" />
                <p className="b-ref-name">{r.name}</p>
                <p className="b-ref-place">
                  <MapPin size={20} aria-hidden="true" />
                  {r.place}
                </p>
                <span className="sample">{r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the enquiry ---- */}
      <section className="b-enquire" aria-labelledby="b-enquire-title">
        <div className="container b-enquire-grid">
          <h2 id="b-enquire-title" className="b-enquire-title" data-reveal="words">
            <Words>Plan it into your next tower.</Words>
          </h2>
          <div className="b-enquire-side" data-reveal="fade">
            <p>Tell us about your project and we will get back to you. It helps to include:</p>
            <ul>
              <li>Project name and city</li>
              <li>Number of flats</li>
              <li>Construction stage</li>
            </ul>
            <a href={BUILDER_MAILTO} className="btn btn-primary">
              Start an enquiry
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <Motion />
    </>
  );
}
