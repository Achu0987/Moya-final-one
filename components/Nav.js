'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CaretDown, Funnel, List, Package, Scales, X } from '@phosphor-icons/react/dist/ssr';
import { ALL_PAGES, CONTACT_LINK, NAV_LINKS } from '@/lib/content';


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
        {/* the approved logo, navy on white (brand book p.9: for light backgrounds), from the master artwork, never retyped */}
        <a href="/" className="nav-mark">
          <img className="nav-logo" src="/brand/moyaone-logo-navy.svg" alt="MoyaOne, home" width="1262" height="575" />
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
                    <CaretDown weight="bold" size={16} aria-hidden="true" />
                  </button>
                  <ul id="compare-menu" className="nav-menu" hidden={!menu}>
                    {l.children.map((c) => {
                      const Icon = MENU_ICONS[c.href];
                      return (
                        <li key={c.href}>
                          <a href={c.href} aria-current={c.href === pathname ? 'page' : undefined}>
                            <span className="nav-menu-icon">
                              <Icon weight="bold" size={22} aria-hidden="true" />
                            </span>
                            <span className="nav-menu-text">
                              <strong>{c.label}</strong>
                              <span>{c.note}</span>
                            </span>
                            <ArrowRight weight="bold" className="nav-menu-arrow" size={18} aria-hidden="true" />
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
          <ArrowUpRight weight="bold" size={18} aria-hidden="true" />
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X weight="bold" size={24} aria-hidden="true" /> : <List weight="bold" size={24} aria-hidden="true" />}
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
