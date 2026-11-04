import styles from './Diagram.module.css';

const NODES = [
  { title: 'Implement task', sub: 'Agent loop: the model decides', agent: true },
  { title: 'Run configured linters', sub: 'Plain code: no model involved', agent: false },
  { title: 'Push changes', sub: 'Plain code: no model involved', agent: false },
  { title: 'Fix CI failures', sub: 'Agent loop, at most one retry', agent: true },
];

const X = 100;
const W = 300;
const H = 64;
const STEP = 100;
const Y0 = 70;

/** Stripe-style "blueprint": a workflow in code where only some nodes run an agent loop. */
export default function Blueprint() {
  const humanY = Y0 + NODES.length * STEP;
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 600 600" className={styles.svg} role="img" aria-labelledby="bp-t bp-d">
        <title id="bp-t">Blueprint: workflow in code with agent and deterministic nodes</title>
        <desc id="bp-d">
          Implement task and Fix CI failures run an agent loop. Run configured linters and Push changes are plain code.
          The flow ends in human review. Fix CI failures gets one retry, then goes to a human.
        </desc>
        <defs>
          <marker id="bp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
          <marker id="bp-l" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHeadLoop} />
          </marker>
        </defs>

        {/* legend */}
        <rect x={100} y={16} width={14} height={14} rx={3} className={`${styles.node} ${styles.teal}`} />
        <text x={122} y={28} className={styles.sub}>model decides</text>
        <rect x={236} y={16} width={14} height={14} rx={3} className={`${styles.node} ${styles.ink}`} />
        <text x={258} y={28} className={styles.sub}>code decides</text>
        <rect x={364} y={16} width={14} height={14} rx={3} className={`${styles.node} ${styles.amber}`} />
        <text x={386} y={28} className={styles.sub}>human decides</text>

        {/* edges */}
        {NODES.map((_, i) => (
          <path
            key={i}
            d={`M${X + W / 2} ${Y0 + i * STEP + H} V${Y0 + (i + 1) * STEP}`}
            className={styles.edge}
            markerEnd="url(#bp-a)"
          />
        ))}

        {/* one retry loop on Fix CI failures */}
        <path
          d={`M${X + W} ${Y0 + 3 * STEP + 18} H${X + W + 44} V${Y0 + 3 * STEP + 48} H${X + W}`}
          className={`${styles.edge} ${styles.edgeLoop}`}
          markerEnd="url(#bp-l)"
        />
        <text x={X + W + 54} y={Y0 + 3 * STEP + 36} className={styles.labelLoop}>retry ×1</text>

        {NODES.map((n, i) => {
          const y = Y0 + i * STEP;
          return (
            <g key={n.title}>
              <rect x={X} y={y} width={W} height={H} rx={12}
                className={`${styles.node} ${n.agent ? styles.teal : styles.ink}`} />
              <text x={X + W / 2} y={y + 28} textAnchor="middle"
                className={n.agent ? styles.title : styles.inkTitle}>{n.title}</text>
              <text x={X + W / 2} y={y + 48} textAnchor="middle"
                className={n.agent ? styles.sub : styles.inkSub}>{n.sub}</text>
            </g>
          );
        })}

        <rect x={X} y={humanY} width={W} height={H} rx={12} className={`${styles.node} ${styles.amber}`} />
        <text x={X + W / 2} y={humanY + 28} textAnchor="middle" className={styles.title}>Human review</text>
        <text x={X + W / 2} y={humanY + 48} textAnchor="middle" className={styles.sub}>Still required before merge</text>
      </svg>
      <figcaption className={styles.caption}>
        Illustrative blueprint built from the node names Stripe publishes. The exact order is simplified.
      </figcaption>
    </figure>
  );
}
