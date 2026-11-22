'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { lerp, mixPts, pathD, rng, smooth, type Pt } from '../motion/math';
import { Car } from '../motion/road';
import styles from '../motion/Motion.module.css';

const EGO: Pt = [190, 344];
const M = 16;
const ps = Array.from({ length: M }, (_, j) => j / (M - 1));
const LS = [-150, -100, -60, -25, 0, 25, 60, 100, 150];

const anchor = (L: number): Pt[] => ps.map(p => [EGO[0] + L * p ** 1.6, EGO[1] - 270 * p]);
/** The path the human actually drove: a left drift with its own wobble, not any anchor's shape. */
const GT: Pt[] = ps.map(p => [EGO[0] - 74 * p ** 1.35 + 11 * Math.sin(Math.PI * p), EGO[1] - 262 * p]);

const dist = (a: Pt[], b: Pt[]) => a.reduce((s, q, i) => s + Math.hypot(q[0] - b[i][0], q[1] - b[i][1]), 0);
const ANCH = LS.map(anchor);
const POS = ANCH.reduce((b, a, i) => (dist(a, GT) < dist(ANCH[b], GT) ? i : b), 0);

function noisy(base: Pt[], seed: number, amp: number): Pt[] {
  const r = rng(seed);
  const [f, g, a, b] = [1 + r() * 1.6, 2.2 + r() * 2, r() * 6.28, r() * 6.28];
  return base.map(([x, y], j) => {
    const p = ps[j];
    return [x + amp * p * (0.6 * Math.sin(6.28 * f * p + a) + 0.4 * Math.sin(6.28 * g * p + b)), y + 6 * p * Math.sin(6.28 * f * p + b)];
  });
}
const NOISY = ANCH.map((a, i) => noisy(a, 300 + i, 18));
const EXTRA = [1, 2, 3].map(k => noisy(ANCH[POS], 400 + k, 20)); // more noisy draws around the positive

const ROWS = [
  { title: 'Find the positive', sub: 'anchor nearest the human path' },
  { title: 'Noise the anchors', sub: 'not the human path' },
  { title: 'Denoise to the human path', sub: 'L1 loss to the ground-truth path' },
  { title: 'Train the score head', sub: 'positive → 1, other anchors → 0' },
];
const PHASES = [
  { label: 'positive', at: 0.22, from: 0 },
  { label: 'noise', at: 0.48, from: 0.3 },
  { label: 'denoise', at: 0.72, from: 0.54 },
  { label: 'score', at: 0.95, from: 0.76 },
];

/** One DiffusionDrive training step: which trajectory gets noise, and what the target is. */
export default function WhichPathNoised() {
  const clock = useClock({ duration: 10000 });
  const t = clock.t;
  const m1 = smooth(0.06, 0.18, t);
  const m2 = smooth(0.32, 0.44, t);
  const m3 = smooth(0.56, 0.7, t);
  const m4 = smooth(0.78, 0.86, t);
  const phase = PHASES.reduce((acc, p, i) => (t >= (p.from ?? 0) ? i : acc), 0);
  const pred = mixPts(mixPts(ANCH[POS], NOISY[POS], m2), GT, m3);
  const end = (pts: Pt[]) => pts[pts.length - 1];

  return (
    <MotionFigure
      clock={clock}
      heading="The noise goes on the anchors. The human path is only the answer key."
      caption="Illustrative geometry. Mechanism from the DiffusionDrive paper (CVPR 2025): truncated noise on anchors, L1 reconstruction to the ground truth, BCE on anchor scores."
      phases={PHASES}
    >
      <svg viewBox="0 0 720 380" className={styles.svg} role="img" aria-labelledby="wp-t wp-d">
        <title id="wp-t">One training step of an anchor-based diffusion planner</title>
        <desc id="wp-d">
          Nine anchor trajectories fan out from the car, and a solid line shows the path the human driver took. Step
          one: the anchor closest to the human path is marked as the positive. Step two: noise is added to the
          anchors, not to the human path. Step three: the denoiser turns the noisy positive anchor into a prediction,
          which is pulled onto the human path by an L1 loss. Step four: the score head is trained to output one for
          the positive anchor and zero for the others.
        </desc>

        {ANCH.map((a, i) => {
          const pos = i === POS;
          const pts = mixPts(a, NOISY[i], m2);
          return (
            <g key={i}>
              <path
                d={pathD(pts)}
                className={pos && m1 > 0.5 ? styles.trailTeal : styles.trailMuted}
                opacity={pos ? 1 : lerp(0.7, 0.35, m1)}
                strokeDasharray={pos ? '5 5' : undefined}
              />
              {m4 > 0 && (
                <text
                  x={end(pts)[0]}
                  y={end(pts)[1] - 10}
                  textAnchor="middle"
                  className={pos ? styles.labelTeal : styles.label}
                  opacity={m4}
                >
                  {pos ? '1' : '0'}
                </text>
              )}
            </g>
          );
        })}
        {EXTRA.map((pts, k) => (
          <path key={k} d={pathD(mixPts(ANCH[POS], pts, m2))} className={styles.trailTeal} opacity={0.35 * m2} />
        ))}

        <path d={pathD(GT)} className={styles.trailInk} />
        <text x={GT[9][0] - 14} y={GT[9][1]} textAnchor="end" className={styles.sub}>human path</text>

        {m3 > 0 && <path d={pathD(pred)} className={styles.trailTeal} style={{ strokeWidth: 3 }} opacity={m3} />}
        {m3 > 0.6 && (
          <text x={GT[9][0] - 14} y={GT[9][1] + 18} textAnchor="end" className={styles.labelTeal}>
            prediction, pulled onto it (L1)
          </text>
        )}
        <Car at={EGO} />

        {ROWS.map((r, i) => {
          const y = 34 + i * 82;
          const on = i === phase;
          return (
            <g key={r.title}>
              <rect x={420} y={y} width={280} height={66} rx={12} className={on ? styles.panelOn : styles.panel} />
              <text x={438} y={y + 20} className={styles.label}>{i + 1}</text>
              <text x={456} y={y + 28} className={styles.title} style={{ fontSize: 17 }}>{r.title}</text>
              <text x={456} y={y + 50} className={styles.sub}>{r.sub}</text>
            </g>
          );
        })}
      </svg>
    </MotionFigure>
  );
}
