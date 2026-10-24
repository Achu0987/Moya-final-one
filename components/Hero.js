import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import KitchenScene from './KitchenScene';
import Facts from './common/Facts';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* a pale water surface behind the hero: slow ripple lines drifting across */}
      <svg className="hero-water" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
        {[90, 190, 300, 420, 530].map((y, i) => (
          <path
            key={y}
            className="hero-ripple"
            style={{ animationDuration: `${26 + i * 6}s`, animationDelay: `${-i * 5}s` }}
            d={`M-1440 ${y} ${Array.from({ length: 12 }, (_, k) => `q120 ${k % 2 ? 14 : -14} 240 0`).join(" ")}`}
          />
        ))}
      </svg>
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            Drinking water,
            <br /> on tap at home.
          </h1>
          {/* PLACEHOLDER: "no filter to look after" comes from CLIENT_CONTEXT.md, not the Claims tab. Add it there as OK before launch. */}
          <p className="hero-lede">
            Moya One brings drinking water to every flat in your tower on its own line. No jugs to carry, no filter to
            look after. You recharge litres from your phone, like a <span className="marker">mobile plan</span>.
          </p>
          <div className="hero-actions">
            <a href="/b2c/how-it-works" className="btn btn-primary">
              See how it works
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/b2b/builders" className="text-link">
              For builders
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
          {/* PLACEHOLDER: follows from "installed during construction, through the builder"; confirm wording with Rayansh (Claims tab). */}
          <p className="hero-note">Available only in towers that build it in.</p>
        </div>

        <figure className="hero-visual">
          <KitchenScene />
          <figcaption>Illustration. Sample data on the phone.</figcaption>
        </figure>
      </div>

      <div className="container">
        <Facts />
      </div>
    </section>
  );
}
