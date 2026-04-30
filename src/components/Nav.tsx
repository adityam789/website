'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';
import styles from './Nav.module.css';

const NAV_LINKS = [
    { label: 'work', href: '/work' },
    { label: 'about', href: '/about' },
    { label: 'blog', href: '/blog' },
    { label: 'contact', href: '/contact' },
];

export default function Nav() {
    const { theme, toggle } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isDmp = mounted && pathname === '/dmp';

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>

                <Link href="/" className={styles.logo}>
                    AM<span className={styles.logoDot}>.</span>
                </Link>

                {isDmp ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            className={styles.toggle}
                            onClick={toggle}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            aria-label="Toggle dark mode"
                        >
                            <div className={`${styles.knob} ${theme === 'dark' ? styles.knobDark : ''}`} />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop links */}
                        <div className={styles.links}>
                            {NAV_LINKS.map(l => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
                                >
                                    {l.label}
                                </Link>
                            ))}

                            {/* Dark mode toggle */}
                            <button
                                className={styles.toggle}
                                onClick={toggle}
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                aria-label="Toggle dark mode"
                            >
                                <div className={`${styles.knob} ${theme === 'dark' ? styles.knobDark : ''}`} />
                            </button>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className={styles.hamburger}
                            onClick={() => setMenuOpen(m => !m)}
                            aria-label="Toggle menu"
                        >
                            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
                            <span className={`${styles.bar} ${styles.barMid} ${menuOpen ? styles.barHide : ''}`} />
                            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
                        </button>
                    </>
                )}
            </div>


            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {NAV_LINKS.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={styles.mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <button className={styles.toggle} onClick={toggle} style={{ marginTop: '1rem' }}>
                        <div className={`${styles.knob} ${theme === 'dark' ? styles.knobDark : ''}`} />
                    </button>
                </div>
            )}
        </nav>
    );
}
