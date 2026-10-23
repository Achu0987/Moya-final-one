# Moya One website

Homepage for Moya One: drinking water on tap in every flat of a residential tower, recharged in litres from a phone.

## Run it

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Stop `npm run dev` before running `npm run build`: both write to `.next/`, and the dev server serves broken styles afterwards until it is restarted.

## Stack

Next.js (App Router, JavaScript), GSAP with ScrollTrigger, Phosphor icons. Reason: the team's existing setup, static pre-rendering for every page, and GSAP loaded only after the page is visible.

- Fonts: Plus Jakarta Sans and Inter through `next/font`, downloaded at build time and served from this site.
- Lenis is not used: it broke programmatic and anchor scrolling in testing, and DESIGN.md allows it only if native scroll is unaffected.
- Initial JavaScript is about 175 KB gzip, above the 100 KB target in CLAUDE.md. About 160 KB of that is the Next.js and React runtime; the page's own code is about 10 KB, and GSAP loads after first paint.

## Where things are

| Path | What |
| --- | --- |
| `app/globals.css` | Tokens from DESIGN.md (colour, type scale, spacing), buttons, sample label, focus |
| `app/home.css` | Homepage sections |
| `components/` | One file per section; `Jug.js` is the one 20-litre jug drawing; `Motion.js` is the whole motion layer |
| `public/illustrations/jug.svg` | The jug as a standalone file |
| `lib/content.js` | Contact details, nav and sample recharge data |

## Before launch

Search the code for `PLACEHOLDER:` and `SAMPLE` to find everything that must be replaced: contact email, phone, legal company name, logo, and the sample recharge figures.
