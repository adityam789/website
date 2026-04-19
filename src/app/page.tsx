'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Reveal from '../components/Reveal';
import styles from './page.module.css';

/* ── Typewriter lines ── */
const LINES = [
  'Software Engineer. Builder. Perpetual learner.',
  'I write code that works and cook food that (mostly) does.',
  'Currently shipping at PayPal — open to what\'s next.',
  'Backend systems, AI tooling, and mountain trails.',
  'I debug production and mountain routes equally.',
];

function Typewriter() {
  const [text, setText] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const charRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);


  useEffect(() => {
    const tick = () => {
      const line = LINES[lineIdx];
      if (!deleting) {
        charRef.current++;
        setText(line.slice(0, charRef.current));
        if (charRef.current === line.length) {
          setDeleting(true);
          timeoutRef.current = setTimeout(tick, 2400);
          return;
        }
        timeoutRef.current = setTimeout(tick, 52);
      } else {
        charRef.current--;
        setText(line.slice(0, charRef.current));
        if (charRef.current === 0) {
          setDeleting(false);
          setLineIdx(i => (i + 1) % LINES.length);
          timeoutRef.current = setTimeout(tick, 450);
          return;
        }
        timeoutRef.current = setTimeout(tick, 26);
      }
    };
    timeoutRef.current = setTimeout(tick, 900);
    return () => clearTimeout(timeoutRef.current);
  }, [lineIdx, deleting]);

  return (
    <div className={styles.typewriter} aria-live="polite">
      {text}<span className="cursor" />
    </div>
  );
}

/* ── Projects ── */
const PROJECTS = [
  {
    name: 'Market Lens',
    desc: 'Multi-source financial intelligence with LLM-powered sentiment analysis',
    tags: ['Python', 'Claude', 'Grok', 'Google Sheets'],
    href: '#',
  },
  {
    name: 'Deep Learning From Scratch',
    desc: 'CNN, LSTM, and logistic regression — built without high-level libraries',
    tags: ['Python', 'TensorFlow', 'music21'],
    href: 'https://github.com/adityam789/Deep-Learning',
  },
  {
    name: 'CryptoSimulator',
    desc: 'Back-end crypto trading sim with real-time Coinbase data and 2FA auth',
    tags: ['Node.js', 'Express', 'MongoDB'],
    href: 'https://github.com/adityam789/crypto_transaction_api',
  },
];

/* ── Life cards ── */
const LIFE = [
  { emoji: '🏔', label: 'Hiking', sub: 'trails, peaks, summit sunrises', cls: 'lc-hike' },
  { emoji: '🏀', label: 'Basketball', sub: 'pickup games, courts anywhere', cls: 'lc-bball' },
  { emoji: '🍳', label: 'Cooking', sub: 'experimenting without a recipe', cls: 'lc-cook' },
  { emoji: '🚗', label: 'Cars & Driving', sub: 'winding roads, long drives', cls: 'lc-cars' },
  { emoji: '✈️', label: 'Travel', sub: 'new countries, no rigid itinerary', cls: 'lc-travel' },
];

/* ── Blog posts ── */
const TECH_POSTS = [
  'How I automated 30,000 investigator hours with a single pipeline',
  'Building LLM agents that actually work in production',
  'Cloud migration lessons: moving compliance infra to GCP',
  'Deep learning from scratch: what you learn when you can\'t use Keras',
];

const LIFE_POSTS = [
  'On cooking without recipes (and coding without documentation)',
  'What trail running teaches you about system design',
  'Solo travel as a software engineer: what I\'d build differently',
  'The discipline of finishing things',
];

export default function HomePage() {
  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className={styles.hero} id="home">
        <div className="container-wide">
          <div className={styles.heroGrid}>
            {/* Left Column: Intro */}
            <div className={styles.heroIntro}>
              <span className="available-badge">
                <span className="pulse-dot" />
                open to opportunities
              </span>

              <p className={`label-caps ${styles.eyebrow}`} style={{ marginTop: '1.5rem' }}>
                Software Engineer · San Jose, CA
              </p>

              <h1 className={`display ${styles.heroName}`}>
                <span>Aditya</span>
                <span>Maheshwari<span className={styles.nameDot}>.</span></span>
              </h1>

              <Typewriter />

              <div className={styles.cta}>
                <Link href="/work" className="btn-primary">view my work</Link>
                <a href="/resume.pdf" className="btn-secondary" download>download resume ↓</a>
              </div>
            </div>

            {/* Right Column: Terminal */}
            <div className="terminal-wrapper" style={{ width: '100%' }}>
              <div className="terminal" style={{ margin: '0', width: '100%' }}>
                <div className="terminal-bar">
                  <span className="dot dot-r" />
                  <span className="dot dot-y" />
                  <span className="dot dot-g" />
                  <span className="terminal-title">aditya.sh</span>
                </div>
                <div className="terminal-body">
                  <div><span className="t-prompt">~</span> <span className="t-cmd">whoami</span></div>
                  <div className="t-out">software engineer by day, trail chaser by weekend</div>
                  <div style={{ marginTop: '6px' }}><span className="t-prompt">~</span> <span className="t-cmd">cat beliefs.txt</span></div>
                  <div className="t-out"><span className="t-key">→</span> good code is like good prose — clear, not clever</div>
                  <div className="t-out"><span className="t-key">→</span> ship it, then sleep. in that order. usually.</div>
                  <div className="t-out"><span className="t-key">→</span> mountains fix most things. good food fixes the rest.</div>
                  <div style={{ marginTop: '6px' }}><span className="t-prompt">~</span> <span className="t-cmd">cat impact.txt</span></div>
                  <div className="t-out"><span className="t-accent">→</span> $160M fraud recovered annually</div>
                  <div className="t-out"><span className="t-accent">→</span> 10K+ AML cases automated per year</div>
                  <div className="t-out"><span className="t-accent">→</span> 25K+ subpoenas/yr, latency cut 55%</div>
                  <div style={{ marginTop: '6px' }}><span className="t-prompt">~</span> <span style={{ opacity: 0.3 }}>█</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <span className="hero-scroll">scroll</span>
        <span className="hero-num">01 / 05</span>
      </section>


      <div className="section-divider" />

      {/* ──────────── ABOUT ──────────── */}
      <section className={`section ${styles.about}`} id="about">
        <div className="container">

          <Reveal>
            <div className={styles.aboutGrid}>
              <div>
                <p className="label-caps" style={{ marginBottom: '1rem' }}>about</p>
                <p className={styles.bio}>
                  I build systems that handle money, protect people, and sometimes auto-file
                  regulatory reports to the government. By day I&apos;m a software engineer at PayPal;
                  by weekend I&apos;m chasing trails and cooking things that require more patience
                  than debugging.
                  <br /><br />
                  I care about clean architecture, honest writing, and not over-engineering things.
                </p>
              </div>

              <div className={styles.statsGrid}>
                {[
                  { num: '3+', label: 'years at PayPal' },
                  { num: '$160M', label: 'recovered annually' },
                  { num: '∞', label: 'tabs open' },
                  { num: '4', label: 'hobbies I\'m mediocre at' },
                ].map(s => (
                  <div className="stat-card" key={s.label}>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ──────────── WORK ──────────── */}
      <section className="section" id="work">
        <div className="container">

          <Reveal>
            <div className="section-header">
              <span className="label-caps">selected work</span>
              <Link href="/work" className="section-more">view all →</Link>
            </div>
          </Reveal>

          <div>
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <Link
                  href={p.href}
                  className="project-row"
                  target={p.href.startsWith('http') ? '_blank' : undefined}
                  rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div>
                    <div className="project-name">{p.name}</div>
                    <div className="project-desc">{p.desc}</div>
                  </div>
                  <div className="project-tags">
                    {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                    <span className="project-arrow">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ──────────── LIFE ──────────── */}
      <section className="section" id="life">
        <div className="container">

          <Reveal>
            <div className="section-header">
              <span className="label-caps">outside the terminal</span>
            </div>
          </Reveal>

          <div className="life-grid">
            {LIFE.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className={`life-card ${c.cls}`}>
                  <div className="life-card-bg">{c.emoji}</div>
                  <div className="life-card-label">{c.label}</div>
                  <div className="life-card-sub">{c.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ──────────── BLOG ──────────── */}
      <section className="section" id="blog">
        <div className="container">

          <Reveal>
            <div className="section-header">
              <span className="label-caps">recent writing</span>
              <Link href="/blog" className="section-more">all posts →</Link>
            </div>
          </Reveal>

          {[...TECH_POSTS, ...LIFE_POSTS].map((title, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="blog-row">
                <span className="blog-num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="blog-title">{title}</span>
                <div className="blog-meta">
                  <span className="badge-soon">coming soon</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
