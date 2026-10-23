import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Words from './common/Words';
import { CONTACT_EMAIL } from '@/lib/content';

export default function Close() {
  return (
    <section className="closing" id="contact" aria-labelledby="close-title">
      <div className="container closing-inner">
        <h2 id="close-title" data-reveal="words">
          <Words>Leave the jugs behind.</Words>
        </h2>
        <p data-reveal="fade">
          Moya One is installed while a tower is built. Ask your builder about it, or write to us.
        </p>
        {/* PLACEHOLDER: contact email, see lib/content.js */}
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary" data-reveal="fade">
          Write to us
          <ArrowRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
