import styles from './Diagram.module.css';

const MOVES = [
  ['Isolate context'],
  ['Separate writer', 'and judge'],
  ['Deterministic code', 'around the model'],
  ['Spend model money', 'by role'],
];

/** Moves (1-based) that each team's own post describes. */
const TEAMS: { name: string; moves: number[] }[] = [
  { name: 'Google EGM', moves: [1, 2] },
  { name: 'Factory Missions', moves: [1, 2, 4] },
  { name: 'Cursor', moves: [2, 4] },
  { name: 'Stripe Minions', moves: [3] },
  { name: 'Spotify Honk', moves: [2, 3] },
  { name: 'Ramp Inspect', moves: [3] },
];

const LX = 20, LW = 220, LH = 50, LSTEP = 80, LY0 = 20;
const RX = 500, RW = 250, RH = 84, RSTEP = 124, RY0 = 20;

function spread(index: number, count: number) {
  return (index - (count - 1) / 2) * 12;
}

/** Which teams use which of the four moves, drawn as themed inline SVG. */
export default function Convergence() {
  const incoming = MOVES.map((_, m) => TEAMS.filter(t => t.moves.includes(m + 1)));
  const edges = TEAMS.flatMap((t, ti) =>
    t.moves.map((m, k) => {
      const y1 = LY0 + ti * LSTEP + LH / 2 + spread(k, t.moves.length);
      const slot = incoming[m - 1].indexOf(t);
      const y2 = RY0 + (m - 1) * RSTEP + RH / 2 + spread(slot, incoming[m - 1].length);
      const x1 = LX + LW, x2 = RX;
      const mid = (x1 + x2) / 2;
      return { key: `${t.name}-${m}`, d: `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}` };
    }),
  );

  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 770 500" className={styles.svg} role="img" aria-labelledby="cv-t cv-d">
        <title id="cv-t">Which agent harnesses use which of the four moves</title>
        <desc id="cv-d">
          Google EGM: isolate context, separate writer and judge. Factory Missions: isolate context, separate writer
          and judge, spend model money by role. Cursor: separate writer and judge, spend model money by role. Stripe
          Minions: deterministic code around the model. Spotify Honk: separate writer and judge, deterministic code
          around the model. Ramp Inspect: deterministic code around the model.
        </desc>

        {edges.map(e => <path key={e.key} d={e.d} className={styles.link} />)}

        {TEAMS.map((t, i) => (
          <g key={t.name}>
            <rect x={LX} y={LY0 + i * LSTEP} width={LW} height={LH} rx={10} className={styles.company} />
            <text x={LX + LW / 2} y={LY0 + i * LSTEP + LH / 2 + 5} textAnchor="middle" className={styles.name}>
              {t.name}
            </text>
          </g>
        ))}

        {MOVES.map((lines, i) => {
          const y = RY0 + i * RSTEP;
          const base = y + RH / 2 + (lines.length === 1 ? 5 : -2);
          return (
            <g key={i}>
              <rect x={RX} y={y} width={RW} height={RH} rx={10} className={styles.move} />
              <path d={`M${RX + 10} ${y} H${RX + 4} V${y + RH} H${RX + 10} Z`} className={styles.moveBar} />
              <text x={RX + 20} y={base} className={styles.name}>
                <tspan className={styles.moveNum}>{i + 1}  </tspan>{lines[0]}
              </text>
              {lines[1] && <text x={RX + 20 + 18} y={base + 20} className={styles.name}>{lines[1]}</text>}
            </g>
          );
        })}
      </svg>
      <figcaption className={styles.caption}>
        Lines show the moves each team&apos;s own write-up describes. Source: company posts, read Nov 2026.
      </figcaption>
    </figure>
  );
}
