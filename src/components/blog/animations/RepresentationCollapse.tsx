'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { gauss, lerp, rng, smooth, type Pt } from '../motion/math';
import styles from '../motion/Motion.module.css';

const CX = 250;
const CY = 160;
const R = 110; // embedding-space radius in px
const PER = 10;
const CLASSES = 3;

/** 30 images from 3 kinds of scene, as random starting embeddings (unit-ish space). */
const POINTS = (() => {
  const r = rng(21);
  return Array.from({ length: PER * CLASSES }, (_, i) => {
    const c = Math.floor(i / PER);
    const start: Pt = [gauss(r) * 0.55, gauss(r) * 0.55];
    const angle = (c / CLASSES) * Math.PI * 2 + 0.5;
    // contrastive: tight clusters pushed far apart (ends up using the edge of the space)
    const contrast: Pt = [Math.cos(angle) * 0.9 + gauss(r) * 0.06, Math.sin(angle) * 0.9 + gauss(r) * 0.06];
    // SIGReg-style: semantic clusters, but the cloud as a whole fills an isotropic Gaussian
    const sig: Pt = [Math.cos(angle) * 0.45 + gauss(r) * 0.22, Math.sin(angle) * 0.45 + gauss(r) * 0.22];
    return { c, start, contrast, sig };
  });
})();

const PHASES = [
  { label: 'no guard: collapse', at: 0.3, from: 0 },
  { label: 'contrastive', at: 0.63, from: 0.34 },
  { label: 'SIGReg', at: 0.96, from: 0.67 },
];
const NOTES = [
  ['Only objective: “make the two', 'views of a scene agree.”', 'Cheapest solution: map', 'everything to one point.'],
  ['Pull views of the same scene', 'together, push other scenes', 'apart. Works, but needs lots', 'of negatives per batch.'],
  ['Keep the agreement loss, and', 'push the whole cloud toward', 'an isotropic Gaussian. One', 'term, no negatives, no EMA.'],
];
const CLASS_FILL = ['var(--m-teal)', 'var(--accent)', 'var(--text-secondary)'];

function spread(pts: Pt[]) {
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return Math.sqrt(pts.reduce((s, p) => s + (p[0] - mx) ** 2 + (p[1] - my) ** 2, 0) / pts.length);
}

/** Representation collapse, and two ways out of it. */
export default function RepresentationCollapse() {
  const clock = useClock({ duration: 12000 });
  const t = clock.t;
  const phase = PHASES.reduce((acc, p, i) => (t >= p.from ? i : acc), 0);
  const local = smooth(PHASES[phase].from + 0.04, PHASES[phase].from + 0.24, t);

  const pts: Pt[] = POINTS.map(p => {
    const target: Pt = phase === 0 ? [0.02 * p.start[0], 0.02 * p.start[1]] : phase === 1 ? p.contrast : p.sig;
    return [lerp(p.start[0], target[0], local), lerp(p.start[1], target[1], local)];
  });
  const s = spread(pts);

  return (
    <MotionFigure
      clock={clock}
      heading="The cheapest way to agree is to say nothing"
      caption="Illustrative 2-D sketch of an embedding space. Colors are three kinds of scene the model never sees labels for. The spread readout is how much of the space the embeddings use."
      phases={PHASES}
    >
      <svg viewBox="0 0 720 320" className={styles.svg} role="img" aria-labelledby="rc-t rc-d">
        <title id="rc-t">Representation collapse versus contrastive learning versus SIGReg</title>
        <desc id="rc-d">
          Thirty embeddings from three kinds of scene start scattered. With no guard, they all shrink to a single point
          and carry no information. With contrastive learning, each kind forms a tight cluster pushed to the edge of the
          space. With SIGReg, the clusters stay distinct while the whole cloud fills a round Gaussian shape.
        </desc>

        <circle cx={CX} cy={CY} r={R} className={styles.ghost} />
        {phase === 2 && (
          <>
            <circle cx={CX} cy={CY} r={R * 0.55} className={styles.ghost} opacity={local} />
            <text x={CX} y={CY - R - 8} textAnchor="middle" className={styles.labelTeal} opacity={local}>
              target: isotropic Gaussian
            </text>
          </>
        )}
        <line x1={CX - R - 10} y1={CY} x2={CX + R + 10} y2={CY} className={styles.axis} opacity={0.5} />
        <line x1={CX} y1={CY - R - 10} x2={CX} y2={CY + R + 10} className={styles.axis} opacity={0.5} />

        {pts.map((p, i) => (
          <circle key={i} cx={CX + p[0] * R} cy={CY + p[1] * R} r={5.5} style={{ fill: CLASS_FILL[POINTS[i].c] }} opacity={0.85} />
        ))}
        {phase === 0 && local > 0.9 && (
          <text x={CX + 14} y={CY - 10} className={styles.labelAmber}>all 30 are here</text>
        )}

        <text x={430} y={60} className={styles.label}>step {phase + 1} of 3</text>
        {NOTES[phase].map((line, i) => (
          <text key={line} x={430} y={88 + i * 20} className={styles.sub}>{line}</text>
        ))}
        <text x={430} y={196} className={styles.label}>spread used</text>
        <rect x={430} y={204} width={220} height={10} rx={5} className={styles.chip} />
        <rect x={430} y={204} width={Math.min(220, (s / 0.85) * 220)} height={10} rx={5}
          className={s < 0.08 ? styles.barAmber : styles.barTeal} />
        <text x={430} y={234} className={s < 0.08 ? styles.labelAmber : styles.labelTeal}>
          {s < 0.08 ? 'collapsed: zero information' : 'embeddings carry information'}
        </text>
      </svg>
    </MotionFigure>
  );
}
