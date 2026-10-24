import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

// PLACEHOLDER: a holding page for a route in the header that is not built yet.
// Each one is replaced by the real page, in the agreed build order.
export default function Holding({ title, text }) {
  return (
    <section className="holding" aria-labelledby="holding-title">
      <div className="container holding-inner">
        <h1 id="holding-title">{title}</h1>
        <p>{text}</p>
        <p className="holding-note">This page is being built.</p>
        <div className="holding-actions">
          <a href="/b2c/how-it-works" className="btn btn-primary">
            See how it works
            <ArrowRight size={20} aria-hidden="true" />
          </a>
          <a href="/" className="text-link">
            Back to home
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
