'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { pathD, sample, smooth, type Pt } from '../motion/math';
import styles from '../motion/Motion.module.css';

/** Made-up rewards for four samples drawn around each anchor. */
const GROUPS = [
  { name: 'anchor: change left', cx: 125, L: -62, vars: [-46, -16, 14, 44], reward: [0.62, 0.81, 0.74, 0.55] },
  { name: 'anchor: keep lane', cx: 360, L: 0, vars: [-45, -15, 15, 45], reward: [0.9, 0.86, 0.7, 0.94] },
  { name: 'anchor: change right', cx: 595, L: 62, vars: [-44, -14, 16, 46], reward: [0.4, 0.66, 0.58, 0.71] },
];
const BASE_Y = 232;
const BAR_Y = 282;

/** DiffusionDriveV2's intra-anchor GRPO: advantages are relative to samples from the same anchor only. */
export default function GroupRanking() {
  const clock = useClock({ duration: 2600, loop: false });
  const draw = smooth(0.0, 0.45, clock.t);
  const grow = smooth(0.45, 0.95, clock.t);

  return (
    <MotionFigure
      clock={clock}
      heading="Rank samples against their own anchor, never across intents"
      caption="Illustrative rewards. Bars are each sample’s reward minus its group’s mean: teal gets pushed up, amber pushed down. Keep-lane samples score highest overall, but that never counts against the lane changes."
    >
      <svg viewBox="0 0 720 346" className={styles.svg} role="img" aria-labelledby="gr-t gr-d">
        <title id="gr-t">Group-relative advantages computed within each anchor</title>
        <desc id="gr-d">
          Three groups side by side: samples around a change-left anchor, a keep-lane anchor and a change-right anchor.
          Each group has four sampled trajectories with a reward. Under each group, bars show reward minus that group’s
          own average, so every group has winners and losers. The keep-lane group has the highest raw rewards, but its
          samples are never compared with the lane-change samples.
        </desc>

        {GROUPS.map((g, gi) => {
          const mean = g.reward.reduce((s, r) => s + r, 0) / g.reward.length;
          const fn = (v: number) => (p: number): Pt => [g.cx + (g.L + v) * p ** 1.5, BASE_Y - 170 * p];
          return (
            <g key={g.name}>
              <text x={g.cx} y={24} textAnchor="middle" className={styles.label}>{g.name}</text>
              <path d={pathD(sample(fn(0)))} className={`${styles.trailMuted} ${styles.dashed}`} />
              {g.vars.map((v, i) => {
                const pts = sample(fn(v), draw);
                const tip = pts[pts.length - 1];
                return (
                  <g key={v}>
                    {draw > 0 && <path d={pathD(pts)} className={styles.trailTeal} opacity={0.25 + 0.75 * g.reward[i] ** 2} />}
                    {draw > 0.95 && (
                      <text x={tip[0]} y={tip[1] - 8} textAnchor="middle" className={styles.label}>
                        {g.reward[i].toFixed(2)}
                      </text>
                    )}
                  </g>
                );
              })}
              <circle cx={g.cx} cy={BASE_Y} r={5} className={styles.car} />

              <line x1={g.cx - 52} y1={BAR_Y} x2={g.cx + 52} y2={BAR_Y} className={styles.axis} />
              {g.reward.map((r, i) => {
                const adv = (r - mean) * 170 * grow;
                return (
                  <rect
                    key={i}
                    x={g.cx - 42 + i * 22}
                    y={adv >= 0 ? BAR_Y - adv : BAR_Y}
                    width={16}
                    height={Math.abs(adv)}
                    rx={2}
                    className={r >= mean ? styles.barTeal : styles.barAmber}
                  />
                );
              })}
              <text x={g.cx} y={338} textAnchor="middle" className={styles.label}>group mean {mean.toFixed(2)}</text>
              {gi < GROUPS.length - 1 && (
                <line x1={g.cx + 117} y1={40} x2={g.cx + 117} y2={330} className={`${styles.trailMuted} ${styles.dashed}`} opacity={0.5} />
              )}
            </g>
          );
        })}
      </svg>
    </MotionFigure>
  );
}
