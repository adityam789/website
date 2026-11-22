import { headingDeg, smooth, type Pt } from './math';
import styles from './Motion.module.css';

/** Geometry for the top-down "box in the lane" panels (car drives up the screen). */
export const LANE = { top: 44, bottom: 300, half: 100, startY: 282, endY: 56, obsY: 122, obsW: 48, obsH: 26 };

export const yAt = (p: number) => LANE.startY - (LANE.startY - LANE.endY) * p;

/** Progress at which a car driving straight touches the box. */
export const HIT_P = (LANE.startY - (LANE.obsY + LANE.obsH / 2 + 14)) / (LANE.startY - LANE.endY);

/** Lateral offset of a swerve around the box: out, hold past it, back to center. */
export const swerve = (p: number, side: number, amp = 62) =>
  side * amp * smooth(0.12, 0.42, p) * (1 - smooth(0.74, 0.96, p));

export function Lane({ cx }: { cx: number }) {
  return (
    <rect
      x={cx - LANE.half}
      y={LANE.top}
      width={LANE.half * 2}
      height={LANE.bottom - LANE.top}
      rx={10}
      className={styles.road}
    />
  );
}

export function Box({ cx, hit = false }: { cx: number; hit?: boolean }) {
  return (
    <rect
      x={cx - LANE.obsW / 2}
      y={LANE.obsY - LANE.obsH / 2}
      width={LANE.obsW}
      height={LANE.obsH}
      rx={4}
      className={hit ? styles.obstacleHit : styles.obstacle}
    />
  );
}

/** A car pointing up at `at`, turned to face `toward` when given. */
export function Car({ at, toward, faint = false }: { at: Pt; toward?: Pt; faint?: boolean }) {
  const raw = toward && (toward[0] !== at[0] || toward[1] !== at[1]) ? headingDeg(at, toward) : 0;
  const angle = Math.max(-35, Math.min(35, raw)); // cars don't turn sideways in a lane
  return (
    <g transform={`translate(${at[0].toFixed(1)} ${at[1].toFixed(1)}) rotate(${angle.toFixed(1)})`} opacity={faint ? 0.35 : 1}>
      <rect x={-8} y={-14} width={16} height={28} rx={5} className={styles.car} />
      <rect x={-5.5} y={-9} width={11} height={6} rx={2} className={styles.windshield} />
    </g>
  );
}
