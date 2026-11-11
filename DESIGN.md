# Moya One: design system

Owner: Vinayak (design). Read this before writing any CSS, SVG or copy.

Every change must pass the design audit in CLAUDE.md, using the taste skill, the impeccable skill and section 12 below.

## 1. Design intent

Moya One must look premium and feel effortless. Two words govern every choice:

- **Convenience:** a visitor understands the offer in five seconds and every action is obvious.
- **Luxury:** restraint, space, precise type and quiet motion. It should feel like a well-made product, not a utility.

The client's words: "not looking luxurious", "a sign of a brand", "like a Mercedes, not a Maruti". The site is the first impression of a new brand, and it has to earn trust with builders and families.

Rule of thumb: if a decoration does not make the offer clearer or the brand more credible, remove it.

## 2. Colour (client brand book, Edition 1, November 2026)

Source: MoyaOne_Brand_Book_Final.pdf, pages 12 to 15. Colour is flat, with no gradients. Navy leads.

| Brand colour | Hex | Use | Site token |
|---|---|---|---|
| Deep navy | #0B1626 | Primary background, text, headings, logo | `--navy` (role `--ink`) |
| White | #FFFFFF | Page ground, text on dark fields | `--white` (role `--base`) |
| Royal blue | #0450F5 | Brand accent: colour fields, links on white | `--royal` |
| Sky blue | #2F9FE7 | Buttons, links on navy, highlights | `--sky` |
| Mist | #EEF2F7 | Light panels and cards | `--mist` (role `--grey`) |
| Steel | #8792A3 | Secondary text on navy, dividers | `--steel` (role `--on-ink-muted`) |
| Slate | #4B5768 | Secondary text on white | `--slate` (role `--muted`) |

Derived tints (from the palette, not new hues): `--highlight` and `--water` are sky blue at 30% on white (the pale sky
marker and water in drawings); `--line` is steel at 28% on white; `--ink-raised` is a tone step on navy.

Rules (brand book p.13):
- Navy field: white text, sky blue actions and links. White field: navy text, royal blue links, sky buttons with navy text.
  Royal blue field: white text, navy buttons. Mist panel: navy text, slate secondary text.
- Sky blue never carries white text and is never used for text on white.
- One primary (sky blue) button per view.
- Icons: navy on white, white on navy.
- The brand palette has no green. The client's request for a green contact section was met with the royal blue field.

## 3. Typography (brand book p.14)

**League Spartan** (headings, the font of the logo) and **Outfit** (body, interface, captions). Both from Google Fonts,
self-hosted in the build by next/font. Sentence case, left aligned, headlines on two lines at most.

| Role | Desktop size / line height | Weight | Tracking | Phone |
|---|---|---|---|---|
| Display | 72 / 1.0 | 700 | -0.01em | 44 |
| Heading 1 | 48 / 1.05 | 700 | -0.01em | 36 |
| Heading 2 | 32 / 1.15 | 700 | 0 | 28 |
| Heading 3 | 22 / 1.25 | 600 | 0 | 20 |
| Body large | 20 / 1.55 | 400 | 0 | 18 |
| Body | 17 / 1.6 | 400 | 0 | 17 |
| Caption | 13 / 1.4 | 500 | 0.02em | 13 |

The logo is used only from the master artwork in `public/brand/` (white on navy in the header, footer and opening
screen). It is never retyped, recoloured, rotated or given effects (brand book p.11). The name is written MoyaOne, one word.

## 4. Layout and space

- Container: max 1200px, 16px side gutter on mobile, 48px on desktop.
- Section padding: 120px desktop, 72px mobile. Generous space is part of the luxury.
- Grid: 12 columns desktop, 4 columns mobile.
- Corners: 20px on cards, 999px on buttons and pills. No mixed radii inside one component.
- Dividers: 1px `--line`. No drop shadows heavier than `0 20px 40px -28px rgba(17,24,39,.25)`.

## 5. Iconography

- One icon family: **Phosphor**, Bold weight only (closest to the brand book's 2px stroke, p.16). Do not mix weights. The brand book's own 14-icon set replaces it once the files arrive.
- Icon size 24px in text, 44px in feature cards. Stroke 1.5px at 24px.
- Navy icons on light backgrounds, white on dark (brand book p.16). No filled icons except status dots.
- No emoji anywhere on the site. No cartoon characters.
- Custom icons (control unit, dustbin, jug) must match the same stroke weight and corner radius.

## 6. Illustration

The current bottle drawing reads as a battery. Fix it using the proportions in CLAUDE.md before anything else visual.

Style: flat with one soft shade. Clean geometry. No cartoon faces, no thick outlines, no gradients heavier than one tone.

Rules by element:
- **20-litre jug:** wide body, height about 1.4x width, rounded shoulder, short neck, generic orange cap, pale water inside. Same drawing everywhere.
- **Stick figure (hero):** thin ink line, 2px stroke, no face. Orange only on the jug it holds. One figure only.
- **Dustbin:** simple outline shape, Moya One logo and water-line mark in orange and ink. Branded, not decorative.
- **Building and pipe:** orange pipe, ink building outline, white flats, yellow LEDs only.
- **Control room (basement):** isometric, clean, basic. Panel with a small screen, two gauges, status LEDs, a manifold. No part numbers, no labels that reveal the technology.

## 7. Motion

Motion explains the product. It should feel slow and precise.

- Easing: `cubic-bezier(.3, 0, .3, 1)` for entrances, `cubic-bezier(.4, 0, .2, 1)` for fills.
- Durations: 0.6 to 0.9s for reveals, 1.2 to 2.4s for pours and fills, never over 3s for any single step.
- Text reveals: by line or word. No fade-in on everything.
- Pinned sections: maximum one pinned sequence per screen. Scroll length should feel light on a phone.
- Reduced motion: everything shows in its final state. No looping animations.
- Lenis smooth scroll only if it does not break native scroll on mobile. Test on a real phone.

## 8. Components

- **Primary button:** orange fill, white text, pill, 14px 26px padding, magnetic hover allowed on desktop only.
- **Secondary button:** ink outline, transparent fill.
- **Card:** white on base, 20px radius, 1px line border, 28px to 36px padding.
- **Pill (status):** small, uppercase label only for "Good", "Standard", "Sample".
- **Sample label:** every illustrative number carries a grey "Sample data" pill.
- **Table (comparison):** sticky header, qualitative labels in pills, Moya One column tinted `#FFF7ED`.
- **Nav:** sticky, blurred base background, links shrink to four items on mobile (or hide behind a menu).

## 9. Voice and copy

- Plain, confident, short. Sentences under 20 words where possible.
- Speak to the resident as "you". Speak to the builder as "your project".
- Lead with the benefit, then the mechanism.
- No jargon: no "centralised RO", no technical acronyms except TDS and pH in the app panel.
- No superlatives ("best", "world-class", "revolutionary") unless the client has evidence.

## 10. Accessibility

- Contrast: body text at least 4.5:1 on its background. Check yellow highlights and orange buttons with white text (orange `#F97316` with white is below 4.5:1; use ink text on orange, or darken the button to `#EA580C` for body-size text).
- Focus ring: 3px orange outline, 3px offset.
- Tap targets: at least 44px.
- Images and SVG: `role="img"` with a clear label. Decorative SVG gets `aria-hidden`.

## 11. Open design decisions

| ID | Decision | Owner | Status |
|---|---|---|---|
| DD1 | Keep Plus Jakarta Sans and Inter, or move to an editorial display face | Vinayak | Open (test at 1440px) |
| DD2 | Client's logo and colour preference | Omar (client) | Waiting |
| DD3 | Hero illustration style: stick figure and dustbin, approved? | Rayansh | Open |
| DD4 | Builders section: dark ink or light base | Vinayak | Open |
| DD5 | Are 4 to 5 logo variations from client usable, or do we draw our own | Rayansh | Open |

## 12. Design audit checklist (fallback until the impeccable skill is installed)

Run this after every change. Every item must pass.

- [ ] Only the colour tokens in section 2 are used. No other colours.
- [ ] Fonts: only the families in section 3. Type sizes match the scale.
- [ ] Headlines are sentence case, two lines at most, and say something specific.
- [ ] One icon family, one weight, one stroke width.
- [ ] No emoji. No cartoon faces. No stock-looking imagery.
- [ ] Section padding follows section 4. Nothing feels cramped.
- [ ] Corner radii follow section 4. Nothing mixes radii within a component.
- [ ] Layouts use a grid. Not everything is centred.
- [ ] No generic gradients, glows or decorative blobs.
- [ ] One orange action per viewport.
- [ ] Every animation explains something about the product. Nothing loops without a reason.
- [ ] Copy has no template phrases ("seamless", "unlock", "empower", "revolutionary").
- [ ] Checked at 390px and 1440px. No horizontal scroll.
- [ ] Reduced motion shows the final state.
