'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react/dist/ssr';

// The Environment page opens on a forest with sunlight through the trees (client brief): a real photograph of sun
// rays in a forest, held for a slow push-in, dissolves into a short, quiet film of hill forest under mist. Muted, looping, plays inline. It rests while off screen, the visitor can pause it
// (WCAG 2.2.2: moving content longer than five seconds), and with reduced motion only the still frame shows.
export default function ForestFilm() {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (userPaused.current) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
      setPaused(false);
    } else {
      userPaused.current = true;
      v.pause();
      setPaused(true);
    }
  };

  return (
    <>
      {/* the opening shot: sun rays through a forest, then it dissolves into the film (CSS only, once) */}
      <img
        className="ev-film-open"
        src="/environment/sunlight-1920.webp"
        srcSet="/environment/sunlight-960.webp 960w, /environment/sunlight-1920.webp 1920w"
        sizes="100vw"
        width="1920"
        height="1280"
        alt=""
        fetchPriority="high"
      />
      <video
        ref={ref}
        className="ev-film-video"
        autoPlay={!still}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/environment/forest-poster.webp"
        aria-hidden="true"
      >
        <source src="/environment/forest.webm" type="video/webm" />
      </video>
      {!still && (
        <button type="button" className="ev-film-toggle" onClick={toggle} aria-pressed={paused}>
          {paused ? <Play weight="bold" size={18} aria-hidden="true" /> : <Pause weight="bold" size={18} aria-hidden="true" />}
          <span>{paused ? 'Play film' : 'Pause film'}</span>
        </button>
      )}
    </>
  );
}
