// Every client fact that is not yet confirmed lives here, so it can be found and replaced in one place.

// PLACEHOLDER: contact email. Replace with the address the client confirms.
export const CONTACT_EMAIL = 'hello@example.com';

// PLACEHOLDER: contact phone. Not shown until the client confirms a number.
export const CONTACT_PHONE = null;

// PLACEHOLDER: WhatsApp number, digits only with country code (for example 91XXXXXXXXXX).
// Empty until the client confirms it; the button then points to the contact section.
export const WHATSAPP_NUMBER = '';

// PLACEHOLDER: registered company name for the legal line.
export const LEGAL_NAME = 'Moya One';

export const BUILDER_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Moya One for our project',
)}&body=${encodeURIComponent('Project name:\nCity:\nNumber of flats:\nConstruction stage:\n')}`;

// Links work from every page. `section` marks the home-page section that lights the link while you scroll home.
// PLACEHOLDER: "Your water" points to the home section until /b2c/water-quality exists.
export const NAV_LINKS = [
  { href: '/', label: 'Home', section: 'top' },
  { href: '/b2c/how-it-works', label: 'How it works' },
  { href: '/#water', label: 'Your water', section: 'water' },
  { href: '/b2b/builders', label: 'For builders', section: 'builders' },
];

// SAMPLE: recharge packs and balance are illustrative. Litres only, no prices (CLAUDE.md non-negotiable 1).
export const SAMPLE_BALANCE_L = 120;
export const SAMPLE_PACKS_L = [250, 500, 1000];

// PLACEHOLDER: the MP4 explainer for the builders page (tracker F3, F4). Empty until the approved cut is delivered;
// the page then shows a marked placeholder in its place.
export const BUILDER_VIDEO = { src: '', poster: '' };
