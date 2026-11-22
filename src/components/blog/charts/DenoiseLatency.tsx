'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { smooth } from '../motion/math';
import styles from '../motion/Motion.module.css';

/** DiffusionDrive paper, Table 2: NAVSIM navtest, ResNet-34, one RTX 4090. */
const ROWS = [
  { name: 'Vanilla diffusion', sub: '20 steps from pure noise', ms: 130.0, fps: 7, pdms: 84.6 },
  { name: 'Truncated diffusion', sub: '2 steps from anchors', ms: 13.8, fps: 27, pdms: 85.7 },
  { name: 'DiffusionDrive', sub: '2 steps + better decoder', ms: 7.6, fps: 45, pdms: 88.1 },
];
const X0 = 210;
const SCALE = 330 / 140; // px per ms
const BUDGET = 100; // 10 Hz replanning

/** Planner latency vs. a 10 Hz replanning budget. */
export default function DenoiseLatency() {
  const clock = useClock({ duration: 1800, loop: false });
  const grow = smooth(0, 1, clock.t);

  return (
    <MotionFigure
      clock={clock}
      heading="From 7 plans a second to 45, and better plans"
      caption="Source: DiffusionDrive (Liao et al., CVPR 2025), Table 2. PDMS is NAVSIM’s planning score (higher is better). The 100 ms line assumes the whole stack replans at 10 Hz; the planner only gets part of it."
    >
      <svg viewBox="0 0 720 220" className={styles.svg} role="img" aria-labelledby="dl-t dl-d">
        <title id="dl-t">Planner latency per frame</title>
        <desc id="dl-d">
          Vanilla diffusion with 20 steps: 130 milliseconds, 7 frames per second, PDMS 84.6. Truncated diffusion with
          2 steps: 13.8 milliseconds, 27 frames per second, PDMS 85.7. DiffusionDrive with 2 steps: 7.6 milliseconds, 45
          frames per second, PDMS 88.1. Only the vanilla version exceeds a 100 millisecond, 10 hertz budget.
        </desc>

        {ROWS.map((r, i) => {
          const y = 30 + i * 58;
          const over = r.ms > BUDGET;
          return (
            <g key={r.name}>
              <text x={0} y={y + 14} className={styles.sub} style={{ fill: 'var(--text-primary)', fontWeight: 500 }}>{r.name}</text>
              <text x={0} y={y + 32} className={styles.label}>{r.sub}</text>
              <rect x={X0} y={y} width={Math.max(2, r.ms * SCALE * grow)} height={30} rx={4}
                className={over ? styles.barAmber : styles.barTeal} />
              <text x={X0 + r.ms * SCALE + 10} y={y + 13} className={over ? styles.labelAmber : styles.labelTeal} opacity={grow}>
                {r.ms.toFixed(1)} ms · {r.fps} FPS
              </text>
              <text x={X0 + r.ms * SCALE + 10} y={y + 28} className={styles.label} opacity={grow}>PDMS {r.pdms}</text>
            </g>
          );
        })}
        <line x1={X0 + BUDGET * SCALE} y1={20} x2={X0 + BUDGET * SCALE} y2={196} className={`${styles.trailMuted} ${styles.dashed}`} />
        <text x={X0 + BUDGET * SCALE} y={212} textAnchor="middle" className={styles.label}>100 ms = 10 Hz</text>
      </svg>
    </MotionFigure>
  );
}
