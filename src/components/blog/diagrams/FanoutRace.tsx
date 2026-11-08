import styles from './Diagram.module.css';
import { Box } from './Box';

const COLS = { a: 70, v1: 235, f: 380, v2: 525, b: 690 };

/** Sequence diagram: async fan-out converges state after both regions already granted the same claim. */
export default function FanoutRace() {
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 440" className={styles.svg} role="img" aria-labelledby="fr-t fr-d">
        <title id="fr-t">Two regions claim the same key before replication arrives</title>
        <desc id="fr-d">
          Caller A and Caller B send the same set-if-absent request to their own regional Valkey at the same moment.
          Both are told the key is claimed. Each region then publishes its claim to the fan-out service, which applies
          it to the other region. Both callers have already proceeded, so the key was claimed twice.
        </desc>
        <defs>
          <marker id="fr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
        </defs>

        {/* lifelines */}
        {Object.values(COLS).map(x => (
          <path key={x} d={`M${x} 72 V332`} className={`${styles.edge} ${styles.edgeDashed}`} opacity={0.5} />
        ))}

        <Box x={COLS.a - 65} y={20} w={130} h={52} kind="plain" title="Caller A" sub={['region 1']} />
        <Box x={COLS.v1 - 65} y={20} w={130} h={52} kind="teal" title="Valkey" sub={['region 1']} />
        <Box x={COLS.f - 65} y={20} w={130} h={52} kind="ink" title="Fan-out" sub={['Pub/Sub or Pulsar']} />
        <Box x={COLS.v2 - 65} y={20} w={130} h={52} kind="teal" title="Valkey" sub={['region 2']} />
        <Box x={COLS.b - 65} y={20} w={130} h={52} kind="plain" title="Caller B" sub={['region 2']} />

        {/* same moment: both claim */}
        <path d={`M${COLS.a} 130 H${COLS.v1}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.a + COLS.v1) / 2} y={122} textAnchor="middle" className={styles.label}>SET key NX</text>
        <path d={`M${COLS.b} 130 H${COLS.v2}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.b + COLS.v2) / 2} y={122} textAnchor="middle" className={styles.label}>SET key NX</text>

        {/* both told "claimed" */}
        <path d={`M${COLS.v1} 175 H${COLS.a}`} className={`${styles.edge} ${styles.edgeDashed}`} markerEnd="url(#fr-a)" />
        <text x={(COLS.a + COLS.v1) / 2} y={167} textAnchor="middle" className={styles.labelLoop}>OK, claimed</text>
        <path d={`M${COLS.v2} 175 H${COLS.b}`} className={`${styles.edge} ${styles.edgeDashed}`} markerEnd="url(#fr-a)" />
        <text x={(COLS.b + COLS.v2) / 2} y={167} textAnchor="middle" className={styles.labelLoop}>OK, claimed</text>

        {/* each region publishes its claim */}
        <path d={`M${COLS.v1} 235 H${COLS.f}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.v1 + COLS.f) / 2} y={227} textAnchor="middle" className={styles.label}>publish A&apos;s claim</text>
        <path d={`M${COLS.v2} 235 H${COLS.f}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.v2 + COLS.f) / 2} y={227} textAnchor="middle" className={styles.label}>publish B&apos;s claim</text>

        {/* fan-out applies them to the other side */}
        <path d={`M${COLS.f} 290 H${COLS.v1}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.v1 + COLS.f) / 2} y={282} textAnchor="middle" className={styles.label}>apply B&apos;s claim</text>
        <path d={`M${COLS.f} 290 H${COLS.v2}`} className={styles.edge} markerEnd="url(#fr-a)" />
        <text x={(COLS.v2 + COLS.f) / 2} y={282} textAnchor="middle" className={styles.label}>apply A&apos;s claim</text>

        <Box x={60} y={352} w={640} h={76} kind="amber" title="Two winners"
          sub={['Both callers saw “claimed” and went ahead.', 'Replication made the regions agree afterward. It did not stop the duplicate.']} />
      </svg>
      <figcaption className={styles.caption}>
        Fan-out gives convergence, not exclusion: the regions end up agreeing, but only after both requests proceeded.
      </figcaption>
    </figure>
  );
}
