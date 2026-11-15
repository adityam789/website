'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export interface PaletteItem {
  label: string;
  group: string;
  href?: string;
  action?: 'theme';
}

/** ⌘K / Ctrl+K command menu: jump to any page, post or case study, or run a quick action. */
export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const { toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const show = () => { setQuery(''); setIndex(0); setOpen(true); };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuery(''); setIndex(0); setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', show);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter(i => `${i.label} ${i.group}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  if (!open) return null;

  const run = (item?: PaletteItem) => {
    if (!item) return;
    setOpen(false);
    if (item.action === 'theme') toggle();
    else if (item.href?.startsWith('/') && !item.href.endsWith('.pdf')) router.push(item.href);
    else if (item.href) window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[index]); }
  };

  return (
    <div className="cmdk-backdrop" onClick={() => setOpen(false)}>
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          className="cmdk-input"
          autoFocus
          value={query}
          onChange={e => { setQuery(e.target.value); setIndex(0); }}
          placeholder="Jump to a page, post or case study…"
          aria-label="Search"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
        />
        <ul className="cmdk-list" id="cmdk-list" role="listbox">
          {results.length === 0 && <li className="cmdk-empty">Nothing matches “{query}”.</li>}
          {results.map((item, i) => (
            <li
              key={`${item.group}-${item.label}`}
              role="option"
              aria-selected={i === index}
              className={`cmdk-item ${i === index ? 'cmdk-item-active' : ''}`}
              ref={i === index ? el => { el?.scrollIntoView({ block: 'nearest' }); } : undefined}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(item)}
            >
              <span>{item.label}</span>
              <span className="cmdk-group">{item.group}</span>
            </li>
          ))}
        </ul>
        <div className="cmdk-foot"><kbd>↑↓</kbd> move <kbd>↵</kbd> open <kbd>esc</kbd> close</div>
      </div>
    </div>
  );
}
