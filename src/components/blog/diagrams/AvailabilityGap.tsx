import styles from './Diagram.module.css';

/** Pod state over time: up bands and restart bands, as widths in px. Illustrative, not incident data. */
const BANDS = [
  { up: true, w: 150 }, { up: false, w: 90 }, { up: true, w: 120 }, { up: false, w: 100 },
  { up: true, w: 110 }, { up: false, w: 110 },
];
const X0 = 40;
const STEP = 20;

/** Why a restart loop reads as 100% available from the inside: only requests that arrive get counted. */
export default function AvailabilityGap() {
  const spans = BANDS.reduce<{ up: boolean; x: number; w: number }[]>((acc, b) => {
    const prev = acc[acc.length - 1];
    return [...acc, { ...b, x: prev ? prev.x + prev.w : X0 }];
  }, []);
  const total = spans.reduce((s, b) => s + b.w, 0);
  const dots = Array.from({ length: Math.floor(total / STEP) }, (_, i) => {
    const x = X0 + STEP / 2 + i * STEP;
    return { x, up: spans.some(b => b.up && x >= b.x && x < b.x + b.w) };
  });
  const served = dots.filter(d => d.up).length;
  const pct = Math.round((served / dots.length) * 100);

  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 330" className={styles.svg} role="img" aria-labelledby="ag-t ag-d">
        <title id="ag-t">A restarting pod looks fully available from the inside</title>
        <desc id="ag-d">
          The caller sends a steady stream of requests. The pod alternates between running and restarting. Requests
          that arrive while it runs succeed and are counted. Requests sent while it restarts time out at the gateway
          and never reach the pod, so the pod reports 100 percent while the caller sees about {pct} percent.
        </desc>

        <text x={X0} y={28} className={styles.tag}>requests the caller sent</text>
        {dots.map(d => (
          <circle key={d.x} cx={d.x} cy={52} r={5} className={`${styles.node} ${d.up ? styles.teal : styles.amber}`} />
        ))}

        <text x={X0} y={98} className={styles.tag}>the pod</text>
        {spans.map(b => (
          <g key={b.x}>
            <rect x={b.x + 1} y={110} width={b.w - 2} height={46} rx={8}
              className={`${styles.node} ${b.up ? styles.teal : styles.amber}`} />
            <text x={b.x + b.w / 2} y={138} textAnchor="middle" className={styles.sub}>
              {b.up ? 'running' : 'restarting'}
            </text>
          </g>
        ))}

        <text x={X0} y={196} className={styles.tag}>what each side measured</text>
        <rect x={X0} y={208} width={330} height={96} rx={12} className={`${styles.node} ${styles.teal}`} />
        <text x={X0 + 165} y={244} textAnchor="middle" className={styles.title}>Pod: 100% available</text>
        <text x={X0 + 165} y={268} textAnchor="middle" className={styles.sub}>{served} arrived, {served} succeeded</text>
        <text x={X0 + 165} y={286} textAnchor="middle" className={styles.sub}>The rest never entered the count</text>

        <rect x={X0 + 350} y={208} width={330} height={96} rx={12} className={`${styles.node} ${styles.amber}`} />
        <text x={X0 + 515} y={244} textAnchor="middle" className={styles.title}>Caller: {pct}% succeeded</text>
        <text x={X0 + 515} y={268} textAnchor="middle" className={styles.sub}>{dots.length} sent, {dots.length - served} timed out</text>
        <text x={X0 + 515} y={286} textAnchor="middle" className={styles.sub}>504s from the gateway, not the pod</text>
      </svg>
      <figcaption className={styles.caption}>
        Illustrative numbers. Both readings are correct. Only one of them describes what users got.
      </figcaption>
    </figure>
  );
}
