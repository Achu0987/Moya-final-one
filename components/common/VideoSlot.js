'use client';

import { useEffect, useRef, useState } from 'react';
import { FilmSlate } from '@phosphor-icons/react/dist/ssr';

// The MP4 explainer, lazy-loaded (CLAUDE.md): the file is only requested once the slot is near the screen.
// Until the approved cut exists (`src` empty), it shows a clearly marked placeholder instead.
export default function VideoSlot({ src, poster, title }) {
  const box = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!src || !box.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [src]);

  if (!src) {
    return (
      <div className="video-slot is-placeholder" ref={box}>
        <FilmSlate size={44} aria-hidden="true" />
        <p className="video-slot-title">{title}</p>
        <p className="video-slot-note">The explainer film plays here once the final cut is approved.</p>
      </div>
    );
  }

  return (
    <div className="video-slot" ref={box}>
      <video
        controls
        playsInline
        preload="none"
        poster={poster || undefined}
        src={near ? src : undefined}
        aria-label={title}
      />
    </div>
  );
}
