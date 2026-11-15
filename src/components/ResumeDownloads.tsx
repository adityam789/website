'use client';

import { useState } from 'react';
import { RESUME_TRACKS } from '../data/site';
import styles from './ResumeDownloads.module.css';

/** Resume and CV links plus a small switch for which version they download. Hybrid is the default. */
export default function ResumeDownloads() {
  const [key, setKey] = useState(RESUME_TRACKS[0].key);
  const track = RESUME_TRACKS.find(t => t.key === key) ?? RESUME_TRACKS[0];

  return (
    <span className={styles.root}>
      <a href={track.resume} download>resume ↓</a>
      <a href={track.cv} download>cv ↓</a>
      <span className={styles.tracks} role="radiogroup" aria-label="Resume version">
        {RESUME_TRACKS.map(t => (
          <label key={t.key} className={styles.track} title={t.hint}>
            <input
              type="radio"
              name="resume-track"
              value={t.key}
              checked={t.key === key}
              onChange={() => setKey(t.key)}
              className={styles.input}
            />
            <span className={styles.pill}>{t.label}</span>
          </label>
        ))}
      </span>
      <span className={styles.hint} aria-live="polite">{track.hint}</span>
    </span>
  );
}
