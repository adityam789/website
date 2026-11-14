import styles from './Diagram.module.css';
import { Box } from './Box';

const OPTIONS = [
  { label: 'refund', p: 0.86 },
  { label: 'billing', p: 0.11 },
  { label: 'other', p: 0.03 },
];

/** A chat model and a decision model share the same transformer body; only the last step differs. */
export default function DecisionHead() {
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 760 470" className={styles.svg} role="img" aria-labelledby="dh-t dh-d">
        <title id="dh-t">A chat model and a decision model, side by side</title>
        <desc id="dh-d">
          Both models pass the input through the same stack of transformer layers. The chat model ends in a head that
          scores every word in its vocabulary and loops, producing text one token at a time. The decision model ends
          in a head that scores only the options you supplied, once, and returns a probability for each.
        </desc>
        <defs>
          <marker id="dh-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHead} />
          </marker>
          <marker id="dh-l" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className={styles.arrowHeadLoop} />
          </marker>
        </defs>

        <text x={190} y={24} textAnchor="middle" className={styles.tag}>chat model</text>
        <text x={570} y={24} textAnchor="middle" className={styles.tag}>decision model</text>

        {[40, 420].map(x => (
          <g key={x}>
            <path d={`M${x + 150} 100 V124`} className={styles.edge} markerEnd="url(#dh-a)" />
            <path d={`M${x + 150} 204 V228`} className={styles.edge} markerEnd="url(#dh-a)" />
            <path d={`M${x + 150} 308 V332`} className={styles.edge} markerEnd="url(#dh-a)" />
          </g>
        ))}

        <Box x={40} y={40} w={300} h={60} kind="plain" title="Your prompt" />
        <Box x={40} y={124} w={300} h={80} kind="ink" title="Transformer layers" sub={['Attention and feed-forward blocks']} />
        <Box x={40} y={228} w={300} h={80} kind="amber" title="Language head"
          sub={['Scores every token in the vocabulary']} />
        <Box x={40} y={332} w={300} h={60} kind="plain" title="Text, one token at a time" />
        <path d="M340 362 H372 V70 H340" className={`${styles.edge} ${styles.edgeLoop}`} markerEnd="url(#dh-l)" />
        <text x={190} y={418} textAnchor="middle" className={styles.labelLoop}>loops once per output token</text>

        <Box x={420} y={40} w={300} h={60} kind="plain" title="Your input + your options" />
        <Box x={420} y={124} w={300} h={80} kind="ink" title="Transformer layers" sub={['The same kind of body']} />
        <Box x={420} y={228} w={300} h={80} kind="teal" title="Decision head"
          sub={['Scores only the options you gave it']} />
        <rect x={420} y={332} width={300} height={112} rx={12} className={`${styles.node} ${styles.plain}`} />
        {OPTIONS.map((o, i) => (
          <g key={o.label}>
            <text x={438} y={360 + i * 30} className={styles.sub}>{o.label}</text>
            <rect x={500} y={349 + i * 30} width={150 * o.p} height={12} rx={4} className={`${styles.node} ${styles.teal}`} />
            <text x={702} y={360 + i * 30} textAnchor="end" className={styles.label}>{o.p.toFixed(2)}</text>
          </g>
        ))}
        <text x={570} y={462} textAnchor="middle" className={styles.label}>one pass, no loop</text>
      </svg>
      <figcaption className={styles.caption}>
        Illustrative. Designs differ in how the last step is built, but the body is a language model in each case.
      </figcaption>
    </figure>
  );
}
