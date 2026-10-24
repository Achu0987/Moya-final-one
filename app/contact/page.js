import { ArrowRight, ArrowUpRight, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Words from '@/components/common/Words';
import Motion from '@/components/Motion';
import InView from '@/components/common/InView';
import ContactForm from '@/components/contact/ContactForm';
import NextSteps from '@/components/contact/NextSteps';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from '@/lib/content';
import './contact.css';

export const metadata = {
  title: 'Contact: Moya One',
  description:
    'Write to Moya One. Residents with a question about their tower, and builders planning drinking water into a project.',
};

export default function Contact() {
  const whatsapp =
    WHATSAPP_NUMBER &&
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Moya One, I would like to know more.')}`;

  return (
    <>
      {/* ---- the first screen: dark ink, as on the builders page; the form in a white card ---- */}
      <section className="ct-hero" aria-labelledby="ct-title">
        <div className="container ct-grid">
          <div className="ct-copy">
            <h1 id="ct-title" className="hero-title">
              Talk to us.
            </h1>
            {/* PLACEHOLDER: "reads every message and writes back" is not a response-time promise; Rayansh to confirm. */}
            <p className="hero-lede">
              Living in a tower, or building one? Tell us who you are and what you need. The Moya One team reads every
              message and writes back.
            </p>

            <div className="ct-direct">
              <p className="ct-direct-label">Or write to us directly</p>
              {/* PLACEHOLDER: contact email, see lib/content.js */}
              <a href={`mailto:${CONTACT_EMAIL}`} className="ct-direct-link">
                {CONTACT_EMAIL}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
              {CONTACT_PHONE && (
                <a href={`tel:${CONTACT_PHONE}`} className="ct-direct-link">
                  {CONTACT_PHONE}
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp} className="ct-direct-link" target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo size={20} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <NextSteps />

      {/* ---- not ready to write: the two pages that answer most questions ---- */}
      <section className="closing ct-close" aria-labelledby="ct-close-title">
        <div className="container closing-inner">
          <h2 id="ct-close-title" data-reveal="words">
            <Words>Not ready to write yet?</Words>
          </h2>
          <p data-reveal="fade">See how the water reaches the kitchen, or how Moya One goes into a tower during the build.</p>
          <div className="ct-close-actions" data-reveal="fade">
            <a href="/b2c/how-it-works" className="text-link">
              See how it works
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a href="/b2b/builders" className="text-link">
              For builders
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
