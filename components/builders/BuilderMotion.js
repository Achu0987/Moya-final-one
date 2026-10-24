'use client';

import { useEffect } from 'react';

// The builders page's motion: marks each [data-in] block with .is-in the first time it comes into view (the CSS
// then plays that block's own sequence), and drifts the crane band slowly against the scroll.
// Reduced motion: every block is marked at once, so the CSS shows the finished state, and nothing drifts.
export default function BuilderMotion() {
  useEffect(() => {
    const blocks = [...document.querySelectorAll('[data-in]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      blocks.forEach((b) => b.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { threshold: 0.25 },
    );
    blocks.forEach((b) => io.observe(b));

    // the crane band drifts against the scroll, the cranes seeming further away than the page
    const band = document.querySelector('.bx-band');
    const img = band?.querySelector('img');
    let raf = 0;
    const drift = () => {
      raf = 0;
      const r = band.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1 to 1 across the screen
      img.style.transform = `translate3d(0, ${(p * -9).toFixed(2)}%, 0)`;
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(drift));
    if (img) {
      drift();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return null;
}
