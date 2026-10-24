'use client';

import { useEffect, useRef, useState } from 'react';

// A count that runs up or down to its new value instead of jumping (reduced motion: it jumps).
export default function useCount(to) {
  const [shown, setShown] = useState(to);
  const from = useRef(to);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(to);
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 500);
      const v = Math.round(start + (to - start) * (1 - Math.pow(1 - p, 3)));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return shown;
}
