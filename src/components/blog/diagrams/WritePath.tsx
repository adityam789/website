import styles from './Diagram.module.css';
import { Box } from './Box';

/** Cross-region replication: a replica in your region gives local reads, but writes still go to the primary. */
export default function WritePath() {
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 420" className={styles.svg} role="img" aria-labelledby="wp-t wp-d">
        <title id="wp-t">Cross-region replication: writes go to the primary, reads can stay local</title>
        <desc id="wp-d">
          A service in region B writes to the primary instance in region A, which crosses regions. The primary
          replicates asynchronously to a read-only secondary in region B. The service then reads from that local
          secondary, which may lag behind the primary.
        </desc>
        <defs>
          <marker id="wp-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
          <marker id="wp-l" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHeadLoop} />
          </marker>
        </defs>

        {/* region bands */}
        <rect x={20} y={20} width={720} height={140} rx={14} className={`${styles.edge} ${styles.edgeDashed}`} />
        <text x={38} y={44} className={styles.tag}>region A</text>
        <rect x={20} y={190} width={720} height={215} rx={14} className={`${styles.edge} ${styles.edgeDashed}`} />
        <text x={38} y={214} className={styles.tag}>region B · where your compute runs</text>

        <Box x={470} y={56} w={250} h={84} kind="ink" title="Primary"
          sub={['Only instance that accepts writes']} />
        <Box x={50} y={262} w={230} h={90} kind="plain" title="Your service"
          sub={['Runs in region B']} />
        <Box x={470} y={262} w={250} h={90} kind="teal" title="Secondary"
          sub={['Read-only, asynchronous copy']} />

        {/* 1: the write crosses regions */}
        <path d="M280 284 C 380 284 380 98 470 98" className={`${styles.edge} ${styles.edgeLoop}`}
          markerEnd="url(#wp-l)" />
        <text x={396} y={180} className={styles.labelLoop}>1 write crosses regions</text>

        {/* 2: async replication */}
        <path d="M595 140 V262" className={`${styles.edge} ${styles.edgeDashed}`} markerEnd="url(#wp-a)" />
        <text x={607} y={226} className={styles.label}>2 async replication</text>

        {/* 3: local read */}
        <path d="M470 330 H280" className={styles.edge} markerEnd="url(#wp-a)" />
        <text x={375} y={320} textAnchor="middle" className={styles.label}>3 local read, may lag</text>
      </svg>
      <figcaption className={styles.caption}>
        A replica in your region gives you local reads, not local writes. The write still crosses to the primary,
        and the replica catches up afterward.
      </figcaption>
    </figure>
  );
}
