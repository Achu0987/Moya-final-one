'use client';

import { useEffect } from 'react';

// The motion layer. Everything renders in its final state first; this only replays it.
// With reduced motion nothing here runs, so the visitor sees the finished page (DESIGN.md section 7).
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        reveals(gsap);
        monument(gsap);
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}

// Section parts enter once: heading words, then text, then the picture.
function reveals(gsap) {
  gsap.utils.toArray('[data-reveal="words"]').forEach((h) => {
    gsap.from(h.querySelectorAll('.w > span'), {
      yPercent: 110,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.15,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  const panels = gsap.utils.toArray('[data-reveal="card"]');
  if (panels.length) {
    gsap.from(panels, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: panels[0], start: 'top 85%', once: true },
    });
  }

  const slip = document.querySelector('[data-reveal="phone"]');
  if (slip) {
    gsap.from(slip, {
      yPercent: 12,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: slip, start: 'top 85%', once: true },
    });
  }
}

// The name is heavy: it grows into place as the footer arrives.
function monument(gsap) {
  gsap.from('.footer-mark', {
    scale: 0.94,
    transformOrigin: '50% 100%',
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
