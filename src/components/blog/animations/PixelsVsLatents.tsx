'use client';

import MotionFigure from '../motion/MotionFigure';
import { useClock } from '../motion/useClock';
import { rng } from '../motion/math';
import styles from '../motion/Motion.module.css';

const COLS = 10;
const ROWS = 7;
const CELL = 14;
const FRAMES = 8;
const LEAVES = new Set(['0,0', '1,0', '2,0', '0,1', '1,1', '2,1', '3,0', '1,2']); // a tree canopy, top-left

/** Ball path across the frame: one cell right per frame, on a gentle arc. */
const ballAt = (f: number): [number, number] => [1 + f, 5 - Math.round(Math.sin((f / (FRAMES - 1)) * Math.PI) * 2)];

function Grid({ x, y, frame, predicted }: { x: number; y: number; frame: number; predicted: boolean }) {
  const r = rng(1000 + frame * 7 + (predicted ? 3 : 0));
  const [bx, by] = ballAt(frame);
  const cells = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const leaf = LEAVES.has(`${i},${j}`);
      let fill = 'var(--surface-subtle)';
      let opacity = 1;
      if (leaf) {
        fill = 'var(--m-teal)';
        opacity = predicted ? 0.15 + 0.7 * r() : 0.35 + 0.5 * r();
      }
      if (!predicted && i === bx && j === by) {
        fill = 'var(--text-primary)';
        opacity = 1;
      }
      if (predicted && j >= by - 1 && j <= by + 1 && Math.abs(i - bx) <= 1) {
        // every plausible next position, averaged: a blur instead of a ball
        const d = Math.abs(i - bx) + Math.abs(j - by);
        fill = 'var(--text-primary)';
        opacity = d === 0 ? 0.45 : d === 1 ? 0.25 : 0.12;
      }
      cells.push(
        <rect key={`${i}-${j}`} x={x + i * CELL} y={y + j * CELL} width={CELL - 1.5} height={CELL - 1.5} rx={2}
          style={{ fill }} opacity={opacity} />,
      );
    }
  }
  return <g>{cells}</g>;
}

const BARS = ['position', 'velocity', 'in contact?', 'leaf texture'];

/** Generative next-frame prediction vs. JEPA-style prediction in embedding space. */
export default function PixelsVsLatents() {
  const clock = useClock({ duration: 6400 });
  const frame = Math.min(FRAMES - 2, Math.floor(clock.t * (FRAMES - 1)));
  const [bx] = ballAt(frame);
  const target = [bx / COLS, 0.62, frame === 3 ? 0.9 : 0.15, 0];
  const pred = [target[0] + 0.03, 0.6, target[2] * 0.92, 0];

  return (
    <MotionFigure
      clock={clock}
      heading="Predict every pixel, or predict what matters"
      caption="Illustrative. Left: a generative model must guess every cell of the next frame, including leaves that are unpredictable by nature, so it hedges with blur. Right: a JEPA-style model encodes both frames and predicts only the compact encoding, so it can drop the leaves."
    >
      <svg viewBox="0 0 720 256" className={styles.svg} role="img" aria-labelledby="pl-t pl-d">
        <title id="pl-t">Pixel-space prediction versus representation-space prediction</title>
        <desc id="pl-d">
          A small scene of a ball flying past a tree. On the left, a generative model predicts the next frame as 70 pixel
          values; its prediction is a blurred ball and random leaf noise, because it must commit to every detail. On the
          right, an encoder turns frames into four numbers: position, velocity, contact and leaf texture, which the
          encoder learns to ignore. A predictor estimates the next frame’s numbers, and they closely match the encoding of
          the real next frame.
        </desc>

        <text x={180} y={22} textAnchor="middle" className={styles.title}>Generative: predict pixels</text>
        <text x={540} y={22} textAnchor="middle" className={styles.title}>JEPA: predict the encoding</text>

        {/* left panel */}
        <text x={30} y={52} className={styles.label}>frame t</text>
        <Grid x={30} y={60} frame={frame} predicted={false} />
        <text x={190} y={52} className={styles.label}>predicted t+1</text>
        <Grid x={190} y={60} frame={frame + 1} predicted />
        <text x={181} y={113} textAnchor="middle" className={styles.label}>→</text>
        <text x={30} y={186} className={styles.labelAmber}>70 values to guess, every frame</text>
        <text x={30} y={204} className={styles.label}>can’t know where each leaf goes,</text>
        <text x={30} y={220} className={styles.label}>can’t pick one future for the ball:</text>
        <text x={30} y={236} className={styles.label}>so it averages them into blur</text>

        {/* right panel */}
        <text x={390} y={52} className={styles.label}>frame t</text>
        <Grid x={390} y={60} frame={frame} predicted={false} />
        <path d="M535 70 L565 85 L565 135 L535 150 Z" className={styles.panel} />
        <text x={550} y={168} textAnchor="middle" className={styles.label}>encode</text>

        {BARS.map((b, i) => {
          const y = 66 + i * 22;
          const ignored = i === 3;
          return (
            <g key={b}>
              <text x={574} y={y + 10} className={styles.label}>{b}</text>
              <rect x={666} y={y} width={46} height={12} rx={3} className={styles.chip} />
              {!ignored && (
                <>
                  <rect x={666} y={y} width={46 * target[i]} height={12} rx={3} className={styles.barTeal} opacity={0.35} />
                  <rect x={666} y={y + 3} width={46 * pred[i]} height={6} rx={2} className={styles.barTeal} />
                </>
              )}
              {ignored && <text x={689} y={y + 10} textAnchor="middle" className={styles.label} style={{ fontSize: 9 }}>dropped</text>}
            </g>
          );
        })}
        <text x={574} y={170} className={styles.labelTeal}>thin: predicted t+1</text>
        <text x={574} y={186} className={styles.label}>wide: real t+1, encoded</text>
        <text x={390} y={226} className={styles.labelTeal}>4 numbers, and the leaves don’t cost anything</text>
        <text x={390} y={244} className={styles.label}>planning: try actions, compare encodings</text>
      </svg>
    </MotionFigure>
  );
}
