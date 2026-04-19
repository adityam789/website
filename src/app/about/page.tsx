import Reveal from '../../components/Reveal';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About — Aditya Maheshwari',
    description: 'About Aditya Maheshwari — software engineer, trail runner, perpetual learner.',
};

const SKILLS = [
    { group: 'Languages', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'C/C++', 'R', 'SQL', 'HTML/CSS'] },
    { group: 'Backend', items: ['Spring Boot', 'Node.js', 'Flask', 'Express'] },
    { group: 'Frontend', items: ['React', 'Angular', 'Next.js'] },
    { group: 'AI / ML', items: ['TensorFlow', 'PyTorch', 'LangChain', 'Crew AI', 'Langflow', 'LIME', 'SHAP'] },
    { group: 'Cloud (AWS)', items: ['EKS', 'Fargate', 'DynamoDB', 'S3', 'CloudWatch', 'Cognito'] },
    { group: 'Cloud (GCP)', items: ['BigQuery', 'Cloud Run', 'Spanner', 'GKE', 'Pub/Sub'] },
    { group: 'Databases', items: ['Oracle SQL', 'MongoDB', 'PostgreSQL'] },
    { group: 'Tools', items: ['Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Celonis', 'Salesforce'] },
];

const CERTS = [
    'AWS Certified Cloud Practitioner',
    'Stanford Machine Learning (Coursera)',
    'Neural Networks & Deep Learning (DeepLearning.AI)',
];

const AWARDS = [
    { title: 'IIT JEE Advanced', detail: 'All-India Rank 2,533 / 1.4M — Top ~0.2%' },
    { title: 'IPMAT IIM Indore', detail: 'All-India Rank 1 / 20,000+' },
    { title: 'JEE Main', detail: '99.45 Percentile' },
    { title: 'Best Teaching Assistant', detail: 'UMass Amherst — CS 446 Search Engines' },
    { title: "Dean's List", detail: 'All semesters · Chancellor\'s Award Scholarship' },
];

export default function AboutPage() {
    return (
        <div className="section">
            <div className="container">

                {/* Header */}
                <Reveal>
                    <div className={styles.pageHeader}>
                        <Link href="/" className={styles.back}>← home</Link>
                        <h1 className={`display ${styles.pageTitle}`}>About</h1>
                    </div>
                </Reveal>

                {/* Bio */}
                <Reveal delay={80}>
                    <div className={styles.bioBlock}>
                        <div className={styles.bioText}>
                            <p>
                                I&apos;m Aditya — a software engineer based in San Jose, CA. I currently work at PayPal
                                where I build systems that handle money, protect people, and sometimes auto-file
                                regulatory reports to the government. Before that, I studied Computer Science and
                                Mathematics at UMass Amherst with a 3.96 GPA.
                            </p>
                            <p>
                                I care about clean architecture, honest writing, and not over-engineering things.
                                Outside work, I&apos;m usually hiking trails, playing basketball, cooking without a
                                recipe, driving long roads, or planning the next trip.
                            </p>
                            <p>
                                Originally from India. Grew up competing in some of the world&apos;s most competitive
                                academic exams. Now I apply that same intensity to building software — and
                                occasionally to a good recipe.
                            </p>
                        </div>

                        {/* Quick facts */}
                        <div className={styles.quickFacts}>
                            {[
                                { label: 'Currently', value: 'Software Engineer @ PayPal' },
                                { label: 'Education', value: 'UMass Amherst — CS & Math, 3.96 GPA' },
                                { label: 'Based in', value: 'San Jose, CA' },
                                { label: 'Open to', value: 'New opportunities' },
                                { label: 'Site', value: 'mahicodes.com' },
                            ].map(f => (
                                <div className={styles.factRow} key={f.label}>
                                    <span className={styles.factLabel}>{f.label}</span>
                                    <span className={styles.factValue}>{f.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Skills */}
                <Reveal delay={100}>
                    <p className="label-caps" style={{ margin: '3.5rem 0 1.5rem' }}>Technical Skills</p>
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

                {/* Certifications */}
                <Reveal delay={80}>
                    <p className="label-caps" style={{ margin: '3rem 0 1rem' }}>Certifications</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {CERTS.map(c => (
                            <span className="cert-badge" key={c}>✓ {c}</span>
                        ))}
                    </div>
                </Reveal>

                {/* Awards */}
                <Reveal delay={80}>
                    <p className="label-caps" style={{ margin: '3rem 0 1.5rem' }}>Honors & Awards</p>
                    <div className={styles.awardsList}>
                        {AWARDS.map((a, i) => (
                            <Reveal key={a.title} delay={i * 55}>
                                <div className={styles.awardRow}>
                                    <span className={styles.awardTitle}>{a.title}</span>
                                    <span className={styles.awardDetail}>{a.detail}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </Reveal>

            </div>
        </div>
    );
}
