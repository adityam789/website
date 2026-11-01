'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const els = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    // Active = last heading whose top has crossed ~30% of the viewport.
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  const list = (
    <ol className={styles.list}>
      {items.map(i => (
        <li key={i.id} className={i.depth === 3 ? styles.sub : undefined}>
          <a
            href={`#${i.id}`}
            className={`${styles.link} ${active === i.id ? styles.active : ''}`}
            aria-current={active === i.id ? 'location' : undefined}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className={styles.sidebar} aria-label="Table of contents">
        <p className="label-caps">on this page</p>
        {list}
      </aside>

      {/* Mobile: collapsible */}
      <details className={styles.mobile}>
        <summary>on this page</summary>
        {list}
      </details>
    </>
  );
}
