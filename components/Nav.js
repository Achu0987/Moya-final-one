'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, List, X } from '@phosphor-icons/react/dist/ssr';
import { NAV_LINKS } from '@/lib/content';

// PLACEHOLDER: brand mark and wordmark until the client's approved logo arrives (DESIGN.md DD2, DD5).
// The mark is a drop carrying the water line from the brand drawings.
function Mark() {
  return (
    <svg className="nav-logo" viewBox="0 0 28 32" aria-hidden="true">
      <path d="M14 1.5C14 1.5 3 13.6 3 20.2a11 11 0 0 0 22 0C25 13.6 14 1.5 14 1.5z" fill="var(--ink)" />
      <path d="M7.5 21q1.6-2 3.25 0t3.25 0t3.25 0t3.25 0" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [section, setSection] = useState('top');

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // the bar tightens once the page moves; on the home page the link for the section in view is marked
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    let io;
    if (pathname === '/') {
      const ids = new Set(NAV_LINKS.map((l) => l.section).filter(Boolean));
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && ids.has(e.target.id) && setSection(e.target.id)),
        { rootMargin: '-45% 0px -50% 0px' },
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  const isCurrent = (l) => (pathname === '/' ? l.section === section : l.href === pathname);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="/" className="nav-mark" aria-label="Moya One, home">
          <Mark />
          <span>Moya One</span>
        </a>
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={isCurrent(l) ? 'page' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/#contact" className="nav-cta">
          Contact
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      <div id="mobile-menu" className="nav-sheet" hidden={!open}>
        <ul>
          {[...NAV_LINKS, { href: '/#contact', label: 'Contact' }].map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
