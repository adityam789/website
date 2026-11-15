import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '../../components/Reveal';
import { site, PRINCIPLES } from '../../data/site';
import { SKILLS, CERTS, AWARDS, EDUCATION } from '../../data/about';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About — Aditya Maheshwari',
  description: 'About Aditya Maheshwari: software engineer, trail runner, perpetual learner.',
};

const FACTS = [
  { label: 'Currently', value: `${site.role} @ ${site.employer}` },
  { label: 'Education', value: `UMass Amherst, CS & Math, ${EDUCATION.gpa} GPA` },
  { label: 'Based in', value: site.location },
  { label: 'Open to', value: 'New opportunities' },
  { label: 'Site', value: site.domain },
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container">
        <Reveal>
          <div className={styles.pageHeader}>
            <Link href="/" className={styles.back}>← home</Link>
            <h1 className={`display ${styles.pageTitle}`}>About</h1>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.bioBlock}>
            <div className={styles.bioText}>
              <p>
                I’m Aditya, a software engineer based in San Jose, CA. I work at PayPal, where I ship LLM agents
                for case work and the distributed systems behind them: systems that handle money, protect people,
                and help file regulatory reports. Before
                that, I studied Computer Science and Mathematics at UMass Amherst.
              </p>
              <p>
                Outside work, I’m usually hiking trails, playing basketball, cooking without a recipe, driving long
                roads, or planning the next trip.
              </p>
              <p>
                Originally from India. I grew up competing in some of the world’s most competitive academic exams,
                and I apply that same intensity to building software, and occasionally to a good recipe.
              </p>
            </div>
            <div className={styles.quickFacts}>
              {FACTS.map(f => (
                <div className={styles.factRow} key={f.label}>
                  <span className={styles.factLabel}>{f.label}</span>
                  <span className={styles.factValue}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="label-caps block-label">How I work</h2>
          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="principle">
                <span className="blog-num mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="label-caps block-label">Technical skills</h2>
          <div className="skills-grid">
            {SKILLS.map(sg => (
              <div className="skill-group" key={sg.group}>
                <div className="skill-group-title">{sg.group}</div>
                <div className="skill-pills">
                  {sg.items.map(s => <span className="tag" key={s}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="label-caps block-label">Education</h2>
          <div className="exp-row exp-row-static">
            <div className="exp-header">
              <div>
                <div className="exp-company">{EDUCATION.school}</div>
                <div className="exp-role">{EDUCATION.degree} · GPA {EDUCATION.gpa}</div>
              </div>
              <div className="exp-period">{EDUCATION.period}</div>
            </div>
            <p className="exp-note">{EDUCATION.detail}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1.25rem' }}>
            {CERTS.map(c => <span className="cert-badge" key={c}>✓ {c}</span>)}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="label-caps block-label">Honors & awards</h2>
          <div className={styles.awardsList}>
            {AWARDS.map(a => (
              <div className={styles.awardRow} key={a.title}>
                <span className={styles.awardTitle}>{a.title}</span>
                <span className={styles.awardDetail}>{a.detail}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
