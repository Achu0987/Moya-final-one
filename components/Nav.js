'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CaretDown, Funnel, List, Package, Scales, X } from '@phosphor-icons/react/dist/ssr';
import { ALL_PAGES, CONTACT_LINK, NAV_LINKS } from '@/lib/content';

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

// an icon for each comparison in the Compare menu
const MENU_ICONS = { '/compare': Scales, '/compare/bottled-water': Package, '/compare/ro-filters': Funnel };

export default function Nav() {
  const [open, setOpen] = useState(false); // phone menu
  const [menu, setMenu] = useState(false); // Compare menu
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const compareRef = useRef(null);
  const closeTimer = useRef(null);

  // on a mouse or trackpad the Compare menu opens on hover; a short delay stops it flickering shut
  const hoverOpen = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const hoverClose = (e) => {
    if (e.pointerType !== 'mouse') return;
    closeTimer.current = setTimeout(() => setMenu(false), 160);
  };

  // Escape closes either menu; a click outside closes the Compare menu
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setMenu(false);
    };
    const onClick = (e) => compareRef.current && !compareRef.current.contains(e.target) && setMenu(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // the bar tightens once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCurrent = (l) => (l.children ? pathname.startsWith(l.href) : l.href === pathname);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="/" className="nav-mark" aria-label="Moya One, home">
          <Mark />
          <span>Moya One</span>
        </a>
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV_LINKS.map((l) =>
              l.children ? (
                <li
                  key={l.href}
                  className="nav-compare"
                  ref={compareRef}
                  onPointerEnter={hoverOpen}
                  onPointerLeave={hoverClose}
                >
                  <button
                    type="button"
                    className="nav-menu-button"
                    aria-expanded={menu}
                    aria-controls="compare-menu"
                    aria-current={isCurrent(l) ? 'page' : undefined}
                    onClick={() => setMenu((m) => !m)}
                  >
                    {l.label}
                    <CaretDown size={16} aria-hidden="true" />
                  </button>
                  <ul id="compare-menu" className="nav-menu" hidden={!menu}>
                    {l.children.map((c) => {
                      const Icon = MENU_ICONS[c.href];
                      return (
                        <li key={c.href}>
                          <a href={c.href} aria-current={c.href === pathname ? 'page' : undefined}>
                            <span className="nav-menu-icon">
                              <Icon size={22} aria-hidden="true" />
                            </span>
                            <span className="nav-menu-text">
                              <strong>{c.label}</strong>
                              <span>{c.note}</span>
                            </span>
                            <ArrowRight className="nav-menu-arrow" size={18} aria-hidden="true" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ) : (
                <li key={l.href}>
                  <a href={l.href} aria-current={isCurrent(l) ? 'page' : undefined}>
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
        <a href={CONTACT_LINK.href} className="nav-cta" aria-current={pathname === CONTACT_LINK.href ? 'page' : undefined}>
          {CONTACT_LINK.label}
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
        <ol>
          {ALL_PAGES.map((l) => (
            <li key={l.href + l.label}>
              <a href={l.href} aria-current={l.href === pathname ? 'page' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
