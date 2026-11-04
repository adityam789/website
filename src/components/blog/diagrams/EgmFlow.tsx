import styles from './Diagram.module.css';

type Kind = 'ink' | 'teal' | 'amber' | 'plain';

function Box(props: {
  x: number; y: number; w: number; h: number; kind: Kind; title: string; sub?: string[];
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

/** Elephant-Goldfish design-review flow (UML activity style), drawn as themed inline SVG. */
export default function EgmFlow() {
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 750" className={styles.svg} role="img" aria-labelledby="egm-t egm-d">
        <title id="egm-t">Elephant-Goldfish design review flow</title>
        <desc id="egm-d">
          An Elephant session drafts the spec and writes no code. Three fresh Goldfish reviewers run in sequence:
          a comprehension check, an antagonistic review, and an implementation readiness check. A no-go returns to the
          Elephant. On go, a human approves the spec; if not approved it returns to the Elephant, otherwise
          implementation starts.
        </desc>
        <defs>
          <marker id="egm-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
          <marker id="egm-l" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHeadLoop} />
          </marker>
        </defs>

        {/* main spine */}
        <path d="M380 116 V156" className={styles.edge} markerEnd="url(#egm-a)" />
        <path d="M380 228 V262" className={styles.edge} markerEnd="url(#egm-a)" />
        <path d="M380 334 V368" className={styles.edge} markerEnd="url(#egm-a)" />
        <path d="M380 440 V488" className={styles.edge} markerEnd="url(#egm-a)" />
        <path d="M380 612 V662" className={styles.edge} markerEnd="url(#egm-a)" />

        {/* loops back to the Elephant */}
        <path d="M230 404 H110 V68 H180" className={`${styles.edge} ${styles.edgeLoop}`} markerEnd="url(#egm-l)" />
        <path d="M530 550 H650 V68 H580" className={`${styles.edge} ${styles.edgeLoop}`} markerEnd="url(#egm-l)" />

        <Box x={180} y={20} w={400} h={96} kind="ink" title="Elephant"
          sub={['One long session holds the project context.', 'Drafts the spec. Writes no code.']} />
        <Box x={230} y={156} w={300} h={72} kind="teal" title="Goldfish 1 · Comprehension"
          sub={['Fresh context. Explains the design back.']} />
        <Box x={230} y={262} w={300} h={72} kind="teal" title="Goldfish 2…n · Antagonistic"
          sub={['Edge cases, hidden dependencies, gaps.']} />
        <Box x={230} y={368} w={300} h={72} kind="teal" title="Final Goldfish · Readiness"
          sub={['Paths, data structures, signatures.']} />

        {/* human gate */}
        <path d="M380 488 L530 550 L380 612 L230 550 Z" className={`${styles.node} ${styles.amber}`} />
        <text x={380} y={545} textAnchor="middle" className={styles.title}>Human approves</text>
        <text x={380} y={567} textAnchor="middle" className={styles.title}>the spec?</text>

        <Box x={230} y={662} w={300} h={64} kind="plain" title="Implementation" />

        <text x={392} y={470} className={styles.label}>go</text>
        <text x={392} y={642} className={styles.label}>yes</text>
        <text x={98} y={236} textAnchor="end" className={styles.labelLoop}>no-go: revise</text>
        <text x={662} y={310} className={styles.labelLoop}>no: revise</text>
      </svg>
      <figcaption className={styles.caption}>
        Elephant-Goldfish: design in a long context, review in fresh ones, and a human decides before code.
      </figcaption>
    </figure>
  );
}
