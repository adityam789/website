import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Reveal from '../../components/Reveal';
import CaseCard from '../../components/CaseCard';
import { CASE_STUDIES, EXPERIENCE, PROJECTS, TEACHING } from '../../data/work';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work — Aditya Maheshwari',
  description: 'Case studies, experience and side projects from Aditya Maheshwari.',
};

export default function WorkPage() {
  return (
    <div className="section">
      <div className="container">
        <Reveal>
          <div className={styles.pageHeader}>
            <Link href="/" className={styles.back}>← home</Link>
            <h1 className={`display ${styles.pageTitle}`}>Work</h1>
            <p className={styles.pageDesc}>
              Systems I’ve built for fraud, compliance and the people who investigate both, plus the projects I build for fun.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}><h2 className="label-caps block-label">Case studies</h2></Reveal>
        <div className="case-stack">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i, 3) * 60}><CaseCard study={c} full /></Reveal>
          ))}
        </div>

        <Reveal><h2 className="label-caps block-label">Experience</h2></Reveal>
        <div className="exp-list">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={`${e.company}-${e.role}`} delay={Math.min(i, 3) * 60}>
              <details className="exp-row" open={i === 0}>
                <summary className="exp-header">
                  <div>
                    <div className="exp-company">{e.company}</div>
                    <div className="exp-role">{e.role} · {e.location}</div>
                  </div>
                  <div className="exp-period">{e.period}</div>
                </summary>
                <ul className="exp-bullets">
                  {e.bullets.map(b => <li key={b} className="exp-bullet">{b}</li>)}
                </ul>
                <div className="project-tags" style={{ marginTop: '1rem', justifyContent: 'flex-start' }}>
                  {e.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal><h2 className="label-caps block-label">Teaching</h2></Reveal>
        {TEACHING.map(t => (
          <Reveal key={t.course}>
            <div className="exp-row exp-row-static">
              <div className="exp-header">
                <div>
                  <div className="exp-company">{t.course}</div>
                  <div className="exp-role">{t.role}</div>
                </div>
                <div className="exp-period">{t.period}</div>
              </div>
              <p className="exp-note">{t.note}</p>
            </div>
          </Reveal>
        ))}

        <Reveal><h2 className="label-caps block-label">Side projects</h2></Reveal>
        {PROJECTS.map((p, i) => {
          const row = (
            <>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: 4 }}>
                  <span className="project-name">{p.name}</span>
                  <span className="label-caps">{p.year}</span>
                </div>
                <p className={styles.projectFullDesc}>{p.desc}</p>
                <div className="project-tags" style={{ marginTop: '0.75rem', justifyContent: 'flex-start' }}>
                  {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
                {p.image && (
                  <figure className={styles.projectFigure}>
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      width={p.image.width}
                      height={p.image.height}
                      sizes="(max-width: 720px) 100vw, 640px"
                      unoptimized={p.image.src.endsWith('.gif')}
                      className={p.image.height > p.image.width ? `${styles.projectImage} ${styles.projectImageTall}` : styles.projectImage}
                    />
                    <figcaption className={styles.projectCaption}>{p.image.caption}</figcaption>
                  </figure>
                )}
              </div>
              {p.href && <span className="project-arrow">↗</span>}
            </>
          );
          return (
            <Reveal key={p.name} delay={i * 60}>
              {p.href ? (
                <a href={p.href} className={`project-row ${styles.projectCard}`} target="_blank" rel="noopener noreferrer">{row}</a>
              ) : (
                <div className={`project-row project-row-static ${styles.projectCard}`}>{row}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
