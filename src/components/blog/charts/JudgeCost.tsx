import styles from './Chart.module.css';

const ROWS = [
  { label: 'Solo agent', note: 'Core feature did not work', cost: 9, minutes: 20, costLabel: '$9', timeLabel: '20 min' },
  {
    label: 'Planner, generator, evaluator',
    note: 'Playable app',
    cost: 200,
    minutes: 360,
    costLabel: '$200',
    timeLabel: '6 hours',
  },
];

const BAR_H = 18;
const ROW_Y = [74, 150];
const COST = { x: 220, w: 200, max: 200 };
const TIME = { x: 500, w: 170, max: 360 };

/** Cost and time of the same prompt, solo versus full harness (Anthropic, Mar 2026). Small multiples, one axis each. */
export default function JudgeCost() {
  return (
    <figure className={`${styles.figure} ${styles.root}`}>
      <p className={styles.heading}>Same prompt, very different bill</p>
      <svg viewBox="0 0 720 210" className={styles.svg} role="img" aria-labelledby="jc-t jc-d">
        <title id="jc-t">Cost and time of the same prompt, solo agent versus full harness</title>
        <desc id="jc-d">
          Solo agent: $9 and 20 minutes, and the core feature did not work. Planner, generator and evaluator harness:
          $200 and 6 hours, and the app was playable.
        </desc>

        <text x={COST.x} y={30} className={styles.panelTitle}>Cost</text>
        <text x={TIME.x} y={30} className={styles.panelTitle}>Time</text>

        {[COST, TIME].map(p => (
          <g key={p.x}>
            <line x1={p.x} x2={p.x} y1={44} y2={186} className={styles.axis} />
            <line x1={p.x + p.w / 2} x2={p.x + p.w / 2} y1={44} y2={186} className={styles.grid} />
            <line x1={p.x + p.w} x2={p.x + p.w} y1={44} y2={186} className={styles.grid} />
          </g>
        ))}

        {ROWS.map((r, i) => {
          const y = ROW_Y[i];
          const cw = Math.max(4, (r.cost / COST.max) * COST.w);
          const tw = Math.max(4, (r.minutes / TIME.max) * TIME.w);
          return (
            <g key={r.label}>
              <text x={0} y={y + 8} className={styles.rowLabel}>{r.label}</text>
              <text x={0} y={y + 28} className={styles.note}>{r.note}</text>

              <path
                className={styles.hoverBar}
                fill="var(--c-blue)"
                d={`M${COST.x} ${y} H${COST.x + cw - 4} a4 4 0 0 1 4 4 V${y + BAR_H - 4} a4 4 0 0 1 -4 4 H${COST.x} Z`}
              >
                <title>{`${r.label}: ${r.costLabel}`}</title>
              </path>
              <text x={COST.x + cw + 8} y={y + 14} className={styles.value}>{r.costLabel}</text>

              <path
                className={styles.hoverBar}
                fill="var(--c-blue)"
                d={`M${TIME.x} ${y} H${TIME.x + tw - 4} a4 4 0 0 1 4 4 V${y + BAR_H - 4} a4 4 0 0 1 -4 4 H${TIME.x} Z`}
              >
                <title>{`${r.label}: ${r.timeLabel}`}</title>
              </path>
              <text x={TIME.x + tw + 8} y={y + 14} className={styles.value}>{r.timeLabel}</text>
            </g>
          );
        })}
      </svg>

      <table className={styles.srOnly}>
        <caption>Cost and time, solo versus full harness</caption>
        <thead><tr><th>Run</th><th>Cost</th><th>Time</th><th>Outcome</th></tr></thead>
        <tbody>
          {ROWS.map(r => (
            <tr key={r.label}><td>{r.label}</td><td>{r.costLabel}</td><td>{r.timeLabel}</td><td>{r.note}</td></tr>
          ))}
        </tbody>
      </table>
      <p className={styles.caption}>
        Prompt: a 2D retro game maker with a level editor, sprite editor, entity behaviors and a playable test mode.
        Opus 4.5. Source: Anthropic, &ldquo;Harness design for long-running application development&rdquo;, Mar 24, 2026.
      </p>
    </figure>
  );
}
