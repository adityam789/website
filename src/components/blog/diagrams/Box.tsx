import styles from './Diagram.module.css';

export type BoxKind = 'ink' | 'teal' | 'amber' | 'plain';

/** Rounded node with a serif title and optional sub-lines, shared by the newer diagrams. */
export function Box(props: {
  x: number; y: number; w: number; h: number; kind: BoxKind; title: string; sub?: string[];
}) {
  const { x, y, w, h, kind, title, sub = [] } = props;
  const ink = kind === 'ink';
  const top = y + (sub.length ? h / 2 - 6 - (sub.length - 1) * 8 : h / 2 + 7);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} className={`${styles.node} ${styles[kind]}`} />
      <text x={x + w / 2} y={top} textAnchor="middle" className={ink ? styles.inkTitle : styles.title}>
        {title}
      </text>
      {sub.map((s, i) => (
        <text
          key={s}
          x={x + w / 2}
          y={top + 20 + i * 16}
          textAnchor="middle"
          className={ink ? styles.inkSub : styles.sub}
        >
          {s}
        </text>
      ))}
    </g>
  );
}
