'use client';

import Reveal from '../../components/Reveal';
import Link from 'next/link';
import styles from './page.module.css';

export default function ContactPage() {
    return (
        <div className="section">
            <div className="container">
                <Reveal>
                    <div className={styles.pageHeader}>
                        <Link href="/" className={styles.back}>← home</Link>
                        <h1 className={`display ${styles.pageTitle}`}>Say Hello</h1>
                        <p className={styles.pageDesc}>
                            Whether it&apos;s a role, a collaboration, or just a question — I read everything.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={80}>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactLinks}>
                            <p className="label-caps" style={{ marginBottom: '1.25rem' }}>Find me</p>
                            {[
                                { label: 'Email', value: 'adityamahesh@umass.edu', href: 'mailto:adityamahesh@umass.edu' },
                                { label: 'GitHub', value: 'adityam789', href: 'https://github.com/adityam789' },
                                { label: 'LinkedIn', value: 'aditya-maheshwari-05', href: 'https://linkedin.com/in/aditya-maheshwari-05' },
                            ].map(l => (
                                <div className={styles.contactRow} key={l.label}>
                                    <span className={styles.contactLabel}>{l.label}</span>
                                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                                        {l.value} →
                                    </a>
                                </div>
                            ))}
                        </div>

                        <form
                            className="contact-form"
                            onSubmit={e => { e.preventDefault(); alert('Form submission coming soon!'); }}
                        >
                            <p className="label-caps" style={{ marginBottom: '1.25rem' }}>Or drop a note</p>
                            <div className="form-field">
                                <label className="form-label">Name</label>
                                <input className="form-input" type="text" placeholder="Your name" required />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Message</label>
                                <textarea className="form-textarea" rows={5} placeholder="What's on your mind?" required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                                send it →
                            </button>
                        </form>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
