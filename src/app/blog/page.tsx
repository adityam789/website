import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '../../components/Reveal';
import BlogList from '../../components/blog/BlogList';
import { formatDate, getAllPosts } from '../../lib/blog';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog — Aditya Maheshwari',
  description: 'Writing on software engineering, AI, and life.',
};

export default function BlogPage() {
  const posts = getAllPosts().map(p => ({ ...p, dateLabel: formatDate(p.date) }));
  return (
    <div className="section">
      <div className="container">
        <Reveal>
          <div className={styles.pageHeader}>
            <Link href="/" className={styles.back}>← home</Link>
            <h1 className={`display ${styles.pageTitle}`}>Writing</h1>
            <p className={styles.pageDesc}>
              Notes on software, systems, and the long way round. Also available as <a href="/feed.xml" className="inline-link">RSS</a>.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}><BlogList posts={posts} /></Reveal>
      </div>
    </div>
  );
}
