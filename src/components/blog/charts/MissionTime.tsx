import styles from './Chart.module.css';

const SEGMENTS = [
  { name: 'Orchestration', hours: 0.38, pct: 2.3, color: 'var(--c-blue)' },
  { name: 'Implementation', hours: 9.98, pct: 60.5, color: 'var(--c-amber)' },
  { name: 'Validation', hours: 6.14, pct: 37.2, color: 'var(--c-teal)' },
];

const X0 = 20;
const W = 680;
const GAP = 2;
const BAR_Y = 70;
const BAR_H = 36;

/** Where one 16.5-hour Factory mission spent its time (single stacked bar, 3 segments). */
export default function MissionTime() {
  let cursor = X0;
  const total = SEGMENTS.reduce((s, d) => s + d.pct, 0);
  const placed = SEGMENTS.map(s => {
    const w = (s.pct / total) * W;
    const seg = { ...s, x: cursor, w };
    cursor += w;
    return seg;
  });

  return (
    <figure className={`${styles.figure} ${styles.root}`}>
      <p className={styles.heading}>Validation took over a third of the clock</p>
      <svg viewBox="0 0 720 170" className={styles.svg} role="img" aria-labelledby="mt-t mt-d">
        <title id="mt-t">Where a 16.5-hour mission spent its time</title>
        <desc id="mt-d">
          Orchestration 2.3 percent (0.38 hours), implementation 60.5 percent (9.98 hours), validation 37.2 percent
          (6.14 hours).
        </desc>

        {placed.map((s, i) => {
          const first = i === 0;
          const last = i === placed.length - 1;
          const x = s.x + (first ? 0 : GAP / 2);
          const w = s.w - (first || last ? GAP / 2 : GAP);
          const r = 4;
          // square the ends that touch a neighbor, round the outer ends
          const d = `M${x + (first ? r : 0)} ${BAR_Y} H${x + w - (last ? r : 0)}${
            last ? ` a${r} ${r} 0 0 1 ${r} ${r} V${BAR_Y + BAR_H - r} a${r} ${r} 0 0 1 -${r} ${r}` : ` V${BAR_Y + BAR_H}`
          } H${x + (first ? r : 0)}${
            first ? ` a${r} ${r} 0 0 1 -${r} -${r} V${BAR_Y + r} a${r} ${r} 0 0 1 ${r} -${r}` : ` V${BAR_Y}`
          } Z`;
          return (
            <path key={s.name} d={d} fill={s.color} className={styles.hoverBar}>
              <title>{`${s.name}: ${s.pct}% (${s.hours} h)`}</title>
            </path>
          );
        })}

        {/* Orchestration label above (its segment is too narrow for text), leader line down to the sliver */}
        <line x1={placed[0].x + placed[0].w / 2} x2={placed[0].x + placed[0].w / 2} y1={52} y2={BAR_Y - 2}
          className={styles.axis} />
        <rect x={X0} y={26} width={10} height={10} rx={2} fill="var(--c-blue)" />
        <text x={X0 + 16} y={35} className={styles.value}>Orchestration</text>
        <text x={X0 + 112} y={35} className={styles.valueSub}>0.38 h · 2.3%</text>

        {placed.slice(1).map(s => (
          <g key={s.name}>
            <rect x={s.x + 2} y={BAR_Y + BAR_H + 18} width={10} height={10} rx={2} fill={s.color} />
            <text x={s.x + 18} y={BAR_Y + BAR_H + 27} className={styles.value}>{s.name}</text>
            <text x={s.x + 18} y={BAR_Y + BAR_H + 46} className={styles.valueSub}>
              {s.hours} h · {s.pct}%
            </text>
          </g>
        ))}
      </svg>

      <table className={styles.srOnly}>
        <caption>Time by phase for one 16.5-hour mission</caption>
        <thead><tr><th>Phase</th><th>Hours</th><th>Share</th></tr></thead>
        <tbody>
          {SEGMENTS.map(s => <tr key={s.name}><td>{s.name}</td><td>{s.hours}</td><td>{s.pct}%</td></tr>)}
        </tbody>
      </table>
      <p className={styles.caption}>
        One vendor example run: a Slack clone, 185 runs, 6 milestones, 16.5 hours. Source: Factory, &ldquo;How Missions
        Work&rdquo;, Apr 10, 2026.
      </p>
    </figure>
  );
}
