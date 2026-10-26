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

// The phase 1 Must pages, in the agreed build order. Compare holds its hub and the two comparisons;
// Contact is the header's action button. Pages not built yet show a holding page (components/common/Holding.js).
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/b2c/how-it-works', label: 'How it works' },
  { href: '/b2b/builders', label: 'Builders' },
  {
    href: '/compare',
    label: 'Compare',
    children: [
      { href: '/compare', label: 'Compare hub', note: 'All three options side by side' },
      { href: '/compare/bottled-water', label: 'Bottled water', note: 'The weekly jug routine' },
      { href: '/compare/ro-filters', label: 'RO filters', note: 'Servicing and space' },
    ],
  },
  { href: '/environment', label: 'Environment' },
];

export const CONTACT_LINK = { href: '/contact', label: 'Contact' };

// Every page in order, for the phone menu and the footer.
export const ALL_PAGES = [
  ...NAV_LINKS.flatMap((l) => (l.children ? l.children : [l])),
  CONTACT_LINK,
];

// SAMPLE: recharge packs and balance are illustrative. Litres only, no prices (CLAUDE.md non-negotiable 1).
export const SAMPLE_BALANCE_L = 120;
export const SAMPLE_PACKS_L = [250, 500, 1000];

// PLACEHOLDER: the MP4 explainer for the builders page (tracker F3, F4). Empty until the approved cut is delivered;
// the page then shows a marked placeholder in its place.
export const BUILDER_VIDEO = { src: '', poster: '' };
