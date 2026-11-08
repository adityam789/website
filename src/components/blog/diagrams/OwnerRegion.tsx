import styles from './Diagram.module.css';
import { Box } from './Box';

/** One owner region per key: every claim for key K goes to the same Valkey primary. */
export default function OwnerRegion() {
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 440" className={styles.svg} role="img" aria-labelledby="or-t or-d">
        <title id="or-t">Routing each key to a single owner region</title>
        <desc id="or-d">
          Services in regions 1, 2 and 3 all receive a request for key K. Hashing K picks region 2 as the owner. The
          region 2 service claims the key locally. The services in regions 1 and 3 each make one cross-region hop to
          the region 2 primary. Other keys hash to other regions, so every region owns a slice of the keys.
        </desc>
        <defs>
          <marker id="or-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
          <marker id="or-l" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHeadLoop} />
          </marker>
        </defs>

        <Box x={30} y={30} w={230} h={70} kind="plain" title="Service · region 1" sub={['Request for key K']} />
        <Box x={30} y={150} w={230} h={70} kind="plain" title="Service · region 2" sub={['Request for key K']} />
        <Box x={30} y={270} w={230} h={70} kind="plain" title="Service · region 3" sub={['Request for key K']} />

        <Box x={490} y={130} w={240} h={110} kind="ink" title="Valkey primary"
          sub={['Region 2 owns key K', 'The atomic claim happens here']} />

        {/* cross-region hops */}
        <path d="M260 65 L490 152" className={`${styles.edge} ${styles.edgeLoop}`} markerEnd="url(#or-l)" />
        <text x={380} y={100} className={styles.labelLoop}>SET K NX · 1 hop</text>
        <path d="M260 305 L490 218" className={`${styles.edge} ${styles.edgeLoop}`} markerEnd="url(#or-l)" />
        <text x={380} y={290} className={styles.labelLoop}>SET K NX · 1 hop</text>

        {/* owner-local */}
        <path d="M260 185 H490" className={styles.edge} markerEnd="url(#or-a)" />
        <text x={375} y={177} textAnchor="middle" className={styles.label}>SET K NX · local</text>

        <rect x={30} y={366} width={700} height={58} rx={12} className={`${styles.edge} ${styles.edgeDashed}`} />
        <text x={380} y={390} textAnchor="middle" className={styles.sub}>
          owner(K) = hash(K) → one region. The same key always lands on the same owner.
        </text>
        <text x={380} y={410} textAnchor="middle" className={styles.sub}>
          Other keys hash to other regions, so every region owns a slice of the keys.
        </text>
      </svg>
      <figcaption className={styles.caption}>
        One decision point per key, not one global one. Non-owner regions pay a single cross-region hop.
      </figcaption>
    </figure>
  );
}
