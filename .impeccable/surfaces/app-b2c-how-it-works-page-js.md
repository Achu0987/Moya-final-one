---
version: 1
slug: "app-b2c-how-it-works-page-js"
primary_target: "app/b2c/how-it-works/page.js"
related_targets: []
---

# How it works (/b2c/how-it-works)

Mode: Persuade (explanatory). Audience: a resident who wants to understand the system before trusting it (PAGE_BRIEFS.md #2).
Leave with: one line to the flat, a control unit in the kitchen, recharging from a phone. Main action per brief: check water quality; /b2c/water-quality is not built yet, so the page offers the sample recharge on home and contact (PLACEHOLDER until the page exists).
Constraints: no part names, no inner workings of the unit, no unverified claims (Claims tab), numbers labelled sample. Inherits the home world (DESIGN.md tokens, 3D scenes in lib/three and components/*Scene.js).

## Direction contract

THESIS: The resident follows one glass of water backwards to its source, in five calm steps, while a single 3D stage shows each step happen. Refuses the stock icon-row "how it works" with numbered circles and arrows.
OWN-WORLD: Base ground and ink type as home; the 3D stage sits on the dark ink showroom card used by the home hero; orange is the line itself; step numbers in small ink discs, the same as the home step cards.
STORY: plant room -> riser to the flat -> Moya1(TM) control unit -> recharge in the app -> pour a glass -> try a sample recharge / talk to us.
FIRST VIEWPORT: H1 "From the building to your glass." with one sentence on the left; the dark stage on the right already showing the plant room machinery; step 1 text begins below the lede.
FORM: scrollytelling, text column scrolls past one sticky 3D stage (DESIGN.md: one pinned sequence per screen); stage swaps tower -> kitchen at step 3. seed: none (unavailable; surface roll not run, structure fixed by the brief). Signature interaction: scrolling drives the camera through the real system.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
