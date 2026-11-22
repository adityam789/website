'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { clamp, gauss, lerp, pathD, rng, smooth, type Pt } from '../motion/math';
import styles from '../motion/Motion.module.css';

const N = 26;
const K = 24;
const X = (x: number) => 360 + x * 165;
const E = (x: number) => (x * x - 1) ** 2; // two valleys at ±1, a ridge at 0
const Y = (x: number) => 238 - 52 * Math.min(E(x), 2.9);

/**
 * Precomputed denoising runs: start from Gaussian noise, step down the gradient with shrinking noise
 * (annealed Langevin, simplified). Seed chosen so the split is even and nobody stays on the ridge.
 */
const RUNS: number[][] = (() => {
  const r = rng(11);
  let xs = Array.from({ length: N }, () => clamp(gauss(r) * 0.75, -1.7, 1.7));
  const runs = xs.map(x => [x]);
  for (let k = 0; k < K; k++) {
    const s = 0.24 * (1 - k / K);
    xs = xs.map(x => clamp(x + 0.12 * -4 * x * (x * x - 1) + s * gauss(r), -1.75, 1.75));
    xs.forEach((x, i) => runs[i].push(x));
  }
  return runs;
})();
/** Tiny fixed spread so settled particles don't hide behind each other. */
const SPREAD = Array.from({ length: N }, (_, i) => ((i * 7) % 11) / 10 - 0.5);

const LANDSCAPE = pathD(Array.from({ length: 121 }, (_, i): Pt => {
  const x = -1.8 + (3.6 * i) / 120;
  return [X(x), Y(x)];
}));

const stepAt = (t: number) => clamp((t - 0.1) / 0.72) * K;

/** Diffusion as rolling downhill: noise picks a side, the learned slope does the rest. */
export default function ScoreValleys() {
  const clock = useClock({ duration: 7500 });
  const kf = stepAt(clock.t);
  const k0 = Math.min(K - 1, Math.floor(kf));
  const frac = kf - k0;
  const done = smooth(0.6, 1, kf / K);
  const noise = 1 - kf / K;

  return (
    <MotionFigure
      clock={clock}
      heading="Nobody tells it how many modes there are"
      caption="Illustrative 1-D version. Each dot is one sample. The curve is the learned landscape (low = likely). Drag the slider to step through denoising."
      scrub={t => `step ${Math.round(stepAt(t))} / ${K}`}
    >
      <svg viewBox="0 0 720 300" className={styles.svg} role="img" aria-labelledby="sv-t sv-d">
        <title id="sv-t">Denoising as rolling downhill on a learned landscape</title>
        <desc id="sv-d">
          A curve with two valleys, labelled swerve left and swerve right, and a ridge between them labelled straight
          into the box. Twenty-six samples start scattered by random noise. Over twenty-four denoising steps each one
          moves downhill while the added noise shrinks. They end split between the two valleys, about half each, with
          none left on the ridge.
        </desc>

        <text x={40} y={30} className={styles.label}>denoising step {Math.round(kf)} / {K}</text>
        <text x={40} y={52} className={styles.label}>noise</text>
        <rect x={84} y={44} width={120} height={8} rx={4} className={styles.chip} />
        <rect x={84} y={44} width={Math.max(0, 120 * noise)} height={8} rx={4} className={styles.barAmber} opacity={0.8} />

        <path d={LANDSCAPE} className={styles.curveInk} />
        <text x={X(-1)} y={266} textAnchor="middle" className={styles.labelTeal}>swerve left</text>
        <text x={X(1)} y={266} textAnchor="middle" className={styles.labelTeal}>swerve right</text>
        <text x={X(0)} y={Y(0) - 14} textAnchor="middle" className={styles.labelAmber}>straight: into the box</text>
        <text x={X(-1.72)} y={Y(-1.72) - 10} className={styles.label}>off the road</text>
        <text x={X(1.72)} y={Y(1.72) - 10} textAnchor="end" className={styles.label}>off the road</text>

        {RUNS.map((run, i) => {
          const x = lerp(run[k0], run[k0 + 1], frac) + SPREAD[i] * 0.2 * done;
          return (
            <circle
              key={i}
              cx={X(x)}
              cy={Y(x) - 7}
              r={5}
              style={{ fill: `color-mix(in srgb, var(--m-teal) ${Math.round(25 + 75 * done)}%, var(--text-tertiary))` }}
              opacity={0.9}
            />
          );
        })}
      </svg>
    </MotionFigure>
  );
}
