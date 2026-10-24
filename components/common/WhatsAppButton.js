'use client';

import { useEffect, useState } from 'react';
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { WHATSAPP_NUMBER } from '@/lib/content';

// Floating WhatsApp button, bottom-right. It pops in shortly after the page opens, waves once,
// and shows a "Chat with us" bubble for a few seconds (and again on hover or focus).
// Until the client confirms a number it points to the Contact page instead of WhatsApp.
export default function WhatsAppButton() {
  const [shown, setShown] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [away, setAway] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setShown(true), reduce ? 0 : 1200);
    const t2 = setTimeout(() => setBubble(true), reduce ? 0 : 2000);
    const t3 = setTimeout(() => setBubble(false), reduce ? 4000 : 6500);
    // step aside while the footer is on screen, so it never covers the footer's contact details
    const footer = document.querySelector('.footer');
    const io = footer && new IntersectionObserver(([e]) => setAway(e.isIntersecting), { threshold: 0.15 });
    if (footer) io.observe(footer);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      io?.disconnect();
    };
  }, []);

  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Moya One, I would like to know more.')}`
    : '/contact';

  return (
    <div className={`wa${shown ? ' is-shown' : ''}${bubble && !away ? ' has-bubble' : ''}${away ? ' is-away' : ''}`}>
      <span className="wa-bubble" aria-hidden="true">
        Chat with us
      </span>
      <a
        href={href}
        className="wa-button"
        aria-label="Chat with Moya One on WhatsApp"
        {...(WHATSAPP_NUMBER ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onMouseEnter={() => setBubble(true)}
        onMouseLeave={() => setBubble(false)}
        onFocus={() => setBubble(true)}
        onBlur={() => setBubble(false)}
      >
        <WhatsappLogo size={28} aria-hidden="true" />
      </a>
    </div>
  );
}
