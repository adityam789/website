import Link from 'next/link';
import Reveal from '../components/Reveal';
import CaseCard from '../components/CaseCard';
import { formatDate, getAllPosts } from '../lib/blog';
import { site, PROOF, LIFE } from '../data/site';
import { CASE_STUDIES, PROJECTS } from '../data/work';
import styles from './page.module.css';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const featured = CASE_STUDIES.filter(c => c.featured);

  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero} id="home">
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <p className={`label-caps ${styles.eyebrow}`}>
                {site.role} at {site.employer} · {site.location}
              </p>
              <h1 className={`display ${styles.heroName}`}>
                Aditya <br />Maheshwari<span className={styles.nameDot}>.</span>
              </h1>
              <p className={styles.lead}>{site.lead}</p>
              <div className={styles.cta}>
                <Link href="/work" className="btn-primary">see the work →</Link>
                <Link href="/blog" className="btn-secondary">read the writing</Link>
              </div>
              <p className={styles.downloads}>
                <a href="/resume.pdf" download>resume ↓</a>
                <a href="/cv.pdf" download>cv ↓</a>
                <span className="available-badge"><span className="pulse-dot" />open to opportunities</span>
              </p>
            </div>

            <div className="terminal" aria-label="A few things I believe">
              <div className="terminal-bar">
                <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
                <span className="terminal-title">aditya.sh</span>
              </div>
              <div className="terminal-body">
                <div><span className="t-prompt">~</span> <span className="t-cmd">whoami</span></div>
                <div className="t-out">software engineer by day, trail chaser by weekend</div>
                <div style={{ marginTop: 6 }}><span className="t-prompt">~</span> <span className="t-cmd">cat beliefs.txt</span></div>
                <div className="t-out"><span className="t-key">→</span> good code is like good prose: clear, not clever</div>
                <div className="t-out"><span className="t-key">→</span> ship it, then sleep. in that order. usually.</div>
                <div className="t-out"><span className="t-key">→</span> mountains fix most things. good food fixes the rest.</div>
                <div style={{ marginTop: 6 }}><span className="t-prompt">~</span> <span className="cursor" /></div>
              </div>
            </div>
          </div>

          <dl className="proof">
            {PROOF.map(p => (
              <div key={p.label} className="proof-item">
                <dt>{p.value}</dt>
                <dd>{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Case studies ── */}
      <section className="section" id="work">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="label-caps">selected work</h2>
              <Link href="/work" className="section-more">all work →</Link>
            </div>
          </Reveal>
          <div className="case-grid">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}><CaseCard study={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Writing ── */}
      <section className="section" id="blog">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="label-caps">recent writing</h2>
              <Link href="/blog" className="section-more">all posts →</Link>
            </div>
          </Reveal>
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link href={`/blog/${p.slug}`} className="blog-row">
                <span className="blog-num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="blog-title">
                  {p.title}
                  <span className="blog-excerpt">{p.excerpt}</span>
                </span>
                <div className="blog-meta">
                  <span className="blog-date">{formatDate(p.date)} · {p.readMinutes} min</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Side projects ── */}
      <section className="section" id="projects">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="label-caps">side projects</h2>
            </div>
          </Reveal>
          {PROJECTS.map((p, i) => {
            const row = (
              <>
                <div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.short}</div>
                </div>
                <div className="project-tags">
                  {p.tags.slice(0, 3).map(t => <span className="tag" key={t}>{t}</span>)}
                  {p.href && <span className="project-arrow">↗</span>}
                </div>
              </>
            );
            return (
              <Reveal key={p.name} delay={i * 60}>
                {p.href ? (
                  <a href={p.href} className="project-row" target="_blank" rel="noopener noreferrer">{row}</a>
                ) : (
                  <div className="project-row project-row-static">{row}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Life ── */}
      <section className="section" id="life">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <h2 className="label-caps">outside the terminal</h2>
            </div>
            <ul className="life-row">
              {LIFE.map(c => (
                <li key={c.label} className="life-chip">
                  <span className="life-emoji" aria-hidden>{c.emoji}</span>
                  <span className="life-card-label">{c.label}</span>
                  <span className="life-card-sub">{c.sub}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className={styles.closing}>
        <div className="container">
          <Reveal>
            <h2 className={`display ${styles.closingTitle}`}>Have a hard backend problem?</h2>
            <p className={styles.closingText}>Roles, collaborations, or a second opinion on a design. I read everything.</p>
            <Link href="/contact" className="btn-primary">say hello →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
