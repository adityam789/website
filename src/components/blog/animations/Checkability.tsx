'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { lerp, smooth } from '../motion/math';
import styles from '../motion/Motion.module.css';

const X0 = 40;
const X1 = 680;
const AXIS_Y = 168;
const X = (v: number) => X0 + (X1 - X0) * v;

/** Rough, illustrative placement on "how cheaply can a machine check the output?". */
const TASKS = [
  { v: 0.04, label: 'proof in Lean', up: true },
  { v: 0.13, label: 'code with tests', up: false },
  { v: 0.22, label: 'SQL, known rows', up: true },
  { v: 0.31, label: 'refactor + CI', up: false },
  { v: 0.4, label: 'translation', up: true },
  { v: 0.56, label: 'system design', up: false },
  { v: 0.65, label: 'a diagnosis', up: true },
  { v: 0.75, label: 'a novel', up: false },
  { v: 0.85, label: 'folding laundry', up: true },
  { v: 0.94, label: 'driving in snow', up: false },
];

const STAGES = [
  { label: 'pretraining', at: 0.24, from: 0, edge: 0.16 },
  { label: '+ RL on checkable rewards', at: 0.5, from: 0.28, edge: 0.33 },
  { label: '+ formal verifiers', at: 0.95, from: 0.54, edge: 0.44 },
];
const WALL = 0.48;

/** The automation frontier moves exactly as far as checkers do. */
export default function Checkability() {
  const clock = useClock({ duration: 8000 });
  const t = clock.t;
  const e1 = smooth(0.04, 0.2, t);
  const e2 = smooth(0.3, 0.46, t);
  const e3 = smooth(0.56, 0.72, t);
  const edge = lerp(lerp(lerp(0, STAGES[0].edge, e1), STAGES[1].edge, e2), STAGES[2].edge, e3);
  const stage = STAGES.reduce((acc, s, i) => (t >= s.from ? i : acc), 0);
  const showWall = smooth(0.74, 0.84, t);

  return (
    <MotionFigure
      clock={clock}
      heading="Automation goes as far as the checkers go"
      caption="Illustrative placement, not measured data. Left: outputs a machine can verify cheaply. Right: outputs with no checker, or that live in the physical world."
      phases={STAGES.map(s => ({ label: s.label, at: s.at, from: s.from }))}
    >
      <svg viewBox="0 0 720 300" className={styles.svg} role="img" aria-labelledby="ck-t ck-d">
        <title id="ck-t">The automation frontier follows machine-checkability</title>
        <desc id="ck-d">
          Ten tasks along an axis from easy to verify (a proof in Lean, code with tests, SQL with known rows, a refactor
          with green CI, translation) to hard or impossible to verify (system design, a diagnosis, a novel, folding
          laundry, driving in snow). A shaded automated region grows from the left in three stages: pretraining, then
          reinforcement learning on checkable rewards, then formal verifiers. It stops at a wall labelled no cheap checker.
        </desc>

        <text x={X0} y={28} className={styles.label}>easy to check</text>
        <text x={X1} y={28} textAnchor="end" className={styles.label}>no checker / physical world</text>

        <rect x={X0} y={44} width={Math.max(0, X(edge) - X0)} height={248} rx={10} className={styles.chipTeal} opacity={0.8} />
        {edge > 0.02 && (
          <text x={X(edge) - 8} y={64} textAnchor="end" className={styles.labelTeal}>automated</text>
        )}

        <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} className={styles.axis} />
        {TASKS.map(task => {
          const done = task.v < edge;
          const ly = task.up ? AXIS_Y - 30 : AXIS_Y + 40;
          return (
            <g key={task.label}>
              <line x1={X(task.v)} y1={AXIS_Y} x2={X(task.v)} y2={task.up ? ly + 6 : ly - 14} className={styles.axis} />
              <circle cx={X(task.v)} cy={AXIS_Y} r={7} className={done ? styles.dotTeal : styles.chip} />
              {done && (
                <path
                  d={`M${X(task.v) - 3.5} ${AXIS_Y} l2.5 2.6 l4.5 -5`}
                  fill="none"
                  stroke="var(--surface)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              )}
              <text x={X(task.v)} y={ly} textAnchor="middle" className={done ? styles.labelTeal : styles.label}>
                {task.label}
              </text>
            </g>
          );
        })}

        <g opacity={showWall}>
          <line x1={X(WALL)} y1={44} x2={X(WALL)} y2={292} className={`${styles.trailAmber} ${styles.dashed}`} />
          <text x={X(WALL) + 8} y={268} className={styles.labelAmber}>no cheap checker past here:</text>
          <text x={X(WALL) + 8} y={284} className={styles.labelAmber}>more RL on text won’t move this line</text>
        </g>

        <text x={360} y={28} textAnchor="middle" className={styles.labelTeal}>stage {stage + 1}: {STAGES[stage].label}</text>
      </svg>
    </MotionFigure>
  );
}
