import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '../../components/Reveal';
import ContactForm from '../../components/ContactForm';
import { site } from '../../data/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact — Aditya Maheshwari',
  description: 'Get in touch with Aditya Maheshwari.',
};

const LINKS = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'GitHub', value: site.github.handle, href: site.github.url },
  { label: 'LinkedIn', value: site.linkedin.handle, href: site.linkedin.url },
];

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container">
        <Reveal>
          <div className={styles.pageHeader}>
            <Link href="/" className={styles.back}>← home</Link>
            <h1 className={`display ${styles.pageTitle}`}>Say Hello</h1>
            <p className={styles.pageDesc}>
              Whether it’s a role, a collaboration, or just a question, I read everything.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.contactGrid}>
            <div className={styles.contactLinks}>
              <p className="label-caps" style={{ marginBottom: '1.25rem' }}>Find me</p>
              {LINKS.map(l => (
                <div className={styles.contactRow} key={l.label}>
                  <span className={styles.contactLabel}>{l.label}</span>
                  <a
                    href={l.href}
                    className={styles.contactValue}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.value} →
                  </a>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
