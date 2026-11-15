'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PostMeta } from '../../lib/blog';

const FILTERS = ['All', 'Tech', 'Life'] as const;

/** Post list with working tag filters. Dates are pre-formatted on the server. */
export default function BlogList({ posts }: { posts: (PostMeta & { dateLabel: string })[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const shown = filter === 'All' ? posts : posts.filter(p => p.tag === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter posts">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter ${filter === f ? 'filter-active' : ''}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {shown.length === 0 && <p className="empty-note">No {filter.toLowerCase()} posts yet. They’re coming.</p>}
        {shown.map((p, i) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-row">
            <span className="blog-num mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="blog-title">
              {p.title}
              <span className="blog-excerpt">{p.excerpt}</span>
            </span>
            <div className="blog-meta">
              <span className="tag">{p.tag}</span>
              <span className="blog-date">{p.dateLabel} · {p.readMinutes} min</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
