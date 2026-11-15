import results from '../../../data/decision-models-results.json';
import styles from './Chart.module.css';

type System = 'decider' | 'decider_fitted' | 'encoder_few' | 'encoder_full';

const SYSTEMS: { key: System; label: string }[] = [
  { key: 'decider', label: 'Decision model, as shipped' },
  { key: 'decider_fitted', label: 'Decision model + cheap fit' },
  { key: 'encoder_few', label: 'Fine-tuned encoder' },
  { key: 'encoder_full', label: 'Fine-tuned encoder' },
];

// The two tasks that are absent from the decision model's published training list.
const TASKS = [
  { key: 'bitext' as const, title: 'Bitext banking intents' },
  { key: 'enron' as const, title: 'Enron email spam' },
];

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const labels = (n: number) => (n === 0 ? 'No labels' : `${n.toLocaleString('en-US')} labels`);

const GROUPS = TASKS.map(t => ({
  ...t,
  rows: SYSTEMS.map(s => {
    const m = results[t.key][s.key];
    return {
      ...s,
      note: labels(m.labels_used),
      accuracy: m.accuracy,
      ece: m.ece,
      coverage: m['coverage_at_0.90'],
    };
  }),
}));
type Row = (typeof GROUPS)[number]['rows'][number];

// One axis per panel. The error axis ends at the next tenth above the largest value.
const ECE_MAX = Math.max(0.1, Math.ceil(Math.max(...GROUPS.flatMap(g => g.rows.map(r => r.ece))) * 10) / 10);

const PANELS = [
  { title: 'Accuracy', x: 215, w: 105, max: 1, get: (d: Row) => d.accuracy, fmt: pct },
  { title: 'Calibration error', x: 400, w: 115, max: ECE_MAX, get: (d: Row) => d.ece, fmt: (v: number) => v.toFixed(3) },
  { title: 'Coverage at 0.90', x: 580, w: 90, max: 1, get: (d: Row) => d.coverage, fmt: pct },
];

const BAR_H = 18;
const ROW_STEP = 46;
const GROUP_H = 34 + ROW_STEP * SYSTEMS.length;
const TOP = 44;
const BOTTOM = TOP + GROUP_H * GROUPS.length;

/** Results from the experiment repo for the two unseen tasks: accuracy, calibration error and coverage, one axis each. */
export default function DecisionFit() {
  return (
    <figure className={`${styles.figure} ${styles.root}`}>
      <p className={styles.heading}>What a few hundred labels buy, on two tasks the model had not seen</p>
      <svg viewBox={`0 0 720 ${BOTTOM + 10}`} className={styles.svg} role="img" aria-labelledby="df-t df-d">
        <title id="df-t">Accuracy, calibration error and coverage for four systems on two classification tasks</title>
        <desc id="df-d">
          {GROUPS.map(g =>
            g.rows
              .map(
                d =>
                  `${g.title}. ${d.label} (${d.note}): accuracy ${pct(d.accuracy)}, calibration error ` +
                  `${d.ece.toFixed(3)}, coverage at 0.90 confidence ${pct(d.coverage)}. `,
              )
              .join(''),
          ).join('')}
        </desc>

        {PANELS.map(p => (
          <g key={p.title}>
            <text x={p.x} y={30} className={styles.panelTitle}>{p.title}</text>
            <line x1={p.x} x2={p.x} y1={TOP} y2={BOTTOM} className={styles.axis} />
            <line x1={p.x + p.w / 2} x2={p.x + p.w / 2} y1={TOP} y2={BOTTOM} className={styles.grid} />
            <line x1={p.x + p.w} x2={p.x + p.w} y1={TOP} y2={BOTTOM} className={styles.grid} />
          </g>
        ))}

        {GROUPS.map((g, gi) => {
          const top = TOP + GROUP_H * gi;
          return (
            <g key={g.key}>
              <text x={0} y={top + 16} className={styles.panelTitle}>{g.title}</text>
              {g.rows.map((d, i) => {
                const y = top + 30 + ROW_STEP * i;
                return (
                  <g key={d.key}>
                    <text x={0} y={y + 8} className={styles.rowLabel}>{d.label}</text>
                    <text x={0} y={y + 24} className={styles.note}>{d.note}</text>
                    {PANELS.map(p => {
                      const v = p.get(d);
                      const w = Math.max(4, (v / p.max) * p.w);
                      return (
                        <g key={p.title}>
                          <path
                            className={styles.hoverBar}
                            fill="var(--c-blue)"
                            d={`M${p.x} ${y} H${p.x + w - 4} a4 4 0 0 1 4 4 V${y + BAR_H - 4} a4 4 0 0 1 -4 4 H${p.x} Z`}
                          >
                            <title>{`${d.label} (${d.note}): ${p.title.toLowerCase()} ${p.fmt(v)}`}</title>
                          </path>
                          <text x={p.x + w + 6} y={y + 14} className={styles.value}>{p.fmt(v)}</text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <table className={styles.srOnly}>
        <caption>Results by task and system</caption>
        <thead>
          <tr>
            <th>Task</th><th>System</th><th>Labels</th><th>Accuracy</th><th>Calibration error</th>
            <th>Coverage at 0.90</th>
          </tr>
        </thead>
        <tbody>
          {GROUPS.flatMap(g =>
            g.rows.map(d => (
              <tr key={`${g.key}-${d.key}`}>
                <td>{g.title}</td><td>{d.label}</td><td>{d.note}</td><td>{pct(d.accuracy)}</td>
                <td>{d.ece.toFixed(3)}</td><td>{pct(d.coverage)}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      <p className={styles.caption}>
        Bitext: 26 intents, 520 test messages. Enron: spam or not, 600 test emails. Calibration error is expected calibration error, where lower is better. Coverage is the share of test items
        answered with confidence of 0.90 or more. Decision model: Strands Decider 2B, frozen. Encoder: DistilRoBERTa.
        One seed, run on a MacBook Air.
      </p>
    </figure>
  );
}
