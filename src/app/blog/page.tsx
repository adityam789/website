import Reveal from '../../components/Reveal';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Blog — Aditya Maheshwari',
    description: 'Writing on software engineering, AI, and life.',
};

const POSTS = [
    { title: 'How I automated 30,000 investigator hours with a single pipeline', tag: 'Tech' },
    { title: 'Building LLM agents that actually work in production', tag: 'Tech' },
    { title: 'Cloud migration lessons: moving compliance infra to GCP', tag: 'Tech' },
    { title: 'Deep learning from scratch: what you learn when you can\'t use Keras', tag: 'Tech' },
    { title: 'On cooking without recipes (and coding without documentation)', tag: 'Life' },
    { title: 'What trail running teaches you about system design', tag: 'Life' },
    { title: 'Solo travel as a software engineer: what I\'d build differently', tag: 'Life' },
    { title: 'The discipline of finishing things', tag: 'Life' },
];

export default function BlogPage() {
    return (
        <div className="section">
            <div className="container">
                <Reveal>
                    <div className={styles.pageHeader}>
                        <Link href="/" className={styles.back}>← home</Link>
                        <h1 className={`display ${styles.pageTitle}`}>Writing</h1>
                        <p className={styles.pageDesc}>
                            Notes on software, systems, and the long way round.
                        </p>
                    </div>
                </Reveal>

                {/* Filter pills (visual only at this stage) */}
                <Reveal delay={80}>
                    <div className={styles.filters}>
                        <button className={`${styles.filter} ${styles.filterActive}`}>All</button>
                        <button className={styles.filter}>Tech</button>
                        <button className={styles.filter}>Life</button>
                    </div>
                </Reveal>

                <div style={{ marginTop: '1.5rem' }}>
                    {POSTS.map((p, i) => (
                        <Reveal key={p.title} delay={i * 55}>
                            <div className="blog-row">
                                <span className="blog-num mono">{String(i + 1).padStart(2, '0')}</span>
                                <span className="blog-title">{p.title}</span>
                                <div className="blog-meta">
                                    <span className={`tag ${p.tag === 'Life' ? styles.tagLife : ''}`}>{p.tag}</span>
                                    <span className="badge-soon">coming soon</span>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
