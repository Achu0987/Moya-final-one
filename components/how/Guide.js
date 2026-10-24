'use client';

import { useState } from 'react';

// The picture on the opening door: water poured into a glass, the end of the journey the film tells.
// PLACEHOLDER: photo by KOBU Agency on Unsplash (Unsplash License, free for commercial use),
// https://unsplash.com/photos/TWIRIAizZFU. Replace with a client-approved photograph before launch.
export default function Guide({ className }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src="/how/guide.webp" alt="" loading="eager" decoding="async" onError={() => setOk(false)} />
  );
}
