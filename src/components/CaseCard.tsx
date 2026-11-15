import Link from 'next/link';
import type { CaseStudy } from '../data/work';

/** One case study. Compact on the home page (links to /work), full on the work page. */
export default function CaseCard({ study, full = false }: { study: CaseStudy; full?: boolean }) {
  const body = (
    <>
      <h3 className="case-title">{study.title}</h3>
      <p className="case-summary">{study.summary}</p>
      {full && (
        <ul className="exp-bullets">
          {study.built.map(b => <li key={b} className="exp-bullet">{b}</li>)}
        </ul>
      )}
      <dl className="case-metrics">
        {study.metrics.map(m => (
          <div key={m.label} className="case-metric">
            <dt>{m.value}</dt>
            <dd>{m.label}</dd>
          </div>
        ))}
      </dl>
      {full && (
        <div className="project-tags" style={{ justifyContent: 'flex-start' }}>
          {study.stack.map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
      )}
    </>
  );
  return full ? (
    <article className="case-card" id={study.slug}>{body}</article>
  ) : (
    <Link href={`/work#${study.slug}`} className="case-card case-card-link">{body}</Link>
  );
}
