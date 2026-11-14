'use client';

import { usePathname } from 'next/navigation';
import { site, CURRENT_YEAR } from '../data/site';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/dmp') return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.left}>
          © {CURRENT_YEAR} {site.name}. built with craft (and too much coffee).
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
