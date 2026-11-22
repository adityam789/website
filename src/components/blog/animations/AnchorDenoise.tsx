'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { lerp, mixPts, pathD, rng, smooth, type Pt } from '../motion/math';
import { Car } from '../motion/road';
import styles from '../motion/Motion.module.css';

/* Scene: a two-lane road bending right, ego in the right lane, a parked car ahead in that lane. */
const EY = 400;
const cxAt = (y: number) => 300 + 140 * ((400 - y) / 360) ** 2;
const EX = cxAt(EY) + 40;
const OBS: Pt = [cxAt(232) + 40, 232];
const STOP_Y = 292; // where right-lane paths have to stop behind the parked car

const M = 16; // waypoints per trajectory
const LS = [-140, -90, -50, -20, 0, 20, 50, 90, 140];
const ANCHORS = [
  ...LS.flatMap(L => [{ L, len: 1 }, { L, len: 0.55 }]),
  { L: -30, len: 0.8 },
  { L: 30, len: 0.8 },
];

const ps = Array.from({ length: M }, (_, j) => j / (M - 1));

/** K-means-style anchor in the ego frame: lateral bend L, length ~ speed. Knows nothing about this road. */
const anchorPts = (L: number, len: number): Pt[] => ps.map(p => [EX + L * p ** 1.6, EY - len * 330 * p]);

/** Same anchor with a little smooth noise, the "anchored Gaussian" starting point. */
function noisyPts(base: Pt[], seed: number): Pt[] {
  const r = rng(seed);
  const [f1, f2, a1, a2] = [1 + r() * 1.5, 2 + r() * 2, r() * 6.28, r() * 6.28];
  return base.map(([x, y], j) => {
    const p = ps[j];
    return [x + 12 * p * (0.6 * Math.sin(6.28 * f1 * p + a1) + 0.4 * Math.sin(6.28 * f2 * p + a2)), y + 5 * p * Math.sin(6.28 * f1 * p + a2)];
  });
}

/** What the denoiser returns given the scene: follow a real lane, keep a trace of the anchor, respect the parked car. */
function denoisedPts(L: number, len: number): { pts: Pt[]; progress: number } {
  const left = L <= -40;
  const yEnd = left ? EY - len * 330 : Math.max(EY - len * 330, STOP_Y);
  const pts = ps.map((p): Pt => {
    const y = EY - (EY - yEnd) * p;
    if (left) return [lerp(EX, cxAt(y) - 40, smooth(0.05, 0.5, p)) + (L + 70) * 0.18 * p ** 1.6, y];
    return [cxAt(y) + 40 + L * 0.1 * p ** 1.6, y];
  });
  return { pts, progress: (EY - yEnd) / 330 };
}

const TRAJ = ANCHORS.map((a, i) => {
  const A = anchorPts(a.L, a.len);
  const { pts: D, progress } = denoisedPts(a.L, a.len);
  return { A, N: noisyPts(A, 100 + i), D, score: progress - 0.004 * Math.abs(a.L + 60) };
});
const BEST = TRAJ.reduce((b, tr, i) => (tr.score > TRAJ[b].score ? i : b), 0);
const LO = Math.min(...TRAJ.map(t => t.score));
const HI = TRAJ[BEST].score;

const roadEdge = (dx: number) =>
  Array.from({ length: 41 }, (_, i): Pt => {
    const y = 30 + i * 10;
    return [cxAt(y) + dx, y];
  });
const ROAD = `${pathD(roadEdge(-80))}${pathD(roadEdge(80).reverse()).replace('M', 'L')}Z`;

const PHASES = [
  { label: '20 anchors', at: 0.2, from: 0 },
  { label: 'add noise', at: 0.42, from: 0.24 },
  { label: 'denoise ×2', at: 0.68, from: 0.46 },
  { label: 'score & pick', at: 0.95, from: 0.72 },
];

const COPY = [
  ['The vocabulary', 'K-means centers from the', 'training set, in the car’s', 'own frame. Same 20 for', 'every scene.'],
  ['Add a little noise', 'A small, fixed amount.', 'Rigid templates become', 'something that can bend.'],
  ['Denoise: 2 steps', 'Conditioned on the scene.', 'Paths snap to real lanes;', 'right-lane ones stop', 'behind the parked car.'],
  ['Score and pick', 'A head scores all 20;', 'the best one drives.', 'It keeps the anchor’s', 'intent, not its shape.'],
];

/** DiffusionDrive's loop on one frame: anchors → anchored noise → 2-step denoise → score. */
export default function AnchorDenoise() {
  const clock = useClock({ duration: 11000 });
  const t = clock.t;
  const reveal = smooth(0.02, 0.18, t);
  const m1 = smooth(0.26, 0.38, t);
  const m2 = smooth(0.48, 0.64, t);
  const m3 = smooth(0.74, 0.84, t);
  const phase = PHASES.reduce((acc, p, i) => (t >= (p.from ?? 0) ? i : acc), 0);

  return (
    <MotionFigure
      clock={clock}
      heading="Twenty rough guesses, two steps of polish"
      caption="Illustrative, not model output. Shapes and scores are made up to show the mechanism from the DiffusionDrive paper."
      phases={PHASES}
    >
      <svg viewBox="180 20 540 420" className={styles.svg} role="img" aria-labelledby="ad-t ad-d">
        <title id="ad-t">Anchor-based truncated diffusion, step by step</title>
        <desc id="ad-d">
          A two-lane road bends to the right. The car is in the right lane and a parked car blocks that lane ahead.
          Step one: twenty anchor trajectories fan out from the car, ignoring the road. Step two: each anchor gets a
          small amount of noise. Step three: two denoising steps conditioned on the scene bend the paths onto real
          lanes; paths that stay in the right lane stop behind the parked car. Step four: a scoring head ranks them,
          and the path that changes into the left lane and follows the bend is chosen.
        </desc>

        <path d={ROAD} className={styles.road} />
        <path d={pathD(roadEdge(0))} className={styles.laneLine} />
        <g transform={`translate(${OBS[0]} ${OBS[1]})`}>
          <rect x={-10} y={-23} width={20} height={46} rx={6} className={styles.obstacle} />
        </g>
        <text x={OBS[0] + 18} y={OBS[1] + 4} className={styles.label}>parked</text>

        {TRAJ.map((tr, i) => {
          const pts = mixPts(mixPts(tr.A, tr.N, m1), tr.D, m2);
          const best = i === BEST;
          const s = (tr.score - LO) / (HI - LO);
          const opacity = lerp(m2 > 0.5 ? 0.75 : 0.6, best ? 1 : 0.1 + 0.35 * s * s, m3);
          const cls = best && m3 > 0 ? styles.trailTeal : m2 > 0.5 ? styles.trailTeal : styles.trailMuted;
          return (
            <path
              key={i}
              d={pathD(pts)}
              className={cls}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - reveal}
              opacity={opacity}
              style={best ? { strokeWidth: lerp(2, 3.5, m3) } : undefined}
            />
          );
        })}
        <Car at={[EX, EY]} />

        <g>
          <text x={548} y={60} className={styles.label}>step {phase + 1} of 4</text>
          {COPY[phase].map((line, i) => (
            <text key={line} x={548} y={92 + i * 22} className={i === 0 ? styles.title : styles.sub}>
              {line}
            </text>
          ))}
          {m3 > 0.5 && (
            <>
              <text x={548} y={230} className={styles.labelTeal}>chosen: change lanes,</text>
              <text x={548} y={246} className={styles.labelTeal}>then follow the bend</text>
            </>
          )}
        </g>
      </svg>
    </MotionFigure>
  );
}
