'use client';

import { Pause, Play, RotateCcw } from 'lucide-react';
import type { Clock } from './useClock';
import styles from './Motion.module.css';

interface Phase {
  label: string;
  /** Point on the timeline (0–1) that shows this phase settled. */
  at: number;
  /** Phase is active from this t onward (defaults to a bit before `at`). */
  from?: number;
}

/**
 * Card wrapper for animated blog figures: autoplay in view, play/pause, replay, and either
 * phase buttons (jump to a step) or a scrubber. Static frames stay meaningful without JS.
 */
export default function MotionFigure({
  clock,
  heading,
  caption,
  phases,
  scrub,
  children,
}: {
  clock: Clock;
  heading?: string;
  caption: React.ReactNode;
  phases?: Phase[];
  scrub?: (t: number) => string;
  children: React.ReactNode;
}) {
  const { attach, t, playing, toggle, replay, seek } = clock;
  const active = phases
    ? phases.reduce((acc, p, i) => (t >= (p.from ?? p.at - 0.12) ? i : acc), 0)
    : -1;

  return (
    <figure ref={attach} className={styles.figure}>
      {heading && <p className={styles.heading}>{heading}</p>}
      <div className={styles.stage}>{children}</div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={toggle}
          aria-label={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button type="button" className={styles.btn} onClick={replay} aria-label="Replay from the start">
          <RotateCcw size={14} />
        </button>
        {phases && (
          <div className={styles.phases} role="group" aria-label="Jump to a step">
            {phases.map((p, i) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={i === active}
                className={`${styles.phase} ${i === active ? styles.phaseOn : ''}`}
                onClick={() => seek(p.at)}
              >
                {i + 1}. {p.label}
              </button>
            ))}
          </div>
        )}
        {scrub && (
          <label className={styles.scrub}>
            <input
              type="range"
              className={styles.range}
              min={0}
              max={1000}
              value={Math.round(t * 1000)}
              onChange={e => seek(Number(e.target.value) / 1000)}
              aria-label="Scrub through the animation"
            />
            <span className={styles.readout}>{scrub(t)}</span>
          </label>
        )}
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
