import Reveal from '../../components/Reveal';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Work — Aditya Maheshwari',
    description: 'Projects and professional experience from Aditya Maheshwari.',
};

const EXPERIENCE = [
    {
        company: 'PayPal',
        role: 'Software Engineer',
        period: 'Jun 2023 – Present',
        location: 'San Jose, CA',
        tags: ['Java', 'Spring Boot', 'GCP', 'AWS', 'LangChain', 'Crew AI', 'Oracle SQL'],
        bullets: [
            'Drove cloud-native migration of compliance case-management platform (OneSCM) from on-prem Oracle to GCP (Cloud Run, Spanner, GKE, Pub/Sub); presented cell-based multi-tenant architecture to SVP/CTO leadership.',
            'Engineered fraud refund & currency-conversion system — recovers $160M/year from fraudulent accounts, mitigates $10M in litigation risk.',
            'Automated SAR filing across 5 AML rules — eliminates 10K+ manual investigations/year, saves 30K+ investigator hours annually.',
            'Built Account Bundling tool: consolidates 1M+ transaction records, automates multi-jurisdiction filing.',
            'Engineered 3 LLM chat assistants for case processing, team routing, and compliance narrative generation.',
            'Built 2 Agentic AI solutions (Crew AI): voice-activated case assistant + Oracle SQL prompt-to-PR generator.',
            'Re-architected Law Enforcement Fulfillment Portal (25K+ subpoenas/year): −55% latency and storage, saves $5M/yr.',
            'Orchestrated NCMEC integration: automates 2,000+ child-exploitation case reports/year to law enforcement.',
        ],
    },
    {
        company: 'PayPal',
        role: 'Software Engineer Intern',
        period: 'Jun 2022 – Aug 2022',
        location: 'San Jose, CA',
        tags: ['Java', 'Spring Boot', 'Celonis', 'ETL'],
        bullets: [
            'Built Java/Spring ETL connector: extracts and loads 3.5M case-management logs into Celonis for process mining, enabling discovery and operational monitoring.',
            'Automated daily movement of thousands of new case records via scheduled batch jobs.',
        ],
    },
    {
        company: 'TestAIng',
        role: 'Machine Learning Intern',
        period: 'May 2021 – Aug 2021',
        location: 'Bangalore, India (Remote)',
        tags: ['Python', 'scikit-learn', 'LIME', 'SHAP'],
        bullets: [
            'Developed ML pipelines for time-series forecasting with concept-drift detection — 7% error reduction on enterprise datasets.',
            'Integrated LIME and SHAP explainability methods for non-technical stakeholders.',
        ],
    },
    {
        company: 'Arevea Inc.',
        role: 'Software Engineer Intern',
        period: 'May 2021 – Aug 2021',
        location: 'Remote',
        tags: ['Angular', 'Node.js', 'SQL'],
        bullets: [
            'Designed admin portal for a virtual event management platform.',
            'Implemented secure RESTful APIs with QR-code-based event check-in functionality.',
        ],
    },
    {
        company: 'UMass CICS',
        role: 'Undergraduate Research Assistant',
        period: 'Dec 2021 – May 2023',
        location: 'Amherst, MA',
        tags: ['R', 'Python', 'LIME', 'SHAP', 'NLP'],
        bullets: [
            'Evaluated causal inference algorithms on non-linear observational datasets in R under PhD researcher Pracheta Amaranath.',
            'Investigated LIME/SHAP explainability of NLP search engines (LETOR) under Prof. James Allan at CIIR.',
        ],
    },
];

const PROJECTS = [
    {
        name: 'Market Lens',
        year: '2025',
        desc: 'Multi-API financial intelligence system integrating 6+ data sources with intelligent deduplication and LLM-powered sentiment analysis. Auto-syncs to Google Sheets for real-time portfolio signal tracking.',
        tags: ['Python', 'Anthropic Claude', 'Grok', 'Alpha Vantage', 'Google Sheets'],
        href: '#',
    },
    {
        name: 'Deep Learning From Scratch',
        year: '2022',
        desc: 'Trained an LSTM on classical guitar compositions to generate novel musical sequences. Also implemented logistic regression, CNNs, and MLPs from scratch without high-level libraries.',
        tags: ['Python', 'TensorFlow', 'music21'],
        href: 'https://github.com/adityam789/Deep-Learning',
    },
    {
        name: 'CryptoSimulator',
        year: '2021',
        desc: 'Back-end crypto trading simulator with real-time Coinbase exchange data, secure user authentication, two-factor auth, and API key management.',
        tags: ['Node.js', 'Express', 'MongoDB', 'Coinbase API'],
        href: 'https://github.com/adityam789/crypto_transaction_api',
    },
];

export default function WorkPage() {
    return (
        <div className="section">
            <div className="container">

                {/* Header */}
                <Reveal>
                    <div className={styles.pageHeader}>
                        <Link href="/" className={styles.back}>← home</Link>
                        <h1 className={`display ${styles.pageTitle}`}>Work</h1>
                        <p className={styles.pageDesc}>
                            Professional experience, projects, and things I&apos;ve shipped.
                        </p>
                    </div>
                </Reveal>

                {/* Projects */}
                <Reveal delay={100}>
                    <p className="label-caps" style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>Projects</p>
                </Reveal>
                {PROJECTS.map((p, i) => (
                    <Reveal key={p.name} delay={i * 80}>
                        <Link
                            href={p.href}
                            className={`project-row ${styles.projectCard}`}
                            target={p.href.startsWith('http') ? '_blank' : undefined}
                            rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '4px' }}>
                                    <span className="project-name">{p.name}</span>
                                    <span className="label-caps">{p.year}</span>
                                </div>
                                <p className={styles.projectFullDesc}>{p.desc}</p>
                                <div className="project-tags" style={{ marginTop: '0.75rem', justifyContent: 'flex-start' }}>
                                    {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                                </div>
                            </div>
                            <span className="project-arrow">→</span>
                        </Link>
                    </Reveal>
                ))}

                {/* Experience */}
                <Reveal delay={100}>
                    <p className="label-caps" style={{ marginBottom: '1.5rem', marginTop: '4rem' }}>Experience</p>
                </Reveal>
                <div className="exp-list">
                    {EXPERIENCE.map((e, i) => (
                        <Reveal key={`${e.company}-${e.role}`} delay={i * 70}>
                            <div className="exp-row">
                                <div className="exp-header">
                                    <div>
                                        <div className="exp-company">{e.company}</div>
                                        <div className="exp-role">{e.role} · {e.location}</div>
                                    </div>
                                    <div className="exp-period">{e.period}</div>
                                </div>
                                <ul className="exp-bullets">
                                    {e.bullets.map(b => (
                                        <li key={b} className="exp-bullet">{b}</li>
                                    ))}
                                </ul>
                                <div className="project-tags" style={{ marginTop: '1rem', justifyContent: 'flex-start' }}>
                                    {e.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </div>
    );
}
