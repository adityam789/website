'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { NAV_LINKS } from '../data/site';
import styles from './Nav.module.css';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle dark mode"
    >
      <div className={`${styles.knob} ${theme === 'dark' ? styles.knobDark : ''}`} />
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDmp = pathname === '/dmp';
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="Main">
      <div className="container-wide nav-inner">
        <Link href="/" className={styles.logo} aria-label="Home">
          AM<span className={styles.logoDot}>.</span>
        </Link>

        {isDmp ? (
          <ThemeToggle />
        ) : (
          <>
            <div className={styles.links}>
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${styles.link} ${isActive(l.href) ? styles.active : ''}`}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                >
                  {l.label}
                </Link>
              ))}
              <button
                className="cmdk-trigger"
                onClick={() => window.dispatchEvent(new Event('cmdk:open'))}
                aria-label="Open command menu"
              >
                search <kbd>⌘K</kbd>
              </button>
              <ThemeToggle />
            </div>

            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(m => !m)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
              <span className={`${styles.bar} ${styles.barMid} ${menuOpen ? styles.barHide : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            </button>
          </>
        )}
      </div>

      {menuOpen && !isDmp && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}><ThemeToggle /></div>
        </div>
      )}
    </nav>
  );
}
