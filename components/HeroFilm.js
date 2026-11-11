'use client';

import { useEffect, useRef, useState } from 'react';

// The home page's kitchen card plays the recorded kitchen film (client request, Nov 11: the film replaces the live
// 3D scene in the same place). Muted, looping, plays inline. The film is recorded from the site's 3D kitchen
// with its chapter line and no pause pill (client: no "Pause film" text); the pour runs long and the loft and cupboards
// turn see-through with "100% space is free" (client change list). It rests while off screen, and with reduced
// motion only the still frame shows.
export default function HeroFilm() {
  const ref = useRef(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
    <video
      ref={ref}
      className="hero-film"
      autoPlay={!still}
      muted
      loop
      playsInline
      preload="metadata"
      poster="/home/kitchen-film-poster.webp"
      aria-label="A kitchen with the MoyaOne tap: the water line comes down to the tap, the litres are recharged on a phone, a glass is filled, and the loft and cupboards turn see-through to show they are empty: 100% space is free."
    >
      <source src="/home/kitchen-film.mp4" type="video/mp4" />
    </video>
    </>
  );
}
