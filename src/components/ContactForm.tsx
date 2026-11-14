'use client';

import { useState } from 'react';
import { site } from '../data/site';

/** No backend: composes the note in the visitor's own mail app, so nothing is stored or sent from the site. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const message = String(data.get('message') ?? '');
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <p className="label-caps" style={{ marginBottom: '1.25rem' }}>Or drop a note</p>
      <div className="form-field">
        <label className="form-label" htmlFor="cf-name">Name</label>
        <input className="form-input" id="cf-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea className="form-textarea" id="cf-message" name="message" rows={5} required />
      </div>
      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        open in your mail app →
      </button>
      <p className="form-note" role="status">
        {sent ? 'Your mail app should have opened with the note ready to send.' : 'This opens a ready-to-send email. Nothing is stored here.'}
      </p>
    </form>
  );
}
