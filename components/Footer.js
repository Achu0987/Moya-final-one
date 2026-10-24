import { ArrowUp, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { ALL_PAGES, CONTACT_EMAIL, CONTACT_PHONE, LEGAL_NAME } from '@/lib/content';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* PLACEHOLDER: text wordmark until the client's approved logo arrives */}
            <p className="footer-name">Moya One</p>
            <p className="footer-about">
              Drinking water on tap in every flat. Built into residential towers in India, recharged from your phone.
            </p>
          </div>

          <nav aria-label="Footer" className="footer-col">
            <p className="footer-label">Explore</p>
            <ul>
              {ALL_PAGES.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <p className="footer-label">Write to us</p>
            {/* PLACEHOLDER: contact email, see lib/content.js */}
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer-email">
              {CONTACT_EMAIL}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            {CONTACT_PHONE && (
              <a href={`tel:${CONTACT_PHONE}`} className="footer-email">
                {CONTACT_PHONE}
              </a>
            )}
          </div>
        </div>

        <div className="footer-legal">
          {/* PLACEHOLDER: registered company name for the legal line */}
          <p>
            © {year} {LEGAL_NAME}. All rights reserved.
          </p>
          <a href="#main" className="footer-top">
            Back to top
            <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="footer-mark" aria-hidden="true">
        Moya One
      </p>
    </footer>
  );
}
