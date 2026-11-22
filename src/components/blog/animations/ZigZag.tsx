'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { clamp, pathD, sample, smooth, type Pt } from '../motion/math';
import { Box, Car, HIT_P, Lane, swerve, yAt } from '../motion/road';
import styles from '../motion/Motion.module.css';

const PW = 350;
const LEFT = PW / 2;
const RIGHT = PW + 20 + PW / 2;
const FRAMES = Array.from({ length: 9 }, (_, i) => 0.035 + i * 0.07); // one replan every ~100 ms

/** Re-decides each frame: drift one way, then the other, and the wobble dies out right in front of the box. */
const wobble = (p: number) => 20 * Math.sin(2 * Math.PI * 2.8 * p) * (1 - smooth(0.25, 0.56, p));
const stateless = (p: number): Pt => [LEFT + wobble(p), yAt(p)];
const committed = (p: number): Pt => [RIGHT + swerve(p, -1, 64), yAt(p)];

function Chips({ cx, upto, pick, good }: { cx: number; upto: number; pick: (p: number) => string; good: boolean }) {
  const shown = FRAMES.filter(f => f <= upto);
  return (
    <g>
      {shown.map((f, i) => {
        const x = cx - 4 * 19 + i * 19;
        return (
          <g key={f}>
            <rect x={x - 8} y={312} width={16} height={18} rx={4} className={good ? styles.chipTeal : styles.chipAmber} />
            <text x={x} y={325} textAnchor="middle" className={good ? styles.labelTeal : styles.labelAmber}>{pick(f)}</text>
          </g>
        );
      })}
    </g>
  );
}

/** Mode flip-flop across frames vs. a planner that reuses its last plan. */
export default function ZigZag() {
  const clock = useClock({ duration: 7000 });
  const p = clamp(clock.t / 0.72);
  const pl = Math.min(p, HIT_P);
  const hit = p >= HIT_P;
  const ahead = Math.min(1, p + 0.28);

  return (
    <MotionFigure
      clock={clock}
      heading="Right every frame, wrong over time"
      caption="Illustrative. Chips are the decision at each replan (L or R). The dashed line on the right is the previous plan, re-used as the next frame’s starting point."
    >
      <svg viewBox="0 0 720 362" className={styles.svg} role="img" aria-labelledby="zz-t zz-d">
        <title id="zz-t">Zig-zagging back to the middle versus committing to a side</title>
        <desc id="zz-d">
          Two copies of the same scene with a box ahead. On the left, a planner that starts from scratch every frame
          chooses left, then right, then left, and the alternating choices cancel out until the car drives straight into
          the box. On the right, a planner that reuses its previous plan picks left on every frame and goes around the
          box.
        </desc>

        <text x={LEFT} y={24} textAnchor="middle" className={styles.title}>Plans from scratch</text>
        <text x={RIGHT} y={24} textAnchor="middle" className={styles.title}>Reuses its last plan</text>

        <Lane cx={LEFT} />
        <Box cx={LEFT} hit={hit} />
        {pl > 0 && <path d={pathD(sample(stateless, pl, 80))} className={styles.trailAmber} />}
        <Car at={stateless(pl)} toward={hit ? undefined : stateless(Math.min(1, pl + 0.01))} />
        {hit && <text x={LEFT + 34} y={126} className={styles.labelAmber}>collision</text>}
        <Chips cx={LEFT} upto={pl} pick={f => (Math.cos(2 * Math.PI * 2.8 * f) > 0 ? 'R' : 'L')} good={false} />

        <Lane cx={RIGHT} />
        <Box cx={RIGHT} />
        {p < 1 && <path d={pathD(sample(q => committed(p + (ahead - p) * q), 1, 20))} className={`${styles.trailTeal} ${styles.dashed}`} opacity={0.6} />}
        {p > 0 && <path d={pathD(sample(committed, p))} className={styles.trailTeal} style={{ strokeWidth: 2.5 }} />}
        <Car at={committed(p)} toward={committed(Math.min(1, p + 0.02))} />
        <Chips cx={RIGHT} upto={p} pick={() => 'L'} good />

        <text x={LEFT} y={352} textAnchor="middle" className={styles.label}>no memory: L and R cancel out</text>
        <text x={RIGHT} y={352} textAnchor="middle" className={styles.label}>warm start: the choice carries over</text>
      </svg>
    </MotionFigure>
  );
}
