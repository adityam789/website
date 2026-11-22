'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const RM = '(prefers-reduced-motion: reduce)';
function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const getRM = () => window.matchMedia(RM).matches;
const getRMServer = () => false;

export interface Clock {
  /** Callback ref for the figure: playback starts when it scrolls into view and pauses when it leaves. */
  attach: (el: HTMLElement | null) => void;
  /** Progress through the animation, 0 to 1. Under reduced motion it rests on the final frame until the reader acts. */
  t: number;
  playing: boolean;
  loop: boolean;
  toggle: () => void;
  replay: () => void;
  seek: (t: number) => void;
}

/**
 * One timeline for a blog animation. Components draw a pure function of `t`, so every frame is
 * reproducible (scrubbing, reduced motion and SSR all just pick a `t`).
 */
export function useClock({ duration, loop = true }: { duration: number; loop?: boolean }): Clock {
  const [el, attach] = useState<HTMLElement | null>(null);
  const reduced = useSyncExternalStore(subscribeRM, getRM, getRMServer);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const tRef = useRef(0);
  const held = useRef(false); // the reader paused or scrubbed: don't auto-resume on scroll

  useEffect(() => {
    if (!el || reduced) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (held.current) return;
        if (!loop && tRef.current >= 1) return;
        setPlaying(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, reduced, loop]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      let next = tRef.current + dt / duration;
      if (next >= 1) {
        if (loop) next %= 1;
        else {
          tRef.current = 1;
          setT(1);
          setPlaying(false);
          return;
        }
      }
      tRef.current = next;
      setT(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, loop]);

  const toggle = useCallback(() => {
    setTouched(true);
    if (playing) {
      held.current = true;
      setPlaying(false);
      return;
    }
    held.current = false;
    if (!loop && tRef.current >= 1) {
      tRef.current = 0;
      setT(0);
    }
    setPlaying(true);
  }, [playing, loop]);

  const replay = useCallback(() => {
    setTouched(true);
    held.current = false;
    tRef.current = 0;
    setT(0);
    setPlaying(true);
  }, []);

  const seek = useCallback((v: number) => {
    setTouched(true);
    held.current = true;
    tRef.current = v;
    setT(v);
    setPlaying(false);
  }, []);

  return { attach, t: reduced && !touched ? 1 : t, playing, loop, toggle, replay, seek };
}
