import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

// PLACEHOLDER: a holding page for a route in the header that is not built yet.
// Each one is replaced by the real page, in the agreed build order.
// `related` lists the neighbouring pages (for example the other comparisons), so a holding page is never a dead end.
export default function Holding({ title, text, related = [] }) {
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
        {related.length > 0 && (
          <nav className="holding-related" aria-label="Related pages">
            {related.map((r) => (
              <a key={r.href} href={r.href} className="text-link">
                {r.label}
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
