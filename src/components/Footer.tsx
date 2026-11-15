'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { site, CURRENT_YEAR } from '../data/site';
import styles from './Footer.module.css';

const timeNow = () =>
  new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
const tick = (l: () => void) => {
  const id = setInterval(l, 15000);
  return () => clearInterval(id);
};

/** Live local time where I am; empty on the server so hydration matches. */
function LocalTime() {
  const time = useSyncExternalStore(tick, timeNow, () => '');
  return <span className="local-time">{site.location} · {time || '—'}</span>;
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/dmp') return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.left}>
          © {CURRENT_YEAR} {site.name}. built with craft (and too much coffee).
          <LocalTime />
        </p>
        <div className={styles.links}>
          <a href={site.github.url} target="_blank" rel="noopener noreferrer">github</a>
          <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer">linkedin</a>
          <a href={`mailto:${site.email}`}>email</a>
          <a href="/feed.xml">rss</a>
        </div>
      </div>
    </footer>
  );
}
